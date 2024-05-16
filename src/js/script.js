import GameModel from "./GameModel.js";
import GameView from "./GameView.js";

localStorage.clear(); //required since there's no reset button yet

let game;
const savedGame = JSON.parse(localStorage.getItem('game-2048'));
if (savedGame) {
  game = new GameModel(savedGame);
}
else {
  game = new GameModel({
    gridOptions: {
      gridBooleanFnName: "threeByThree",
    }
  });
}

const keydownHandlers = {
  slideUp: game.slideUp.bind(game),
  slideRight: game.slideRight.bind(game),
  slideDown: game.slideDown.bind(game),
  slideLeft: game.slideLeft.bind(game)
};

const view = new GameView();
const initialPromises = view.initialize(game.toJSON());
Promise.all(initialPromises).then(initialSetup);

game.addChangeListener("slideEvent", () => {
  const promises = view.slide(game.toJSON());
  Promise.all(promises).then(() => game.mergeBoard());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = view.merge(game.toJSON());
  Promise.all(promises).then(() => game.addTiles());
});

game.addChangeListener("mergeNoTilesEvent", () => {
  view.merge(game.toJSON());
  game.addTiles();
});

game.addChangeListener("noOpEvent", () => {
  view.bindHandlers(keydownHandlers);
});

game.addChangeListener("addTileEvent", () => {
  const promises = view.addTiles(game.toJSON());
  Promise.all(promises).then(() => {
    localStorage.setItem('game-2048', JSON.stringify(game.toJSON()));
    initialSetup();
  });
});

/*------------- FUNCTIONS ------------- */

function initialSetup() {
  console.log("listeners added");
  if (game.isWon()) {
    alert('Game is won');
  }
  else if (game.isLost()) {
    alert('Game is lost');
  }
  else {
    view.bindHandlers(keydownHandlers);
  }
}
