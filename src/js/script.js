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

game.addChangeListener("slideTilesEvent", () => {
  const promises = view.slideTiles(game.toJSON());
  Promise.all(promises).then(() => game.mergeTiles());
});

game.addChangeListener("mergeTilesEvent", () => {
  const promises = view.mergeTiles(game.toJSON());
  Promise.all(promises).then(() => game.addTiles());
});

game.addChangeListener("addTilesEvent", () => {
  const promises = view.addTiles(game.toJSON());
  Promise.all(promises).then(() => {
    localStorage.setItem('game-2048', JSON.stringify(game.toJSON()));
    initialSetup();
  });
});

game.addChangeListener("noOpEvent", () => {
  view.bindHandlers(keydownHandlers);
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
