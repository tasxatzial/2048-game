export default class NewTile {
  constructor() {}

  static original2048(grid) {
    const emptyCells = grid.getCellValues().filter(cell => !cell.hasTile());
    if (emptyCells.length === 0) {
      return [];
    }
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randValue = Math.floor(Math.random() > 0.9 ? 4 : 2);
    return [{
      row: randCell.getRow(),
      column: randCell.getColumn(),
      value: randValue
    }];
  }

  //used in tests, do not remove
  static test1(grid) {
    return [];
  }
}
