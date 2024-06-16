import Model from "./Model.js";
import View from "./View.js";


const model = new Model();
const view = new View();

const modelSlideHandlers = {
  slideUp: model.slideTilesUp.bind(model),
  slideRight: model.slideTilesRight.bind(model),
  slideDown: model.slideTilesDown.bind(model),
  slideLeft: model.slideTilesLeft.bind(model)
}

/* ---------------------------------------------- */

model.addChangeListener('resetBestScoreEvent', () => {
  view.setBestScore(model.getBestScore());
  localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
});

model.addChangeListener('initializeModelEvent', () => {
  const game = model.getGameJSON();
  const bestScore = model.getBestScore();
  view.setBestScore(bestScore);
  view.initializeGame(game, modelSlideHandlers);
  localStorage.setItem('game-2048', JSON.stringify(game));
  localStorage.setItem('game-2048-best-score', JSON.stringify(bestScore));
});

model.addChangeListener("slideTilesEvent", async () => {
  const game = model.getGameJSON();
  await Promise.all(view.slideGameTiles(game));
  view.mergeGameTiles(game);
  view.setBestScore(model.getBestScore());
  view.updateGameScore(game);
  await Promise.all(view.addGameTiles(game));
  model.purgeGameModel();
});

model.addChangeListener("purgeGameModelEvent", () => {
  //update localstorage
  view.setGameReady();
});

model.addChangeListener("noOpEvent", () => view.setGameReady());

/* ---------------------------------------------- */

view.bindResetBestScore(() => {
  model.resetBestScore();
});

view.bindStartNewGame(() => {
  startGame(null);
});

/* ---------------------------------------------- */

startGame(JSON.parse(localStorage.getItem('game-2048')));

function startGame(game) {
  model.initialize(game, JSON.parse(localStorage.getItem('game-2048-best-score')));
}
