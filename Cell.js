const VAR = 0;
const FIX = 1;

class Cell {
    constructor() {
        this.num = 0;
        this.memo = new Array(9);
        this.status = VAR;
        this.initMemo();
    }

    initMemo() {
        this.memo.fill(false);
    }

    changeMemo(cand) {
        if (this.status == FIX) {
            return;
        }
        this.memo[cand - 1] = !this.memo[cand - 1];
    }

    checkMemo() {
        let res = [];
        for (let i = 0; i < this.memo.length; i++) {
            if (this.memo[i] == true) {
                res.push(i + 1);
            }
        }
        return res;
    }

    formatMemo() {
        let cm = this.checkMemo();
        if (cm.length == 1) {
            return cm[0];
        }
        let res = [];
        for (let y = 0; y < 3; y++) {
            let line = [];
            for (let x = 0; x < 3; x++) {
                let num = y * 3 + x;
                line.push(this.memo[num] == true ? (num + 1) : "&ensp;")
            }
            res.push(line.join("&nbsp;"));
        }
        return res.join("<br>");
    }

    isFix() {
        return this.status == FIX ? true : false;
    }

    fix() {
        let cm = this.checkMemo();
        if (cm.length == 1) {
            this.num = cm[0];
            this.status = FIX;
        }
    }
}

module.exports = Cell;