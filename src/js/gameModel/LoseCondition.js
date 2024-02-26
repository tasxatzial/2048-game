export default class LoseCondition {
  constructor() {}

  static original2048(grid) {
    return !grid.canSlide();
  }
}
