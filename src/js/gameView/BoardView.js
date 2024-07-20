import BoardViewColorModel from './BoardViewColorModel.js';

export default class BoardView {
  constructor() {
    this.boardViewColorModel = new BoardViewColorModel();
    this.grid = document.createElement('div');
    this.pointerListeners = null;
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

  addPointerListeners(listeners) {
    this.grid.addEventListener('mousedown', listeners.onMouseDown);
    this.grid.addEventListener('touchstart', listeners.onTouchStart, {passive: false});
    this.pointerListeners = listeners;
  }

  removePointerListeners() {
    this.grid.removeEventListener('mousedown', this.pointerListeners.onMouseDown);
    this.grid.removeEventListener('touchstart', this.pointerListeners.onTouchStart);
    this.pointerListeners = null;
  }

  initialize(grid) {
    const { gridArray } = grid;
    const promises = [];
    this.boardViewColorModel.updateTileColors(gridArray);
    this.gridRows = gridArray.length;
    this.gridCols = this.gridRows ? gridArray[0].length : 0;
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
          if (cellObj.tiles[0]) {
            this._initializeTile(innerCell, cellObj.tiles[0].value);
            innerCell.classList.add('tile');
            if (cellObj.newTileAdded) {
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
    boardContainer.innerHTML = '';
    boardContainer.appendChild(this.grid);
    return promises;
  }

  slide(grid) {
    const { gridArray } = grid;
    const promises = [];
    const cells = this.grid.children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        let zIndex = 100;
        for (let i = 0; i < cellObj.tiles.length; i++) {
          const tileObj = cellObj.tiles[i];
          if (!tileObj) {
            continue;
          }
          const slidingTile = cells.item(tileObj.row * gridArray[0].length + tileObj.column).children[0];
          slidingTile.style.zIndex = zIndex--;
          if (cellObj.column !== tileObj.column || cellObj.row !== tileObj.row) {
            const finalOpacity = i > 0 && cellObj.mergeValue !== null ? 0 : 1;
            const tileStyle = window.getComputedStyle(slidingTile);
            const cellSize = Number(tileStyle.getPropertyValue('--cell-size').slice(0, -3));
            const cellGap = Number(tileStyle.getPropertyValue('--cell-gap').slice(0, -3));
            slidingTile.style.setProperty('--final-opacity', finalOpacity);
            if (cellObj.column !== tileObj.column) {
              const x = 1 - cellSize / (Math.abs(cellObj.column - tileObj.column) * (cellSize + cellGap));
              const slideDuration = Number(tileStyle.getPropertyValue('--horizontal-slide-duration').slice(0, -2));
              slidingTile.style.setProperty('--cell-column', cellObj.column);
              slidingTile.style.setProperty('--tile-column', tileObj.column);
              slidingTile.style.setProperty('--opacity-delay', slideDuration * x + 'ms');
              slidingTile.style.setProperty('--opacity-duration', slideDuration * (1 - x) + 'ms');
              promises.push(this._waitForEvent(slidingTile, 'transitionend'));
              slidingTile.classList.add('horizontal-slide');
            }
            else if (cellObj.row !== tileObj.row) {
              const x = 1 - cellSize / (Math.abs(cellObj.row - tileObj.row) * (cellSize + cellGap));
              const slideDuration = Number(tileStyle.getPropertyValue('--vertical-slide-duration').slice(0, -2));
              slidingTile.style.setProperty('--cell-row', cellObj.row);
              slidingTile.style.setProperty('--tile-row', tileObj.row);
              slidingTile.style.setProperty('--opacity-delay', slideDuration * x + 'ms');
              slidingTile.style.setProperty('--opacity-duration', slideDuration * (1 - x) + 'ms');
              promises.push(this._waitForEvent(slidingTile, 'transitionend'));
              slidingTile.classList.add('vertical-slide');
            }
          }
        }
      }
    }
    return promises;
  }

  merge(grid) {
    const { gridArray } = grid;
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
        innerCell.textContent = '';
        if (cellObj.tiles[0] && !cellObj.newTileAdded) {
          innerCell.classList.add('tile');
          const tileValue = cellObj.mergeValue !== null ? cellObj.mergeValue : cellObj.tiles[0].value;
          this._initializeTile(innerCell, tileValue);
          if (cellObj.mergeValue !== null && cellObj.mergeValue !== undefined) {
            promises.push(this._waitForEvent(innerCell, 'animationend'));
            innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
            innerCell.classList.add('zoomin');
          }
        }
      }
    }
    return promises;
  }

  addTiles(grid) {
    const { gridArray } = grid;
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
        if (cellObj.newTileAdded) {
          promises.push(this._waitForEvent(innerCell, 'animationend'));
          this._initializeTile(innerCell, cellObj.tiles[0].value);
          innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
          innerCell.classList.add('tile', 'zoomin');
        }
      }
    }
    return promises;
  }
}
