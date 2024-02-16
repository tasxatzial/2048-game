import Cell from "./Cell.js";

export default class Grid {
  constructor({size, newTileFn, mergeResultFn}) {
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
    this.newTileFn = newTileFn;
    this.mergeResultFn = mergeResultFn;
    this.mergedTilesSum = 0;
  }

  _slideTilesToEnd(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (!arr[i].hasTile()) {
        continue;
      }
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].hasTile()) {
          if (arr[j].canMerge(arr[i])) {
            arr[j].setMergeTileFrom(arr[i]);
            this.changedAfterSlide = true;
          }
          else if (j-1 != i) {
            arr[j-1].setTileFrom(arr[i]);
            this.changedAfterSlide = true;
          }
          break;
        } else if (j == arr.length - 1) {
            arr[j].setTileFrom(arr[i]);
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
        if (!arr[i].hasTile() || !arr[i + 1].hasTile() || arr[i].canMerge(arr[i + 1])) {
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
        const cell = this.rows[i][j];
        if (cell.willMerge()) {
          cell.mergeTiles(this.mergeResultFn);
          this.mergedTilesSum += cell.getTile().getValue();
        }
      }
    }
  }

  getMergedTilesSum() {
    return this.mergedTilesSum;
  }

  addTile() {
    const res = this.newTileFn(this.toArray());
    if (!res) {
      return;
    }
    const {row, column, value} = res;
    this.rows[row][column].setTile(value);
  }

  hasTile(value) {
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (cell.hasTile() && cell.getTile().getValue() == value) {
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
        if (!cell.hasTile()) {
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
        row.push(cell.toObj());
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
        if (cell.hasTile()) {
          result += (pad + cell.getTile().getValue()).slice(-entryLength);
        } else {
          result += (pad + '.').slice(-entryLength);
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