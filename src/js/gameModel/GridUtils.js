export default class GridUtils {
  constructor(grid) {
    this.grid = grid;
  }

    getCellLongestValue() {
    let maxLength = 0;
    this.getCells().forEach(cell => {
      if (cell.hasTile()) {
        const tileLength = cell.getValue().toString().length;
        if (tileLength > maxLength) {
          maxLength = tileLength;
        }
      }
    });
    return maxLength;
  }

  toCellValues() {
    let result = '';
    const entryLength = this.getCellLongestValue();
    const pad = ' '.repeat(entryLength);
    for (let i = 0; i < this.grid.gridBoolean.length; i++) {
      for (let j = 0; j < this.grid.gridBoolean[0].length; j++) {
        if (this.grid.gridBoolean[i][j] === 1) {
          const cell = this.grid.cells[i * this.grid.gridBoolean[0].length + j];
          if (cell.hasTile()) {
            result += (pad + cell.getValue()).slice(-entryLength);
          } else {
            result += (pad + '.').slice(-entryLength);
          }
        } else {
          result += (pad + '◼').slice(-entryLength);
        }
        if (j !== this.grid.gridBoolean[0].length - 1) {
          result += ' ';
        }
      }
      result += '\n';
    }
    return result;
  }

  replaceTiles(tileValues) {
    if (tileValues.length !== this.grid.gridBoolean.length &&
        tileValues[0].length !== this.grid.gridBoolean[0].length) {
      throw new Error('tileArr must be the same size as the grid');
    }
    for (let i = 0; i < tileValues.length; i++) {
      for (let j = 0; j < tileValues[0].length; j++) {
        const cell = this.grid.cells[i * this.grid.gridBoolean[0].length + j];
        if (tileValues[i][j] !== null) {
          if (cell === undefined) {
            throw new Error('cannot add tiles to a cell that does not exist')
          }
          for (let k = 0; k < tileValues[i][j].length; k++) {
            cell.setTile(tileValues[i][j][k]);
          }
        }
      }
    }
  }

  getTileValues() {
    const tileArr = [];
    for (let i = 0; i < this.grid.gridBoolean.length; i++) {
      const row = [];
      for (let j = 0; j < this.grid.gridBoolean[0].length; j++) {
        if (this.grid.gridBoolean[i][j] === 1) {
          const cell = this.grid.cells[i * this.grid.gridBoolean[0].length + j];
          row.push(cell.getTileValues());
        } else {
          row.push(null);
        }
      }
      tileArr.push(row);
    }
    return tileArr;
  }

  getCellLongestTileArray() {
    let maxLength = 0;
    this.grid.getCell().forEach(cell => {
      if (cell.hasTile()) {
        const tilesStr = '[' + cell.getTileValues().toString() + ']';
        const tileLength = tilesStr.length + 2;
        if (tileLength > maxLength) {
          maxLength = tileLength;
        }
      }
    });
    if (maxLength < 6) {
      maxLength = 6;
    }
    return maxLength;
  }

  printTileValues() {
    const entryLength = this.getCellLongestTileArray();
    const pad = ' '.repeat(entryLength);
    let result = '[\n';
    for (let i = 0; i < this.grid.gridBoolean.length; i++) {
      result += '[';
      for (let j = 0; j < this.grid.gridBoolean[0].length; j++) {
        let tmp;
        if (this.grid.gridBoolean[i][j] === 1) {
          const cell = this.grid.cells[i * this.grid.gridBoolean[0].length + j];
          tmp = '[' + cell.getTileValues().toString() + ']';
        } else {
          tmp = 'null';
        }
        if (j !== this.grid.gridBoolean[0].length - 1) {
          tmp += ',';
        }
        result += (tmp + pad).slice(0, entryLength);
      }
      result += ']';
      if (i !== this.grid.gridBoolean.length - 1) {
        result += ',\n';
      }
    }
    result += '\n]';
    return result;
  }
}
