import GameView from "./GameView.js";

export default class View {
  constructor() {
    this.gameView = null;
    this.bestScoreEl = document.querySelector('.js-best-score');
  }

  addGameTiles(game) {
    return this.gameView.addTiles(game);
  }

  bindGameHandlers(handlers) {
    this.gameView.bindHandlers(handlers);
  }

  bindResetBestScore(callback) {
    document.querySelector('.js-best-score-trash-btn')
            .addEventListener('click', callback);
  }

  bindStartNewGame(callback) {
    document.querySelector('.js-new-game-btn')
            .addEventListener('click', callback);
  }

  getGameView() {
    return this.gameView;
  }

  hasGameView() {
    return this.gameView != null;
  }

  initializeGame(game) {
    this.gameView.initialize(game);
  }

  initializeGameView() {
    this.gameView = new GameView();
  }

  mergeGameTiles(game) {
    return this.gameView.mergeTiles(game);
  }

  removeGameHandlers() {
    if (this.gameView) {
      this.gameView.removeHandlers();
    }
  }

  setBestScore(bestScore) {
    this.bestScoreEl.textContent = bestScore;
  }

  setGameReady() {
    this.gameView.setReady();
  }

  slideGameTiles(game) {
    return this.gameView.slideTiles(game);
  }

  updateGameScore(game) {
    this.gameView.updateScore(game);
  }

  updateGameStatus(game) {
    this.gameView.updateGameStatus(game);
  }
}
