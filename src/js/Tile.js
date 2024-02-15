export default class Tile {
  constructor(row, col, value) {
    this.row = row;
    this.col = col;
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

  setColumn(col) {
    this.col = col;
  }
}