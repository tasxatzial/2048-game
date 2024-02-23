import Game from "./Game.js";
import GameView from "./GameView.js";


const gameContainer = document.getElementById('game-container');

const options = {};

const game = new Game(options);
const gameView = new GameView(gameContainer);
gameView.initialize(game.toJSON());

gameView.bindKeydown({
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
});

game.addChangeListener("slideEvent", () => {
  const promises = gameView.slideBoard(game.toJSON());
  Promise.all(promises).then(() => game.mergeBoard());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = gameView.mergeBoard(game.toJSON());
  Promise.all(promises).then(() => game.addTile());
});

game.addChangeListener("mergeBoardEvent", () => {
  gameView.mergeBoard(game.toJSON());
  game.addTile();
});

game.addChangeListener("addTileEvent", () => {
  const promises = gameView.addTiles(game.toJSON());
  Promise.all(promises).then(() => gameView.reEnableHandlers());
});

game.addChangeListener("noOpEvent", () => {
  gameView.reEnableHandlers();
});
