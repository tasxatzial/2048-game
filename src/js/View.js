export default class View {
  constructor() {
    this.bestScoreEl = document.querySelector('.js-best-score');
  }

  initialize(obj) {
    const { bestScore } = obj;
    this.setBestScore(bestScore);
  }

  bindResetBestScore(callback) {
    document.querySelector('.js-best-score-trash-btn')
            .addEventListener('click', callback);
  }

  bindStartNewGame(callback) {
    document.querySelector('.js-new-game-btn')
            .addEventListener('click', callback);
  }

  setBestScore(bestScore) {
    this.bestScoreEl.textContent = bestScore;
  }
}
