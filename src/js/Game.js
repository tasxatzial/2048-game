import Grid from "./grid/Grid.js";
import Model from "./Model.js";

export default class Game extends Model {
  constructor(options) {
    super();
    const {grid, gridBooleanFnName, newTileFnName, mergeResultFnName, mergeScoreFnName} = options;
    this.grid = new Grid({grid, gridBooleanFnName, newTileFnName, mergeResultFnName, mergeScoreFnName});
    this.grid.addTile();
    this.grid.addTile();
  }

  toJSON() {
    return this.grid.toObj();
  }

  getBoard() {
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
    return this.grid.getScore();
  }

  _postSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.grid.mergeTiles();
      this.grid.addTile();
      this.raiseChange("gridUpdate");
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
}
