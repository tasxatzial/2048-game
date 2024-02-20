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
}
