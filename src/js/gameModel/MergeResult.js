export default class MergeResult {
  constructor() {}

  //first element of tileValues corresponds to the tile closest to the edge in the slide direction
  static original2048(tileValues) {
    return tileValues.reduce((x, y) => x + y, 0);
  }

  //used in tests, do not remove
  static test1(tileValues) {
    return 3 * tileValues[0] - tileValues.slice(1).reduce((x, y) => x + y, 0);
  }
}
