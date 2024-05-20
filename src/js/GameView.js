import BoardView from "./gameView/BoardView.js";

export default class GameView {
  constructor(obj) {
    if (!obj) {
      obj = {};
    }
    this.boardView = new BoardView();
    this.score = document.querySelector('.js-current-score');
    this._onKeydown = this._onKeydown.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this.slideHandlers = null;
    this.slidePermitted = false;
    this.grid = null;
    this.mouseDownPos = null;
    this.mouseTriggerDistance = obj.mouseTriggerDistance || 40;
  }

  initialize(game) {
    this.updateScore(game);
    this.grid = this.boardView.initialize(game.grid);
    const boardContainer = document.querySelector('.js-board-container');
    boardContainer.innerHTML = "";
    boardContainer.appendChild(this.grid);
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
    this.grid.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  removeHandlers() {
    this.slideHandlers = null;
    window.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('mousemove', this._onMouseMove);
  }

  updateGameStatus(game) {
    if (game.isWon) {
      this._showWinMsg();
    }
    else if (game.isLost) {
      this._showLoseMsg();
    }
    else {
      this.setReady();
    }
  }

  setReady() {
    this.slidePermitted = true;
  }

  _showWinMsg() {
    this.boardView.showWinMsg();
  }

  _showLoseMsg() {
    this.boardView.showLoseMsg();
  }

  _onKeydown(e) {
    if (!this.slidePermitted) {
      return;
    }
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.code)) {
      this.slidePermitted = false;
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

  _onMouseDown(e) {
    this.mouseDownPos = {
      x: e.clientX,
      y: e.clientY
    }
  }

  _onMouseUp(e) {
    this.mouseDownPos = null;
  }

  _onMouseMove(e) {
    if (!this.mouseDownPos || !this.slidePermitted) {
      return;
    }
    const horizontalDistance = e.clientX - this.mouseDownPos.x;
    const verticalDistance = e.clientY - this.mouseDownPos.y;
    if (Math.abs(horizontalDistance) > this.mouseTriggerDistance ||
        Math.abs(verticalDistance) > this.mouseTriggerDistance) {
          this.slidePermitted = false;
          this.mouseDownPos = null;
          if (horizontalDistance > this.mouseTriggerDistance) {
            this.slideHandlers.slideRight();
          }
          else if (horizontalDistance < -this.mouseTriggerDistance) {
            this.slideHandlers.slideLeft();
          }
          else if (verticalDistance > this.mouseTriggerDistance) {
            this.slideHandlers.slideDown();
          }
          else if (verticalDistance < -this.mouseTriggerDistance) {
            this.slideHandlers.slideUp();
          }
        }
  }
}
