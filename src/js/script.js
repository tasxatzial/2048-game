import GameModel from "./GameModel.js";
import GameView from "./GameView.js";


let game;
let view;
let slideHandlers;

startGame(JSON.parse(localStorage.getItem('game-2048')));
document.querySelector('.js-new-game-btn')
        .addEventListener('click', () => startGame(null));

function startGame(savedGame) {
  if (view) {
    view.removeHandlers(slideHandlers);
  }
  game = savedGame ? new GameModel(savedGame) : new GameModel();

  game.addChangeListener("slideTilesEvent", () => {
    const promises = view.slideTiles(game.toJSON());
    Promise.all(promises).then(() => game.mergeTiles());
  });
  
  game.addChangeListener("mergeTilesEvent", () => {
    const gameJSON = game.toJSON();
    view.updateScore(gameJSON);
    const promises = view.mergeTiles(gameJSON);
    Promise.all(promises).then(() => game.addTiles());
  });
  
  game.addChangeListener("addTilesEvent", () => {
    const gameJSON = game.toJSON();
    localStorage.setItem('game-2048', JSON.stringify(gameJSON));
    const promises = view.addTiles(gameJSON);
    Promise.all(promises).then(initialSetup);
  });
  
  game.addChangeListener("noOpEvent", () => view.setReady());

  const gameJSON = game.toJSON();
  localStorage.setItem('game-2048', JSON.stringify(gameJSON));
  slideHandlers = {
    slideUp: game.slideUp.bind(game),
    slideRight: game.slideRight.bind(game),
    slideDown: game.slideDown.bind(game),
    slideLeft: game.slideLeft.bind(game)
  }
  view = new GameView();
  view.bindHandlers(slideHandlers);
  const initialPromises = view.initialize(gameJSON);
  Promise.all(initialPromises).then(initialSetup);
}

function initialSetup() {
  if (game.isWon()) {
    view.showWinMsg();
  }
  else if (game.isLost()) {
    view.showLoseMsg();
  }
  else {
    view.setReady();
  }
}
