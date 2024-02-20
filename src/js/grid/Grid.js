import Cell from "./Cell.js";
import MergeResultGen from "./MergeResultGen.js";
import NewTileGen from "./NewTileGen.js";

export default class Grid {
  constructor({grid, gridBoolean, newTileFnName, mergeResultFnName}) {
    if (grid) {
      const {gridArray, slideCount, mergedTilesSum, changedAfterSlide, newTileFnName, mergeResultFnName} = grid;
      const gridBooleanArray = [];
      this.cells = {};
      for (let i = 0; i < gridArray.length; i++) {
        const row = [];
        for (let j = 0; j < gridArray[0].length; j++) {
          const cellObj = gridArray[i][j];
          if (cellObj) {
            this.cells[i * gridArray[0].length + j] = Cell.fromObj(cellObj);
            row.push(1);
          } else {
            row.push(0);
          }
        }
        gridBooleanArray.push(row);
      }
      this.rows = this._createRows(gridBooleanArray);
      this.cols = this._createColumns(gridBooleanArray);
      this.gridBoolean = gridBooleanArray;
      this.slideCount = slideCount;
      this.mergedTilesSum = mergedTilesSum;
      this.changedAfterSlide = changedAfterSlide;
      this.newTileFnName = newTileFnName;
      this.mergeResultFnName = mergeResultFnName;
    }
    else {
      this.cells = this._createCells(gridBoolean);
      this.rows = this._createRows(gridBoolean);
      this.cols = this._createColumns(gridBoolean);
      this.gridBoolean = gridBoolean;
      this.slideCount = 0;
      this.mergedTilesSum = 0;
      this.changedAfterSlide = false;
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
    }
  }

  _createRows(gridBooleanArray) {
    const rows = [];
    let last = false;
    for (let i = 0; i < gridBooleanArray.length; i++) {
      let row = [];
      for (let j = 0; j < gridBooleanArray[0].length; j++) {
        if (gridBooleanArray[i][j] == 1) {
          last = true;
          row.push(this.cells[i * gridBooleanArray[0].length + j]);
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

  _createColumns(gridBooleanArray) {
    if (!gridBooleanArray.length) {
      return [];
    }
    const cols = [];
    let last = false;
    for (let j = 0; j < gridBooleanArray[0].length; j++) {
      let col = [];
      for (let i = 0; i < gridBooleanArray.length; i++) {
        if (gridBooleanArray[i][j] == 1) {
          last = true;
          col.push(this.cells[i * gridBooleanArray[0].length + j]);
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

  _createCells(gridBoolean) {
    const cells = {};
    for (let i = 0; i < gridBoolean.length; i++) {
      for (let j = 0; j < gridBoolean[0].length; j++) {
        if (gridBoolean[i][j] == 1) {
          cells[i * gridBoolean[0].length + j] = new Cell(i, j);
        }
      }
    }
    return cells;
  }

  _slideTilesToEnd(cellArray) {
    for (let i = cellArray.length - 1; i >= 0; i--) {
      if (!cellArray[i].hasTile()) {
        continue;
      }
      for (let j = i + 1; j < cellArray.length; j++) {
        if (cellArray[j].hasTile()) {
          if (cellArray[j].canMerge(cellArray[i])) {
            cellArray[j].setMergeTileFrom(cellArray[i]);
            this.changedAfterSlide = true;
          }
          else if (j-1 != i) {
            cellArray[j-1].setTileFrom(cellArray[i]);
            this.changedAfterSlide = true;
          }
          break;
        } else if (j == cellArray.length - 1) {
            cellArray[j].setTileFrom(cellArray[i]);
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
    function _canSlide(cellArray) {
      for (let i = 0; i < cellArray.length - 1; i++) {
        if (!cellArray[i].hasTile() || !cellArray[i + 1].hasTile() || cellArray[i].canMerge(cellArray[i + 1])) {
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
    const {row, column, value} = this.newTileFn(this.toObj());
    if (row != undefined) {
      this.cells[row * this.gridBoolean[0].length + column].setTile(value);
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

  toObj() {
    const gridArray = [];
    for (let i = 0; i < this.gridBoolean.length; i++) {
      const row = [];
      for (let j = 0; j < this.gridBoolean[0].length; j++) {
        if (this.gridBoolean[i][j] == 1) {
          const cell = this.cells[i * this.gridBoolean[0].length + j];
          row.push(cell.toObj());
        } else {
          row.push(null);
        }
      }
      gridArray.push(row);
    }
    return {
      gridArray: gridArray,
      slideCount: this.slideCount,
      mergedTilesSum: this.mergedTilesSum,
      changedAfterSlide: this.changedAfterSlide,
      newTileFnName: this.newTileFnName,
      mergeResultFnName: this.mergeResultFnName
    };
  }

  toString() {
    let result = '';
    const entryLength = this.getMaxTileLength();
    const pad = ' '.repeat(entryLength);
    for (let i = 0; i < this.gridBoolean.length; i++) {
      for (let j = 0; j < this.gridBoolean[0].length; j++) {
        if (this.gridBoolean[i][j] == 1) {
          const cell = this.cells[i * this.gridBoolean[0].length + j];
          if (cell.hasTile()) {
            result += (pad + cell.getTile().getValue()).slice(-entryLength);
          } else {
            result += (pad + '.').slice(-entryLength);
          }
        } else {
          result += (pad + '◼').slice(-entryLength);
        }
        if (j != this.gridBoolean[0].length - 1) {
          result += ' ';
        }
      }
      result += '\n';
    }
    return result;
  }
}
