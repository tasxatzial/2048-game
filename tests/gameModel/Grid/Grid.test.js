import { describe, it, expect, beforeEach } from 'vitest';
import Grid from '../../../src/js/gameModel/Grid.js';
import GridUtils from '../../../src/js/gameModel/GridUtils.js';
import GameController from '../../../src/js/GameController.js';

describe('Grid set custom options: Grid constructor called with custom options', {} , () => {
  it('should use default options if no game is provided', {}, () => {
    const grid = new Grid();
    expect(grid.newTileFnName).toBe('original2048');
    expect(grid.mergeResultFnName).toBe('original2048');
    expect(grid.mergeScoreFnName).toBe('original2048');
    expect(grid.mergeConditionFnName).toBe('original2048');
    expect(grid.gridBooleanFnName).toBe('original2048');
    expect(grid.minMergeLength).toBe(2);
    expect(grid.maxMergeLength).toBe(4);
    expect(grid.mergeStrategy).toBe('shortest-match');
  })

  it('should save custom options', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6',
        newTileFnName: 'NewTile_test',
        mergeResultFnName: 'MergeResult_test',
        mergeScoreFnName: 'MergeScore_test',
        mergeConditionFnName: 'MergeCondition_test',
        minMergeLength: 2,
        maxMergeLength: 5,
        mergeStrategy: 'longest-match'
      }
    });
    expect(grid.newTileFnName).toBe('NewTile_test');
    expect(grid.mergeResultFnName).toBe('MergeResult_test');
    expect(grid.mergeScoreFnName).toBe('MergeScore_test');
    expect(grid.mergeConditionFnName).toBe('MergeCondition_test');
    expect(grid.gridBooleanFnName).toBe('test1_7x6');
    expect(grid.minMergeLength).toBe(2);
    expect(grid.maxMergeLength).toBe(5);
    expect(grid.mergeStrategy).toBe('longest-match');
  })

  it('should correctly set minMergeLength and maxMergeLength (1)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6',
        minMergeLength: 7
      }
    });
    expect(grid.gridBooleanFnName).toBe('test1_7x6');
    expect(grid.minMergeLength).toBe(7);
    expect(grid.maxMergeLength).toBe(7);
  })

  it('should correctly set minMergeLength and maxMergeLength (2)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6',
        minMergeLength: 3
      }
    });
    expect(grid.gridBooleanFnName).toBe('test1_7x6');
    expect(grid.minMergeLength).toBe(3);
    expect(grid.maxMergeLength).toBe(6);
  })

  it('should correctly set minMergeLength and maxMergeLength (3)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6',
        maxMergeLength: 4
      }
    });
    expect(grid.gridBooleanFnName).toBe('test1_7x6');
    expect(grid.minMergeLength).toBe(2);
    expect(grid.maxMergeLength).toBe(4);
  })

  it('should throw error when minMergeLength > maxMergeLength', {}, () => {
    expect(() => {
      new Grid({
        gridOptions: {
          minMergeLength: 4,
          maxMergeLength: 3
        }
      });
    }).toThrowError();
  })

  it('should throw error when minMergeLength < 2', {}, () => {
    expect(() => {
      new Grid({
        gridOptions: {
          minMergeLength: 1
        }
      });
    }).toThrowError();
  })

  it('should throw error when mergeStrategy is not "shortest-match" or "longest-match"', {}, () => {
    expect(() => {
      new Grid({
        gridOptions: {
          mergeStrategy: 'shortest'
        }
      });
    }).toThrowError();
  })
})

describe('Grid constructor called with game from localStorage', {} , () => {
  let grid;
  beforeEach(() => {
    const gameController = new GameController();
    gameController.initializeModel({game: {
      gridOptions: {
        gridBooleanFnName: 'test1_7x6',
        newTileFnName: 'test1',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScore: `test1`,
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      },
      initialTiles: [
        { row: 2, column: 1, value: 2 },
        { row: 3, column: 2, value: 4 }
      ]
    }});
    localStorage.setItem('game-2048', JSON.stringify(gameController.model.export()));
    const game = JSON.parse(localStorage.getItem('game-2048'));
    gameController.initializeModel({game});
    grid = gameController.model.grid;
  })

  it('should initialize grid options', {}, () => {
    expect(grid.newTileFnName).toBe('test1');
    expect(grid.mergeResultFnName).toBe('test1');
    expect(grid.mergeScoreFnName).toBe('test1');
    expect(grid.mergeConditionFnName).toBe('test1');
    expect(grid.gridBooleanFnName).toBe('test1_7x6');
    expect(grid.minMergeLength).toBe(3);
    expect(grid.maxMergeLength).toBe(4);
    expect(grid.mergeStrategy).toBe('longest-match');
  })

  it('should create cells', {}, () => {
    const cells = grid.cells;
    expect(Object.keys(cells)).toEqual([
      "0", "1", "4", "5",
      "8", "9",
      "13", "14", "16",
      "18", "20", "22",
      "24", "25", "27", "28",
      "30", "31", "32", "33", "34", "35",
      "39", "40" ,"41"
    ]);
    expect(cells[0].row).toBe(0);
    expect(cells[0].col).toBe(0);
    expect(cells[1].row).toBe(0);
    expect(cells[1].col).toBe(1);
    expect(cells[4].row).toBe(0);
    expect(cells[4].col).toBe(4);
    expect(cells[5].row).toBe(0);
    expect(cells[5].col).toBe(5);
    expect(cells[8].row).toBe(1);
    expect(cells[8].col).toBe(2);
    expect(cells[9].row).toBe(1);
    expect(cells[9].col).toBe(3);
    expect(cells[13].row).toBe(2);
    expect(cells[13].col).toBe(1);
    expect(cells[14].row).toBe(2);
    expect(cells[14].col).toBe(2);
    expect(cells[16].row).toBe(2);
    expect(cells[16].col).toBe(4);
    expect(cells[18].row).toBe(3);
    expect(cells[18].col).toBe(0);
    expect(cells[20].row).toBe(3);
    expect(cells[20].col).toBe(2);
    expect(cells[22].row).toBe(3);
    expect(cells[22].col).toBe(4);
    expect(cells[24].row).toBe(4);
    expect(cells[24].col).toBe(0);
    expect(cells[25].row).toBe(4);
    expect(cells[25].col).toBe(1);
    expect(cells[27].row).toBe(4);
    expect(cells[27].col).toBe(3);
    expect(cells[28].row).toBe(4);
    expect(cells[28].col).toBe(4);
    expect(cells[30].row).toBe(5);
    expect(cells[30].col).toBe(0);
    expect(cells[31].row).toBe(5);
    expect(cells[31].col).toBe(1);
    expect(cells[32].row).toBe(5);
    expect(cells[32].col).toBe(2);
    expect(cells[33].row).toBe(5);
    expect(cells[33].col).toBe(3);
    expect(cells[34].row).toBe(5);
    expect(cells[34].col).toBe(4);
    expect(cells[35].row).toBe(5);
    expect(cells[35].col).toBe(5);
    expect(cells[39].row).toBe(6);
    expect(cells[39].col).toBe(3);
    expect(cells[40].row).toBe(6);
    expect(cells[40].col).toBe(4);
    expect(cells[41].row).toBe(6);
    expect(cells[41].col).toBe(5);
  })

  it('should create grid boolean array', {}, () => {
    expect(grid.gridBoolean).toEqual([
      [1, 1, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0],
      [1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1]
    ])
  })

  it('should initialize tiles', {}, () => {
    let tileCount = 0;
    grid.getCellValues().forEach(cell => {
      expect(cell.tiles.length).toBeLessThanOrEqual(1);
      if (cell.tiles.length === 0) {
        expect(cell.tiles).toEqual([]);
      }
      else {
        tileCount++;
      }
    });
    expect(tileCount).toBe(2);
    expect(grid.cells[13].tiles).toEqual([{ row: 2, col: 1, value: 2 }]);
    expect(grid.cells[20].tiles).toEqual([{ row: 3, col: 2, value: 4 }]);
  })

  it('should mark existing tiles as not new', () => {
    grid.getCellValues().forEach(cell => {
      expect(cell.newTileAdded).toBe(false);
    });
  })
})

