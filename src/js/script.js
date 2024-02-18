import Game from "./Game.js";
import GameView from "./GameView.js";

const gridParent = document.getElementById('game-board');

const game = new Game();
const gameView = new GameView(game, gridParent);

