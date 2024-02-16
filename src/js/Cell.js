import Tile from "./Tile.js";

export default class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.tile = null;
    this.mergeTile = null;
  }

  isEmpty() {
    return !this.tile;
  }

  getTile() {
    return this.tile;
  }

  slideTile(tile) { //change to cell?
    if (this.tile) {
      throw new Error("cell already has a tile");
    }
    this.tile = tile;
  }

  setTile(value) {
    if (this.tile) {
      throw new Error("cell already has a tile")
    }
    this.tile = new Tile(this.row, this.col, value);
  }

  slideMergeTile(tile) { //change to cell?
    if (this.mergeTile) {
      throw new Error("cell already has a merge tile");
    }
    this.mergeTile = tile;
  }

  clearTile() {
    this.tile = null;
  }

  clearMergeTile() {
    this.mergeTile = null;
  }

  willMerge() {
    return !this.tile && !this.mergeTile;
  }

  canMerge(tile) {
    if (!this.tile) {
      throw new Error("cell has no tile");
    }
    return !this.mergeTile && (this.tile.getValue() == tile.getValue());
  }

  mergeTiles(mergeTilesFn) {
    if (!this.tile || !this.mergeTile) {
      return;
    }
    this.tile.setValue(mergeTilesFn(this.tile.getValue(), this.mergeTile.getValue()));
    this.tile.row = this.row;
    this.tile.col = this.col;
    this.clearMergeTile();
  }
}
