# 2048 game

This repository contains my implementation of the [2048 game](https://en.wikipedia.org/wiki/2048_(video_game)) by Gabriele Cirulli, where the objective is to combine tiles with the same numbers to reach the 2048 tile.

## Features

* Supports keyboard controls (arrow keys).
* Supports swipe motions for touch devices (mouse or finger).
* Remembers game progress even if browser is closed.

## Implementation

* Variation of the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern.
* Promises are used to ensure correct functionality and that animations complete properly.

## Customization

Although the current UI features the classic 2048 game, you can easily edit the code to create a custom game or even add some of the options below directly to the UI.

### Game

The main game class is [GameModel.js](src/js/GameModel.js), which supports passing an object as an argument in its costructor. Possible keys of this object are:

* `gameOptions`: An object with possible keys:
  * `winConditionFnName`: The function name in [WinCondition.js](src/js/gameModel/WinCondition.js). Specifies the win condition of a game.
  * `loseConditionFnName`:The function name in [LoseCondition.js](src/js/gameModel/LoseCondition.js). Specifies the lose condition of a game.
* `gridOptions`: An object with possible keys:
  * `newTileFnName`: The function name in [NewTile.js](src/js/gameModel/NewTile.js). Specifies how to add new tiles after each move, supporting the addition of multiple tiles.
  * `mergeResultFnName`: The function name in [MergeResult.js](src/js/gameModel/MergeResult.js). Specifies the new value of two merged tiles.
  * `mergeScoreFnName`: The function name in [MergeScore.js](src/js/gameModel/MergeScore.js). Specifies the extra score from merging two tiles.
  * `mergeConditionFnName`: The function name in [MergeCondition.js](src/js/gameModel/MergeCondition.js). Specifies when two tiles can merge. The first parameter corresponds to the tile closest to the edge in the slide direction.
  * `gridBooleanFnName`: The function name in [GridBoolean.js](src/js/gameModel/GridBoolean.js). Specifies a two dimensional boolean array that represents the rows of the board. A value of 1 indicates that the corresponding cell is enabled and can accept tiles, while a value of 0 indicates a disabled cell where tiles cannot occupy or slide through. Disabled cells will display as squares with black background and a white border.
  * `mergeAll`: `false` if we want only two tiles to merge, else `true`. When `true`, the tile closest to the edge in the slide direction will be compared against each of the other tiles.

  **Note**: Do not create a grid with only one row or column, as this will cause text overflow issues when the grid overlay is shown.

* `initialTiles`: An array of initial tiles. Each tile should be an object with the following required keys:
  * `row`: Row of the tile.
  * `column`: Column of the tile.
  * `value`: The tile value.

If a key isn't defined, the values will default to those of the classic 2048 game. The corresponding functions are listed in the files mentioned above under the `original2048` name.

### Board

You can customize the appearance and behavior of the board by defining the following custom properties in the root element of [board.css](src/css/board.css).

* `--cell-size`: Size of each cell. Default is `4.5rem`;
* `--cell-gap`: Gap size between cells. Default is `--cell-size / 18`;
* `--cell-border-radius`: Border radius of cells and board. Default is `--cell-size / 18`;
* `--horizontal-slide-duration`: Duration of a slide across the horizontal axis: Default is `150ms`.
* `--vertical-slide-duration`: Duration of a slide across the vertical axis: Default is `150ms`.
* `--zoomin-duration`: Duration of the animation for merging and adding new tiles: Default is `125ms`.

#### Tile fonts

The font size of each tile is handled automatically based on the length of the tile value, with a maximum supported length of 10. This setting can be modified by adding extra classes in [board.css](src/css/board.css) and modifying the function `_initializeTile` in [BoardView.js](src/js/gameView/BoardView.js).

#### Tile colors

Tile colors are handled automatically. Instead of always assigning the same color to a specific value, the program only ensures that all tiles with the same value share the same color. As a result, the board's coloring works properly in custom-defined games that use different tile values than those in the classic 2048 game.

All colors are defined in [BoardViewColorModel.js](src/js/gameView/BoardViewColorModel.js) as an array. Currently, there are 20 light background colors that use a black font color and 18 dark background colors that use a white font color. The last value in the array corresponds to a tile with a white background and black font color. This entry is used for a tile in a board that is already using all 38 colors, meaning a board that has 38 tiles with different values.

Feel free to edit [BoardViewColorModel.js](src/js/gameView/BoardViewColorModel.js) if you want to add, remove, or adjust any of them.

## Creating a custom game - Example

We would like to create a game with the following options:

* The win condition is reaching tile 32.
* The board size is 3 x 3, with the center cell missing.
* The top left corner has a tile with a value of 2.

To accomplish this, we define in [WinCondition.js](src/js/gameModel/WinCondition.js):

```js
static hasTile32(grid) {
  return grid.hasTile(32);
}
```

and in [GridBoolean.js](src/js/gameModel/GridBoolean.js):

```js
static threeByThreeNoCenter() {
  return [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
}
```

Finally, we create the game:

```js
game = new GameModel({
  gameOptions: {
    winConditionFnName: 'hasTile32'
  },
  gridOptions: {
    gridBooleanFnName: 'threeByThreeNoCenter'
  },
  initialTiles: [
    {row: 0, column: 0, value: 2}
  ]
})
```

Pass the above object as an argument to the `startGame` function on line 57 of [script.js](src/js/script.js), and press 'New Game' to start the custom game.

## Dependencies

None. The project uses only HTML, CSS, JavaScript.

## Run locally

Download the `src` folder and use a local web server to serve its contents.

Navigate to [/colors.html](src/colors.html) to see how each color looks.

## Screenshots

See [screenshots](screenshots/).
