export default class MergeScore {
  constructor() {}

  static original2048(tilesVals) {
    return tilesVals.reduce((x, y) => x + y, 0);
  }
}
