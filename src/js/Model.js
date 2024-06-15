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
    }
    else {
      this.initialGamePresent = false;
      this.gameModel = new GameModel();
    }
    this.bestScore = bestScore || this.bestScore || this.initialBestScore;
    this.bubbleChange(this.gameModel, 'addTilesEvent');
    this.bubbleChange(this.gameModel, 'mergeTilesEvent');
    this.bubbleChange(this.gameModel, 'slideTilesEvent');
    this.bubbleChange(this.gameModel, 'noOpEvent');
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
