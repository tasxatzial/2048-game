import { COLORS } from './gameView/BoardViewColorModel.js';

const gridColorsEl = document.querySelector('.js-grid-colors');

COLORS.forEach(({color, backgroundColor, id}) => {
  const tileEl = document.createElement('div');
  tileEl.classList.add('tile');
  tileEl.style.color = color;
  tileEl.style.backgroundColor = backgroundColor;
  tileEl.textContent = id;
  gridColorsEl.appendChild(tileEl);
});
