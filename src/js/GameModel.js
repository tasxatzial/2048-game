import Grid from "./gameModel/Grid.js";
import WinCondition from "./gameModel/WinCondition.js";
import LoseCondition from "./gameModel/LoseCondition.js";
import EventEmitter from "./EventEmitter.js";

export default class Game extends EventEmitter {
  constructor(obj) {
    super();
    if (!obj) {
      obj = {};
    }
    let {grid, gridOptions, options} = obj;
    if (!options) {
      options = {};
    }
    if (options.winConditionFnName) {
      this.winConditionFnName = options.winConditionFnName;
      this.winConditionFn = WinCondition[this.winConditionFnName];
    }
    else {
      this.winConditionFnName = "original2048";
      this.winConditionFn = WinCondition.original2048;
    }
    if (options.loseConditionFnName) {
      this.loseConditionFnName = options.loseConditionFnName;
      this.loseConditionFn = LoseCondition[this.loseConditionFnName];
    }
    else {
      this.loseConditionFnName = "original2048";
      this.loseConditionFn = LoseCondition.original2048;
    }
    if (grid) {
      this.grid = new Grid({grid: grid});
    }
    else {
      this.grid = new Grid({options: gridOptions});
      this.grid.addTile();
      this.grid.addTile();
    }
  }

  toJSON() {
    return {
      grid: this.grid.toJSON(),
      options: {
        winConditionFnName: this.winConditionFnName,
        loseConditionFnName: this.loseConditionFnName
      }
    }
  }

  isWon() {
    return this.winConditionFn(this.grid);
  }

  isLost() {
    return this.loseConditionFn(this.grid);
  }

  getScore() {
    return this.grid.getScore();
  }

  addTiles() {
    this.grid.addTile();
    this.raiseChange("addTileEvent");
  }

  mergeBoard() {
    const willMergeTilesResult = this.grid.willMergeTiles();
    this.grid.mergeCells();
    if (willMergeTilesResult) {
      this.raiseChange("mergeTilesEvent");
    }
    else {
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
