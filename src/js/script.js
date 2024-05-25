import Model from "./Model.js";
import View from "./View.js";


const model = new Model();
const view = new View();

const gameHandlers = {
  slideUp: model.slideUp.bind(model),
  slideRight: model.slideRight.bind(model),
  slideDown: model.slideDown.bind(model),
  slideLeft: model.slideLeft.bind(model)
}

/* ---------------------------------------------- */

model.addChangeListener('updateBestScoreEvent', () => {
  view.setBestScore(model.getBestScore());
});

model.addChangeListener("addTilesEvent", () => {
  const game = model.getGame();
  localStorage.setItem('game-2048', JSON.stringify(game));
  const promises = view.addGameTiles(game);
  Promise.all(promises).then(() => view.updateGameStatus(game));
});

model.addChangeListener("slideTilesEvent", () => {
  const game = model.getGame();
  const promises = view.slideGameTiles(game);
  Promise.all(promises).then(() => model.mergeGameTiles());
});

model.addChangeListener("mergeTilesEvent", () => {
  const game = model.getGame();
  model.updateBestScore(game);
  view.updateGameScore(game);
  localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
  const promises = view.mergeGameTiles(game);
  Promise.all(promises).then(() => model.addGameTiles());
});

model.addChangeListener("noOpEvent", () => view.setGameReady());

/* ---------------------------------------------- */

view.bindResetBestScore(() => {
  model.resetBestScore();
  localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
});

view.bindStartNewGame(() => {
  startGame(null);
});

/* ---------------------------------------------- */

startGame(JSON.parse(localStorage.getItem('game-2048')));

/* ---------------------------------------------- */

function startGame(game) {
  model.initialize(game, JSON.parse(localStorage.getItem('game-2048-best-score')));
  view.removeGameHandlers();
  view.initializeGameView();
  
  if (game) {
    view.initializeGame(game);
    view.updateGameStatus(game);
  }
  else {
    view.initializeGame(model.getGame());
    model.initializeGameTiles();
  }

  view.bindGameHandlers(gameHandlers);
}
