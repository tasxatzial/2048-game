import EventEmitter from './EventEmitter.js';
import GameModel from './gameModel/GameModel.js';

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.initialBestScore = 0;
    this.bestScore = this.initialBestScore;
  }

  initialize(obj = {}) {
    const { bestScore } = obj;
    if (bestScore !== undefined && bestScore !== null) {
      this.bestScore = bestScore;
    }
    this.raiseChange('initializeModelEvent');
  }

  initializeGame(obj = {}) {
    if (obj.game) {
      this.gameModel = new GameModel(obj.game);
    }
    else {
      this.gameModel = new GameModel();
    }
    this.gameModel.addChangeListener('moveEvent', () => {
      const score = this.gameModel.getScore();
      if (score > this.bestScore) {
        this.bestScore = score;
      }
      this.raiseChange('gameMoveEvent');
    });
    this.gameModel.addChangeListener('purgeModelEvent', () => {
      this.raiseChange('purgeGameModelEvent');
    });
    this.gameModel.addChangeListener('noOpEvent', () => {
      this.raiseChange('gameNoOpEvent');
    });
    this.raiseChange('initializeGameModelEvent');
  }

  getGameObj() {
    return this.gameModel.export();
  }

  getBestScore() {
    return this.bestScore;
  }

  purgeGameModel() {
    this.gameModel.purge();
  }

  getBestScore() {
    return this.bestScore;
  }

  resetBestScore() {
    this.bestScore = 0;
    this.raiseChange('resetBestScoreEvent');
  }

  gameMoveUp() {
    this.gameModel.moveUp();
  }

  gameMoveDown() {
    this.gameModel.moveDown();
  }
  
  gameMoveLeft() {
    this.gameModel.moveLeft();
  }

  gameMoveRight() {
    this.gameModel.moveRight();
  }
}
