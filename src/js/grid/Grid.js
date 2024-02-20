import Cell from "./Cell.js";
import MergeResultGen from "./MergeResultGen.js";
import NewTileGen from "./NewTileGen.js";

export default class Grid {
  constructor({gridArray, gridStateObj, newTileFnName, mergeResultFnName}) {
    if (gridStateObj) {

    } else {
      this.gridArray = gridArray;
      this.cells = this._createCells(gridArray);
      this.rows = this._createRows(gridArray);
      this.cols = this._createColumns(gridArray);
      this.slideCount = 0;
      this.mergedTilesSum = 0;
    }
    if (newTileFnName) {
      this.newTileFn = NewTileGen[newTileFnName];
      this.newTileFnName = newTileFnName;
    }
    else {
      this.newTileFn = NewTileGen.original2048;
      this.newTileFnName = "original2048";
    }
    if (mergeResultFnName) {
      this.mergeResultFn = MergeResultGen[mergeResultFnName];
      this.mergeResultFnName = mergeResultFnName;
    }
    else {
      this.mergeResultFn = MergeResultGen.original2048;
      this.mergeResultFnName = "original2048";
    }
    this.changedAfterSlide = false;
  }

  _createRows(grid) {
    const rows = [];
    let last = false;
    for (let i = 0; i < grid.length; i++) {
      let row = [];
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] == 1) {
          last = true;
          row.push(this.cells[i * grid[0].length + j]);
        }
        else if (last) {
          last = false;
          rows.push(row);
          row = [];
        }
      }
      rows.push(row);
    }
    return rows;
  }

  _createColumns(grid) {
    if (!grid.length) {
      return [];
    }
    const cols = [];
    let last = false;
    for (let j = 0; j < grid[0].length; j++) {
      let col = [];
      for (let i = 0; i < grid.length; i++) {
        if (grid[i][j] == 1) {
          last = true;
          col.push(this.cells[i * grid[0].length + j]);
        }
        else if (last) {
          last = false;
          cols.push(col);
          col = [];
        }
      }
      cols.push(col);
    }
    return cols;
  }

  _createCells(grid) {
    const cells = {};
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] == 1) {
          cells[i * grid[0].length + j] = new Cell(i, j);
        }
      }
    }
    return cells;
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
    Object.values(this.cells).forEach(cell => {
      if (cell.willMerge()) {
        cell.mergeTiles(this.mergeResultFn);
        this.mergedTilesSum += cell.getTile().getValue();
      }
    });
  }

  getMergedTilesSum() {
    return this.mergedTilesSum;
  }

  addTile() {
    const {row, column, value} = this.newTileFn(this.toStateObj().gridObj);
    if (row != undefined) {
      this.cells[row * this.gridArray[0].length + column].setTile(value);
    }
  }

  hasTile(value) {
    return Object.values(this.cells).some(cell => {
      return cell.hasTile() && cell.getTile().getValue() == value;
    });
  }

  hasChangedAfterSlide() {
    return this.changedAfterSlide;
  }

  getSlideCount() {
    return this.slideCount;
  }

  getMaxTileLength() {
    let maxLength = 0;
    Object.values(this.cells).forEach(cell => {
      if (cell.hasTile()) {
        const tileLength = cell.getTile().getValue().toString().length;
        if (tileLength > maxLength) {
          maxLength = tileLength;
        }
      }
    });
    return maxLength;
  }

  toStateObj() {
    const arr = [];
    for (let i = 0; i < this.gridArray.length; i++) {
      const row = [];
      for (let j = 0; j < this.gridArray[0].length; j++) {
        if (this.gridArray[i][j] == 1) {
          const cell = this.cells[i * this.gridArray[0].length + j];
          row.push(cell.toObj());
        } else {
          row.push(null);
        }
      }
      arr.push(row);
    }
    return {
      gridObj: arr,
      slideCount: this.slideCount,
      mergedTilesSum: this.mergedTilesSum,
      newTileFn: this.newTileFnName,
      mergeResultFnName: this.mergeResultFnName
    };
  }

  fromStateObj(stateObj) {

  }

  toString() {
    let result = '';
    const entryLength = this.getMaxTileLength();
    const pad = ' '.repeat(entryLength);
    for (let i = 0; i < this.gridArray.length; i++) {
      for (let j = 0; j < this.gridArray[0].length; j++) {
        if (this.gridArray[i][j] == 1) {
          const cell = this.cells[i * this.gridArray[0].length + j];
          if (cell.hasTile()) {
            result += (pad + cell.getTile().getValue()).slice(-entryLength);
          } else {
            result += (pad + '.').slice(-entryLength);
          }
        } else {
          result += (pad + '◼').slice(-entryLength);
        }
        if (j != this.gridArray[0].length - 1) {
          result += ' ';
        }
      }
      result += '\n';
    }
    return result;
  }
}
