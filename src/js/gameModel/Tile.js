export default class Tile {
  constructor(row, column, value) {
    this.row = row;
    this.col = column;
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

  setColumn(column) {
    this.col = column;
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

  static fromObj(obj) {
    if (obj) {
      const {row, column, value, mergeCount} = obj;
      const tile = new Tile(row, column, value);
      tile.mergeCount = mergeCount;
      return tile;
    } else {
      return null;
    }
  }
}