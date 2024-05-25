import EventEmitter from "./EventEmitter.js";
import GameModel from "./GameModel.js";

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.bestScore = 0;
  }

  addGameTiles() {
    this.gameModel.addTiles();
  }

  getBestScore() {
    return this.bestScore;
  }

  getGame() {
    return this.gameModel.toJSON();
  }

  initialize(game, bestScore) {
    if (game) {
      this.gameModel = new GameModel(game);
      this.bestScore = bestScore;
    }
    else {
      this.gameModel = new GameModel();
    }
    this.gameModel.addChangeListener('addTilesEvent', () => {
      this.raiseChange('addTilesEvent');
    });
    this.gameModel.addChangeListener('mergeTilesEvent', () => {
      this.raiseChange('mergeTilesEvent');
    });
    this.gameModel.addChangeListener('slideTilesEvent', () => {
      this.raiseChange('slideTilesEvent');
    });
    this.gameModel.addChangeListener('noOpEvent', () => {
      this.raiseChange('noOpEvent');
    });
    this.raiseChange('updateBestScoreEvent');
  }

  initializeGameTiles() {
    this.gameModel.initializeTiles();
  }

  mergeGameTiles() {
    this.gameModel.mergeTiles();
  }

  resetBestScore() {
    this.bestScore = 0;
    this.raiseChange('updateBestScoreEvent');
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

  updateBestScore(game) {
    if (game.score > this.bestScore) {
      this.bestScore = game.score;
      this.raiseChange('updateBestScoreEvent');
    }
  }
}
