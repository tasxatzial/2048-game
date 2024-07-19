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
        gridArray[i][j].tiles = [];
        if (gridArray[i][j].tile) {
          gridArray[i][j].tiles.push(gridArray[i][j].tile);
        }
        gridArray[i][j].tiles.push(...gridArray[i][j].mergeTiles);
        delete gridArray[i][j].tile;
        delete gridArray[i][j].mergeTiles;
      }
    }
  }
}
