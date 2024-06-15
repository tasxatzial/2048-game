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

model.addChangeListener('initializeModelEvent', () => {
  const game = model.getGame();
  view.setBestScore(model.getBestScore());
  view.initializeGame(game);
  view.bindGameHandlers(gameHandlers);
  view.updateGameStatus(game);
});

model.addChangeListener("slideTilesEvent", () => {
  //update view
  //model purge
});

model.addChangeListener("purgeGameModelEvent", () => {
  //update localstorage
  //set view ready
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
