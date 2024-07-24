export default class Updater {
  constructor() {}

  update() {
    const version = localStorage.getItem('game-2048-version');
    if (version === '2') {
      return;
    }
    const game = JSON.parse(localStorage.getItem('game-2048'));
    if (game && this.updateToLatest(game)) {
      localStorage.setItem('game-2048', JSON.stringify(game));
    }
    localStorage.setItem('game-2048-version', '2');
  }

  // will modify game
  updateToLatest(game) {
    const gridArray = game.grid.gridArray;
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[0].length; j++) {
        const cell = gridArray[i][j];
        if (cell.tiles) { // exists in v2+ games
          return false;
        }
        cell.tiles = [];
        if (cell.tile) {
          cell.tiles.push(cell.tile);
        }
        cell.tiles.push(...cell.mergeTiles);
        delete cell.tile;
        delete cell.mergeTiles;
      }
    }
    return true;
  }
}
