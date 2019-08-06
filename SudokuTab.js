const Cell = require('./Cell.js');

class SudokuTab {
    constructor() {
        this.ptr = [4, 4];
        this.table = null;
        this.initTable();
        this.selected = true;
    }

    movePtr(direction) {
        for (let idx = 0; idx < 2; idx++) {
            let nextP = this.ptr[idx] + direction[idx];
            if (nextP < 0) {
                this.ptr[idx] = 8;
            } else if (8 < nextP) {
                this.ptr[idx] = 0;
            } else {
                this.ptr[idx] = nextP;
            }
        }
    }

    setPtr(x, y) {
        this.ptr[0] = x;
        this.ptr[1] = y;
    }

    initTable() {
        this.table = new Array();
        for (let y = 1; y <= 9; y++) {
            for (let x = 1; x <= 9; x++) {
                this.table.push(new Cell());
            }
        }
    }

    setTable(data) {
        this.initTable();
        for (let i = 0; i < this.table.length; i++) {
            if (1 <= data[i] && data[i] <= 9) {
                this.table[i].changeMemo(data[i]);
            }
        }
    }

    setCurrent(num) {
        let idx = this.ptr[1] * 9 + this.ptr[0];
        this.table[idx].changeMemo(num);
    }

    delCurrent() {
        let idx = this.ptr[1] * 9 + this.ptr[0];
        this.table[idx].initMemo();
    }

    select() {
        this.selected = true;
    }

    notSelect() {
        this.selected = false;
    }

    fix() {
        for (let i = 0; i < this.table.length; i++) {
            this.table[i].fix();
        }
    }

    _setClassToCell(btn, x, y) {
        btn.classList.remove('target-st-cell', 'one-num-cell', 'fixed-cell');
        let idx = y * 9 + x;
        if (x == this.ptr[0] && y == this.ptr[1]) {
            btn.classList.add('target-st-cell');
        }
        let cm = this.table[idx].checkMemo();
        if (cm.length == 1) {
            btn.classList.add('one-num-cell');
        }
        if (this.table[idx].isFix()) {
            btn.classList.add('fixed-cell');
        }
        btn.innerHTML = this.table[idx].formatMemo();
        return btn;
    }

    _createCell(x, y) {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'stc¥t' + x + '¥t' + y);
        btn.classList.add('st-cell');
        btn = this._setClassToCell(btn, x, y);
        return btn;
    }

    _mapXY(outerX, outerY, innerX, innerY) {
        let mapTable = [0, 3, 6, 27, 30, 33, 54, 57, 60];
        let offset = mapTable[outerY * 3 + outerX];
        let mappedIdx = offset + innerY * 9 + innerX;
        let mappedX = mappedIdx % 9;
        let mappedY = Math.floor(mappedIdx / 9);
        return [mappedX, mappedY];
    }

    _createInnerTab(outerX, outerY) {
        let tab = document.createElement('table');
        tab.classList.add('inner-tab');
        for (let innerY = 0; innerY < 3; innerY++) {
            let tr = document.createElement('tr');
            for (let innerX = 0; innerX < 3; innerX++) {
                let td = document.createElement('td');
                let mapped = this._mapXY(outerX, outerY, innerX, innerY);
                let cell = this._createCell(mapped[0], mapped[1]);
                td.appendChild(cell);
                tr.appendChild(td);
            }
            tab.appendChild(tr);
        }
        return tab;
    }

    createTag() {
        let stDiv = document.getElementById('sudoku-tab');
        let selectOrNot = this.selected == true ? 'selected' : 'not-selected';
        stDiv.classList.add(selectOrNot);

        let tab = document.createElement('table');
        tab.classList.add('outer-tab');
        for (let y = 0; y < 3; y++) {
            let tr = document.createElement('tr');
            for (let x = 0; x < 3; x++) {
                let td = document.createElement('td');
                td.appendChild(this._createInnerTab(x, y));
                tr.appendChild(td);
            }
            tab.appendChild(tr);
        }
        stDiv.appendChild(tab);
    }

    updateTag() {
        let stDiv = document.getElementById('sudoku-tab');
        stDiv.classList.remove('selected', 'not-selected');
        let selectOrNot = this.selected == true ? 'selected' : 'not-selected';
        stDiv.classList.add(selectOrNot);
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                let btn = document.getElementById('stc¥t' + x + '¥t' + y);
                this._setClassToCell(btn, x, y);
            }
        }
    }
}

module.exports = SudokuTab;
