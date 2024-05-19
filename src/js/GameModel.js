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
      this.initialTiles = initialTiles;
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
      this.score = 0;
      this.slideCount = 0;
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

  initTiles() {
    if (this.initialTiles) {
      this.grid.initTiles(this.initialTiles);
    }
    else {
      this.grid.addTiles();
      this.grid.addTiles();
    }
    this.raiseChange("addTilesEvent");
  }

  isWon() {
    return this.winConditionFn(this.grid);
  }

  isLost() {
    return this.loseConditionFn(this.grid);
  }

  addTiles() {
    this.grid.addTiles();
    this.raiseChange("addTilesEvent");
  }

  mergeTiles() {
    this.score += this.grid.mergeCells();
    this.raiseChange("mergeTilesEvent");
  }

  _raiseEventAfterSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.raiseChange("slideTilesEvent");
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
