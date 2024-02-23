import Cell from "./Cell.js";
import GridBoolean from "./GridBoolean.js";
import MergeResult from "./MergeResult.js";
import MergeScore from "./MergeScore.js";
import NewTile from "./NewTile.js";

export default class Grid {
  constructor({grid, gridBooleanFnName, newTileFnName, mergeResultFnName, mergeScoreFnName}) {
    if (grid) {
      const {gridArray, slideCount, score, changedAfterSlide, newTileFnName, mergeResultFnName, mergeScoreFnName} = grid;
      this._createCellsFromGrid(gridArray);
      this._createRows(this.gridBoolean);
      this._createColumns(this.gridBoolean);
      this.slideCount = slideCount;
      this.score = score;
      this.changedAfterSlide = changedAfterSlide;
      this.newTileFnName = newTileFnName;
      this.newTileFn = NewTile[newTileFnName];
      this.mergeResultFnName = mergeResultFnName;
      this.mergeResultFn = MergeResult[mergeResultFnName];
      this.mergeScoreFnName = mergeScoreFnName;
      this.mergeScoreFn = MergeScore[mergeScoreFnName];
    }
    else {
      if (gridBooleanFnName) {
        this.gridBoolean = GridBoolean[gridBooleanFnName]();
      }
      else {
        this.gridBoolean = GridBoolean.original2048();
      }
      this._createCellsFromGridBoolean(this.gridBoolean);
      this._createRows(this.gridBoolean);
      this._createColumns(this.gridBoolean);
      this.slideCount = 0;
      this.score = 0;
      this.changedAfterSlide = false;
      if (newTileFnName) {
        this.newTileFn = NewTile[newTileFnName];
        this.newTileFnName = newTileFnName;
      }
      else {
        this.newTileFn = NewTile.original2048;
        this.newTileFnName = "original2048";
      }
      if (mergeResultFnName) {
        this.mergeResultFn = MergeResult[mergeResultFnName];
        this.mergeResultFnName = mergeResultFnName;
      }
      else {
        this.mergeResultFn = MergeResult.original2048;
        this.mergeResultFnName = "original2048";
      }
      if (mergeScoreFnName) {
        this.mergeScoreFn = MergeScore[mergeScoreFnName];
        this.mergeScoreFnName = mergeScoreFnName;
      }
      else {
        this.mergeScoreFn = MergeScore.original2048;
        this.mergeScoreFnName = "original2048";
      }
    }
  }

  _createRows(booleanArray) {
    this.rows = [];
    let last = false;
    for (let i = 0; i < booleanArray.length; i++) {
      let row = [];
      for (let j = 0; j < booleanArray[0].length; j++) {
        if (booleanArray[i][j] == 1) {
          last = true;
          row.push(this.cells[i * booleanArray[0].length + j]);
        }
        else if (last) {
          last = false;
          this.rows.push(row);
          row = [];
        }
      }
      this.rows.push(row);
    }
  }

  _createColumns(booleanArray) {
    if (!booleanArray.length) {
      return [];
    }
    this.cols = [];
    let last = false;
    for (let j = 0; j < booleanArray[0].length; j++) {
      let col = [];
      for (let i = 0; i < booleanArray.length; i++) {
        if (booleanArray[i][j] == 1) {
          last = true;
          col.push(this.cells[i * booleanArray[0].length + j]);
        }
        else if (last) {
          last = false;
          this.cols.push(col);
          col = [];
        }
      }
      this.cols.push(col);
    }
  }

  _createCellsFromGridBoolean(booleanArray) {
    this.cells = {};
    for (let i = 0; i < booleanArray.length; i++) {
      for (let j = 0; j < booleanArray[0].length; j++) {
        if (booleanArray[i][j] == 1) {
          this.cells[i * booleanArray[0].length + j] = new Cell(i, j);
        }
      }
    }
  }

  _createCellsFromGrid(gridArray) {
    this.gridBoolean = [];
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
      this.gridBoolean.push(row);
    }
  }

  _slideTilesToEnd(cellArray) {
    for (let i = cellArray.length - 1; i >= 0; i--) {
      if (!cellArray[i].hasTile()) {
        continue;
      }
      for (let j = i + 1; j < cellArray.length; j++) {
        if (cellArray[j].hasTile()) {
          if (cellArray[j].canMergeTile(cellArray[i])) {
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

  willMergeTiles() {
    Object.values(this.cells).some(cell => {
      return cell.willMergeTiles();
    });
  }

  mergeCells() {
    Object.values(this.cells).forEach(cell => {
      this.score += cell.merge(this.mergeResultFn, this.mergeScoreFn);
    });
  }

  getScore() {
    return this.score;
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
    const grid = [];
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
      grid.push(row);
    }
    return {
      gridArray: grid,
      slideCount: this.slideCount,
      score: this.score,
      changedAfterSlide: this.changedAfterSlide,
      newTileFnName: this.newTileFnName,
      mergeResultFnName: this.mergeResultFnName,
      mergeScoreFnName: this.mergeResultFnName
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
