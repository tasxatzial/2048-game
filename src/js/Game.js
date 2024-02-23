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

  getScore() {
    return this.grid.getScore();
  }

  addTile() {
    this.grid.addTile();
    this.raiseChange("addTileEvent");
  }

  mergeBoard() {
    const willMergeTilesResult = this.grid.willMergeTiles();
    this.grid.mergeCells();
    if (willMergeTilesResult) {
      this.raiseChange("mergeTilesEvent");
    } else {
      this.raiseChange("mergeBoardEvent");
    }
  }

  _raiseEventAfterSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.raiseChange("slideEvent");
    }
    else {
      this.raiseChange("noOpEvent");
    }
  }

  slideLeft() {
    this.grid.slideLeft();
    this._raiseEventAfterSlide();
  }

  slideRight() {
    this.grid.slideRight();
    this._raiseEventAfterSlide();
  }

  slideUp() {
    this.grid.slideUp();
    this._raiseEventAfterSlide();
  }

  slideDown() {
    this.grid.slideDown();
    this._raiseEventAfterSlide();
  }
}
