import Game from "./Game.js";
import GameView from "./GameView.js";

localStorage.clear(); //required since there's no reset button yet


const gameContainer = document.getElementById('game-container');

let game;
const savedGame = JSON.parse(localStorage.getItem('game-2048'));
if (savedGame) {
  game = new Game({
    game: savedGame,
    options: {}
  });
}
else {
  game = new Game({
    game: {},
    options: {
      gridBooleanFnName: "threeByThree"
    }
  });
}

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
  Promise.all(promises).then(() => {
    localStorage.setItem('game-2048', JSON.stringify(game.toJSON()));
    initialSetup();
  });
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
