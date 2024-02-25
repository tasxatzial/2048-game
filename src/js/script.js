import GameModel from "./GameModel.js";
import GridView from "./gameView/GridView.js";

localStorage.clear(); //required since there's no reset button yet


const gameGridContainer = document.getElementById('game-grid-container');

let game;
const savedGame = JSON.parse(localStorage.getItem('game-2048'));
if (savedGame) {
  game = new GameModel({
    game: savedGame,
    options: {}
  });
}
else {
  game = new GameModel({
    game: {},
    options: {
      gridBooleanFnName: "threeByThree"
    }
  });
}

const gridView = new GridView(gameGridContainer);
const initialPromises = gridView.initialize(game.getBoard());

const keydownHandlers = {
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
};

Promise.all(initialPromises).then(() => initialSetup());

game.addChangeListener("slideEvent", () => {
  const promises = gridView.slideBoard(game.getBoard());
  Promise.all(promises).then(() => game.mergeBoard());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = gridView.mergeBoard(game.getBoard());
  Promise.all(promises).then(() => game.addTiles());
});

game.addChangeListener("mergeBoardEvent", () => {
  gridView.mergeBoard(game.getBoard());
  game.addTiles();
});

game.addChangeListener("noOpEvent", () => {
  gridView.bindHandlers(keydownHandlers);
});

game.addChangeListener("addTileEvent", () => {
  const promises = gridView.addTiles(game.getBoard());
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
    gridView.bindHandlers(keydownHandlers);
  }
}
