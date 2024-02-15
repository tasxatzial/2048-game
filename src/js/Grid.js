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
    this.changedAfterSlide = false;
    this.slideCount = 0;
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
        this.rows[i][j].mergeTiles();
      }
    }
  }

  addRandomTile() {
    const emptyCells = this.rows.map(row => row.filter(cell => cell.isEmpty())).flat();
    if (emptyCells.length == 0) {
      return;
    }
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randCell.setNewTile();
  }

  hasTile(value) {
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.cols.length; j++) {
        const cell = this.rows[i][j];
        if (!cell.isEmpty() && cell.tile.value == value) {
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