# coding: utf-8

import cv2
import pytesseract
import sys


def get_cut_border(contour):
    top = bottom = left = right = None
    for idx, p in enumerate(contour):
        if idx == 0:
            top = p[0][1]
            bottom = p[0][1]
            left = p[0][0]
            right = p[0][0]
        else:
            top = p[0][1] if p[0][1] < top else top
            bottom = p[0][1] if bottom < p[0][1] else bottom
            left = p[0][0] if p[0][0] < left else left
            right = p[0][0] if right < p[0][0] else right
    return top, bottom, left, right


# img = cv2.imread('img/sudoku1.png')
data = sys.stdin.readline()
data = data.rstrip('\r\n')
img = cv2.imread(data)

# １．画像全体の輪郭抽出
gr = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
th = cv2.adaptiveThreshold(gr, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                           cv2.THRESH_BINARY, 11, 2)
ca = cv2.Canny(th, threshold1=80, threshold2=110)
contours, hierarchy = cv2.findContours(
    ca, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours.sort(key=cv2.contourArea, reverse=True)

# ２．数独領域の切り出し
top, bottom, left, right = get_cut_border(contours[0])
st_img = img[top: bottom, left: right]

# ３．数独領域の輪郭抽出(しきい値を変えれるよう１.とは別で行う)
st_gr = cv2.cvtColor(st_img, cv2.COLOR_BGR2GRAY)
st_th = cv2.adaptiveThreshold(st_gr, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                              cv2.THRESH_BINARY, 11, 2)
st_ca = cv2.Canny(st_th, threshold1=80, threshold2=110)
st_contours, hierarchy = cv2.findContours(
    st_ca, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# 4. マス目の輪郭だけ取得
cell_size = (st_img.shape[0] * st_img.shape[1]) / 81
cell_contours = []
for cnt in st_contours:
    area = cv2.contourArea(cnt)
    if area < (cell_size - 500) or (cell_size + 200) < area:
        continue
    cell_contours.append(cnt)

# 5. 1マスの1辺の平均的な長さを求める
arclen_sum = sum([cv2.arcLength(cnt, True) for cnt in cell_contours])
arclen_avg = arclen_sum / len(cell_contours)
side = int(arclen_avg / 4)

# 6. 代表的なマスの頂点を求める
x_points = []
y_points = []
for cnt in cell_contours:
    for p in cnt:
        x, y = p[0]
        if len(x_points) == 0:
            x_points.append(x)
            y_points.append(y)
        else:
            flag = True
            for xp, yp in zip(x_points, y_points):
                if ((xp - side / 3) < x and x < (xp + side / 3)) or ((yp - side / 3) < y and y < (yp + side / 3)):
                    flag = False
                    break
            if flag is True:
                x_points.append(x)
                y_points.append(y)
x_points.sort()
y_points.sort()

# 7. マス目から各マスを切り出し、数字を認識する
sudoku = []
for y_idx in range(len(y_points)-1):
    for x_idx in range(len(x_points)-1):
        top = y_points[y_idx]
        bottom = y_points[y_idx + 1]
        left = x_points[x_idx]
        right = x_points[x_idx + 1]
        cell = st_img[top:bottom, left:right]
        num = pytesseract.image_to_string(
            cell, config='--psm 10 nobatch digits')
        sudoku.append(num)
        # cv2.imwrite('img_out/sudoku_{}_{}.png'.format(y_idx, x_idx), cell)

print('\t'.join(sudoku))


'''
sudoku = [" " if n == "" else n for n in sudoku]
for y in range(9):
    ol = []
    for x in range(9):
        ol.append(sudoku[y * 9 + x])
    print(",".join(ol))
'''
