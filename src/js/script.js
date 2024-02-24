import Game from "./Game.js";
import GameView from "./GameView.js";


const gameContainer = document.getElementById('game-container');

let gameObj = {
  game: {},
  options: {}
};

const game = new Game(gameObj);
const gameView = new GameView(gameContainer);
const promises = gameView.initialize(game.getBoard());

Promise.all(promises).then(() => {
  gameView.bindKeydown({
    slideUp: game.slideUp.bind(game),
    slideRight: game.slideRight.bind(game),
    slideDown: game.slideDown.bind(game),
    slideLeft: game.slideLeft.bind(game)
  });
});

game.addChangeListener("slideEvent", () => {
  const promises = gameView.slideBoard(game.getBoard());
  Promise.all(promises).then(() => game.mergeBoard());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = gameView.mergeBoard(game.getBoard());
  Promise.all(promises).then(() => game.addTile());
});

game.addChangeListener("mergeBoardEvent", () => {
  gameView.mergeBoard(game.getBoard());
  game.addTile();
});

game.addChangeListener("noOpEvent", () => {
  gameView.reEnableHandlers();
});

game.addChangeListener("addTileEvent", () => {
  const promises = gameView.addTiles(game.getBoard());
  Promise.all(promises).then(() => gameView.reEnableHandlers());
});
