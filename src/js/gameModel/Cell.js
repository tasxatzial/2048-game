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

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.col;
  }

  hasTile() {
    return this.tiles.length > 0;
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

  setTileFrom(cell) {
    if (this.tiles.length > 0) {
      throw new Error("target cell already has a tile");
    }
    if (!cell.tiles.length) {
      throw new Error("incoming cell has no tiles");
    }
    this.tiles.push(cell.tiles[0]);
    cell.tiles = [];
  }

  setTile(value) {
    if (this.tiles.length > 0) {
      throw new Error("cell already has a tile");
    }
    this.tiles.push(new Tile(this.row, this.col, value));
  }

  setMergeTileFrom(cell) {
    if (cell.tiles.length > 1) {
      throw new Error("incoming cell has > 1 tiles");
    }
    if (cell.tiles.length === 0) {
      throw new Error("incoming cell has no tiles");
    }
    if (this.mergeAll) {
      this.tiles.push(cell.tiles[0]);
    }
    else {
      if (this.tiles.length === 1) {
        this.tiles.push(cell.tiles[0]);
      }
      else {
        throw new Error("target cell already has a merge tile");
      }
    }
    cell.tiles = [];
  }

  canAcceptTileValueFrom(cell) {
    if (cell.tiles.length > 1) {
      throw new Error("incoming cell has > 1 tiles");
    }
    const cond = this.mergeAll ? this.tiles.length > 0 : this.tiles.length === 1;
    return cond
           && cell.hasTile()
           && this.mergeConditionFn(this.tiles[this.tiles.length - 1].getValue(), cell.tiles[0].getValue());
  }

  satisfiesMergeConditionWith(cell) {
    return this.getValue() && cell.getValue() && this.mergeConditionFn(this.getValue(), cell.getValue());
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

  toJSON() {
    return {
      row: this.row,
      column: this.col,
      tiles: this.tiles.map(tile => tile.toJSON()),
      mergeScore: this.mergeScore,
      mergeValue: this.mergeValue,
      newTileAdded: this.newTileAdded
    }
  }

  static fromJSON(json) {
    if (json) {
      const {row, column, tiles, mergeScore, mergeValue, newTileAdded} = json;
      const cell = new Cell(row, column);
      cell.tiles = tiles.map(tile => Tile.fromJSON(tile));
      cell.mergeScore = mergeScore;
      cell.mergeValue = mergeValue;
      cell.newTileAdded = newTileAdded;
      return cell;
    }
    return null;
  }
}
