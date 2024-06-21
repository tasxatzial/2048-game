export default class BoardViewColorModel {
  constructor() {
    this.tileColors = new Map();
    this.colors = [];
    COLORS.forEach(({color, backgroundColor}) => {
      this.colors.push({
        color,
        backgroundColor,
        'used': false
      });
    });
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
          const tileValue =
              cellObj.mergeValue !== null && cellObj.mergeValue !== undefined
              ? cellObj.mergeValue
              : cellObj.tile.value;
          if (this.tileColors.get(tileValue) === undefined && !tileValues.has(tileValue)) {
            newTileValues.push(tileValue);
          }
          tileValues.add(tileValue);
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
      if (this.tileColors.get(tileValue) !== undefined) {
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
      if (i === this.colors.length) {
        this.tileColors.set(tileValue, i - 1);
      }
    });
  }
}

export const COLORS = [
  {id:1,  color: 'black', backgroundColor: 'hsl(50, 77%, 75%)'},
  {id:2,  color: 'black', backgroundColor: 'hsl(25, 88%, 74%)'},
  {id:3,  color: 'black', backgroundColor: 'hsl(120, 87%, 78%)'},
  {id:4,  color: 'black', backgroundColor: 'hsl(180, 85%, 70%)'},
  {id:5,  color: 'black', backgroundColor: 'hsl(60, 80%, 50%)'},
  {id:6,  color: 'black', backgroundColor: 'hsl(39, 90%, 45%)'},
  {id:7,  color: 'black', backgroundColor: 'hsl(0, 71%, 69%)'},
  {id:8,  color: 'black', backgroundColor: 'hsl(150, 88%, 44%)'},
  {id:9,  color: 'black', backgroundColor: 'hsl(195, 53%, 79%)'},
  {id:10, color: 'black', backgroundColor: 'hsl(302, 55%, 70%)'},
  {id:11, color: 'black', backgroundColor: 'hsl(0, 29%, 72%)'},
  {id:12, color: 'black', backgroundColor: 'hsl(20, 88%, 60%)'},
  {id:13, color: 'black', backgroundColor: 'hsl(95, 76%, 56%)'},
  {id:14, color: 'black', backgroundColor: 'hsl(49, 84%, 45%)'},
  {id:15, color: 'black', backgroundColor: 'hsl(195, 100%, 60%)'},
  {id:16, color: 'black', backgroundColor: 'hsl(115, 20%, 60%)'},
  {id:17, color: 'black', backgroundColor: 'hsl(256, 62%, 76%)'},
  {id:18, color: 'black', backgroundColor: 'hsl(300, 81%, 70%)'},
  {id:19, color: 'black', backgroundColor: 'hsl(39, 91%, 57%)'},
  {id:20, color: 'black', backgroundColor: 'hsl(0, 4%, 68%)'},
  {id:21, color: 'white', backgroundColor: 'hsl(0, 68%, 42%)'},
  {id:22, color: 'white', backgroundColor: 'hsl(120, 61%, 34%)'},
  {id:23, color: 'white', backgroundColor: 'hsl(210, 62%, 54%)'},
  {id:24, color: 'white', backgroundColor: 'hsl(271, 76%, 53%)'},
  {id:25, color: 'white', backgroundColor: 'hsl(240, 92%, 59%)'},
  {id:26, color: 'white', backgroundColor: 'hsl(60, 89%, 22%)'},
  {id:27, color: 'white', backgroundColor: 'hsl(0, 77%, 60%)'},
  {id:28, color: 'white', backgroundColor: 'hsl(25, 76%, 31%)'},
  {id:29, color: 'white', backgroundColor: 'hsl(328, 66%, 35%)'},
  {id:30, color: 'white', backgroundColor: 'hsl(249, 100%, 70%)'},
  {id:31, color: 'white', backgroundColor: 'hsl(80, 65%, 35%)'},
  {id:32, color: 'white', backgroundColor: 'hsl(180, 100%, 27%)'},
  {id:33, color: 'white', backgroundColor: 'hsl(210, 13%, 50%)'},
  {id:34, color: 'white', backgroundColor: 'hsl(338, 47%, 52%)'},
  {id:35, color: 'white', backgroundColor: 'hsl(125, 73%, 20%)'},
  {id:36, color: 'white', backgroundColor: 'hsl(18, 91%, 48%)'},
  {id:37, color: 'white', backgroundColor: 'hsl(220, 89%, 28%)'},
  {id:38, color: 'white', backgroundColor: 'hsl(312, 80%, 42%)'},
  {id:39, color: 'black', backgroundColor: 'white'}
];
