import GameView from "./GameView.js";

export default class View {
  constructor() {
    this.gameView = null;
    this.bestScoreEl = document.querySelector('.js-best-score');
  }

  getGameView() {
    return this.gameView;
  }

  initializeGameView() {
    this.gameView = new GameView();
  }

  setBestScore(bestScore) {
    this.bestScoreEl.textContent = bestScore;
  }

  bindResetBestScore(callback) {
    document.querySelector('.js-best-score-trash-btn')
            .addEventListener('click', callback);
  }

  bindStartNewGame(callback) {
    document.querySelector('.js-new-game-btn')
            .addEventListener('click', callback);
  }
}
