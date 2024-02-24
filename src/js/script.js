import Game from "./Game.js";
import GameView from "./GameView.js";


const gameContainer = document.getElementById('game-container');

const gameObj = {
  game: {},
  options: {
    gridBooleanFnName: "threeByThree"
  }
};

const game = new Game(gameObj);
const gameView = new GameView(gameContainer);
const initialPromises = gameView.initialize(game.getBoard());

const keydownHandlers = {
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
};

Promise.all(initialPromises).then(() => initialSetup());

game.addChangeListener("slideEvent", () => {
  const promises = gameView.slideBoard(game.getBoard());
  Promise.all(promises).then(() => game.mergeBoard());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = gameView.mergeBoard(game.getBoard());
  Promise.all(promises).then(() => game.addTiles());
});

game.addChangeListener("mergeBoardEvent", () => {
  gameView.mergeBoard(game.getBoard());
  game.addTiles();
});

game.addChangeListener("noOpEvent", () => {
  gameView.bindHandlers(keydownHandlers);
});

game.addChangeListener("addTileEvent", () => {
  const promises = gameView.addTiles(game.getBoard());
  Promise.all(promises).then(() => initialSetup());
});

/*------------- FUNCTIONS ------------- */

function initialSetup() {
  if (game.isWon()) {
    alert('Game is won');
  }
  else if (game.isLost()) {
    alert('Game is lost');
  }
  else {
    gameView.bindHandlers(keydownHandlers);
  }
}
