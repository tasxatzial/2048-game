import Grid from "./Grid.js";
import GridGen from "./GridGen.js";

export default class Game {
  constructor() {
    this.grid = new Grid({
      grid: GridGen.createFullRectangle(4, 4),
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

  hasBoardChanged() {
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

  newTileFn(emptyCells) {
    if (emptyCells.length == 0) {
      return null;
    }
    const randEl = emptyCells[Math.floor(Math.random() * emptyCells.length)];
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
