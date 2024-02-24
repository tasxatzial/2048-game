export default class NewTileGen {
  constructor() {}

  static original2048({gridArray}) {
    const emptyCells = gridArray.map(row => row.filter(el => el && !el.tile)).flat();
    if (emptyCells.length == 0) {
      return {};
    }
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randValue = Math.floor(Math.random() > 0.9 ? 4 : 2);
    return {
      row: randCell.row,
      column: randCell.column,
      value: randValue
    };
  }
}
