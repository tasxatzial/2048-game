export default class Tile {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.value = Math.random() > 0.9 ? 4 : 2;
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