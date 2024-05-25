import EventEmitter from "./EventEmitter.js";
import GameModel from "./GameModel.js";

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.bestScore = 0;
    this.bestScoreChanged = true;
    this.initialGamePresent = null;
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

  hasBestScoreChanged() {
    return this.bestScoreChanged;
  }

  hasInitialGame() {
    return this.initialGamePresent;
  }

  initialize(game, bestScore) {
    if (game) {
      this.initialGamePresent = true;
      this.gameModel = new GameModel(game);
      this.bestScore = bestScore;
    }
    else {
      this.initialGamePresent = false;
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
    this.raiseChange('initializeModelEvent');
  }

  initializeGameTiles() {
    this.gameModel.initializeTiles();
  }

  mergeGameTiles() {
    this.gameModel.mergeTiles();
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

  updateBestScore(game) {
    this.bestScoreChanged = false;
    if (game.score > this.bestScore) {
      this.bestScore = game.score;
      this.bestScoreChanged = true;
    }
    this.raiseChange('updateBestScoreEvent');
  }
}
