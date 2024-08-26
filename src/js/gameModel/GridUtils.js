export default class GridUtils {
  constructor(grid) {
    this.grid = grid;
  }

    _getMaxCellValueLength() {
    let maxLength = 0;
    this.grid.getCellValues().forEach(cell => {
      if (cell.hasTile()) {
        const tileLength = cell.getValue().toString().length;
        if (tileLength > maxLength) {
          maxLength = tileLength;
        }
      }
    });
    return maxLength;
  }

  /* returns a string representation of the cell values. Each value
  is either a merged value from multiple tiles, or a single tile value.
  Disabled cells are represented by the entity ◼ */
  cellValuesToString() {
    let result = '';
    const entryLength = this._getMaxCellValueLength();
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
      throw new Error('array is not the same size as the grid');
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

  _getMaxTileArrayLength() {
    let maxLength = 0;
    this.grid.getCellValues().forEach(cell => {
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

  /* returns a string representation of the tile values of each cell */
  tileValuesToString() {
    const longestTileArrayLength = this._getMaxTileArrayLength();
    const pad = ' '.repeat(longestTileArrayLength);
    let result = '[\n';
    for (let i = 0; i < this.grid.gridBoolean.length; i++) {
      result += '[';
      for (let j = 0; j < this.grid.gridBoolean[0].length; j++) {
        let cellResult;
        if (this.grid.gridBoolean[i][j] === 1) {
          const cell = this.grid.cells[i * this.grid.gridBoolean[0].length + j];
          cellResult = '[' + cell.getTileValues().toString() + ']';
        } else {
          cellResult = 'null';
        }
        if (j !== this.grid.gridBoolean[0].length - 1) {
          cellResult += ',';
        }
        result += (cellResult + pad).slice(0, longestTileArrayLength);
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
