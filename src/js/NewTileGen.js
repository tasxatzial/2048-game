export default class NewTileGen {
  constructor() {}

  static original2048(board) {
    const emptyCells = board.map(row => row.filter(el => el && !el.tile)).flat();
    console.log(emptyCells.length)
    if (emptyCells.length == 0) {
      return null;
    }
    const randEl = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.floor(Math.random() > 0.9 ? 4 : 2);
    return {
      row: randEl.row,
      column: randEl.column,
      value: value
    };
  }
}
