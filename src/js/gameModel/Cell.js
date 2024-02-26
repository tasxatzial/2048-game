import Tile from "./Tile.js";

export default class Cell {
  constructor(row, column) {
    this.row = row;
    this.col = column;
    this.tile = null;
    this.mergeTile = null;
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
    return this.tile && !cell.mergeTile && !this.mergeTile && this.mergeConditionFn(this.tile.getValue(), cell.tile.getValue());
  }

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
      score = this.mergeScoreFn(this.tile.getValue(), this.mergeTile.getValue());
      this.tile.setValue(this.mergeResultFn(this.tile.getValue(), this.mergeTile.getValue()));
      this.tile.setMergeCount(Math.max(this.tile.getMergeCount(), this.mergeTile.getMergeCount()) + 1);
      this.mergeTile = null;
    }
    return score;
  }

  toObj() {
    return {
      row: this.row,
      column: this.col,
      tile: this.tile ? this.tile.toObj() : null,
      mergeTile: this.mergeTile ? this.mergeTile.toObj() : null,
    }
  }

  static fromObj(obj) {
    if (obj) {
      const {row, column, tile, mergeTile} = obj;
      const cell = new Cell(row, column);
      cell.tile = Tile.fromObj(tile);
      cell.mergeTile = Tile.fromObj(mergeTile);
      return cell;
    } else {
      return null;
    }
  }
}
