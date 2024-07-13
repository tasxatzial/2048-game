import Cell from './Cell.js';
import GridBoolean from './GridBoolean.js';
import MergeResult from './MergeResult.js';
import MergeScore from './MergeScore.js';
import MergeCondition from './MergeCondition.js';
import NewTile from './NewTile.js';

export default class Grid {
  constructor(json = {}) {
    if (json.grid) {
      const {gridArray, newTileFnName, mergeResultFnName, mergeScoreFnName, mergeConditionFnName, gridBooleanFnName, mergeAll} = json.grid;
      this.newTileFnName = newTileFnName;
      this.newTileFn = NewTile[newTileFnName];
      this.mergeResultFnName = mergeResultFnName;
      this.mergeResultFn = MergeResult[mergeResultFnName];
      this.mergeScoreFnName = mergeScoreFnName;
      this.mergeScoreFn = MergeScore[mergeScoreFnName];
      this.mergeConditionFnName = mergeConditionFnName;
      this.mergeConditionFn = MergeCondition[mergeConditionFnName];
      this.gridBooleanFnName = gridBooleanFnName;
      this.mergeAll = mergeAll;
      const {gridBoolean, cells} =  this._createCellsFromGrid(gridArray, true);
      this.cells = cells;
      this.gridBoolean = gridBoolean;
      this.rows = this._createRows(this.gridBoolean);
      this.cols = this._createColumns(this.gridBoolean);
    }
    else {
      const options = json.options || {};
      const {newTileFnName, mergeResultFnName, mergeScoreFnName, mergeConditionFnName, gridBooleanFnName, mergeAll} = options;
      if (gridBooleanFnName) {
        this.gridBoolean = GridBoolean[gridBooleanFnName]();
        this.gridBooleanFnName = gridBooleanFnName;
      }
      else {
        this.gridBoolean = GridBoolean.original2048();
        this.gridBooleanFnName = 'original2048';
      }
      if (newTileFnName) {
        this.newTileFn = NewTile[newTileFnName];
        this.newTileFnName = newTileFnName;
      }
      else {
        this.newTileFn = NewTile.original2048;
        this.newTileFnName = 'original2048';
      }
      if (mergeResultFnName) {
        this.mergeResultFn = MergeResult[mergeResultFnName];
        this.mergeResultFnName = mergeResultFnName;
      }
      else {
        this.mergeResultFn = MergeResult.original2048;
        this.mergeResultFnName = 'original2048';
      }
      if (mergeScoreFnName) {
        this.mergeScoreFn = MergeScore[mergeScoreFnName];
        this.mergeScoreFnName = mergeScoreFnName;
      }
      else {
        this.mergeScoreFn = MergeScore.original2048;
        this.mergeScoreFnName = 'original2048';
      }
      if (mergeConditionFnName) {
        this.mergeConditionFn = MergeCondition[mergeConditionFnName];
        this.mergeConditionFnName = mergeConditionFnName;
      }
      else {
        this.mergeConditionFn = MergeCondition.original2048;
        this.mergeConditionFnName = 'original2048';
      }
      if (mergeAll === true) {
        this.mergeAll = mergeAll;
      }
      else {
        this.mergeAll = false;
      }
      this.cells = this._createCellsFromGridBoolean(this.gridBoolean, false);
      this.rows = this._createRows(this.gridBoolean);
      this.cols = this._createColumns(this.gridBoolean);
    }
    this.changedAfterSlide = null;
    this.mergeScore = null;
  }

  _createRows(booleanArray) {
    const rows = [];
    let isRowNonEmpty = false;
    for (let i = 0; i < booleanArray.length; i++) {
      let row = [];
      for (let j = 0; j < booleanArray[0].length; j++) {
        if (booleanArray[i][j] === 1) {
          isRowNonEmpty = true;
          row.push(this.cells[i * booleanArray[0].length + j]);
        }
        else if (isRowNonEmpty) {
          isRowNonEmpty = false;
          rows.push(row);
          row = [];
        }
      }
      rows.push(row);
    }
    return rows;
  }

  _createColumns(booleanArray) {
    if (!booleanArray.length) {
      return [];
    }
    const cols = [];
    let isRowNonEmpty = false;
    for (let j = 0; j < booleanArray[0].length; j++) {
      let col = [];
      for (let i = 0; i < booleanArray.length; i++) {
        if (booleanArray[i][j] === 1) {
          isRowNonEmpty = true;
          col.push(this.cells[i * booleanArray[0].length + j]);
        }
        else if (isRowNonEmpty) {
          isRowNonEmpty = false;
          cols.push(col);
          col = [];
        }
      }
      cols.push(col);
    }
    return cols;
  }

  _createCellsFromGridBoolean(booleanArray, initialGamePresent) {
    const cells = {};
    for (let i = 0; i < booleanArray.length; i++) {
      for (let j = 0; j < booleanArray[0].length; j++) {
        if (booleanArray[i][j] === 1) {
          const idx = i * booleanArray[0].length + j;
          cells[idx] = new Cell(i, j);
          cells[idx].mergeResultFn = this.mergeResultFn;
          cells[idx].mergeScoreFn = this.mergeScoreFn;
          cells[idx].mergeConditionFn = this.mergeConditionFn;
          cells[idx].mergeAll = this.mergeAll;
          if (initialGamePresent) {
            cells[idx].setNewTileAdded(false);
          }
        }
      }
    }
    return cells;
  }

