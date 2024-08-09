import Updater from './Updater.js';
import Model from './Model.js';
import View from './View.js';
import GameController from './GameController.js';


const updater = new Updater();
updater.update();

const pageLoadingEl = document.querySelector('.js-page-loading');
pageLoadingEl.remove();

const model = new Model();
const view = new View();
const gameController = new GameController();

model.addChangeListener('updateBestScoreEvent', async () => {
  const bestScore = model.getBestScore();
  view.setBestScore(bestScore);
  localStorage.setItem('game-2048-best-score', JSON.stringify(bestScore));
  await gameController.createNewTiles();
});

model.addChangeListener('initializeEvent', async () => {
  const bestScore = model.getBestScore();
  localStorage.setItem('game-2048-best-score', JSON.stringify(bestScore));
  view.initialize({bestScore});
  await gameController.initializeView();
});

/* ---------------------------------------------- */

view.bindResetBestScore(() => {
  model.resetBestScore();
});

view.bindStartNewGame(() => {
  startGame();
});

/* ---------------------------------------------- */

gameController.addChangeListener('moveEvent', () => {
  const score = gameController.getScore();
  model.updateBestScore(score);
});

gameController.addChangeListener('initializeModelEvent', () => {
  model.initialize({
    bestScore: JSON.parse(localStorage.getItem('game-2048-best-score'))
  });
});

/* ---------------------------------------------- */

startGame({
  game: JSON.parse(localStorage.getItem('game-2048'))
});

function startGame(obj) {
  gameController.initializeModel(obj);
}
