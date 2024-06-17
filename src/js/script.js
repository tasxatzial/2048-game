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

model.addChangeListener('resetBestScoreEvent', () => {
  view.setBestScore(model.getBestScore());
  localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
});

model.addChangeListener('updateBestScoreEvent', () => {
  if (model.hasBestScoreChanged()) {
    view.setBestScore(model.getBestScore());
  }
  localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
  model.addGameTiles();
});

model.addChangeListener('initializeModelEvent', () => {
  const game = model.getGame();
  view.setBestScore(model.getBestScore());
  view.initializeGame(game);
  view.bindGameHandlers(gameHandlers);
  if (model.hasInitialGame()) {
    view.updateGameStatus(game);
  }
  else {
    model.initializeGameTiles();
    localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
  }
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
  view.mergeGameTiles(game);
  view.updateGameScore(game);
  model.updateBestScore(game);
});

model.addChangeListener("noOpEvent", () => view.setGameReady());

/* ---------------------------------------------- */

view.bindResetBestScore(() => {
  model.resetBestScore();
});

view.bindStartNewGame(() => {
  startGame();
});

/* ---------------------------------------------- */

startGame(JSON.parse(localStorage.getItem('game-2048')));

function startGame(game) {
  model.initialize(game, JSON.parse(localStorage.getItem('game-2048-best-score')));
}
