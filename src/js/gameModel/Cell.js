import Tile from "./Tile.js";

export default class Cell {
  constructor(row, column) {
    this.row = row;
    this.col = column;
    this.tile = null;
    this.mergeTile = null;
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

  hasMergeTile() {
    return !!this.mergeTile;
  }

  getTile() {
    return this.tile;
  }

  getMergeTile() {
    return this.mergeTile;
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
    if (this.mergeTile) {
      throw new Error("target cell already has a merge tile");
    }
    this.mergeTile = cell.tile;
    cell.tile = null;
  }

  canMergeTile(cell) {
    return this.tile
           && !cell.mergeTile
           && !this.mergeTile
           && this.mergeConditionFn(this.tile.getValue(), cell.tile.getValue());
  }

  //currently unused
  willMergeTiles() {
    return this.tile && this.mergeTile;
  }

  merge() {
    let score = 0;
    if (this.tile) {
      this.tile.setRow(this.row);
      this.tile.setColumn(this.col);
    }
    if (this.mergeTile) {
      const val1 = this.tile.getValue();
      const val2 = this.mergeTile.getValue();
      score = this.mergeScoreFn(val1, val2);
      const newVal = this.mergeResultFn(val1, val2);
      this.tile.setValue(newVal);
      this.mergeTile = null;
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
      mergeTile: this.mergeTile ? this.mergeTile.toJSON() : null,
      merged: this.merged
    }
  }

  static fromJSON(json) {
    if (json) {
      const {row, column, tile, mergeTile, merged} = json;
      const cell = new Cell(row, column);
      cell.tile = Tile.fromJSON(tile);
      cell.mergeTile = Tile.fromJSON(mergeTile);
      cell.merged = merged;
      return cell;
    }
    else {
      return null;
    }
  }
}
