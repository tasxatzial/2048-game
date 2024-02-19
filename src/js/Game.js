import Grid from "./Grid.js";
import Model from "./Model.js";

export default class Game extends Model {
  constructor(options) {
    super();
    const {gridArray, gridStateObj, newTileFnName, mergeResultFnName} = options;
    this.grid = new Grid({gridArray, gridStateObj, newTileFnName, mergeResultFnName});
    this.grid.addTile();
    this.grid.addTile();
  }

  toJSON() {
    return this.grid.toStateObj();
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
    return this.grid.getMergedTilesSum();
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
