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

  addTile() {
    this.grid.addTile();
    console.log("model add tile");
    this.raiseChange("addTileEvent");
  }

  mergeTiles() {
    this.grid.mergeTiles();
    console.log("model merge");
    this.raiseChange("mergeEvent");
  }

  slideLeft() {
    this.grid.slideLeft();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
  }

  slideRight() {
    this.grid.slideRight();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
  }

  slideUp() {
    this.grid.slideUp();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
  }

  slideDown() {
    this.grid.slideDown();
    if (this.grid.hasChangedAfterSlide()) {
      console.log("model slide");
      this.raiseChange("slideEvent");
    }
  }
}
