import EventEmitter from "./EventEmitter.js";
import GameModel from "./GameModel.js";

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.gameModel = null;
    this.bestScore = 0;
  }

  initialize(game, bestScore) {
    if (game) {
      this.gameModel = new GameModel(game);
      this.bestScore = bestScore;
    }
    else {
      this.gameModel = new GameModel();
    }
    this.raiseChange('updateBestScoreEvent');
  }

  getGameModel() {
    return this.gameModel;
  }

  getBestScore() {
    return this.bestScore;
  }

  updateBestScore(game) {
    if (game.score > this.bestScore) {
      this.bestScore = game.score;
      this.raiseChange('updateBestScoreEvent');
    }
  }

  resetBestScore() {
    this.bestScore = 0;
    this.raiseChange('updateBestScoreEvent');
  }
}
