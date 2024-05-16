import BoardView from "./gameView/BoardView.js";

export default class GameView {
  constructor() {
    this.boardView = new BoardView(document.getElementById('board-container'));
    this._onKeydown = this._onKeydown.bind(this);
  }

  initialize(game) {
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

  bindHandlers(slideHandlers) {
    this.slideHandlers = slideHandlers;
    window.addEventListener('keydown', this._onKeydown, {once: true});
  }

  _onKeydown(e) {
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
