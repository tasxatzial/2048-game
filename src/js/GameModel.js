import Grid from './gameModel/Grid.js';
import WinCondition from './gameModel/WinCondition.js';
import LoseCondition from './gameModel/LoseCondition.js';
import EventEmitter from './EventEmitter.js';

export default class GameModel extends EventEmitter {
  constructor(json = {}) {
    super();
    if (json.grid) {
      const {grid, gameOptions, score, slideCount} = json;
      this.grid = new Grid({grid});
      this.score = score;
      this.slideCount = slideCount;
      this.winConditionFnName = gameOptions.winConditionFnName;
      this.winConditionFn = WinCondition[this.winConditionFnName];
      this.loseConditionFnName = gameOptions.loseConditionFnName;
      this.loseConditionFn = LoseCondition[this.loseConditionFnName];
    }
    else {
      const {gridOptions, initialTiles} = json;
      this.grid = new Grid({gridOptions});
      const gameOptions = json.gameOptions || {};
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
    const json = {
      grid: this.grid.toJSON(),
      gameOptions: {
        winConditionFnName: this.winConditionFnName,
        loseConditionFnName: this.loseConditionFnName,
      },
      score: this.score,
      slideCount: this.slideCount
    };
    if (this.winConditionFn(this.grid)) {
      return {...json, isWon: true}
    }
    else if (this.loseConditionFn(this.grid) || LoseCondition.default(this.grid)) {
      return {...json, isLost: true}
    }
    return json;
  }

  getScore() {
    return this.score;
  }

  purge() {
    this.grid.purge();
    this.raiseChange('purgeModelEvent');
  }

  moveLeft() {
    this.grid.slideLeft();
    this._postMove();
  }

  moveRight() {
    this.grid.slideRight();
    this._postMove();
  }

  moveUp() {
    this.grid.slideUp();
    this._postMove();
  }

  moveDown() {
    this.grid.slideDown();
    this._postMove();
  }

  _postMove() {
    this.grid.clearNewTileFlags();
    this.grid.updateMergeScore();
    if (this.grid.hasChangedAfterSlide()) {
      this.grid.addTiles();
      this.slideCount++;
      const mergeScore = this.grid.getMergeScore();
      if (mergeScore !== null) {
        this.score += mergeScore;
      }
      this.raiseChange('moveEvent');
    }
    else {
      this.raiseChange('noOpEvent');
    }
  }
}