describe('Grid export', {}, () => {
  let grid;
  beforeEach(() => {
    grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
  })

  it('should initialize grid with tiles (constructor called with test3_4x4 from GridBoolean.js)', {}, () => {
    const initialTiles = [
      { row: 2, column: 1, value: 2 },
      { row: 3, column: 2, value: 4 }
    ];
    grid.addTiles(initialTiles);
    const gridArray = grid.export().gridArray;
    const missingCells = [];
    const cells = [];
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[0].length; j++) {
        const item = gridArray[i][j];
        if (item) {
          cells.push(item);
        }
        else {
          missingCells.push(item);
        }
      }
    }
    expect(cells.length).toBe(13);
    expect(missingCells.length).toBe(3);

    expect(cells[7].row).toBe(2);
    expect(cells[7].column).toBe(1);
    expect(cells[7].tiles).toEqual([{ row: 2, column: 1, value: 2 }]);
    expect(cells[7].newTileAdded).toBe(true);
    expect(cells[11].row).toBe(3);
    expect(cells[11].column).toBe(2);
    expect(cells[11].tiles).toEqual([{ row: 3, column: 2, value: 4 }]);
    expect(cells[11].newTileAdded).toBe(true);

    let tileCount = 0;
    cells.forEach(cell => {
      expect(cell.tiles.length).toBeLessThanOrEqual(1);
      if (cell.tiles.length === 0) {
        expect(cell.tiles).toEqual([]);
        expect(cell.newTileAdded).toBe(false);
      }
      else {
        tileCount++;
      }
      expect(cell.mergeScore).toBeNull();
      expect(cell.mergeValue).toBeNull();
    });

    expect(tileCount).toBe(2);
  
    missingCells.forEach(hole => {
      expect(hole).toBeNull();
    });

    expect(cells[0].row).toBe(0);
    expect(cells[0].column).toBe(0);
    expect(cells[1].row).toBe(0);
    expect(cells[1].column).toBe(1);
    expect(cells[2].row).toBe(0);
    expect(cells[2].column).toBe(3);
    expect(cells[3].row).toBe(1);
    expect(cells[3].column).toBe(1);
    expect(cells[4].row).toBe(1);
    expect(cells[4].column).toBe(2);
    expect(cells[5].row).toBe(1);
    expect(cells[5].column).toBe(3);
    expect(cells[6].row).toBe(2);
    expect(cells[6].column).toBe(0);
    expect(cells[7].row).toBe(2);
    expect(cells[7].column).toBe(1);
    expect(cells[8].row).toBe(2);
    expect(cells[8].column).toBe(2);
    expect(cells[9].row).toBe(2);
    expect(cells[9].column).toBe(3);
    expect(cells[10].row).toBe(3);
    expect(cells[10].column).toBe(0);
    expect(cells[11].row).toBe(3);
    expect(cells[11].column).toBe(2);
    expect(cells[12].row).toBe(3);
    expect(cells[12].column).toBe(3);
  })

  it('should initialize grid with default tiles (constructor called with test3_4x4 from GridBoolean.js)', {}, () => {
    grid.addDefaultTiles();
    grid.addDefaultTiles();
    const gridArray = grid.export().gridArray;
    const missingCells = [];
    const cells = [];
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[0].length; j++) {
        const item = gridArray[i][j];
        if (item) {
          cells.push(item);
        }
        else {
          missingCells.push(item);
        }
      }
    }

    expect(cells.length).toBe(13);
    expect(missingCells.length).toBe(3);

    let tileCount = 0;
    cells.forEach(cell => {
      expect(cell.tiles.length).toBeLessThanOrEqual(1);
      if (cell.tiles.length === 0) {
        expect(cell.tiles).toEqual([]);
        expect(cell.newTileAdded).toBe(false);
      }
      else {
        tileCount++;
        expect(cell.tiles[0].row).toBe(cell.row);
        expect(cell.tiles[0].column).toBe(cell.column);
        expect(cell.tiles[0].value === 2 || cell.tiles[0].value === 4).toBe(true);
        expect(cell.newTileAdded).toBe(true);
      }
      expect(cell.mergeScore).toBeNull();
      expect(cell.mergeValue).toBeNull();
    });

    expect(tileCount).toBe(2);
  
    missingCells.forEach(hole => {
      expect(hole).toBeNull();
    });

    expect(cells[0].row).toBe(0);
    expect(cells[0].column).toBe(0);
    expect(cells[1].row).toBe(0);
    expect(cells[1].column).toBe(1);
    expect(cells[2].row).toBe(0);
    expect(cells[2].column).toBe(3);
    expect(cells[3].row).toBe(1);
    expect(cells[3].column).toBe(1);
    expect(cells[4].row).toBe(1);
    expect(cells[4].column).toBe(2);
    expect(cells[5].row).toBe(1);
    expect(cells[5].column).toBe(3);
    expect(cells[6].row).toBe(2);
    expect(cells[6].column).toBe(0);
    expect(cells[7].row).toBe(2);
    expect(cells[7].column).toBe(1);
    expect(cells[8].row).toBe(2);
    expect(cells[8].column).toBe(2);
    expect(cells[9].row).toBe(2);
    expect(cells[9].column).toBe(3);
    expect(cells[10].row).toBe(3);
    expect(cells[10].column).toBe(0);
    expect(cells[11].row).toBe(3);
    expect(cells[11].column).toBe(2);
    expect(cells[12].row).toBe(3);
    expect(cells[12].column).toBe(3);
  })
})

