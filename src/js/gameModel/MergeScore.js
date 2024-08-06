export default class MergeScore {
  constructor() {}

  static original2048(tileValues) {
    return tileValues.reduce((x, y) => x + y, 0);
  }

  //used in tests, do not remove
  static test1(tileValues) {
    return 2 * tileValues[0] + tileValues.slice(1).reduce((x, y) => x + y, 0);
  }
}
