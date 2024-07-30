export default class MergeResult {
  constructor() {}

  static original2048(tileValues) {
    return tileValues.reduce((x, y) => x + y, 0);
  }
}
