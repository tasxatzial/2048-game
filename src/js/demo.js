import Grid from './Grid.js';

export default function demo() {
  const options = {
    size: 4,
    addTileFn: getNewTile,
    mergeTilesFn: mergeTiles
  };
  
  console.log("Starting new game");
  const grid = new Grid(options);
  grid.addTile();
  grid.addTile();
  console.log(grid.toString())

  while(1) {
    if (grid.hasTile(options.winTile)) {
      console.log(`Game is won after ${grid.getSlideCount()} moves. Here's the final board`);
      console.log(grid.toString())
      break;
    }
    if (!grid.canSlide()) {
      console.log(`Game is lost after ${grid.getSlideCount()} moves. Here's the final board`);
      console.log(grid.toString())
      break;
    }
    const n = Math.floor(Math.random() * 4);
    switch(n) {
      case 0:
        grid.slideLeft();
        break;
      case 1:
        grid.slideDown();
        break;
      case 2:
        grid.slideRight();
        break;
      case 3:
        grid.slideUp();
        break;
    }
    if (grid.hasChangedAfterSlide()) {
      grid.mergeTiles();
      grid.addTile();
      console.log(grid.toString())
    }
  }
}

function getNewTile(gridArray) {
  const emptyCells = gridArray.map(row => row.filter(el => !el.value)).flat();
  if (emptyCells.length == 0) {
    return null;
  }
  const randEl = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.floor(Math.random() > 0.9 ? 4 : 2);
  return {
    row: randEl.row,
    column: randEl.column,
    value: value
  };
}

function mergeTiles(value1, value2) {
  return value1 + value2;
}
