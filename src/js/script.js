import Game from "./Game.js";
import GameView from "./GameView.js";

const gridParent = document.getElementById('game-board');

const game = new Game();
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
