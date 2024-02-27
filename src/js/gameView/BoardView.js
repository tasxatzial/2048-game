import BoardViewColorModel from "./BoardViewColorModel.js";

export default class BoardView {
  constructor(boardContainer) {
    this.boardViewColorModel = new BoardViewColorModel();
    this.boardContainer = boardContainer;
    this._onKeydown = this._onKeydown.bind(this);
  }

  _initializeTile(tileElement, tileObj) {
    tileElement.textContent = tileObj.value;
    const {color, backgroundColor} = this.boardViewColorModel.getTileColor(tileObj.value);
    tileElement.style.color = color;
    tileElement.style.backgroundColor = backgroundColor;
    const valueLength = tileObj.value.toString().length;
    tileElement.classList.add(valueLength > 10 ? 'tile-font-size-10' : 'tile-font-size-' + valueLength);
  }

  _waitForEvent(element, eventType) {
    return new Promise(resolve => {
      element.addEventListener(eventType, resolve, {once: true})
    });
  }

  initialize({gridArray}) {
    this.boardViewColorModel.updateTileColors(gridArray);
    const promises = [];
    this.gridRows = gridArray.length;
    this.gridCols = this.gridRows? gridArray[0].length : 0;
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.style.setProperty('--grid-rows', this.gridRows);
    grid.style.setProperty('--grid-columns', this.gridCols);
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cell = document.createElement('div');
        const cellObj = gridArray[i][j];
        if (cellObj) {
          cell.classList.add('cell');
          const innerCell = document.createElement('div');
          innerCell.classList.add('inner-cell', 'zoomin');
          innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
          if (cellObj.tile) {
            promises.push(this._waitForEvent(innerCell, 'animationend'));
            this._initializeTile(innerCell, cellObj.tile);
          }
          cell.appendChild(innerCell);
        }
        else {
          cell.classList.add('missing-cell');
        }
        grid.appendChild(cell);
      }
    }
    this.boardContainer.appendChild(grid);
    return promises;
  }

  slide({gridArray}) {
    const promises = [];
    const cells = this.boardContainer.children[0].children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        if (cellObj.mergeTile) {
          cells.item(cellObj.row * gridArray[0].length + cellObj.column).setAttribute('data-will-merge', '');
        }
        [cellObj.tile, cellObj.mergeTile].forEach((tileObj) => {
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
    const cells = this.boardContainer.children[0].children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        const cell = cells.item(i * gridArray[0].length + j);
        const innerCell = cell.children[0];
        innerCell.removeAttribute('style');
        innerCell.classList = 'inner-cell';
        if (cellObj.tile) {
          this._initializeTile(innerCell, cellObj.tile);
          if (cell.hasAttribute('data-will-merge')) {
            promises.push(this._waitForEvent(innerCell, 'animationend'));
            cell.removeAttribute('data-will-merge');
            innerCell.classList.add('zoomin');
            innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
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
    this.boardViewColorModel.updateTileColors(gridArray);
    const promises = [];
    const cells = this.boardContainer.children[0].children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        const cell = cells.item(i * gridArray[0].length + j);
        const innerCell = cell.children[0];
        if (cellObj.tile && innerCell.textContent == '') {
          promises.push(this._waitForEvent(innerCell, 'animationend'));
          this._initializeTile(innerCell, cellObj.tile);
          innerCell.classList.add('zoomin');
          innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'), {once: true});
        }
      }
    }
    return promises;
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
