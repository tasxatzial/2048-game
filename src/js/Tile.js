export default class Tile {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.mergeCount = 0;
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

  setColumn(col) {
    this.col = col;
  }

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.col;
  }

  getMergeCount() {
    return this.mergeCount;
  }

  setMergeCount(value) {
    this.mergeCount = value;
  }

  toObj() {
    return {
      row: this.row,
      column: this.col,
      value: this.value,
      mergeCount: this.mergeCount
    };
  }
}