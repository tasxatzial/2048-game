import EventEmitter from './EventEmitter.js';
import GameModel from './GameModel.js';

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.initialBestScore = 0;
    this.bestScore = this.initialBestScore;
  }

  initialize(game, bestScore) {
    this.gameModel = new GameModel(game);
    this.bestScore = bestScore || this.bestScore || this.initialBestScore;
    this.gameModel.addChangeListener('slideEvent', () => {
      const score = this.gameModel.getScore();
      if (score > this.bestScore) {
        this.bestScore = score;
      }
      this.raiseChange('slideTilesEvent');
    });
    this.gameModel.addChangeListener('purgeModelEvent', () => {
      this.raiseChange('purgeGameModelEvent');
    })
    this.bubbleChange(this.gameModel, 'noOpEvent');
    this.raiseChange('initializeModelEvent');
  }

  purgeGameModel() {
    this.gameModel.purge();
  }

  getGameJSON() {
    return this.gameModel.toJSON();
  }

  getBestScore() {
    return this.bestScore;
  }

  resetBestScore() {
    this.bestScore = 0;
    this.raiseChange('resetBestScoreEvent');
  }

  slideTilesUp() {
    this.gameModel.slideUp();
  }

  slideTilesDown() {
    this.gameModel.slideDown();
  }
  
  slideTilesLeft() {
    this.gameModel.slideLeft();
  }

  slideTilesRight() {
    this.gameModel.slideRight();
  }
}
