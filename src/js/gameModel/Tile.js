export default class Tile {
  constructor(row, column, value) {
    this.row = row;
    this.col = column;
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  setRow(row) {
    this.row = row;
  }

  setColumn(column) {
    this.col = column;
  }

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.col;
  }

  toJSON() {
    return {
      row: this.row,
      column: this.col,
      value: this.value
    };
  }

  static fromJSON(json) {
    if (json) {
      const {row, column, value} = json;
      return new Tile(row, column, value);
    }
    else {
      return null;
    }
  }
}