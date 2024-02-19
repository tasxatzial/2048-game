import Game from "./Game.js";
import GameView from "./GameView.js";
import GridGen from "./GridGen.js";


const gridParent = document.getElementById('game-board');

const options = {
  gridObj: null,
  gridArray: GridGen.createFullRectangle(4, 4),
  newTileFnName: "original2048",
  mergeResultFnName: "original2048"
};

const game = new Game(options);
const gameView = new GameView(game.toJSON(), gridParent);

gameView.bindKeydown({
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
});

game.addChangeListener("gridUpdate", () => {
  gameView.updateGrid(game.toJSON());
});
