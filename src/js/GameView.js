import BoardView from "./gameView/BoardView.js";

export default class GameView {
  constructor() {
    this.boardView = new BoardView(document.getElementById('board-container'));
    this.newGameBtn = document.getElementById('new-game-btn');
    this.score = document.getElementById('score');
    this._onKeydown = this._onKeydown.bind(this);
    this.slideHandlers = null;
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
    window.addEventListener('keydown', this._onKeydown, {once: true});
  }

  removeHandlers() {
    this.slideHandlers = null;
    window.removeEventListener('keydown', this._onKeydown);
  }

  _onKeydown(e) {
    switch(e.code) {
      case 'ArrowLeft':
        this.slideHandlers.slideLeft();
        this.newGameBtn.blur();
        break;
      case 'ArrowUp':
        this.slideHandlers.slideUp();
        this.newGameBtn.blur();
        break;
      case 'ArrowRight':
        this.slideHandlers.slideRight();
        this.newGameBtn.blur();
        break;
      case 'ArrowDown':
        this.slideHandlers.slideDown();
        this.newGameBtn.blur();
        break;
    }
  }
}
