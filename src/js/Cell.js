import Tile from "./Tile.js";

export default class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.tile = null;
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

  clearTile() {
    this.tile = null;
  }

  setNewTile() {
    if (this.tile) {
      throw new Error("cell already has a tile")
    }
    this.tile = new Tile(this.row, this.col);
  }
}
