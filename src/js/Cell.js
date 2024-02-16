import Tile from "./Tile.js";

export default class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.tile = null;
    this.mergeTile = null;
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

  clearTile() {
    this.tile = null;
  }

  clearMergeTile() {
    this.mergeTile = null;
  }

  willMerge() {
    return this.tile && this.mergeTile;
  }

  canMerge(cell) {
    return this.tile && !cell.mergeTile && !this.mergeTile && (this.tile.getValue() == cell.tile.getValue());
  }

  mergeTiles(mergeTilesFn) {
    if (this.willMerge()) {
      this.tile.setValue(mergeTilesFn(this.tile.getValue(), this.mergeTile.getValue()));
      this.tile.row = this.row;
      this.tile.col = this.col;
      this.clearMergeTile();
    }
  }

  toObj() {
    return {
      row: this.row,
      column: this.col,
      tile: this.hasTile() ? this.tile.toObj() : null,
      mergeTile: this.hasMergeTile() ? this.mergeTile.toObj() : null
    }
  }
}
