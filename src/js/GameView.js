import BoardView from "./gameView/BoardView.js";

export default class GameView {
  constructor() {
    this.boardView = new BoardView();
    this.scoreEl = document.querySelector('.js-current-score');
    this._onKeydown = this._onKeydown.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this.modelSlideHandlers = null;
    this.slidePermitted = false;
    this.pointerDownPos = null;
    this.slideTriggerDistance = 40;
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
    this.scoreEl.textContent = game.score;
  }

  bindModelSlideHandlers(modelHandlers) {
    this.modelSlideHandlers = modelHandlers;
  }

  unbindModelSlideHandlers() {
    this.modelSlideHandlers = null;
  }

  addSlideListeners() {
    window.addEventListener('keydown', this._onKeydown);
    this.boardView.addPointerListeners({
      onMouseDown: this._onPointerDown,
      onTouchStart: this._onPointerDown
    });
    document.addEventListener('mouseup', this._onPointerUp);
    document.addEventListener('mousemove', this._onPointerMove);
    document.addEventListener('touchend', this._onPointerUp);
    document.addEventListener('touchmove', this._onPointerMove);
  }

  removeSlideListeners() {
    window.removeEventListener('keydown', this._onKeydown);
    this.boardView.removePointerListeners();
    document.removeEventListener('mouseup', this._onPointerUp);
    document.removeEventListener('mousemove', this._onPointerMove);
    document.removeEventListener('touchend', this._onPointerUp);
    document.removeEventListener('touchmove', this._onPointerMove);
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
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.code)) {
      e.preventDefault()
      if (this.slidePermitted) {
        this.slidePermitted = false;
        switch(e.code) {
          case 'ArrowLeft':
            this.modelSlideHandlers.slideLeft();
            break;
          case 'ArrowUp':
            this.modelSlideHandlers.slideUp();
            break;
          case 'ArrowRight':
            this.modelSlideHandlers.slideRight();
            break;
          case 'ArrowDown':
            this.modelSlideHandlers.slideDown();
            break;
        }
      }
    }
  }

  _onPointerDown(e) {
    if (!e.target.closest('div').classList.contains('js-end-game-overlay')) {
      e.preventDefault();
    }
    else {
      return;
    }
    if (e.type === 'mousedown') {
      this.pointerDownPos = {
        x: e.clientX,
        y: e.clientY
      }
    }
    else if (e.type === 'touchstart') {
      this.pointerDownPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
    }
  }

  _onPointerUp(e) {
    this.pointerDownPos = null;
  }

  _onPointerMove(e) {
    if (!this.pointerDownPos || !this.slidePermitted) {
      return;
    }
    let horizontalDistance;
    let verticalDistance;
    if (e.type === 'mousemove') {
      horizontalDistance = e.clientX - this.pointerDownPos.x;
      verticalDistance = e.clientY - this.pointerDownPos.y;
    }
    else if (e.type === 'touchmove') {
      horizontalDistance = e.touches[0].clientX - this.pointerDownPos.x;
      verticalDistance = e.touches[0].clientY - this.pointerDownPos.y;
    }
    if (Math.abs(horizontalDistance) > this.slideTriggerDistance ||
        Math.abs(verticalDistance) > this.slideTriggerDistance) {
          this.slidePermitted = false;
          this.pointerDownPos = null;
          if (horizontalDistance > this.slideTriggerDistance) {
            this.modelSlideHandlers.slideRight();
          }
          else if (horizontalDistance < -this.slideTriggerDistance) {
            this.modelSlideHandlers.slideLeft();
          }
          else if (verticalDistance > this.slideTriggerDistance) {
            this.modelSlideHandlers.slideDown();
          }
          else if (verticalDistance < -this.slideTriggerDistance) {
            this.modelSlideHandlers.slideUp();
          }
        }
  }
}
