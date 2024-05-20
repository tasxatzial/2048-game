import GameModel from "./GameModel.js";
import GameView from "./GameView.js";


let game;
let view;
let slideHandlers;
const bestScoreEl = document.querySelector('.js-best-score');

startGame(JSON.parse(localStorage.getItem('game-2048')));

document.querySelector('.js-new-game-btn')
        .addEventListener('click', () => startGame(null));
document.querySelector('.js-best-score-trash-btn')
        .addEventListener('click', () => {
          bestScoreEl.textContent = 0;
          localStorage.setItem('game-2048-best-score', JSON.stringify(0));
        });

function startGame(savedGame) {
  if (view) {
    view.removeHandlers(slideHandlers);
  }

  const bestScore = JSON.parse(localStorage.getItem('game-2048-best-score'));
  if (savedGame) {
    game = new GameModel(savedGame);
    bestScoreEl.textContent = bestScore;
  }
  else {
    game = new GameModel();
    if (!bestScore) {
      bestScoreEl.textContent = '0';
    }
  }
  
  view = new GameView();
  
  game.addChangeListener("addTilesEvent", () => {
    const gameJSON = game.toJSON();
    localStorage.setItem('game-2048', JSON.stringify(gameJSON));
    localStorage.setItem('game-2048-best-score', JSON.stringify(bestScoreEl.textContent));
    const promises = view.addTiles(gameJSON);
    Promise.all(promises).then(() => view.updateGameStatus(gameJSON));
  });

  if (savedGame) {
    view.initialize(savedGame);
    view.updateGameStatus(savedGame);
  }
  else {
    view.initialize(game.toJSON());
    game.initTiles();
  }

  game.addChangeListener("slideTilesEvent", () => {
    const promises = view.slideTiles(game.toJSON());
    Promise.all(promises).then(() => game.mergeTiles());
  });
  
  game.addChangeListener("mergeTilesEvent", () => {
    const gameJSON = game.toJSON();
    view.updateScore(gameJSON);
    if (gameJSON.score > bestScoreEl.textContent) {
      bestScoreEl.textContent = gameJSON.score;
    }
    const promises = view.mergeTiles(gameJSON);
    Promise.all(promises).then(() => game.addTiles());
  });
  
  game.addChangeListener("noOpEvent", () => view.setReady());

  slideHandlers = {
    slideUp: game.slideUp.bind(game),
    slideRight: game.slideRight.bind(game),
    slideDown: game.slideDown.bind(game),
    slideLeft: game.slideLeft.bind(game)
  }
  view.bindHandlers(slideHandlers);
}
