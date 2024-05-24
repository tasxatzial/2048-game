import Model from "./Model.js";
import View from "./View.js";

let view = new View();
let model = new Model();

model.addChangeListener('updateBestScoreEvent', () => {
  view.setBestScore(model.getBestScore());
});

view.bindResetBestScore(() => {
  model.resetBestScore();
  localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
});

view.bindStartNewGame(() => {
  startGame(null);
});

startGame(JSON.parse(localStorage.getItem('game-2048')));

/* ---------------------------------------------- */

function startGame(savedGame) {
  view.getGameView() && view.getGameView().removeHandlers();

  const bestScore = JSON.parse(localStorage.getItem('game-2048-best-score'));
  model.initialize(savedGame, bestScore);
  const gameModel = model.getGameModel();
  view.initializeGameView();
  const gameView = view.getGameView();

  gameModel.addChangeListener("addTilesEvent", () => {
    const game = gameModel.toJSON();
    localStorage.setItem('game-2048', JSON.stringify(game));
    const promises = gameView.addTiles(game);
    Promise.all(promises).then(() => gameView.updateGameStatus(game));
  });

  gameModel.addChangeListener("slideTilesEvent", () => {
    const game = gameModel.toJSON();
    const promises = gameView.slideTiles(game);
    Promise.all(promises).then(() => gameModel.mergeTiles());
  });

  gameModel.addChangeListener("mergeTilesEvent", () => {
    const game = gameModel.toJSON();
    model.updateBestScore(game);
    gameView.updateScore(game);
    localStorage.setItem('game-2048-best-score', JSON.stringify(model.getBestScore()));
    const promises = gameView.mergeTiles(game);
    Promise.all(promises).then(() => gameModel.addTiles());
  });

  gameModel.addChangeListener("noOpEvent", () => gameView.setReady());

  if (savedGame) {
    gameView.initialize(savedGame);
    gameView.updateGameStatus(savedGame);
  }
  else {
    gameView.initialize(gameModel.toJSON());
    gameModel.initTiles();
  }

  const slideHandlers = {
    slideUp: gameModel.slideUp.bind(gameModel),
    slideRight: gameModel.slideRight.bind(gameModel),
    slideDown: gameModel.slideDown.bind(gameModel),
    slideLeft: gameModel.slideLeft.bind(gameModel)
  }
  gameView.bindHandlers(slideHandlers);
}
