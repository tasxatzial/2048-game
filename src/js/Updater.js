export default class Updater {
  constructor() {}

  update() {
    const game = JSON.parse(localStorage.getItem('game-2048'));
    if (game && localStorage.getItem('game-2048-version') !== '2') {
      this.updateToLatest(game);
      localStorage.setItem('game-2048', JSON.stringify(game));
      localStorage.setItem('game-2048-version', '2');
    }
  }

  // will modify game
  updateToLatest(game) {
    const gridArray = game.grid.gridArray;
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[0].length; j++) {
        const cell = gridArray[i][j];
        cell.tiles = [];
        if (cell.tile) {
          cell.tiles.push(cell.tile);
        }
        cell.tiles.push(...cell.mergeTiles);
        delete cell.tile;
        delete cell.mergeTiles;
      }
    }
  }
}
