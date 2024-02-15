import Cell from "./Cell.js";

export default class Grid {
  constructor({size, addTileFn, mergeTilesFn}) {
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
    this.changedAfterSlide = false;
    this.slideCount = 0;
    this.addTileFn = addTileFn;
    this.mergeTilesFn = mergeTilesFn;
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
            this.changedAfterSlide = true;
          }
          else if (j-1 != i) {
            arr[j-1].setTile(arr[i].getTile());
            arr[i].clearTile();
            this.changedAfterSlide = true;
          }
          break;
        } else if (j == arr.length - 1) {
            arr[j].setTile(arr[i].getTile());
            arr[i].clearTile();
            this.changedAfterSlide = true;
            break;
        }
      }
    }
  }

  _slide(direction) {
    this.changedAfterSlide = false;
    switch(direction) {
      case 'up':
        this.cols.forEach(x => this._slideTilesToEnd([...x].reverse()));
        break;
      case 'down':
        this.cols.forEach(x => this._slideTilesToEnd(x));
        break;
      case 'left':
        this.rows.forEach(x => this._slideTilesToEnd([...x].reverse()));
        break;
      case 'right':
        this.rows.forEach(x => this._slideTilesToEnd(x));
        break;
    }
    if (this.changedAfterSlide) {
      this.slideCount++;
    }
  }

  slideRight() {
    this._slide('right');
  }

  slideLeft() {
    this._slide('left');
  }

  slideUp() {
    this._slide('up');
  }

  slideDown() {
    this._slide('down');
  }

  canSlide() {
    function _canSlide(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].isEmpty() || arr[i + 1].isEmpty() || arr[i].canMerge(arr[i + 1].getTile())) {
          return true;
        }
      }
      return false;
    }
    return this.rows.some(_canSlide) || this.cols.some(_canSlide);
  }

  mergeTiles() {
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        this.rows[i][j].mergeTiles(this.mergeTilesFn);
      }
    }
  }

  addTile() {
    const res = this.addTileFn(this.toArray());
    if (!res) {
      return;
    }
    const {row, column, value} = res;
    if (!this.rows[row][column].isEmpty()) {
      throw new Error("cell is not empty");
    }
    this.rows[row][column].setNewTile(value);
  }

  hasTile(value) {
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (!cell.isEmpty() && cell.getTile().getValue() == value) {
          return true;
        }
      }
    }
    return false;
  }

  hasChangedAfterSlide() {
    return this.changedAfterSlide;
  }

  getSlideCount() {
    return this.slideCount;
  }

  _getMaxTileLength() {
    let maxLength = 0;
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (cell.isEmpty()) {
          continue;
        }
        const tileLength = cell.getTile().getValue().toString().length;
        if (tileLength > maxLength) {
          maxLength = tileLength;
        }
      }
    }
    return maxLength;
  }

  toArray() {
    const arr = [];
    for (let i = 0; i < this.rows.length; i++) {
      const row = [];
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        row.push({
          row: i,
          column: j,
          value: (cell.isEmpty() ? null : cell.getTile().getValue())
        });
      }
      arr.push(row);
    }
    return arr;
  }

  toString() {
    let result = '';
    const entryLength = this._getMaxTileLength();
    const pad = ' '.repeat(entryLength);
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (cell.isEmpty()) {
          result += (pad + '.').slice(-entryLength);
        } else {
          result += (pad + cell.getTile().getValue()).slice(-entryLength);
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