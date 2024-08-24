import Tile from './Tile.js';

export default class Cell {
  constructor(row, column) {
    this.row = row;
    this.col = column;
    this.tiles = [];
    this.mergeScore = null;
    this.mergeValue = null;
    this.newTileAdded = false;
  }

  mergeResultFn() {
    throw new Error('Method mergeResultFn must be overridden');
  }

  mergeScoreFn() {
    throw new Error('Method mergeScoreFn must be overridden');
  }

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.col;
  }

  hasTile() {
    return this.tiles.length > 0;
  }

  setTile(value) {
    if (this.tiles.length > 0) {
      throw new Error('cell already has a tile');
    }
    this.tiles.push(new Tile(this.row, this.col, value));
  }

  getTileValues() {
    return this.tiles.map(tile => tile.getValue());
  }

  getValue() {
    if (this.mergeValue) {
      return this.mergeValue;
    }
    if (this.hasTile()) {
      return this.tiles[0].getValue();
    }
    return null;
  }

  getMergeScore() {
    return this.mergeScore;
  }

  setNewTileAdded(bool) {
    this.newTileAdded = bool;
  }

  setTile(value) {
    if (this.tiles.length > 0) {
      throw new Error('cell already has a tile');
    }
    this.tiles.push(new Tile(this.row, this.col, value));
  }

  setTileFrom(cell) {
    if (cell === this) {
      return;
    }
    if (cell.tiles.length > 1) {
      throw new Error('incoming cell has > 1 tiles');
    }
    if (cell.tiles.length === 0) {
      throw new Error('incoming cell has no tiles');
    }
    this.tiles.push(cell.tiles[0]);
    cell.tiles = [];
  }

  updateMergeResults() {
    if (this.tiles.length > 1) {
      const tilesVals = this.tiles.map(tile => tile.getValue());
      this.mergeScore = this.mergeScoreFn(tilesVals);
      this.mergeValue = this.mergeResultFn(tilesVals);
    }
    else {
      this.mergeScore = null;
      this.mergeValue = null;
    }
    
  }

  purge() {
    this.newTileAdded = false;
    if (this.tiles.length > 0) {
      this.tiles[0].setRow(this.row);
      this.tiles[0].setColumn(this.col);
    }
    if (this.tiles.length > 1) {
      this.tiles[0].setValue(this.mergeValue);
      this.mergeScore = null;
      this.mergeValue = null;
      this.tiles = [this.tiles[0]];
    }
  }

  export() {
    return {
      row: this.row,
      column: this.col,
      tiles: this.tiles.map(tile => tile.export()),
      mergeScore: this.mergeScore,
      mergeValue: this.mergeValue,
      newTileAdded: this.newTileAdded
    }
  }

  static import(obj) {
    if (obj) {
      const {row, column, tiles, mergeScore, mergeValue, newTileAdded} = obj;
      const cell = new Cell(row, column);
      cell.tiles = tiles.map(tile => Tile.import(tile));
      cell.mergeScore = mergeScore;
      cell.mergeValue = mergeValue;
      cell.newTileAdded = newTileAdded;
      return cell;
    }
    return null;
  }
}
