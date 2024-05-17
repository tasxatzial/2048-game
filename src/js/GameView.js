import BoardView from "./gameView/BoardView.js";

export default class GameView {
  constructor() {
    this.boardView = new BoardView(document.getElementById('board-container'));
    this.newGameBtn = document.getElementById('new-game-btn');
    this.score = document.getElementById('score');
    this._onKeydown = this._onKeydown.bind(this);
    this.slideHandlers = null;
    this.slidePermitted = false;
  }

  initialize(game) {
    this.updateScore(game);
    return this.boardView.initialize(game.grid);
  }

  slideTiles(game) {
    return this.boardView.slide(game.grid);
  }

  mergeTiles(game) {
    return this.boardView.merge(game.grid);
  }

  addTiles(game) {
    return this.boardView.addTiles(game.grid);
  }

  updateScore(game) {
    this.score.textContent = game.score;
  }

  bindHandlers(slideHandlers) {
    this.slideHandlers = slideHandlers;
    window.addEventListener('keydown', this._onKeydown);
  }

  removeHandlers() {
    this.slideHandlers = null;
    window.removeEventListener('keydown', this._onKeydown);
  }

  setReady() {
    this.slidePermitted = true;
  }

  _onKeydown(e) {
    if (!this.slidePermitted) {
      return;
    }
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.code)) {
      this.slidePermitted = false;
      this.newGameBtn.blur();
      switch(e.code) {
        case 'ArrowLeft':
          this.slideHandlers.slideLeft();
          break;
        case 'ArrowUp':
          this.slideHandlers.slideUp();
          break;
        case 'ArrowRight':
          this.slideHandlers.slideRight();
          break;
        case 'ArrowDown':
          this.slideHandlers.slideDown();
          break;
      }
    }
  }
}
