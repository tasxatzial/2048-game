import Updater from './Updater.js';
import Model from './Model.js';
import View from './View.js';


const updater = new Updater();
updater.update();

const pageLoadingEl = document.querySelector('.js-page-loading');
pageLoadingEl.remove();

const model = new Model();
const view = new View();

const modelHandlers = {
  gameMove : {
    moveUp: model.gameMoveUp.bind(model),
    moveRight: model.gameMoveRight.bind(model),
    moveDown: model.gameMoveDown.bind(model),
    moveLeft: model.gameMoveLeft.bind(model)
  }
}

/* ---------------------------------------------- */

model.addChangeListener('resetBestScoreEvent', () => {
  const bestScore = model.getBestScore();
  localStorage.setItem('game-2048-best-score', JSON.stringify(bestScore));
  view.setBestScore(bestScore);
});

model.addChangeListener('initializeModelEvent', () => {
  const bestScore = model.getBestScore();
  localStorage.setItem('game-2048-best-score', JSON.stringify(bestScore));
  view.initialize({bestScore});
});

model.addChangeListener('initializeGameModelEvent', async () => {
  const game = model.getGameObj();
  localStorage.setItem('game-2048', JSON.stringify(game));
  await view.initializeGame({game, modelHandlers});
});

model.addChangeListener('gameMoveEvent', async () => {
  const game = model.getGameObj();
  const bestScore = model.getBestScore();
  localStorage.setItem('game-2048-best-score', JSON.stringify(bestScore));
  await Promise.all(view.slideGameTiles(game));
  const mergePromises = view.mergeGameTiles(game);
  view.updateGameScore(game);
  view.setBestScore(bestScore);
  await Promise.all([...view.addGameTiles(game), ...mergePromises]);
  model.purgeGameModel();
});

model.addChangeListener('purgeGameModelEvent', () => {
  const game = model.getGameObj();
  localStorage.setItem('game-2048', JSON.stringify(game));
  view.updateGameStatus(game);
});

model.addChangeListener('gameNoOpEvent', () => view.setGameReady());

/* ---------------------------------------------- */

view.bindResetBestScore(() => {
  model.resetBestScore();
});

view.bindStartNewGame(() => {
  startGame();
});

/* ---------------------------------------------- */

model.initialize({
  bestScore: JSON.parse(localStorage.getItem('game-2048-best-score'))
});

startGame({
  game: JSON.parse(localStorage.getItem('game-2048'))
});

function startGame(obj) {
  model.initializeGame(obj);
}
