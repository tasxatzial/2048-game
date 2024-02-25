import Grid from "./gameModel/Grid.js";
import EventEmitter from "./EventEmitter.js";

export default class Game extends EventEmitter {
  constructor({game, options}) {
    super();
    if (Object.keys(game).length == 0) {
      const gridOptions = {
        newTileFnName: options.newTileFnName,
        mergeResultFnName: options.mergeResultFnName,
        mergeScoreFnName: options.mergeScoreFnName,
        gridBooleanFnName: options.gridBooleanFnName
      };
      this.grid = new Grid({grid: {}, options: gridOptions});
      if (options.winTile) {
        this.winTile = options.winTile;
      }
      else {
        this.winTile = '2048';
      }
    }
    else {
      this.winTile = game.options.winTile;
      this.grid = new Grid({grid: game.grid, options: {}});
    }
    this.grid.addTile();
    this.grid.addTile();
  }

  toJSON() {
    return {
      grid: this.grid.toObj(),
      options: {
        winTile: this.winTile
      }
    }
  }

  getBoard() {
    return this.grid.toObj();
  }

  isWon() {
    return this.grid.hasTile(this.winTile);
  }

  isLost() {
    return !this.grid.canSlide();
  }

  getScore() {
    return this.grid.getScore();
  }

  addTiles() {
    this.grid.addTile();
    this.raiseChange("addTileEvent");
  }

  mergeBoard() {
    const willMergeTilesResult = this.grid.willMergeTiles();
    this.grid.mergeCells();
    if (willMergeTilesResult) {
      this.raiseChange("mergeTilesEvent");
    }
    else {
      this.raiseChange("mergeBoardEvent");
    }
  }

  _raiseEventAfterSlide() {
    if (this.grid.hasChangedAfterSlide()) {
      this.raiseChange("slideEvent");
    }
    else {
      this.raiseChange("noOpEvent");
    }
  }

  slideLeft() {
    this.grid.slideLeft();
    this._raiseEventAfterSlide();
  }

  slideRight() {
    this.grid.slideRight();
    this._raiseEventAfterSlide();
  }

  slideUp() {
    this.grid.slideUp();
    this._raiseEventAfterSlide();
  }

  slideDown() {
    this.grid.slideDown();
    this._raiseEventAfterSlide();
  }
}
