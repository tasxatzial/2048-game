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
    this.gameView.bindModelSlideHandlers(handlers);
  }

  bindResetBestScore(callback) {
    document.querySelector('.js-best-score-trash-btn')
            .addEventListener('click', callback);
  }

  bindStartNewGame(callback) {
    document.querySelector('.js-new-game-btn')
            .addEventListener('click', callback);
  }

  initializeGame(game, modelSlideHandlers) {
    if (this.gameView) {
      this.gameView.unbindModelSlideHandlers();
      this.gameView.removeSlideListeners();
    }
    this.gameView = new GameView();
    this.gameView.bindModelSlideHandlers(modelSlideHandlers);
    this.gameView.addSlideListeners();
    const promises = this.gameView.initialize(game);
    Promise.all(promises).then(() => {
      this.updateGameStatus(game);
    });
  }

  mergeGameTiles(game) {
    return this.gameView.mergeTiles(game);
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
