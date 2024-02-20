import Game from "./Game.js";
import GameView from "./GameView.js";


const gameContainer = document.getElementById('game-container');

const options = {};

const game = new Game(options);
const gameView = new GameView(game.toJSON(), gameContainer);

gameView.bindKeydown({
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
});

game.addChangeListener("gridUpdate", () => {
  gameView.updateGrid(game.toJSON());
});
