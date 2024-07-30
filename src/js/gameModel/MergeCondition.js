export default class MergeCondition {
  constructor() {}

  //first element of tileValues corresponds to the tile closest to the edge in the slide direction
  static original2048(tileValues) {
    if (tileValues.length !== 2) {
      return false;
    }
    return tileValues[0] === tileValues[1];
  }
}
