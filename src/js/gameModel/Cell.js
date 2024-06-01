import Tile from "./Tile.js";

export default class Cell {
  constructor(row, column) {
    this.row = row;
    this.col = column;
    this.tile = null;
    this.mergeTiles = [];
    this.merged = false;
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

  //currently unused
  hasMergeTile() {
    return !!this.mergeTiles.length;
  }

  getTile() {
    return this.tile;
  }

  getMergeTiles() {
    return this.mergeTiles;
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

  //currently unused
  willMergeTiles() {
    return this.tile && this.mergeTiles.length;
  }

  merge() {
    let score = 0;
    if (this.tile) {
      this.tile.setRow(this.row);
      this.tile.setColumn(this.col);
    }
    if (this.mergeTiles.length) {
      const tileVal = this.tile.getValue();
      let mergeTilesVals;
      if (this.mergeAll) {
        mergeTilesVals = this.mergeTiles.map(tile => tile.getValue());
      }
      else {
        mergeTilesVals = [this.mergeTiles[0].getValue()];
      }
      score = this.mergeScoreFn(tileVal, mergeTilesVals);
      const newVal = this.mergeResultFn(tileVal, mergeTilesVals);
      this.tile.setValue(newVal);
      this.mergeTiles = [];
      this.merged = true;
    } else {
      this.merged = false;
    }
    return score;
  }

  toJSON() {
    return {
      row: this.row,
      column: this.col,
      tile: this.tile ? this.tile.toJSON() : null,
      mergeTiles:  this.mergeTiles.map(tile => tile.toJSON()),
      merged: this.merged
    }
  }

  static fromJSON(json) {
    if (json) {
      const {row, column, tile, mergeTiles, merged} = json;
      const cell = new Cell(row, column);
      cell.tile = Tile.fromJSON(tile);
      cell.mergeTiles = mergeTiles.map(tile => Tile.fromJSON(tile));
      cell.merged = merged;
      return cell;
    }
    else {
      return null;
    }
  }
}
