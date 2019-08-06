const SudokuTab = require('./SudokuTab.js');
const NumButton = require('./NumButton.js');

const ST_ON = 0;
const NB_STANDBY = 1;
const NB_ON = 2;

const path = require('path');
//const { PythonShell } = require('python-shell');
const { PythonShell } = require('/usr/local/lib/node_modules/python-shell');
const pyPath = path.join(__dirname, 'python', 'find_sudoku_table.py');
//const pyshell = new PythonShell(pyPath);

function run() {
    let status = {
        st: new SudokuTab(),
        nb: new NumButton(),
        sw: ST_ON
    };

    //数独テーブルと数字ボタンを生成
    status.st.createTag();
    status.nb.createTag();
    document.activeElement.blur();

    //数独テーブルにキーボード入力によるイベント登録
    document.addEventListener('keydown', function (e) {
        st_action(e, status);
    }, false);

    //数字ボタンにキーボード入力によるイベント登録
    document.addEventListener('keydown', function (e) {
        nb_action(e, status);
    }, false);

    //ロード画面表示用のイベント登録
    let fread = document.getElementById('fread');
    fread.addEventListener('change', function (e) {
        let pyshell = new PythonShell(pyPath);
        design_input(e);
        const file = e.target.files[0].path;
        pyshell.send(file);
        document.getElementById('loader-bg').style.display = 'block';

        //画像解析プログラムからのレスポンス受信時のイベント登録
        pyshell.on('message', function (data) {
            status.st.setTable(data.split('\t'));
            status.st.updateTag();
            document.getElementById('loader-bg').style.display = 'none';
        });
    });

    //数字確定ボタンにクリック時のイベント登録
    document.getElementById('fix').onclick = function () {
        status.st.fix();
        status.st.updateTag();
        this.disabled = true;
    };

    document.getElementById('reset').onclick = function () {
        let res = window.confirm('テーブルをリセットしますか?');
        if (res) {
            status.st.initTable();
            status.st.updateTag();
            document.getElementById('fix').disabled = false;
        }
    };

    //数独テーブルにクリック時のイベント登録
    let cellList = document.getElementsByClassName('st-cell');
    for (let i = 0; i < cellList.length; i++) {
        cellList[i].onclick = function (e) {
            //選択切り替え
            status.st.select();
            status.nb.notSelect();
            status.sw = ST_ON;

            //値を更新
            let idStr = e.target.getAttribute('id');
            let splittedId = idStr.split('¥t');
            let x = Number(splittedId[1]);
            let y = Number(splittedId[2]);
            status.st.setPtr(x, y);

            //画面描画
            status.st.updateTag();
            status.nb.updateTag();
        }
    };

    //数字ボタンにクリック時のイベント登録
    let bnCellList = document.getElementsByClassName('nb-cell');
    for (let i = 0; i < bnCellList.length; i++) {
        bnCellList[i].onclick = function (e) {
            //選択切り替え
            status.st.notSelect();
            status.nb.select();
            status.sw = NB_ON;

            //値を更新
            let idStr = e.target.getAttribute('id');
            let splittedId = idStr.split('¥t');
            let x = Number(splittedId[1]);
            let y = Number(splittedId[2]);
            status.nb.setPtr(x, y);
            status.st.setCurrent(status.nb.getCurrent());

            //画面病が
            status.st.updateTag();
            status.nb.updateTag();
        };
    }
}

function design_input(e) {
    let file = e.target.files[0].path;
    if (file.length) {
        // let span_tag = document.createElement('span');
        // span_tag.classList.add('filename');
        // span_tag.appendChild(document.createTextNode(file));
        // document.getElementById('file-loader').appendChild(span_tag);
        let textbox = document.getElementById('uploaded');
        textbox.setAttribute('value', file);
    }
    document.getElementById('input-label').classList.add("changed");
}

function st_action(e, s) {
    if (s.sw != ST_ON) {
        return;
    }
    let numKeyMap = {
        '49': '1', '50': '2', '51': '3', '52': '4', '53': '5',
        '54': '6', '55': '7', '56': '8', '57': '9'
    };
    let reg = new RegExp(Object.keys(numKeyMap).join('|'));
    let kCode = e.keyCode;
    switch (true) {
        //backspace
        case (kCode == 8):
            s.st.delCurrent();
            break;
        //enter
        case (kCode == 13):
            s.sw = NB_STANDBY;
            s.st.notSelect();
            s.nb.select();
            break;
        //left
        case (kCode == 37):
            s.st.movePtr([-1, 0]);
            break;
        //up
        case (kCode == 38):
            s.st.movePtr([0, -1]);
            break;
        //right
        case (kCode == 39):
            s.st.movePtr([1, 0]);
            break;
        //down
        case (kCode == 40):
            s.st.movePtr([0, 1]);
            break;
        //1〜9
        case reg.test(kCode):
            s.st.setCurrent(numKeyMap[kCode]);
            break;
    }
    s.st.updateTag();
    s.nb.updateTag();
    document.activeElement.blur();
}

function nb_action(e, s) {
    if (s.sw == ST_ON) {
        return;
    }
    switch (e.keyCode) {
        //backspace
        case 8:
            s.st.delCurrent();
            break;
        //enter
        case 13:
            if (s.sw == NB_STANDBY) {
                s.sw = NB_ON;
            } else {
                let num = s.nb.getCurrent();
                s.st.setCurrent(num);
            }
            break;
        //esc
        case 27:
            s.sw = ST_ON;
            s.st.select();
            s.nb.notSelect();
            break;
        //left
        case 37:
            s.nb.movePtr([-1, 0]);
            break;
        //up
        case 38:
            s.nb.movePtr([0, -1]);
            break;
        //right
        case 39:
            s.nb.movePtr([1, 0]);
            break;
        //down
        case 40:
            s.nb.movePtr([0, 1]);
            break;
    }
    s.st.updateTag();
    s.nb.updateTag();
    document.activeElement.blur();
}



