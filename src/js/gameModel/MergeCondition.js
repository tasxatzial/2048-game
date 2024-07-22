export default class MergeCondition {
  constructor() {}

  //first element of tilesVals corresponds to the tile closest to the edge in the slide direction
  static original2048(tilesVals) {
    if (tilesVals.length !== 2) {
      return false;
    }
    return tilesVals[0] === tilesVals[1];
  }
}
