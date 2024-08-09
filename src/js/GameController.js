import GameView from './GameView.js';
import GameModel from './GameModel.js';
import EventEmitter from './EventEmitter.js';

export default class GameController extends EventEmitter {
  constructor() {
    super();
    this.model = null;
    this.view = null;
    this.modelHandlers = null;
  }

  initializeModel(obj = {}) {
    if (obj.game) {
      this.model = new GameModel(obj.game);
    }
    else {
      this.model = new GameModel();
    }
    const game = this.model.export();
    localStorage.setItem('game-2048', JSON.stringify(game));

    this.modelHandlers = {
      move : {
        moveUp: this.model.moveUp.bind(this.model),
        moveRight: this.model.moveRight.bind(this.model),
        moveDown: this.model.moveDown.bind(this.model),
        moveLeft: this.model.moveLeft.bind(this.model)
      }
    }

    this.model.addChangeListener('moveEvent', async () => {
      const game = this.model.export();
      await Promise.all(this.view.slideTiles(game));
      this.raiseChange('moveEvent');
    });

    this.model.addChangeListener('purgeModelEvent', () => {
      const game = this.model.export();
      localStorage.setItem('game-2048', JSON.stringify(game));
      this.view.updateStatus(game);
    });

    this.model.addChangeListener('noOpEvent', () => {
      this.view.setReady();
    });

    this.raiseChange('initializeModelEvent');
  }

  async initializeView() {
    if (this.view) {
      this.view.unbindModelHandlers();
      this.view.removeSlideListeners();
    }
    this.view = new GameView();
    this.view.bindModelHandlers(this.modelHandlers);
    this.view.addSlideListeners();
    const game = this.model.export();
    await Promise.all(this.view.initialize(game));
    this.view.updateStatus(game);
  }

  getScore() {
    return this.model.getScore();
  }

  async createNewTiles() {
    const game = this.model.export();
    const mergePromises = this.view.mergeTiles(game);
    this.view.updateScore(game);
    const addNewTilesPromises = this.view.addTiles(game);
    await Promise.all([...mergePromises, ...addNewTilesPromises]);
    this.model.purge();
  }
}
