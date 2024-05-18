export default class BoardViewColorModel {
  constructor() {
    this.tileColors = new Map();
    this.colors = [];
    for (let i = 0; i < COLORS.length; i++) {
      this.colors.push({
        'color': COLORS[i][0],
        'backgroundColor': COLORS[i][1],
        'used': false
      });
    }
  }

  getTileColor(tileValue) {
    return this.colors[this.tileColors.get(tileValue)];
  }

  updateTileColors(gridArray) {
    const tileValues = new Set();
    let newTileValues = [];
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[0].length; j++) {
        const cellObj = gridArray[i][j];
        if (cellObj && cellObj.tile) {
          tileValues.add(cellObj.tile.value);
          if (this.tileColors.get(cellObj.tile.value) == undefined) {
            newTileValues.push(cellObj.tile.value);
          }
        }
      } 
    }
    
    this.tileColors.forEach((colorIndex, tileValue) => {
      if (!tileValues.has(tileValue)) {
        this.tileColors.delete(tileValue);
        this.colors[colorIndex].used = false;
      }
    });

    newTileValues.forEach(tileValue => {
      if (this.tileColors.get(tileValue) != undefined) {
        return;
      }
      let i;
      for (i = 0; i < this.colors.length; i++) {
        if (!this.colors[i].used) {
          this.colors[i].used = true;
          this.tileColors.set(tileValue, i);
          break;
        }
      }
      if (i == this.colors.length) {
        this.tileColors.set(tileValue, i - 1);
      }
    });
  }
}

const COLORS = [
  ['black', 'hsl(50, 77%, 75%)'],
  ['black', 'hsl(25, 88%, 74%)'],
  ['black', 'hsl(120, 87%, 78%)'],
  ['black', 'hsl(0, 71%, 69%)'],
  ['black', 'hsl(39, 98%, 45%)'],
  ['black', 'hsl(180, 100%, 67%)'],
  ['black', 'hsl(60, 84%, 55%)'],
  ['black', 'hsl(150, 88%, 44%)'],
  ['black', 'hsl(195, 53%, 79%)'],
  ['black', 'hsl(302, 60%, 70%)'],
  ['black', 'hsl(95, 76%, 56%)'],
  ['black', 'hsl(0, 29%, 72%)'],
  ['black', 'hsl(195, 100%, 50%)'],
  ['black', 'hsl(49, 84%, 45%)'],
  ['black', 'hsl(115, 20%, 60%)'],
  ['black', 'hsl(20, 88%, 60%)'],
  ['black', 'hsl(256, 62%, 76%)'],
  ['black', 'hsl(0, 4%, 68%)'],
  ['black', 'hsl(39, 100%, 50%)'],
  ['white', 'hsl(0, 68%, 42%)'],
  ['white', 'hsl(120, 61%, 34%)'],
  ['white', 'hsl(210, 62%, 54%)'],
  ['white', 'hsl(271, 76%, 53%)'],
  ['white', 'hsl(0, 77%, 58%)'],
  ['white', 'hsl(60, 89%, 22%)'],
  ['white', 'hsl(240, 90%, 55%)'],
  ['white', 'hsl(300, 81%, 54%)'],
  ['white', 'hsl(25, 76%, 31%)'],
  ['white', 'hsl(80, 65%, 35%)'],
  ['white', 'hsl(249, 100%, 70%)'],
  ['white', 'hsl(328, 66%, 35%)'],
  ['white', 'hsl(180, 100%, 27%)'],
  ['white', 'hsl(220, 89%, 28%)'],
  ['white', 'hsl(338, 47%, 52%)'],
  ['white', 'hsl(210, 13%, 50%)'],
  ['white', 'hsl(125, 73%, 20%)'],
  ['white', 'hsl(18, 91%, 48%)'],
  ['white', 'hsl(275, 100%, 25%)'],
  ['black', 'white']];
