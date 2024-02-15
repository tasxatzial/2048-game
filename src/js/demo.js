import Grid from './Grid.js';

export default function demo() {
  const options = {
    size: 4,
  };
  
  console.log("Starting new game");
  const grid = new Grid(options);
  grid.addRandomTile();
  grid.addRandomTile();
  console.log(grid.toString())
  
  while(1) {
    if (grid.hasTile(2048)) {
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
      grid.addRandomTile();
      console.log(grid.toString())
    }
  }
}
