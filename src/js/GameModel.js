import Grid from './gameModel/Grid.js';
import WinCondition from './gameModel/WinCondition.js';
import LoseCondition from './gameModel/LoseCondition.js';
import EventEmitter from './EventEmitter.js';

export default class GameModel extends EventEmitter {
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
        this.winConditionFnName = 'original2048';
        this.winConditionFn = WinCondition.original2048;
      }
      if (loseConditionFnName) {
        this.loseConditionFnName = gameOptions.loseConditionFnName;
        this.loseConditionFn = LoseCondition[this.loseConditionFnName];
      }
      else {
        this.loseConditionFnName = 'original2048';
        this.loseConditionFn = LoseCondition.original2048;
      }
      this.score = 0;
      this.slideCount = 0;
      if (this.initialTiles) {
        this.grid.initTiles(this.initialTiles);
      }
      else {
        this.grid.addTiles();
        this.grid.addTiles();
      }
    }
  }

  toJSON() {
    const JSON = {
      grid: this.grid.toJSON(),
      gameOptions: {
        winConditionFnName: this.winConditionFnName,
        loseConditionFnName: this.loseConditionFnName,
      },
      score: this.score,
      slideCount: this.slideCount
    };
    if (this.winConditionFn(this.grid)) {
      return {...JSON, isWon: true}
    }
    else if (this.loseConditionFn(this.grid)) {
      return {...JSON, isLost: true}
    }
    return JSON;
  }

  getScore() {
    return this.score;
  }

  purge() {
    this.grid.purge();
    this.raiseChange('purgeModelEvent');
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

  _raiseEventAfterSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.slideCount++;
      const mergeScore = this.grid.getMergeScore();
      if (mergeScore !== null) {
        this.score += mergeScore;
      }
      this.raiseChange('slideEvent');
    }
    else {
      this.raiseChange('noOpEvent');
    }
  }
}
