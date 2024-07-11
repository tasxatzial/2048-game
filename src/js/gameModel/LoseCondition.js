export default class LoseCondition {
  constructor() {}

  static default(grid) {
    return !grid.canSlide();
  }

  static original2048(grid) {
    return !grid.canSlide();
  }
}