describe('Grid initialize: Constructor called with custom boolean grid', {} , () => {
  let grid;
  beforeEach(() => {
    grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
  })

  it('should create correct number of rows', {}, () => {
    expect(grid.rows.length).toBe(12);
  })

  it('should create correct number of cells in each row', {}, () => {
    const rows = grid.rows;
    expect(rows[0].length).toBe(2);
    expect(rows[1].length).toBe(2);
    expect(rows[2].length).toBe(2);
    expect(rows[3].length).toBe(2);
    expect(rows[4].length).toBe(1);
    expect(rows[5].length).toBe(1);
    expect(rows[6].length).toBe(1);
    expect(rows[7].length).toBe(1);
    expect(rows[8].length).toBe(2);
    expect(rows[9].length).toBe(2);
    expect(rows[10].length).toBe(6);
    expect(rows[11].length).toBe(3);
  })

  it('should generate correct indices for each cell in each row', {}, () => {
    const rows = grid.rows;
    expect(rows[0][0].row).toBe(0);
    expect(rows[0][0].col).toBe(0);
    expect(rows[0][1].row).toBe(0);
    expect(rows[0][1].col).toBe(1);
    expect(rows[1][0].row).toBe(0);
    expect(rows[1][0].col).toBe(4);
    expect(rows[1][1].row).toBe(0);
    expect(rows[1][1].col).toBe(5);
    expect(rows[2][0].row).toBe(1);
    expect(rows[2][0].col).toBe(2);
    expect(rows[3][0].row).toBe(2);
    expect(rows[3][0].col).toBe(1);
    expect(rows[3][1].row).toBe(2);
    expect(rows[3][1].col).toBe(2);
    expect(rows[4][0].row).toBe(2);
    expect(rows[4][0].col).toBe(4);
    expect(rows[5][0].row).toBe(3);
    expect(rows[5][0].col).toBe(0);
    expect(rows[6][0].row).toBe(3);
    expect(rows[6][0].col).toBe(2);
    expect(rows[7][0].row).toBe(3);
    expect(rows[7][0].col).toBe(4);
    expect(rows[8][0].row).toBe(4);
    expect(rows[8][0].col).toBe(0);
    expect(rows[8][1].row).toBe(4);
    expect(rows[8][1].col).toBe(1);
    expect(rows[9][0].row).toBe(4);
    expect(rows[9][0].col).toBe(3);
    expect(rows[9][1].row).toBe(4);
    expect(rows[9][1].col).toBe(4);
    expect(rows[10][0].row).toBe(5);
    expect(rows[10][0].col).toBe(0);
    expect(rows[10][1].row).toBe(5);
    expect(rows[10][1].col).toBe(1);
    expect(rows[10][2].row).toBe(5);
    expect(rows[10][2].col).toBe(2);
    expect(rows[10][3].row).toBe(5);
    expect(rows[10][3].col).toBe(3);
    expect(rows[10][4].row).toBe(5);
    expect(rows[10][4].col).toBe(4);
    expect(rows[10][5].row).toBe(5);
    expect(rows[10][5].col).toBe(5);
    expect(rows[11][0].row).toBe(6);
    expect(rows[11][0].col).toBe(3);
    expect(rows[11][1].row).toBe(6);
    expect(rows[11][1].col).toBe(4);
    expect(rows[11][2].row).toBe(6);
    expect(rows[11][2].col).toBe(5);
  })

  it('should create correct number of columns', {}, () => {
    expect(grid.cols.length).toBe(13);
  })

  it('should create correct number of cells in each column', {}, () => {
    const cols = grid.cols;
    expect(cols[0].length).toBe(1);
    expect(cols[1].length).toBe(3);
    expect(cols[2].length).toBe(1);
    expect(cols[3].length).toBe(1);
    expect(cols[4].length).toBe(2);
    expect(cols[5].length).toBe(3);
    expect(cols[6].length).toBe(1);
    expect(cols[7].length).toBe(1);
    expect(cols[8].length).toBe(3);
    expect(cols[9].length).toBe(1);
    expect(cols[10].length).toBe(5);
    expect(cols[11].length).toBe(1);
    expect(cols[12].length).toBe(2);
  })

  it('should generate cells', {}, () => {
    const cells = grid.cells;
    expect(Object.keys(cells)).toEqual([
      "0", "1", "4", "5",
      "8", "9",
      "13", "14", "16",
      "18", "20", "22",
      "24", "25", "27", "28",
      "30", "31", "32", "33", "34", "35",
      "39", "40" ,"41"
    ]);
    expect(cells[0].row).toBe(0);
    expect(cells[0].col).toBe(0);
    expect(cells[1].row).toBe(0);
    expect(cells[1].col).toBe(1);
    expect(cells[4].row).toBe(0);
    expect(cells[4].col).toBe(4);
    expect(cells[5].row).toBe(0);
    expect(cells[5].col).toBe(5);
    expect(cells[8].row).toBe(1);
    expect(cells[8].col).toBe(2);
    expect(cells[9].row).toBe(1);
    expect(cells[9].col).toBe(3);
    expect(cells[13].row).toBe(2);
    expect(cells[13].col).toBe(1);
    expect(cells[14].row).toBe(2);
    expect(cells[14].col).toBe(2);
    expect(cells[16].row).toBe(2);
    expect(cells[16].col).toBe(4);
    expect(cells[18].row).toBe(3);
    expect(cells[18].col).toBe(0);
    expect(cells[20].row).toBe(3);
    expect(cells[20].col).toBe(2);
    expect(cells[22].row).toBe(3);
    expect(cells[22].col).toBe(4);
    expect(cells[24].row).toBe(4);
    expect(cells[24].col).toBe(0);
    expect(cells[25].row).toBe(4);
    expect(cells[25].col).toBe(1);
    expect(cells[27].row).toBe(4);
    expect(cells[27].col).toBe(3);
    expect(cells[28].row).toBe(4);
    expect(cells[28].col).toBe(4);
    expect(cells[30].row).toBe(5);
    expect(cells[30].col).toBe(0);
    expect(cells[31].row).toBe(5);
    expect(cells[31].col).toBe(1);
    expect(cells[32].row).toBe(5);
    expect(cells[32].col).toBe(2);
    expect(cells[33].row).toBe(5);
    expect(cells[33].col).toBe(3);
    expect(cells[34].row).toBe(5);
    expect(cells[34].col).toBe(4);
    expect(cells[35].row).toBe(5);
    expect(cells[35].col).toBe(5);
    expect(cells[39].row).toBe(6);
    expect(cells[39].col).toBe(3);
    expect(cells[40].row).toBe(6);
    expect(cells[40].col).toBe(4);
    expect(cells[41].row).toBe(6);
    expect(cells[41].col).toBe(5);
  })
})

