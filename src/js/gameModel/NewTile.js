export default class NewTileGen {
  constructor() {}

  static original2048(grid) {
    const emptyCells = grid.getCells().filter(cell => !cell.hasTile());
    if (emptyCells.length == 0) {
      return {};
    }
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randValue = Math.floor(Math.random() > 0.9 ? 4 : 2);
    return [{
      row: randCell.getRow(),
      column: randCell.getColumn(),
      value: randValue
    }];
  }
}
