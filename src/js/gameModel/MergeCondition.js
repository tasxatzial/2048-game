export default class MergeCondition {
  constructor() {}

  //first parameter corresponds to the tile closest to the edge in the slide direction
  static original2048(val1, val2) {
    return val1 === val2;
  }
}
