# 2048 game

[2048](https://en.wikipedia.org/wiki/2048_(video_game)) is a game created by [Gabriele Cirulli](https://github.com/gabrielecirulli). The objective is to combine tiles with the same numbers to reach the 2048 tile.

This repo contains my own implementation from scratch.

## Features

* Supports keyboard controls (arrow keys).
* Supports swipe motions for touch devices (mouse or finger).
* Remembers game progress even if browser is closed.

## Implementation

* Variation of the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern.
* Promises are used to ensure that animations complete properly and to prevent multiple moves before the animations finish.

## Customization

Although the current UI features the classic 2048 game, we can easily edit the code to create a custom game or even add some of the options below directly to the UI.

### Game

We can define a custom game by creating an object with the following possible keys:

* `gameOptions`: An object with possible keys:
  * `winConditionFnName`: The function name in [WinCondition.js](src/js/gameModel/WinCondition.js). Specifies the win condition of a game.
  * `loseConditionFnName`: The function name in [LoseCondition.js](src/js/gameModel/LoseCondition.js). Specifies the lose condition of a game.
* `gridOptions`: An object with possible keys:
  * `newTileFnName`: The function name in [NewTile.js](src/js/gameModel/NewTile.js). Specifies how to add new tiles after each move, supporting the addition of multiple tiles.
  * `mergeResultFnName`: The function name in [MergeResult.js](src/js/gameModel/MergeResult.js). Specifies the new tile value obtained from merging all tiles in a cell.
  * `mergeScoreFnName`: The function name in [MergeScore.js](src/js/gameModel/MergeScore.js). Specifies the extra score obtained from merging all tiles in a cell.
  * `mergeConditionFnName`: The function name in [MergeCondition.js](src/js/gameModel/MergeCondition.js). Specifies when two tiles can merge. The first parameter corresponds to the tile closest to the edge in the slide direction.
  * `gridBooleanFnName`: The function name in [GridBoolean.js](src/js/gameModel/GridBoolean.js). Specifies a two dimensional boolean array that represents the rows of the board. A value of 1 indicates that the corresponding cell is enabled and can accept tiles, while a value of 0 indicates a disabled cell where tiles cannot occupy or slide through. Disabled cells will display as squares with black background and a white border.
  * `mergeAll`: `false` if we want only two tiles to merge, else `true`.
* `initialTiles`: An array of initial tiles. Each tile should be an object with the following required keys:
  * `row`: Row of the tile.
  * `column`: Column of the tile.
  * `value`: The tile value.

If a key isn't defined, the values will default to those of the classic 2048 game. The corresponding functions are listed in the files mentioned above under the `original2048` name.

#### Merging

The merging algorithm starts by considering the tiles that are closest to the edge in the slide direction. It will check if two consequtive tiles (tiles that are only separated by empty cells) meet the criteria specified by the function `mergeConditionFnName`. If so, it will consider two possibilities: If `mergeAll` is set to `false`, it will merge the two tiles into one based on the return value of `mergeResultFnName`. If `mergeAll` is set to `true`, it will find the longest chain of consequtive tiles so that any two consequtive tiles meet the merge condition. All the tiles in the chain will be merged into one.

### Board

We can customize the appearance and behavior of the board by defining the following custom properties in the root element of [board.css](src/css/board.css).

* `--cell-size`: Size of each cell. Default is `4.5rem`.
* `--cell-gap`: Gap size between cells. Default is `0.25rem`.
* `--cell-border-radius`: Border radius of cells and board. Default is `0.25rem`.
* `--horizontal-slide-duration`: Duration of a slide across the horizontal axis: Default is `125ms`.
* `--vertical-slide-duration`: Duration of a slide across the vertical axis: Default is `125ms`.
* `--zoomin-duration`: Duration of the animation for merging and adding new tiles: Default is `125ms`.

#### Tile fonts

The font size of each tile is handled automatically based on the length of the tile value, with a maximum supported length of 10. This setting can be modified by adding extra classes in [board.css](src/css/board.css) and modifying the function `_initializeTile` in [BoardView.js](src/js/gameView/BoardView.js).

#### Tile colors

Tile colors are handled automatically. Instead of always assigning the same color to a specific value, the app only ensures that all tiles with the same value share the same color. As a result, the board's coloring works properly in custom-defined games that use different tile values than those in the classic 2048 game.

All colors are defined in [BoardViewColorModel.js](src/js/gameView/BoardViewColorModel.js) as an array. The last value in the array corresponds to a tile with a white background and black font color. This entry is used for a tile in a board that is already using all previous colors.

## Creating a custom game - Example

We would like to create a game with the following options:

* The win condition is reaching tile 32.
* The board size is 3 x 3, with the center cell missing.
* The top left corner has a tile with a value of 2.

To accomplish this, we define in [WinCondition.js](src/js/gameModel/WinCondition.js):

```js
static hasTile32(grid) {
  return grid.hasTile(32)
}
```

and in [GridBoolean.js](src/js/gameModel/GridBoolean.js):

```js
static threeByThreeNoCenter() {
  return [[1, 1, 1],
          [1, 0, 1],
          [1, 1, 1]]
}
```

We can now define the custom game as:

```js
game = {
  gameOptions: {
    winConditionFnName: 'hasTile32'
  },
  gridOptions: {
    gridBooleanFnName: 'threeByThreeNoCenter'
  },
  initialTiles: [
    {row: 0, column: 0, value: 2}
  ]
}
```

and pass it as an argument to the `startGame` function in [script.js](src/js/script.js) like so:

```js
view.bindStartNewGame(() => {
  startGame({game})
})
```

## Dependencies

None. The project uses only HTML, CSS, JavaScript.

## Run locally

Download the `src` folder and use a local web server to serve its contents.

Navigate to `/colors.html` to see all possible tile colors.

## Screenshots

See [screenshots](screenshots/).
