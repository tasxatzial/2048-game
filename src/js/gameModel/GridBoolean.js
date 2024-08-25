// only rectangular grids are supported
export default class GridBoolean {
  constructor() {}

  static original2048() {
    return this._createFullRectangle(4, 4);
  }

  static _createFullRectangle(rowCount, columnCount) {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (let j = 0; j < columnCount; j++) {
        row.push(1);
      }
      rows.push(row);
    }
    return rows;
  }

  //used in tests, do not remove
  static test1_7x6() {
    return [
      [1, 1, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0],
      [1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1]
    ];
  }

  //used in tests, do not remove
  static test2_10x10() {
    return [
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    ];
  }

  //used in tests, do not remove
  static test3_4x4() {
    return [
      [1, 1, 0, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 0, 1, 1]
    ];
  }
}
