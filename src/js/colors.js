import { COLORS } from './gameView/BoardViewColorModel.js';

const tiles = document.querySelectorAll('.tile');

for (let i = 0; i < tiles.length; i++) {
  tiles[i].style.color = COLORS[i].color;
  tiles[i].style.backgroundColor = COLORS[i].backgroundColor;
}
