export default class GameView {
  constructor(gameContainer) {
    this.gridParent = gameContainer;
    this._onKeydown = this._onKeydown.bind(this);
  }

  initialize({gridArray}) {
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
          innerCell.classList.add('inner-cell');
          if (cellObj.tile) {
            innerCell.textContent = cellObj.tile.value;
            const mergeCount = cellObj.tile.mergeCount;
            innerCell.classList.add(mergeCount > 32 ? 'tile-merge-32' : 'tile-merge-' + mergeCount);
            const valueLength = cellObj.tile.value.toString().length;
            innerCell.classList.add(valueLength > 10 ? 'tile-font-size-10' : 'tile-font-size-' + valueLength);
          }
          cell.appendChild(innerCell);
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

  slideBoard({gridArray}) {
    const cells = this.gridParent.children[0].children;
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
              slidingTile.style.setProperty('--cell-column', cellObj.column);
              slidingTile.style.setProperty('--tile-column', tileObj.column);
              slidingTile.classList.add('horizontal-slide');
            }
            else if (cellObj.row != tileObj.row) {
              slidingTile.style.setProperty('--cell-row', cellObj.row);
              slidingTile.style.setProperty('--tile-row', tileObj.row);
              slidingTile.classList.add('vertical-slide');
            }
          }
        });
      }
    }
    console.log("view slide");
  }

  finalizeBoard({gridArray}) {
    const cells = this.gridParent.children[0].children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cell = cells.item(i * gridArray[0].length + j);
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        const innerCell = cell.children[0];
        innerCell.removeAttribute('style');
        innerCell.classList = 'inner-cell';
        if (cellObj.tile) {
          innerCell.textContent = cellObj.tile.value;
          const mergeCount = cellObj.tile.mergeCount;
          innerCell.classList.add(mergeCount > 32 ? 'tile-merge-32' : 'tile-merge-' + mergeCount);
          const valueLength = cellObj.tile.value.toString().length;
          innerCell.classList.add(valueLength > 10 ? 'tile-font-size-10' : 'tile-font-size-' + valueLength);
          if (cell.hasAttribute('data-will-merge')) {
            innerCell.classList.add('zoomin');
            innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'));
          }
        } else {
          innerCell.textContent = '';
        }
      }
    }
    console.log("view merge");
  }

  addTile({gridArray}) {
    const cells = this.gridParent.children[0].children;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridCols; j++) {
        const cellObj = gridArray[i][j];
        if (!cellObj) {
          continue;
        }
        const cell = cells.item(i * gridArray[0].length + j);
        cell.removeAttribute('data-will-merge');
        const innerCell = cell.children[0];
        if (cellObj.tile && innerCell.textContent == '') {
          innerCell.textContent = cellObj.tile.value;
          const mergeCount = cellObj.tile.mergeCount;
          innerCell.classList.add(mergeCount > 32 ? 'tile-merge-32' : 'tile-merge-' + mergeCount);
          const valueLength = cellObj.tile.value.toString().length;
          innerCell.classList.add(valueLength > 10 ? 'tile-font-size-10' : 'tile-font-size-' + valueLength);
          innerCell.classList.add('zoomin');
          innerCell.addEventListener('animationend', () => innerCell.classList.remove('zoomin'));
        }
      }
    }
    console.log("view add tile");
    setTimeout(() => {
      this.bindKeydown(this.slideHandlers);
    }, 100);
  }

  noModelChange() {
    this.bindKeydown(this.slideHandlers);
  }

  bindKeydown(slideHandlers) {
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