describe('Grid find tiles: Constructor called with custom boolean grid', {} , () => {
  let grid;
  beforeEach(() => {
    grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
  })

  it('should be able to find tiles', {}, () => {
    const initialTiles = [
      { row: 2, column: 2, value: 16 },
      { row: 3, column: 0, value: 256 },
    ];
    grid.addTiles(initialTiles);
    expect(grid.hasTile(16)).toBe(true);
    expect(grid.hasTile(256)).toBe(true);
  })
})

describe('Grid slide tiles: Constructor called with custom boolean grid', {} , () => {
  let grid;
  let gridUtils;
  beforeEach(() => {
    grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10'
      }
    });
    gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2], [],   [2],  [],  [2], [],   [2], [2], [4]  ],
      [[2],  [],  [2],  [2],  [],  [],  [],   [],  [2], []   ],
      [[],   [2], [4],  [2],  [],  [2], [],   [],  [],  null ],
      [[],   [2], [2],  [4],  [2], [],  [2],  [],  [2], []   ],
      [[],   [2], null, [2],  [4], [4], [4],  [],  [2], []   ],
      [[4],  [2], [2],  [2],  [4], [4], [2],  [2], [],  [2]  ],
      [[],   [2], [2],  [4],  [4], [2], [],   [2], [],  []   ],
      [[2],  [2], null, [2],  [4], [],  null, [4], [],  [4]  ],
      [[],   [2], [4],  [4],  [8], [4], [4],  [4], [4], []   ],
      [[8],  [2], [2],  null, [4], [],  [4],  [8], [8], []   ]
    ];
    gridUtils.replaceTiles(tilesArray);
  })

  it('should slide tiles left', {}, () => {
    grid.slideLeft();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,  [2,2], [2,2], [2],   [4],   [],    [],    [],    [],    []     ],
      [[2,2], [2,2], [],    [],    [],    [],    [],    [],    [],    []     ],
      [[2],   [4],   [2,2], [],    [],    [],    [],    [],    [],    null   ],
      [[2,2], [4],   [2,2], [2],   [],    [],    [],    [],    [],    []     ],
      [[2],   [],    null,  [2],   [4,4], [4],   [2],   [],    [],    []     ],
      [[4],   [2,2], [2],   [4,4], [2,2], [2],   [],    [],    [],    []     ],
      [[2,2], [4,4], [2,2], [],    [],    [],    [],    [],    [],    []     ],
      [[2,2], [],    null,  [2],   [4],   [],    null,  [4,4], [],    []     ],
      [[2],   [4,4], [8],   [4,4], [4,4], [],    [],    [],    [],    []     ],
      [[8],   [2,2], [],    null,  [4,4], [8,8], [],    [],    [],    []     ]
    ]);
  })

  it('should slide tiles right', {}, () => {
    grid.slideRight();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,  [],    [],    [],    [],    [],    [2],   [2,2], [2,2], [4]    ],
      [[],    [],    [],    [],    [],    [],    [],    [],    [2,2], [2,2]  ],
      [[],    [],    [],    [],    [],    [],    [2],   [4],   [2,2], null   ],
      [[],    [],    [],    [],    [],    [],    [2,2], [4],   [2],   [2,2]  ],
      [[],    [2],   null,  [],    [],    [],    [2],   [4],   [4,4], [2]    ],
      [[],    [],    [],    [],    [4],   [2],   [2,2], [4,4], [2],   [2,2]  ],
      [[],    [],    [],    [],    [],    [],    [],    [2,2], [4,4], [2,2]  ],
      [[],    [2,2], null,  [],    [2],   [4],   null,  [],    [],    [4,4]  ],
      [[],    [],    [],    [],    [],    [2],   [4,4], [8],   [4,4], [4,4]  ],
      [[],    [8],   [2,2], null,  [],    [],    [],    [],    [4,4], [8,8]  ]
    ]);
  })

  it('should slide tiles up', {}, () => {
    grid.slideUp();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,  [2,2], [2],   [2,2], [2],   [2,2], [2],   [2,2], [2,2], [4]    ],
      [[2],   [2,2], [4],   [2],   [4,4], [4,4], [4],   [2],   [2,2], []     ],
      [[4],   [2,2], [2],   [4],   [4,4], [2],   [2],   [4,4], [4],   null   ],
      [[2],   [2,2], [],    [2,2], [8],   [4],   [],    [8],   [8],   [2]    ],
      [[8],   [2],   null,  [4],   [4],   [],    [],    [],    [],    [4]    ],
      [[],    [],    [2,2], [2],   [],    [],    [],    [],    [],    []     ],
      [[],    [],    [],    [4],   [],    [],    [],    [],    [],    []     ],
      [[],    [],    null,  [],    [],    [],    null,  [],    [],    []     ],
      [[],    [],    [4],   [],    [],    [],    [4,4], [],    [],    []     ],
      [[],    [],    [2],   null,  [],    [],    [],    [],    [],    []     ]
    ]);
  })

  it('should slide tiles down', {}, () => {
    grid.slideDown();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,  [],    [],    [],    [],    [],    [],    [],    [],    []     ],
      [[],    [],    [2],   [],    [],    [],    [],    [],    [],    [4]    ],
      [[],    [],    [4],   [2],   [],    [],    [],    [],    [],    null   ],
      [[],    [],    [2],   [2,2], [],    [],    [],    [],    [],    []     ],
      [[],    [],    null,  [4],   [],    [],    [2],   [],    [],    []     ],
      [[],    [2],   [],    [2,2], [2],   [],    [4],   [],    [],    []     ],
      [[2],   [2,2], [2,2], [4],   [4,4], [2,2], [2],   [2],   [2,2], []     ],
      [[4],   [2,2], null,  [2],   [4,4], [4,4], null,  [2,2], [2,2], []     ],
      [[2],   [2,2], [4],   [4],   [8],   [2],   [],    [4,4], [4],   [2]    ],
      [[8],   [2,2], [2],   null,  [4],   [4],   [4,4], [8],   [8],   [4]    ]
    ]);
  })
})

