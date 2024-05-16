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
    if (obj.grid) {
      const {grid, gameOptions, score, slideCount} = obj;
      this.grid = new Grid({grid: grid});
      this.score = score;
      this.slideCount = slideCount;
      this.winConditionFnName = gameOptions.winConditionFnName;
      this.winConditionFn = WinCondition[this.winConditionFnName];
      this.loseConditionFnName = gameOptions.loseConditionFnName;
      this.loseConditionFn = LoseCondition[this.loseConditionFnName];
    }
    else {
      const {gridOptions, initialTiles} = obj;
      const gameOptions = obj.gameOptions || {};
      this.grid = new Grid({options: gridOptions});
      const {winConditionFnName, loseConditionFnName} = gameOptions;
      if (winConditionFnName) {
        this.winConditionFnName = gameOptions.winConditionFnName;
        this.winConditionFn = WinCondition[this.winConditionFnName];
      }
      else {
        this.winConditionFnName = "original2048";
        this.winConditionFn = WinCondition.original2048;
      }
      if (loseConditionFnName) {
        this.loseConditionFnName = gameOptions.loseConditionFnName;
        this.loseConditionFn = LoseCondition[this.loseConditionFnName];
      }
      else {
        this.loseConditionFnName = "original2048";
        this.loseConditionFn = LoseCondition.original2048;
      }
      if (initialTiles) {
        this.grid.initTiles(initialTiles);
      }
      else {
        this.grid.addTiles();
        this.grid.addTiles();
      }
    }
  }

  toJSON() {
    return {
      grid: this.grid.toJSON(),
      gameOptions: {
        winConditionFnName: this.winConditionFnName,
        loseConditionFnName: this.loseConditionFnName,
      },
      score: this.score,
      slideCount: this.slideCount
    }
  }

  isWon() {
    return this.winConditionFn(this.grid);
  }

  isLost() {
    return this.loseConditionFn(this.grid);
  }

  getScore() {
    return this.score;
  }

  getSlideCount() {
    return this.slideCount;
  }

  addTiles() {
    this.grid.addTiles();
    this.raiseChange("addTileEvent");
  }

  mergeBoard() {
    const willMergeCells = this.grid.willMergeCells();
    this.score += this.grid.mergeCells();
    if (willMergeCells) {
      this.raiseChange("mergeTilesEvent");
    }
    else {
      this.raiseChange("mergeBoardEvent");
    }
  }

  _raiseEventAfterSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.raiseChange("slideEvent");
      this.slideCount++;
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
