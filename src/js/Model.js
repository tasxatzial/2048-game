import EventEmitter from './EventEmitter.js';

export default class Model extends EventEmitter {
  constructor() {
    super();
    this.initialBestScore = 0;
    this.bestScore = this.initialBestScore;
  }

  initialize(obj = {}) {
    const { bestScore } = obj;
    if (bestScore !== undefined && bestScore !== null) {
      this.bestScore = bestScore;
    }
    this.raiseChange('initializeEvent');
  }

  getBestScore() {
    return this.bestScore;
  }

  resetBestScore() {
    this.bestScore = 0;
    this.raiseChange('updateBestScoreEvent');
  }

  updateBestScore(score) {
    if (score > this.bestScore) {
      this.bestScore = score;
    }
    this.raiseChange('updateBestScoreEvent');
  }
}
