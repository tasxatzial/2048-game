import GameView from './GameView.js';

export default class View {
  constructor() {
    this.gameView = null;
    this.bestScoreEl = document.querySelector('.js-best-score');
  }

  bindResetBestScore(callback) {
    document.querySelector('.js-best-score-trash-btn')
            .addEventListener('click', callback);
  }

  bindStartNewGame(callback) {
    document.querySelector('.js-new-game-btn')
            .addEventListener('click', callback);
  }

  async initializeGame(json) {
    const { game, modelHandlers } = json;
    if (this.gameView) {
      this.gameView.unbindModelHandlers();
      this.gameView.removeSlideListeners();
    }
    this.gameView = new GameView();
    this.gameView.bindModelHandlers(modelHandlers);
    this.gameView.addSlideListeners();
    await Promise.all(this.gameView.initialize(game));
    this.gameView.updateStatus(game);
  }

  initialize(json) {
    const { bestScore } = json;
    this.setBestScore(bestScore);
  }

  slideGameTiles(game) {
    return this.gameView.slideTiles(game);
  }

  mergeGameTiles(game) {
    return this.gameView.mergeTiles(game);
  }

  addGameTiles(game) {
    return this.gameView.addTiles(game);
  }

  setBestScore(bestScore) {
    this.bestScoreEl.textContent = bestScore;
  }

  updateGameScore(game) {
    this.gameView.updateScore(game);
  }

  updateGameStatus(game) {
    this.gameView.updateStatus(game);
  }

  setGameReady() {
    this.gameView.setReady();
  }
}
