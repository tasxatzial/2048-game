import EventEmitter from "./EventEmitter.js";
import GameModel from "./GameModel.js";

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.initialBestScore = 0;
    this.bestScore = this.initialBestScore;
    this.bestScoreChanged = true;
    this.initialGamePresent = null;
  }

  initialize(game, bestScore) {
    if (game) {
      this.initialGamePresent = true;
      this.gameModel = new GameModel(game);
    }
    else {
      this.initialGamePresent = false;
      this.gameModel = new GameModel();
    }
    this.bestScore = bestScore || this.bestScore || this.initialBestScore;
    this.gameModel.addChangeListener('slideTilesEvent', () => {
      const game = this.gameModel.toJSON();
      this.bestScoreChanged = false;
      if (game.score > this.bestScore) {
        this.bestScore = game.score;
        this.bestScoreChanged = true;
      }
      this.raiseChange('slideTilesEvent');
    });
    this.bubbleChange(this.gameModel, 'noOpEvent');
    this.bubbleChange(this.gameModel, 'purgeGameModelEvent');
    this.raiseChange('initializeModelEvent');
  }

  purgeGameModel() {
    this.gameModel.purge();
  }

  getGame() {
    return this.gameModel.toJSON();
  }

  getBestScore() {
    return this.bestScore;
  }

  hasBestScoreChanged() {
    return this.bestScoreChanged;
  }

  resetBestScore() {
    this.bestScore = 0;
    this.raiseChange('resetBestScoreEvent');
  }

  slideUp() {
    this.gameModel.slideUp();
  }

  slideDown() {
    this.gameModel.slideDown();
  }
  
  slideLeft() {
    this.gameModel.slideLeft();
  }

  slideRight() {
    this.gameModel.slideRight();
  }
}
