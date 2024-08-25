export default class MergeCondition {
  constructor() {}

  //first element of tileValues corresponds to the tile closest to the edge in the slide direction
  static original2048(tileValues) {
    if (tileValues.length !== 2) {
      return false;
    }
    return tileValues[0] === tileValues[1];
  }

  //used in tests, do not remove
  static test1(tileValues) {
    for (let i = 0; i < tileValues.length - 1; i++) {
      if (tileValues[i] < tileValues[i + 1]) {
        return false;
      }
    }
    return true;
  }

  //used in tests, do not remove
  static test2(tileValues) {
    for (let i = 0; i < tileValues.length - 1; i++) {
      if (tileValues[i] !== tileValues[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
