import Game from "./Game.js";

const game = new Game();
console.log("Score ", game.getScore());
console.log(game.printBoard())
if (game.isWon()) {
  console.log("You won!");
}
else if (game.isLost()) {
  console.log("No more moves");
}

window.addEventListener('keydown', keydownHandler);

function keydownHandler(e) {
  if (e.repeat) {
    return;
  }
  switch(e.code) {
    case 'ArrowLeft':
      game.slideLeft();
      break;
    case 'ArrowUp':
      game.slideUp();
      break;
    case 'ArrowRight':
      game.slideRight();
      break;
    case 'ArrowDown':
      game.slideDown();
      break;
  }
  if (game.hasBoardChanged()) {
    console.log("Score ", game.getScore());
    console.log(game.printBoard());
    if (game.isWon()) {
      console.log("You won!");
      window.removeEventListener('keydown', keydownHandler);
    }
    else if (game.isLost()) {
      console.log("No more moves");
      window.removeEventListener('keydown', keydownHandler);
    }
  }
}
