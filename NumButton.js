class NumButton {
    constructor() {
        this.ptr = [1, 1];
        this.table = [7, 8, 9, 4, 5, 6, 1, 2, 3];
        this.selected = false;
    }

    setPtr(x, y) {
        this.ptr[0] = x;
        this.ptr[1] = y;
    }

    movePtr(direction) {
        for (let idx = 0; idx < 2; idx++) {
            let nextP = this.ptr[idx] + direction[idx];
            if (nextP < 0) {
                this.ptr[idx] = 0;
            } else if (2 < nextP) {
                this.ptr[idx] = 2;
            } else {
                this.ptr[idx] = nextP;
            }
        }
    }

    select() {
        this.selected = true;
    }

    notSelect() {
        this.selected = false;
    }

    getCurrent() {
        let idx = this.ptr[1] * 3 + this.ptr[0];
        return this.table[idx];
    }

    _setClassToCell(btn, x, y) {
        btn.classList.remove('nb-target');
        if (this.ptr[0] == x && this.ptr[1] == y) {
            btn.classList.add('nb-target');
        }
        btn.textContent = this.table[y * 3 + x];
        return btn;
    }

    createTag() {
        let nb = document.getElementById('num-button');
        let selectOrNot = this.selected == true ? 'selected' : 'not-selected';
        nb.classList.add(selectOrNot);

        let tab = document.createElement('table');
        tab.classList.add('nb-tab');
        for (let y = 0; y < 3; y++) {
            let tr = document.createElement('tr');
            for (let x = 0; x < 3; x++) {
                let td = document.createElement('td');
                let btn = document.createElement('button');
                btn.setAttribute('type', 'button');
                btn.setAttribute('id', 'nbc¥t' + x + '¥t' + y);
                btn.classList.add('nb-cell');
                btn = this._setClassToCell(btn, x, y);
                td.appendChild(btn);
                tr.appendChild(td);
            }
            tab.appendChild(tr);
        }
        nb.appendChild(tab);
    }


    updateTag() {
        let nb = document.getElementById('num-button');
        nb.classList.remove('selected', 'not-selected');
        let selectOrNot = this.selected == true ? 'selected' : 'not-selected';
        nb.classList.add(selectOrNot);
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                let btn = document.getElementById('nbc¥t' + x + '¥t' + y);
                this._setClassToCell(btn, x, y);
            }
        }
    }
}

module.exports = NumButton;