export default class GameView {
  constructor(game, gridParent) {
    this.gridParent = gridParent;
    this.game = game;
    this.renderGrid(game.toJSON());
  }

  renderGrid(jsonArray) {
    const rows = jsonArray.length;
    const columns = rows? jsonArray[0].length : 0;
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
          tile.classList.add('tile');
          tile.style.setProperty('--row', cellObj.row);
          tile.style.setProperty('--column', cellObj.column);
          if (cellObj.tile) {
            tile.textContent = cellObj.tile.value;
          }
          cell.appendChild(tile);
        }
        else {
          cell.classList.add('missing-cell');
        }
        grid.appendChild(cell);
      }
    }
    this.gridParent.innerHtml = "";
    this.gridParent.appendChild(grid);
  }
}
