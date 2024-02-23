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
    console.log("model add tile");
    this.raiseChange("addTileEvent");
  }

  mergeTiles() {
    const willMerge = this.grid.willMerge();
    this.grid.finalizeCells();
    if (willMerge) {
      this.raiseChange("slideMergeEvent");
    } else {
      this.raiseChange("slideNoMergeEvent");
    }
    console.log("model merge");
  }

  slideLeft() {
    this.grid.slideLeft();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
    else {
      this.raiseChange("noOpEvent");
    }
  }

  slideRight() {
    this.grid.slideRight();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
    else {
      this.raiseChange("noOpEvent");
    }
  }

  slideUp() {
    this.grid.slideUp();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
    else {
      this.raiseChange("noOpEvent");
    }
  }

  slideDown() {
    this.grid.slideDown();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
    else {
      this.raiseChange("noOpEvent");
    }
  }
}
