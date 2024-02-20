export default class GameView {
  constructor(gameObj, gameContainer) {
    this.gridParent = gameContainer;
    this.renderGrid(gameObj);
    this._onKeydown = this._onKeydown.bind(this);
  }

  renderGrid({gridObj}) {
    const rows = gridObj.length;
    const columns = rows ? gridObj[0].length : 0;
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.style.setProperty('--grid-rows', rows);
    grid.style.setProperty('--grid-columns', columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cell = document.createElement('div');
        const cellObj = gridObj[i][j];
        if (cellObj) {
          cell.classList.add('cell');
          const tile = document.createElement('div');
          tile.style.setProperty('--row', cellObj.row);
          tile.style.setProperty('--column', cellObj.column);
          if (cellObj.tile) {
            tile.textContent = cellObj.tile.value;
            tile.classList.add('tile', 'glass');
            const mergeCount = cellObj.tile.mergeCount;
            tile.style.setProperty('--merge-count', cellObj.tile.mergeCount);
            tile.classList.add(mergeCount > 32 ? 'tile-merge-32' : 'tile-merge-' + mergeCount);
            const valueLength = cellObj.tile.value.toString().length;
            tile.classList.add(valueLength > 10 ? 'tile-font-size-10' : 'tile-font-size-' + valueLength);
          }
          cell.appendChild(tile);
        }
        else {
          cell.classList.add('missing-cell');
        }
        grid.appendChild(cell);
      }
    }
    this.gridParent.innerHTML = "";
    this.gridParent.appendChild(grid);
  }

  updateGrid({gridObj}) {
    this.renderGrid({gridObj});
  }

  bindKeydown(slideHandlers) {
    this.slideHandlers = slideHandlers;
    window.addEventListener('keydown', this._onKeydown)
  }

  _onKeydown(e) {
    if (e.repeat) {
      return;
    }
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