describe('Grid slide tiles: Constructor called with multiple custom options', {} , () => {
  let grid;
  let gridUtils;
  beforeEach(() => {
    grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScore: `test1`,
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [],  [],   [],   [],  [],  [6],  [3], [3], []   ],
      [[],   [2], [2],  [3],  [3], [4], [5],  [],  [],  []   ],
      [[],   [1], [2],  [2],  [2], [4], [5],  [],  [],  null ],
      [[4],  [],  [6],  [7],  [8], [7], [4],  [9], [9], [9]  ],
      [[],   [1], null, [],   [],  [6], [1],  [],  [9], []   ],
      [[9],  [8], [],   [7],  [],  [5], [],   [5], [9], []   ],
      [[5],  [],  [6],  [],   [8], [2], [],   [5], [],  [8]  ],
      [[5],  [1], null, [8],  [8], [1], null, [5], [],  [8]  ],
      [[],   [],  [],   [8],  [],  [1], [],   [],  [],  [7]  ],
      [[5],  [],  [4],  null, [],  [1], [1],  [2], [],  [1]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
  })

  it('should slide tiles left', {}, () => {
    grid.slideLeft();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,      [6,3,3],   [],        [],        [],        [],        [],        [],        [],        []         ],
      [[2],       [2],       [3],       [3],       [4],       [5],       [],        [],        [],        []         ],
      [[1],       [2,2,2],   [4],       [5],       [],        [],        [],        [],        [],        null       ],
      [[4],       [6],       [7],       [8,7,4],   [9,9,9],   [],        [],        [],        [],        []         ],
      [[1],       [],        null,      [6],       [1],       [9],       [],        [],        [],        []         ],
      [[9,8,7,5], [5],       [9],       [],        [],        [],        [],        [],        [],        []         ],
      [[5],       [6],       [8],       [2],       [5],       [8],       [],        [],        [],        []         ],
      [[5],       [1],       null,      [8,8,1],   [],        [],        null,      [5],       [8],       []         ],
      [[8],       [1],       [7],       [],        [],        [],        [],        [],        [],        []         ],
      [[5],       [4],       [],        null,      [1],       [1],       [2],       [1],       [],        []         ]
    ]);
  })

  it('should slide tiles right', {}, () => {
    grid.slideRight();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,      [],        [],        [],        [],        [],        [],        [6],       [3],       [3]        ],
      [[],        [],        [],        [],        [],        [],        [],        [2],       [2],       [5,4,3,3]  ],
      [[],        [],        [],        [],        [],        [],        [1],       [2],       [5,4,2,2], null       ],
      [[],        [],        [],        [],        [],        [],        [],        [8,7,6,4], [7],       [9,9,9,4]  ],
      [[],        [1],       null,      [],        [],        [],        [],        [6],       [1],       [9]        ],
      [[],        [],        [],        [],        [],        [],        [9],       [8],       [7],       [9,5,5]    ],
      [[],        [],        [],        [],        [],        [],        [],        [],        [8,6,5],   [8,5,2]    ],
      [[5],       [1],       null,      [8],       [8],       [1],       null,      [],        [5],       [8]        ],
      [[],        [],        [],        [],        [],        [],        [],        [8],       [1],       [7]        ],
      [[],        [5],       [4],       null,      [],        [],        [],        [],        [2,1,1],   [1]        ]
    ]);
  })

  it('should slide tiles up', {}, () => {
    grid.slideUp();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,      [2,1,1],   [2],       [3],       [3],       [4],       [6,5,5,4], [3],       [3],       []         ],
      [[4],       [8],       [2],       [2],       [2],       [4],       [1],       [9,5,5,5], [9,9,9],   []         ],
      [[9,5,5,5], [1],       [6],       [7],       [8,8,8],   [7,6,5,2], [],        [2],       [],        null       ],
      [[],        [],        [],        [7],       [],        [1,1,1],   [],        [],        [],        [9,8,8,7]  ],
      [[],        [],        null,      [8],       [],        [],        [],        [],        [],        [1]        ],
      [[],        [],        [6],       [8],       [],        [],        [],        [],        [],        []         ],
      [[],        [],        [],        [],        [],        [],        [],        [],        [],        []         ],
      [[],        [],        null,      [],        [],        [],        null,      [],        [],        []         ],
      [[],        [],        [4],       [],        [],        [],        [1],       [],        [],        []         ],
      [[],        [],        [],        null,      [],        [],        [],        [],        [],        []         ]
    ]);
  })

  it('should slide tiles down', {}, () => {
    grid.slideDown();
    const tilesArr = gridUtils.getTileValues();
    expect(tilesArr).toEqual([
      [null,      [],        [],        [],        [],        [],        [],        [],        [],        []         ],
      [[],        [],        [],        [],        [],        [],        [],        [],        [],        []         ],
      [[],        [],        [],        [],        [],        [],        [6],       [],        [],        null       ],
      [[],        [],        [6,2,2],   [],        [],        [],        [5],       [],        [],        []         ],
      [[],        [],        null,      [],        [],        [],        [5],       [],        [],        []         ],
      [[],        [],        [],        [],        [],        [7,4,4],   [4],       [],        [],        [9]        ],
      [[],        [],        [6],       [3],       [],        [6],       [1],       [3],       [],        [8]        ],
      [[4],       [2],       null,      [2],       [],        [5],       null,      [9],       [],        [8]        ],
      [[9],       [8,1,1],   [],        [8,8,7,7], [3],       [2],       [],        [5,5,5],   [],        [7]        ],
      [[5,5,5],   [1],       [4],       null,      [8,8,8,2], [1,1,1],   [1],       [2],       [9,9,9,3], [1]        ]
    ]);
  })
})