  _createCellsFromGrid(gridArray, initialGamePresent) {
    const gridBoolean = [];
    const cells = {};
    for (let i = 0; i < gridArray.length; i++) {
      const row = [];
      for (let j = 0; j < gridArray[0].length; j++) {
        const cellObj = gridArray[i][j];
        if (cellObj) {
          const idx = i * gridArray[0].length + j;
          cells[idx] = Cell.fromJSON(cellObj);
          cells[idx].mergeResultFn = this.mergeResultFn;
          cells[idx].mergeScoreFn = this.mergeScoreFn;
          cells[idx].mergeConditionFn = this.mergeConditionFn;
          cells[idx].mergeAll = this.mergeAll;
          if (initialGamePresent) {
            cells[idx].setNewTileAdded(false);
          }
          row.push(1);
        } else {
          row.push(0);
        }
      }
      gridBoolean.push(row);
    }
    return {gridBoolean, cells};
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
          else if (j-1 !== i) {
            cellArray[j-1].setTileFrom(cellArray[i]);
            this.changedAfterSlide = true;
          }
          break;
        } else if (j === cellArray.length - 1) {
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
        if (!cellArray[i].hasTile() || !cellArray[i + 1].hasTile() || cellArray[i].canMergeTile(cellArray[i + 1])) {
          return true;
        }
      }
      return false;
    }
    return this.rows.some(_canSlide) || this.cols.some(_canSlide);
  }

  hasChangedAfterSlide() {
    return this.changedAfterSlide;
  }

  clearNewTileFlags() {
    this.getCells().forEach(cell => {
      cell.setNewTileAdded(false);
    });
  }

  updateMergeScore() {
    let hasMergedTiles = false;
    let totalScore = 0;
    this.getCells().forEach(cell => {
      cell.updateMergeResults();
      const score = cell.getMergeScore();
      if (score !== null) {
        hasMergedTiles = true;
        totalScore += cell.getMergeScore();
      }
    });
    this.mergeScore = hasMergedTiles ? totalScore : null;
  }

  getMergeScore() {
    return this.mergeScore;
  }

  addTiles() {
    const newTiles = this.newTileFn(this);
    newTiles.forEach(tile => {
      const idx = tile.row * this.gridBoolean[0].length + tile.column;
      this.cells[idx].setTile(tile.value);
      this.cells[idx].setNewTileAdded(true);
    });
  }

  initTiles(tiles) {
    tiles.forEach(tile => {
      const idx = tile.row * this.gridBoolean[0].length + tile.column;
      this.cells[idx].setTile(tile.value);
      this.cells[idx].setNewTileAdded(true);
    })
  }

  hasTile(value) {
    return this.getCells().some(cell => {
      return cell.hasTile() && cell.getTile().getValue() === value;
    });
  }

  purge() {
    this.getCells().forEach(cell => {
      cell.purge();
    });
    this.changedAfterSlide = null;
    this.mergeScore = null;
  }

  getMaxTileLength() {
    let maxLength = 0;
    this.getCells().forEach(cell => {
      if (cell.hasTile()) {
        const tileLength = cell.getTile().getValue().toString().length;
        if (tileLength > maxLength) {
          maxLength = tileLength;
        }
      }
    });
    return maxLength;
  }

  getCells() {
    return Object.values(this.cells);
  }

  toJSON() {
    const grid = [];
    for (let i = 0; i < this.gridBoolean.length; i++) {
      const row = [];
      for (let j = 0; j < this.gridBoolean[0].length; j++) {
        if (this.gridBoolean[i][j] === 1) {
          const cell = this.cells[i * this.gridBoolean[0].length + j];
          row.push(cell.toJSON());
        } else {
          row.push(null);
        }
      }
      grid.push(row);
    }
    return {
      gridArray: grid,
      newTileFnName: this.newTileFnName,
      mergeResultFnName: this.mergeResultFnName,
      mergeScoreFnName: this.mergeResultFnName,
      mergeConditionFnName: this.mergeConditionFnName,
      gridBooleanFnName: this.gridBooleanFnName,
      mergeAll: this.mergeAll
    };
  }

  toString() {
    let result = '';
    const entryLength = this.getMaxTileLength();
    const pad = ' '.repeat(entryLength);
    for (let i = 0; i < this.gridBoolean.length; i++) {
      for (let j = 0; j < this.gridBoolean[0].length; j++) {
        if (this.gridBoolean[i][j] === 1) {
          const cell = this.cells[i * this.gridBoolean[0].length + j];
          if (cell.hasTile()) {
            result += (pad + cell.getTile().getValue()).slice(-entryLength);
          } else {
            result += (pad + '.').slice(-entryLength);
          }
        } else {
          result += (pad + '◼').slice(-entryLength);
        }
        if (j !== this.gridBoolean[0].length - 1) {
          result += ' ';
        }
      }
      result += '\n';
    }
    return result;
  }
}
