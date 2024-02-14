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

  setTile(tile) {
    if (this.tile) {
      throw new Error("cell already has a tile");
    }
    this.tile = tile;
    this.tile.setRow(this.row);
    this.tile.setColumn(this.col);
  }

  getTile() {
    return this.tile;
  }

  setMergeTile(tile) {
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

  canMerge(tile) {
    if (!this.tile) {
      throw new Error("cell has no tile");
    }
    return !this.mergeTile && (this.tile.getValue() == tile.getValue());
  }

  mergeTiles() {
    if (!this.tile || !this.mergeTile) {
      return;
    }
    this.tile.setValue(this.tile.getValue() + this.mergeTile.getValue());
    this.clearMergeTile();
  }

  setNewTile() {
    if (this.tile) {
      throw new Error("cell already has a tile")
    }
    this.tile = new Tile(this.row, this.col);
  }
}
