export default class GameView {
  constructor(gameObj, gridParent) {
    this.gridParent = gridParent;
    this.renderGrid(gameObj);
    this.onKeydown = this.onKeydown.bind(this);
  }

  renderGrid(jsonArray) {
    const rows = jsonArray.length;
    const columns = rows ? jsonArray[0].length : 0;
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.style.setProperty('--grid-rows', rows);
    grid.style.setProperty('--grid-columns', columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cell = document.createElement('div');
        const cellObj = jsonArray[i][j];
        if (cellObj) {
          cell.classList.add('cell');
          const tile = document.createElement('div');
          tile.style.setProperty('--row', cellObj.row);
          tile.style.setProperty('--column', cellObj.column);
          if (cellObj.tile) {
            tile.textContent = cellObj.tile.value;
            tile.style.setProperty('--merge-count', cellObj.tile.mergeCount);
            tile.classList.add('tile', `tile-x${cellObj.tile.mergeCount}`);
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

  updateGrid(gameObj) {
    this.renderGrid(gameObj);
  }

  bindKeydown(slideHandlers) {
    this.slideHandlers = slideHandlers;
    window.addEventListener('keydown', this.onKeydown)
  }

  onKeydown(e) {
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
