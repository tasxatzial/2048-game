import Cell from './Cell.js';
import GridBoolean from './GridBoolean.js';
import MergeResult from './MergeResult.js';
import MergeScore from './MergeScore.js';
import MergeCondition from './MergeCondition.js';
import NewTile from './NewTile.js';

export default class Grid {
  constructor(obj = {}) {
    if (obj.grid) {
      const {gridArray, newTileFnName, mergeResultFnName, mergeScoreFnName, mergeConditionFnName, gridBooleanFnName, minMergeLength, maxMergeLength, mergeStrategy} = obj.grid;
      this.newTileFnName = newTileFnName;
      this.newTileFn = NewTile[newTileFnName];
      this.mergeResultFnName = mergeResultFnName;
      this.mergeResultFn = MergeResult[mergeResultFnName];
      this.mergeScoreFnName = mergeScoreFnName;
      this.mergeScoreFn = MergeScore[mergeScoreFnName];
      this.mergeConditionFnName = mergeConditionFnName;
      this.mergeConditionFn = MergeCondition[mergeConditionFnName];
      this.gridBooleanFnName = gridBooleanFnName;
      this.minMergeLength = minMergeLength;
      this.maxMergeLength = maxMergeLength;
      this.mergeStrategy = mergeStrategy;
      const {gridBoolean, cells} =  this._createCellsFromGrid(gridArray, true);
      this.cells = cells;
      this.gridBoolean = gridBoolean;
      this.rows = this._createRows(this.gridBoolean);
      this.cols = this._createColumns(this.gridBoolean);
    }
    else {
      const gridOptions = obj.gridOptions || {};
      const {newTileFnName, mergeResultFnName, mergeScoreFnName, mergeConditionFnName, gridBooleanFnName, minMergeLength, maxMergeLength, mergeStrategy} = gridOptions;
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
      if (mergeStrategy === undefined) {
        this.mergeStrategy = 'shortest-match';
      }
      else if (mergeStrategy !== 'shortest-match' && mergeStrategy !== 'longest-match') {
        throw new Error(`mergeStrategy must be 'shortest-match' or 'longest-match' (was "${mergeStrategy}")`);
      }
      else {
        this.mergeStrategy = mergeStrategy;
      }
      if (!minMergeLength) {
        this.minMergeLength = 2;
      }
      else if (minMergeLength < 2) {
        throw new Error('minMergeLength must be >= 2');
      }
      else {
        this.minMergeLength = minMergeLength;
      }
      this.cells = this._createCellsFromGridBoolean(this.gridBoolean, false);
      this.rows = this._createRows(this.gridBoolean);
      this.cols = this._createColumns(this.gridBoolean);
      if (!maxMergeLength) {
        const rowLengths = this.rows.map(x => x.length);
        const colLengths = this.cols.map(x => x.length);
        this.maxMergeLength = Math.max(...rowLengths, ...colLengths, this.minMergeLength);
      }
      else if (maxMergeLength < this.minMergeLength) {
        throw new Error('maxMergeLength must be >= minMergeLength');
      }
      else {
        this.maxMergeLength = maxMergeLength;
      }
    }
    this.changedAfterSlide = null;
    this.mergeScore = null;
  }

  _createRows(booleanArray) {
    const rows = [];
    for (let i = 0; i < booleanArray.length; i++) {
      let row = [];
      let rowHasCells = false;
      for (let j = 0; j < booleanArray[0].length; j++) {
        if (booleanArray[i][j] === 1) {
          rowHasCells = true;
          row.push(this.cells[i * booleanArray[0].length + j]);
        }
        else if (rowHasCells) {
          rows.push(row);
          row = [];
          rowHasCells = false;
        }
      }
      if (rowHasCells) {
        rows.push(row);
      }
    }
    return rows;
  }

  _createColumns(booleanArray) {
    if (!booleanArray.length) {
      return [];
    }
    const cols = [];
    for (let j = 0; j < booleanArray[0].length; j++) {
      let col = [];
      let colHasCells = false;
      for (let i = 0; i < booleanArray.length; i++) {
        if (booleanArray[i][j] === 1) {
          colHasCells = true;
          col.push(this.cells[i * booleanArray[0].length + j]);
        }
        else if (colHasCells) {
          cols.push(col);
          col = [];
          colHasCells = false;
        }
      }
      if (colHasCells) {
        cols.push(col);
      }
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
          cells[idx] = Cell.import(cellObj);
          cells[idx].mergeResultFn = this.mergeResultFn;
          cells[idx].mergeScoreFn = this.mergeScoreFn;
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
    let packedCells = [];
    for (let i = 0; i < cellArray.length; i++) {
      if (cellArray[i].hasTile()) {
        packedCells.push(cellArray[i]);
      }
    }

    let lastOccupiedIndex = cellArray.length - 1;
    while(packedCells.length > 0) {
      let mergedCells = null;
      for (let i = packedCells.length - this.minMergeLength; i >= packedCells.length - this.maxMergeLength && i >= 0; i--) {
        const arr = packedCells.slice(i, packedCells.length);
        if (this.mergeConditionFn(arr.map(x => x.getValue()).reverse())) {
          mergedCells = arr;
          if (this.mergeStrategy === 'shortest-match') {
            break;
          }
        }
      }
      
      if (mergedCells !== null) {
        this.changedAfterSlide = true;
        for (let i = mergedCells.length - 1; i >= 0; i--) {
          cellArray[lastOccupiedIndex].setTileFrom(mergedCells[i]);
        }
        packedCells = packedCells.slice(0, packedCells.length - mergedCells.length);
      }
      else {
        if (!cellArray[lastOccupiedIndex].hasTile()) {
          this.changedAfterSlide = true;
        }
        cellArray[lastOccupiedIndex].setTileFrom(packedCells[packedCells.length - 1]);
        packedCells = packedCells.slice(0, packedCells.length - 1);
      }
      lastOccupiedIndex--;
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
    const _canSlide = (cellArray) => {
      for (let i = 0; i < cellArray.length; i++) {
        if (!cellArray[i].hasTile()) {
          return true;
        }
      }
      for (let i = this.minMergeLength; i <= this.maxMergeLength; i++) {
        for (let j = 0; j <= cellArray.length - i; j++) {
          const tileValues = cellArray.slice(j, j + i).map(x => x.getValue());
          if (this.mergeConditionFn(tileValues)) {
            return true;
          }
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

  addDefaultTiles() {
    const newTiles = this.newTileFn(this);
    this.addTiles(newTiles);
  }

  addTiles(tiles) {
    tiles.forEach(tile => {
      const idx = tile.row * this.gridBoolean[0].length + tile.column;
      this.cells[idx].setTile(tile.value);
      this.cells[idx].setNewTileAdded(true);
    });
  }

  hasTile(value) {
    return this.getCells().some(cell => {
      return cell.hasTile() && cell.getValue() === value;
    });
  }

  purge() {
    this.getCells().forEach(cell => {
      cell.purge();
    });
    this.changedAfterSlide = null;
    this.mergeScore = null;
  }

  getCells() {
    return Object.values(this.cells);
  }

  export() {
    const grid = [];
    for (let i = 0; i < this.gridBoolean.length; i++) {
      const row = [];
      for (let j = 0; j < this.gridBoolean[0].length; j++) {
        if (this.gridBoolean[i][j] === 1) {
          const cell = this.cells[i * this.gridBoolean[0].length + j];
          row.push(cell.export());
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
      mergeStrategy: this.mergeStrategy,
      minMergeLength: this.minMergeLength,
      maxMergeLength: this.maxMergeLength
    };
  }
}
