import EventEmitter from './EventEmitter.js';
import GameModel from './GameModel.js';

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.initialBestScore = 0;
    this.bestScore = this.initialBestScore;
  }

  initialize(json) {
    if (!json) {
      json = {};
    }
    const { bestScore } = json;
    if (bestScore !== null && bestScore !== undefined) {
      this.bestScore = bestScore;
    }
    this.raiseChange('initializeModelEvent');
  }

  initializeGame(json) {
    if (!json) {
      json = {};
    }
    this.gameModel = new GameModel(json.game);
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

  getGameJSON() {
    return this.gameModel.toJSON();
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
