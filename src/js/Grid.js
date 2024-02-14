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