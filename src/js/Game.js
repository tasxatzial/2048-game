import Grid from "./Grid.js";

export default class Game {
  constructor() {
    this.grid = new Grid({
      size: 4,
      newTileFn: this.newTileFn,
      mergeResultFn: this.mergeResultFn
    });

    this.grid.addTile();
    this.grid.addTile();
  }
  
  printBoard() {
    return this.grid.toString();
  }

  isWon() {
    return this.grid.hasTile(2048);
  }

  isLost() {
    return !this.grid.canSlide();
  }

  hasSlid() {
    return this.grid.hasChangedAfterSlide();
  }

  getScore() {
    return this.grid.getMergedTilesSum();
  }

  _postSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.grid.mergeTiles();
      this.grid.addTile();
    }
  }

  slideLeft() {
    this.grid.slideLeft();
    this._postSlide();
  }

  slideRight() {
    this.grid.slideRight();
    this._postSlide();
  }

  slideUp() {
    this.grid.slideUp();
    this._postSlide();
  }

  slideDown() {
    this.grid.slideDown();
    this._postSlide();
  }

  newTileFn(gridArray) {
    const emptyTiles = gridArray.map(row => row.filter(el => !el.value)).flat();
    if (emptyTiles.length == 0) {
      return null;
    }
    const randEl = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const value = Math.floor(Math.random() > 0.9 ? 4 : 2);
    return {
      row: randEl.row,
      column: randEl.column,
      value: value
    };
  }
  
  mergeResultFn(value1, value2) {
    return value1 + value2;
  }
}
