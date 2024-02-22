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
  gameView.slideBoard(game.toJSON());
  setTimeout(() => {
    game.mergeTiles();
  }, 1000)
});

game.addChangeListener("mergeEvent", () => {
  gameView.mergeTiles(game.toJSON());
  setTimeout(() => {
    game.addTile();
  }, 500);
});

game.addChangeListener("addTileEvent", () => {
  gameView.addTile(game.toJSON());
});