describe('Grid (non-full) unchanged when slide: Constructor called with with custom boolean grid', {} , () => {
  let grid;
  let gridUtils;
  beforeEach(() => {
    grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    gridUtils = new GridUtils(grid);
  })

  it('should not change grid when attempt to slide left and slide left is not allowed', {}, () => {
    const tilesArray = [
      [[2],  [4],  null, []  ],
      [null, [4],  [],   []  ],
      [[4],  [2],  [4],  []  ],
      [[4],  null, [4],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    expect(tilesArray).toEqual([
      [[2],  [4],  null, []  ],
      [null, [4],  [],   []  ],
      [[4],  [2],  [4],  []  ],
      [[4],  null, [4],  [2] ]
    ]);
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not change grid when attempt to slide right and slide right is not allowed', {}, () => {
    const tilesArray = [
      [[2],  [4],  null, []  ],
      [null, [4],  [8],  [2] ],
      [[],   [4],  [8],  [2] ],
      [[4],  null, [],   [4] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideRight();
    expect(tilesArray).toEqual([
      [[2],  [4],  null, []    ],
      [null, [4],  [8],  [2]   ],
      [[],   [4],  [8],  [2]   ],
      [[4],  null, [],   [4]   ]
    ]);
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not change grid when attempt to slide up and slide up is not allowed', {}, () => {
    const tilesArray = [
      [[2],  [2],  null, [4] ],
      [null, [4],  [4],  [2] ],
      [[8],  [],   [8],  [8] ],
      [[4],  null, [],   [4] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideUp();
    expect(tilesArray).toEqual([
      [[2],  [2],  null, [4]   ],
      [null, [4],  [4],  [2]   ],
      [[8],  [],   [8],  [8]   ],
      [[4],  null, [],   [4]   ]
    ]);
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not change grid when attempt to slide down and slide down is not allowed', {}, () => {
    const tilesArray = [
      [[2],  [],   null, [8] ],
      [null, [2],  [],   [2] ],
      [[8],  [4],  [8],  [8] ],
      [[4],  null, [2],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideDown();
    expect(tilesArray).toEqual([
      [[2],  [],   null, [8]   ],
      [null, [2],  [],   [2]   ],
      [[8],  [4],  [8],  [8]   ],
      [[4],  null, [2],  [2]   ]
    ]);
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })
})

describe('Grid (full) cannot slide', {} , () => {
  it('should not be able to slide when slide is not allowed (1)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  null, [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    expect(grid.canSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (2)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    expect(grid.canSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (3)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    expect(grid.canSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (4)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, null, [4],  [2]  ],
      [null, null, [4],  [2],  null, null ],
      [null, [4],  [16], null, [16], null ],
      [[4],  null, [64], null, [4],  null ],
      [[8],  [4],  null, [2],  [64], null ],
      [[2],  [8],  [64], [8],  [16], [32] ],
      [null, null, null, [4],  [32], [64] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    expect(grid.canSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (5)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScore: 'test1',
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2],  [4],  [3],  [6],  [5],  [6],  [5],  [6], [4]  ],
      [[9],  [1],  [8],  [1],  [7],  [1],  [9],  [2],  [4], [3]  ],
      [[2],  [9],  [2],  [9],  [2],  [5],  [4],  [6],  [5], null ],
      [[4],  [1],  [9],  [7],  [8],  [4],  [8],  [3],  [4], [1]  ],
      [[3],  [8],  null, [9],  [1],  [5],  [4],  [8],  [5], [7]  ],
      [[9],  [1],  [8],  [7],  [9],  [4],  [9],  [1],  [3], [2]  ],
      [[5],  [7],  [6],  [8],  [4],  [5],  [3],  [6],  [4], [7]  ],
      [[8],  [4],  null, [3],  [8],  [4],  null, [5],  [1], [5]  ],
      [[2],  [5],  [1],  [5],  [2],  [6],  [1],  [6],  [2], [6]  ],
      [[6],  [4],  [9],  null, [3],  [5],  [4],  [5],  [1], [3]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    expect(grid.canSlide()).toBe(false);
  })
})

describe('Grid (full) has not changed after slide', {} , () => {
  it('should not be able to slide when slide is not allowed (1a)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  null, [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (1b)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  null, [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideRight();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (1c)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  null, [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideUp();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (1d)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  null, [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideDown();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (2a)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (2b)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideRight();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (2c)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideUp();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (2d)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideDown();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (3a)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (3b)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideRight();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (3c)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideUp();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (3d)', {}, () => {
    const grid = new Grid();
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  [32], [2] ],
      [[32], [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  [32], [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideDown();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (4a)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, null, [4],  [2]  ],
      [null, null, [4],  [2],  null, null ],
      [null, [4],  [16], null, [16], null ],
      [[4],  null, [64], null, [4],  null ],
      [[8],  [4],  null, [2],  [64], null ],
      [[2],  [8],  [64], [8],  [16], [32] ],
      [null, null, null, [4],  [32], [64] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (4b)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, null, [4],  [2]  ],
      [null, null, [4],  [2],  null, null ],
      [null, [4],  [16], null, [16], null ],
      [[4],  null, [64], null, [4],  null ],
      [[8],  [4],  null, [2],  [64], null ],
      [[2],  [8],  [64], [8],  [16], [32] ],
      [null, null, null, [4],  [32], [64] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideRight();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (4c)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, null, [4],  [2]  ],
      [null, null, [4],  [2],  null, null ],
      [null, [4],  [16], null, [16], null ],
      [[4],  null, [64], null, [4],  null ],
      [[8],  [4],  null, [2],  [64], null ],
      [[2],  [8],  [64], [8],  [16], [32] ],
      [null, null, null, [4],  [32], [64] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideUp();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (4d)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test1_7x6'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, null, [4],  [2]  ],
      [null, null, [4],  [2],  null, null ],
      [null, [4],  [16], null, [16], null ],
      [[4],  null, [64], null, [4],  null ],
      [[8],  [4],  null, [2],  [64], null ],
      [[2],  [8],  [64], [8],  [16], [32] ],
      [null, null, null, [4],  [32], [64] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideDown();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (5a)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScoreFnName: 'test1',
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2],  [4],  [3],  [6],  [5],  [6],  [5],  [6], [4]  ],
      [[9],  [1],  [8],  [1],  [7],  [1],  [9],  [2],  [4], [3]  ],
      [[2],  [9],  [2],  [9],  [2],  [5],  [4],  [6],  [5], null ],
      [[4],  [1],  [9],  [7],  [8],  [4],  [8],  [3],  [4], [1]  ],
      [[3],  [8],  null, [9],  [1],  [5],  [4],  [8],  [5], [7]  ],
      [[9],  [1],  [8],  [7],  [9],  [4],  [9],  [1],  [3], [2]  ],
      [[5],  [7],  [6],  [8],  [4],  [5],  [3],  [6],  [4], [7]  ],
      [[8],  [4],  null, [3],  [8],  [4],  null, [5],  [1], [5]  ],
      [[2],  [5],  [1],  [5],  [2],  [6],  [1],  [6],  [2], [6]  ],
      [[6],  [4],  [9],  null, [3],  [5],  [4],  [5],  [1], [3]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (5b)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScoreFnName: 'test1',
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2],  [4],  [3],  [6],  [5],  [6],  [5],  [6], [4]  ],
      [[9],  [1],  [8],  [1],  [7],  [1],  [9],  [2],  [4], [3]  ],
      [[2],  [9],  [2],  [9],  [2],  [5],  [4],  [6],  [5], null ],
      [[4],  [1],  [9],  [7],  [8],  [4],  [8],  [3],  [4], [1]  ],
      [[3],  [8],  null, [9],  [1],  [5],  [4],  [8],  [5], [7]  ],
      [[9],  [1],  [8],  [7],  [9],  [4],  [9],  [1],  [3], [2]  ],
      [[5],  [7],  [6],  [8],  [4],  [5],  [3],  [6],  [4], [7]  ],
      [[8],  [4],  null, [3],  [8],  [4],  null, [5],  [1], [5]  ],
      [[2],  [5],  [1],  [5],  [2],  [6],  [1],  [6],  [2], [6]  ],
      [[6],  [4],  [9],  null, [3],  [5],  [4],  [5],  [1], [3]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideRight();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (5c)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScoreFnName: 'test1',
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2],  [4],  [3],  [6],  [5],  [6],  [5],  [6], [4]  ],
      [[9],  [1],  [8],  [1],  [7],  [1],  [9],  [2],  [4], [3]  ],
      [[2],  [9],  [2],  [9],  [2],  [5],  [4],  [6],  [5], null ],
      [[4],  [1],  [9],  [7],  [8],  [4],  [8],  [3],  [4], [1]  ],
      [[3],  [8],  null, [9],  [1],  [5],  [4],  [8],  [5], [7]  ],
      [[9],  [1],  [8],  [7],  [9],  [4],  [9],  [1],  [3], [2]  ],
      [[5],  [7],  [6],  [8],  [4],  [5],  [3],  [6],  [4], [7]  ],
      [[8],  [4],  null, [3],  [8],  [4],  null, [5],  [1], [5]  ],
      [[2],  [5],  [1],  [5],  [2],  [6],  [1],  [6],  [2], [6]  ],
      [[6],  [4],  [9],  null, [3],  [5],  [4],  [5],  [1], [3]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideUp();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })

  it('should not be able to slide when slide is not allowed (5d)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScoreFnName: 'test1',
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2],  [4],  [3],  [6],  [5],  [6],  [5],  [6], [4]  ],
      [[9],  [1],  [8],  [1],  [7],  [1],  [9],  [2],  [4], [3]  ],
      [[2],  [9],  [2],  [9],  [2],  [5],  [4],  [6],  [5], null ],
      [[4],  [1],  [9],  [7],  [8],  [4],  [8],  [3],  [4], [1]  ],
      [[3],  [8],  null, [9],  [1],  [5],  [4],  [8],  [5], [7]  ],
      [[9],  [1],  [8],  [7],  [9],  [4],  [9],  [1],  [3], [2]  ],
      [[5],  [7],  [6],  [8],  [4],  [5],  [3],  [6],  [4], [7]  ],
      [[8],  [4],  null, [3],  [8],  [4],  null, [5],  [1], [5]  ],
      [[2],  [5],  [1],  [5],  [2],  [6],  [1],  [6],  [2], [6]  ],
      [[6],  [4],  [9],  null, [3],  [5],  [4],  [5],  [1], [3]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideDown();
    expect(grid.hasChangedAfterSlide()).toBe(false);
  })
})

describe('Grid calculate merge score', {} , () => {
  it('should set merge score to null when grid has changed after slide but no merge happened', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[],   [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[],   [2],  [],   [8] ],
      [[2],  null, [8],  []  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    grid.updateMergeScore();
    expect(grid.getMergeScore()).toBe(null);
  })

  it('should set merge score to null when grid has not changed after slide', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test3_4x4'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [[2],  [4],  null, [2] ],
      [null, [16], [8],  [4] ],
      [[4],  [2],  [4],  [8] ],
      [[2],  null, [8],  [2] ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    grid.updateMergeScore();
    expect(grid.getMergeScore()).toBe(null);
  })

  it('should calculate merge score when merge happened after slide (1)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [2], [],   [2],  [],  [2], [],   [2], [2], [4]  ],
      [[2],  [],  [2],  [2],  [],  [],  [],   [],  [2], []   ],
      [[],   [2], [4],  [2],  [],  [2], [],   [],  [],  null ],
      [[],   [2], [2],  [4],  [2], [],  [2],  [],  [2], []   ],
      [[],   [2], null, [2],  [4], [4], [4],  [],  [2], []   ],
      [[4],  [2], [2],  [2],  [4], [4], [2],  [2], [],  [2]  ],
      [[],   [2], [2],  [4],  [4], [2], [],   [2], [],  []   ],
      [[2],  [2], null, [2],  [4], [],  null, [4], [],  [4]  ],
      [[],   [2], [4],  [4],  [8], [4], [4],  [4], [4], []   ],
      [[8],  [2], [2],  null, [4], [],  [4],  [8], [8], []   ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    grid.updateMergeScore();
    expect(grid.getMergeScore()).toBe(132);
  })

  it('should calculate merge score when merge happened after slide (2)', {}, () => {
    const grid = new Grid({
      gridOptions: {
        gridBooleanFnName: 'test2_10x10',
        mergeResultFnName: 'test1',
        mergeConditionFnName: 'test1',
        mergeScoreFnName: 'test1',
        minMergeLength: 3,
        maxMergeLength: 4,
        mergeStrategy: 'longest-match'
      }
    });
    const gridUtils = new GridUtils(grid);
    const tilesArray = [
      [null, [],  [],   [],   [],  [],  [6],  [3], [3], []   ],
      [[],   [2], [2],  [3],  [3], [4], [5],  [],  [],  []   ],
      [[],   [1], [2],  [2],  [2], [4], [5],  [],  [],  null ],
      [[4],  [],  [6],  [7],  [8], [7], [4],  [9], [9], [9]  ],
      [[],   [1], null, [],   [],  [6], [1],  [],  [9], []   ],
      [[9],  [8], [],   [7],  [],  [5], [],   [5], [9], []   ],
      [[5],  [],  [6],  [],   [8], [2], [],   [5], [],  [8]  ],
      [[5],  [1], null, [8],  [8], [1], null, [5], [],  [8]  ],
      [[],   [],  [],   [8],  [],  [1], [],   [],  [],  [7]  ],
      [[5],  [],  [4],  null, [],  [1], [1],  [2], [],  [1]  ]
    ];
    gridUtils.replaceTiles(tilesArray);
    grid.slideLeft();
    grid.updateMergeScore();
    expect(grid.getMergeScore()).toBe(152);
  })

  describe('Grid calculate merge values for each cell', {} , () => {
    it('should set merge values to null when grid has changed after slide but no merge happened', {}, () => {
      const grid = new Grid({
        gridOptions: {
          gridBooleanFnName: 'test3_4x4'
        }
      });
      const gridUtils = new GridUtils(grid);
      const tilesArray = [
        [[],   [4],  null, [2] ],
        [null, [16], [8],  [4] ],
        [[],   [2],  [],   [8] ],
        [[2],  null, [8],  []  ]
      ];
      gridUtils.replaceTiles(tilesArray);
      grid.slideLeft();
      grid.updateMergeScore();
      grid.getCellValues().forEach(cell => {
        expect(cell.mergeValue).toBe(null);
      });
    })
  
    it('should set merge values to null when grid has not changed after slide', {}, () => {
      const grid = new Grid({
        gridOptions: {
          gridBooleanFnName: 'test3_4x4'
        }
      });
      const gridUtils = new GridUtils(grid);
      const tilesArray = [
        [[2],  [4],  null, [2] ],
        [null, [16], [8],  [4] ],
        [[4],  [2],  [4],  [8] ],
        [[2],  null, [8],  [2] ]
      ];
      gridUtils.replaceTiles(tilesArray);
      grid.slideLeft();
      grid.updateMergeScore();
      grid.getCellValues().forEach(cell => {
        expect(cell.mergeValue).toBe(null);
      });
    })
  
    it('should set merge values when merge happened after slide (1)', {}, () => {
      const grid = new Grid({
        gridOptions: {
          gridBooleanFnName: 'test2_10x10'
        }
      });
      const gridUtils = new GridUtils(grid);
      const tilesArray = [
        [null, [2], [],   [2],  [],  [2], [],   [2], [2], [4]  ],
        [[2],  [],  [2],  [2],  [],  [],  [],   [],  [2], []   ],
        [[],   [2], [4],  [2],  [],  [2], [],   [],  [],  null ],
        [[],   [2], [2],  [4],  [2], [],  [2],  [],  [2], []   ],
        [[],   [2], null, [2],  [4], [4], [4],  [],  [2], []   ],
        [[4],  [2], [2],  [2],  [4], [4], [2],  [2], [],  [2]  ],
        [[],   [2], [2],  [4],  [4], [2], [],   [2], [],  []   ],
        [[2],  [2], null, [2],  [4], [],  null, [4], [],  [4]  ],
        [[],   [2], [4],  [4],  [8], [4], [4],  [4], [4], []   ],
        [[8],  [2], [2],  null, [4], [],  [4],  [8], [8], []   ]
      ];
      gridUtils.replaceTiles(tilesArray);
      grid.slideLeft();
      grid.updateMergeScore();
      expect(grid.cells[1].mergeValue).toBe(4);
      expect(grid.cells[2].mergeValue).toBe(4);
      expect(grid.cells[10].mergeValue).toBe(4);
      expect(grid.cells[11].mergeValue).toBe(4);
      expect(grid.cells[22].mergeValue).toBe(4);
      expect(grid.cells[30].mergeValue).toBe(4);
      expect(grid.cells[32].mergeValue).toBe(4);
      expect(grid.cells[44].mergeValue).toBe(8);
      expect(grid.cells[51].mergeValue).toBe(4);
      expect(grid.cells[53].mergeValue).toBe(8);
      expect(grid.cells[54].mergeValue).toBe(4);
      expect(grid.cells[60].mergeValue).toBe(4);
      expect(grid.cells[61].mergeValue).toBe(8);
      expect(grid.cells[62].mergeValue).toBe(4);
      expect(grid.cells[70].mergeValue).toBe(4);
      expect(grid.cells[77].mergeValue).toBe(8);
      expect(grid.cells[81].mergeValue).toBe(8);
      expect(grid.cells[83].mergeValue).toBe(8);
      expect(grid.cells[84].mergeValue).toBe(8);
      expect(grid.cells[91].mergeValue).toBe(4);
      expect(grid.cells[94].mergeValue).toBe(8);
      expect(grid.cells[95].mergeValue).toBe(16);
    })
  
    it('should calculate merge score when merge happened after slide (2)', {}, () => {
      const grid = new Grid({
        gridOptions: {
          gridBooleanFnName: 'test2_10x10',
          mergeResultFnName: 'test1',
          mergeConditionFnName: 'test1',
          mergeScoreFnName: 'test1',
          minMergeLength: 3,
          maxMergeLength: 4,
          mergeStrategy: 'longest-match'
        }
      });
      const gridUtils = new GridUtils(grid);
      const tilesArray = [
        [null, [],  [],   [],   [],  [],  [6],  [3], [3], []   ],
        [[],   [2], [2],  [3],  [3], [4], [5],  [],  [],  []   ],
        [[],   [1], [2],  [2],  [2], [4], [5],  [],  [],  null ],
        [[4],  [],  [6],  [7],  [8], [7], [4],  [9], [9], [9]  ],
        [[],   [1], null, [],   [],  [6], [1],  [],  [9], []   ],
        [[9],  [8], [],   [7],  [],  [5], [],   [5], [9], []   ],
        [[5],  [],  [6],  [],   [8], [2], [],   [5], [],  [8]  ],
        [[5],  [1], null, [8],  [8], [1], null, [5], [],  [8]  ],
        [[],   [],  [],   [8],  [],  [1], [],   [],  [],  [7]  ],
        [[5],  [],  [4],  null, [],  [1], [1],  [2], [],  [1]  ]
      ];
      gridUtils.replaceTiles(tilesArray);
      grid.slideLeft();
      grid.updateMergeScore();
      expect(grid.cells[1].mergeValue).toBe(12);
      expect(grid.cells[21].mergeValue).toBe(2);
      expect(grid.cells[33].mergeValue).toBe(13);
      expect(grid.cells[34].mergeValue).toBe(9);
      expect(grid.cells[50].mergeValue).toBe(7);
      expect(grid.cells[73].mergeValue).toBe(15);
    })
  })
})
