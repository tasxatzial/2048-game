import Cell from "./Cell.js";

export default class Grid {
  constructor({size}) {
    const rows = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(new Cell(i, j));
      }
      rows.push(row);
    }
    this.rows = rows;
    this.cols = this.rows.map((_, i) => this.rows.map(row => row[i]));
    this.changed = false;
  }

  _slideTilesToEnd(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].isEmpty()) {
        continue;
      }
      for (let j = i + 1; j < arr.length; j++) {
        if (!arr[j].isEmpty()) {
          if (arr[j].canMerge(arr[i].getTile())) {
            arr[j].setMergeTile(arr[i].getTile());
            arr[i].clearTile();
            this.changed = true;
          }
          else if (j-1 != i) {
            arr[j-1].setTile(arr[i].getTile());
            arr[i].clearTile();
            this.changed = true;
          }
          break;
        } else if (j == arr.length - 1) {
            arr[j].setTile(arr[i].getTile());
            arr[i].clearTile();
            this.changed = true;
            break;
        }
      }
    }
  }

  slideRight() {
    this.rows.forEach(x => this._slideTilesToEnd(x));
  }

  slideLeft() {
    this.rows.forEach(x => this._slideTilesToEnd([...x].reverse()));
  }

  slideUp() {
    this.cols.forEach(x => this._slideTilesToEnd([...x].reverse()));
  }

  slideDown() {
    this.cols.forEach(x => this._slideTilesToEnd(x));
  }

  findMaxValue() {
    let max = 0;
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (!cell.isEmpty() && cell.getTile().getValue() > max) {
          max = cell.getTile().getValue();
        }
      }
    }
    return max;
  }

  toString() {
    let result = '';
    const maxDigits = this.findMaxValue().toString().length;
    const pad = ' '.repeat(maxDigits);
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (cell.isEmpty()) {
          result += (pad + '.').slice(-maxDigits);
        } else {
          result += (pad + cell.getTile().getValue()).slice(-maxDigits);
        }
        if (j != this.rows.length - 1) {
          result += ' ';
        }
      }
      result += '\n';
    }
    return result;
  }
}