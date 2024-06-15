import Tile from "./Tile.js";

export default class Cell {
  constructor(row, column) {
    this.row = row;
    this.col = column;
    this.tile = null;
    this.mergeTiles = [];
    this.mergedScore = null;
    this.mergedValue = null;
    this.hasNewTile = false;
  }

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.col;
  }

  hasTile() {
    return !!this.tile;
  }

  getTile() {
    return this.tile;
  }

  getMergeTiles() {
    return this.mergeTiles;
  }

  getMergedScore() {
    return this.mergedScore;
  }

  setHasNewTile() {
    this.hasNewTile = true;
  }

  setTileFrom(cell) {
    if (this.tile) {
      throw new Error("target cell already has a tile");
    }
    this.tile = cell.tile;
    cell.tile = null;
  }

  setTile(value) {
    if (this.tile) {
      throw new Error("cell already has a tile")
    }
    this.tile = new Tile(this.row, this.col, value);
  }

  setMergeTileFrom(cell) {
    if (this.mergeAll) {
      this.mergeTiles.push(cell.tile);
    }
    else {
      if (!this.mergeTiles.length) {
        this.mergeTiles.push(cell.tile);
      }
      else {
        throw new Error("target cell already has a merge tile");
      }
    }
    cell.tile = null;
  }

  canMergeTile(cell) {
    if (this.mergeAll) {
      return this.tile
             && this.mergeConditionFn(this.tile.getValue(), cell.tile.getValue());
    }
    else {
      return this.tile
             && !this.mergeTiles.length
             && this.mergeConditionFn(this.tile.getValue(), cell.tile.getValue());
    }
  }

  setMergeScore() {
    if (this.mergeTiles.length) {
      const tileVal = this.tile.getValue();
      const mergeTilesVals = this.mergeTiles.map(tile => tile.getValue());
      this.mergedScore = this.mergeScoreFn(tileVal, mergeTilesVals);
      this.mergedValue = this.mergeResultFn(tileVal, mergeTilesVals);
    }
  }

  purge() {
    this.hasNewTile = false;
    if (this.tile) {
      this.tile.setRow(this.row);
      this.tile.setColumn(this.col);
    }
    if (this.mergeTiles.length) {
      this.tile.setValue(this.mergedValue);
      this.mergedScore = null;
      this.mergedValue = null;
      this.mergeTiles = [];
    }
  }

  toJSON() {
    return {
      row: this.row,
      column: this.col,
      tile: this.tile ? this.tile.toJSON() : null,
      mergeTiles:  this.mergeTiles.map(tile => tile.toJSON()),
      mergedScore: this.mergedScore,
      mergedValue: this.mergedValue,
      hasNewTile: this.hasNewTile
    }
  }

  static fromJSON(json) {
    if (json) {
      const {row, column, tile, mergeTiles, mergedScore, mergedValue, hasNewTile} = json;
      const cell = new Cell(row, column);
      cell.tile = Tile.fromJSON(tile);
      cell.mergeTiles = mergeTiles.map(tile => Tile.fromJSON(tile));
      cell.mergedScore = mergedScore;
      cell.mergedValue = mergedValue;
      cell.hasNewTile = hasNewTile;
      return cell;
    }
    else {
      return null;
    }
  }
}
