import BoardViewColorModel from "./BoardViewColorModel.js";

export default class BoardView {
  constructor() {
    this.boardViewColorModel = new BoardViewColorModel();
    this.grid = document.createElement('div');
    this.pointerHandlers = null;
  }

  _waitForEvent(element, eventType) {
    return new Promise(resolve => {
      element.addEventListener(eventType, resolve, {once: true})
    });
  }

  _initializeTile(tileElement, value) {
    tileElement.textContent = value;
    const {color, backgroundColor} = this.boardViewColorModel.getTileColor(value);
    tileElement.style.color = color;
    tileElement.style.backgroundColor = backgroundColor;
    const valueLength = value.toString().length;
    tileElement.classList.add(valueLength > 10 ? 'tile-font-size-10' : 'tile-font-size-' + valueLength);
  }

  _initializeEndGameOverlay() {
    const endGameOverlay =
      `<div class="end-game-overlay js-end-game-overlay">
        <p class="end-game-msg js-end-game-msg"></p>
        <button class="btn hide-overlay-btn js-hide-overlay-btn">Dismiss</button>
      </div>`
    this.grid.insertAdjacentHTML('beforeend', endGameOverlay);
    this.endGameOverlay = this.grid.lastChild;
    this.endGameMsg = this.endGameOverlay.querySelector('.js-end-game-msg');
    this.endGameOverlay.querySelector('.js-hide-overlay-btn')
                       .addEventListener('click', () => this._hideEndGameOverlay());
  }

  _showEndGameOverlay() {
    this.endGameOverlay.classList.add('js-visible');
  }

  _hideEndGameOverlay() {
    this.endGameOverlay.classList.remove('js-visible');
  }

  showWinMsg() {
    this.endGameMsg.textContent = 'Game is Won!';
    this._showEndGameOverlay();
  }

  showLoseMsg() {
    this.endGameMsg.textContent = 'Game is Lost!';
    this._showEndGameOverlay();
  }

  addPointerListeners(handlers) {
    this.grid.addEventListener('mousedown', handlers.onMouseDown);
    this.grid.addEventListener('touchstart', handlers.onTouchStart, {passive: false});
    this.pointerHandlers = handlers;
  }

  removePointerListeners() {
    this.grid.removeEventListener('mousedown', this.pointerHandlers.onMouseDown);
    this.grid.removeEventListener('touchstart', this.pointerHandlers.onTouchStart);
    this.pointerHandlers = null;
  }

  initialize({gridArray}) {
    const promises = [];
    this.boardViewColorModel.updateTileColors(gridArray);
    this.gridRows = gridArray.length;
    this.gridCols = this.gridRows? gridArray[0].length : 0;
    this.grid.classList.add('grid');
    this.grid.style.setProperty('--grid-rows', this.gridRows);
    this.grid.style.setProperty('--grid-columns', this.gridCols);
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cell = document.createElement('div');
        const cellObj = gridArray[i][j];
        if (cellObj) {
          cell.classList.add('cell');
          const innerCell = document.createElement('div');
          if (cellObj.tile) {
            this._initializeTile(innerCell, cellObj.tile.value);
            innerCell.classList.add('tile');
            if (cellObj.hasNewTile) {
              promises.push(this._waitForEvent(innerCell, 'animationend'));
              innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
              innerCell.classList.add('zoomin');
            }
          }
          cell.appendChild(innerCell);
        }
        else {
          cell.classList.add('missing-cell');
        }
        this.grid.appendChild(cell);
      }
    }
    this._initializeEndGameOverlay();
    const boardContainer = document.querySelector('.js-board-container');
    boardContainer.innerHTML = "";
    boardContainer.appendChild(this.grid);
    return promises;
  }

  slide({gridArray}) {
    const promises = [];
    const cells = this.grid.children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        [cellObj.tile, ...cellObj.mergeTiles].forEach((tileObj) => {
          if (tileObj) {
            const slidingTile = cells.item(tileObj.row * gridArray[0].length + tileObj.column).children[0];
            if (cellObj.column != tileObj.column) {
              promises.push(this._waitForEvent(slidingTile, 'transitionend'));
              slidingTile.style.setProperty('--cell-column', cellObj.column);
              slidingTile.style.setProperty('--tile-column', tileObj.column);
              slidingTile.classList.add('horizontal-slide');
            }
            else if (cellObj.row != tileObj.row) {
              promises.push(this._waitForEvent(slidingTile, 'transitionend'));
              slidingTile.style.setProperty('--cell-row', cellObj.row);
              slidingTile.style.setProperty('--tile-row', tileObj.row);
              slidingTile.classList.add('vertical-slide');
            }
          }
        });
      }
    }
    return promises;
  }

  merge({gridArray}) {
    this.boardViewColorModel.updateTileColors(gridArray);
    const promises = [];
    const cells = this.grid.children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        const cell = cells.item(i * gridArray[0].length + j);
        const innerCell = cell.children[0];
        innerCell.removeAttribute('style');
        innerCell.classList = '';
        if (cellObj.tile && !cellObj.hasNewTile) {
          innerCell.classList.add('tile');
          const tileValue = cellObj.mergedValue != null ? cellObj.mergedValue : cellObj.tile.value;
          this._initializeTile(innerCell, tileValue);
          if (cellObj.mergedValue != null) {
            promises.push(this._waitForEvent(innerCell, 'animationend'));
            innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
            innerCell.classList.add('zoomin');
          }
        }
        else {
          innerCell.textContent = '';
        }
      }
    }
    return promises;
  }

  addTiles({gridArray}) {
    const promises = [];
    const cells = this.grid.children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        const cell = cells.item(i * gridArray[0].length + j);
        const innerCell = cell.children[0];
        if (cellObj.hasNewTile) {
          promises.push(this._waitForEvent(innerCell, 'animationend'));
          this._initializeTile(innerCell, cellObj.tile.value);
          innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
          innerCell.classList.add('tile', 'zoomin');
        }
      }
    }
    return promises;
  }
}
