import Grid from './Grid.js';
import WinCondition from './WinCondition.js';
import LoseCondition from './LoseCondition.js';
import EventEmitter from '../EventEmitter.js';

export default class GameModel extends EventEmitter {
  constructor(obj = {}) {
    super();
    if (obj.grid) {
      const {grid, gameOptions, score, slideCount, isWon, isLost} = obj;
      this.grid = new Grid({grid});
      this.score = score;
      this.slideCount = slideCount;
      this.isWon = isWon;
      this.isLost = isLost;
      this.winConditionFnName = gameOptions.winConditionFnName;
      this.winConditionFn = WinCondition[this.winConditionFnName];
      this.loseConditionFnName = gameOptions.loseConditionFnName;
      this.loseConditionFn = LoseCondition[this.loseConditionFnName];
    }
    else {
      const {gridOptions, initialTiles} = obj;
      this.grid = new Grid({gridOptions});
      const gameOptions = obj.gameOptions || {};
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
        this.grid.addTiles(initialTiles);
      }
      else {
        this.grid.addDefaultTiles();
        this.grid.addDefaultTiles();
      }
      this.updateStatus();
    }
  }

  export() {
    const obj = {
      grid: this.grid.export(),
      gameOptions: {
        winConditionFnName: this.winConditionFnName,
        loseConditionFnName: this.loseConditionFnName,
      },
      score: this.score,
      slideCount: this.slideCount,
      isWon: this.isWon,
      isLost: this.isLost
    };
    return obj;
  }

  updateStatus() {
    this.isWon = this.winConditionFn(this.grid);
    this.isLost = this.loseConditionFn(this.grid) || LoseCondition.default(this.grid);
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
    this.grid.updateCellMergeValues();
    if (this.grid.hasChangedAfterSlide()) {
      this.grid.addDefaultTiles();
      this.slideCount++;
      const mergeScore = this.grid.getMergeScore();
      if (mergeScore !== null) {
        this.score += mergeScore;
      }
      this.updateStatus();
      this.raiseChange('moveEvent');
    }
    else {
      this.raiseChange('noOpEvent');
    }
  }
}
