export default class MergeResult {
  constructor() {}

  static original2048(tileVal, mergeTilesVals) {
    return tileVal + mergeTilesVals.reduce((x, y) => x + y, 0);
  }
}
