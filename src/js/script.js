import GameModel from "./GameModel.js";
import BoardView from "./gameView/BoardView.js";

localStorage.clear(); //required since there's no reset button yet

let game;
const savedGame = JSON.parse(localStorage.getItem('game-2048'));
if (savedGame) {
  game = new GameModel(savedGame);
}
else {
  game = new GameModel({
    gridOptions: {
      gridBooleanFnName: "threeByThree"
    }
  });
}

const boardView = new BoardView(document.getElementById('board-container'));
const initialPromises = boardView.initialize(game.toJSON().grid);

const keydownHandlers = {
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
};

Promise.all(initialPromises).then(initialSetup);

game.addChangeListener("slideEvent", () => {
  const promises = boardView.slide(game.toJSON().grid);
  Promise.all(promises).then(() => game.mergeBoard());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = boardView.merge(game.toJSON().grid);
  Promise.all(promises).then(() => game.addTiles());
});

game.addChangeListener("mergeBoardEvent", () => {
  boardView.merge(game.toJSON().grid);
  game.addTiles();
});

game.addChangeListener("noOpEvent", () => {
  boardView.bindHandlers(keydownHandlers);
});

game.addChangeListener("addTileEvent", () => {
  const promises = boardView.addTiles(game.toJSON().grid);
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
    boardView.bindHandlers(keydownHandlers);
  }
}
