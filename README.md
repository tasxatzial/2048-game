# 2048 game

This repository contains my implementation of the popular 2048 game, where the objective is to combine tiles with the same numbers to reach the 2048 tile.

## Features

* Classic 2048 gameplay.
* Supports keyboard controls (arrow keys).
* Supports swipe motions for touch devices (mouse or finger).
* Remembers game progress even if browser is closed.
* Tile colors are not tied to specific values. Instead, all tiles with the same value will share the same color. This ensures that the board's coloring works properly in custom-defined games that use different tile values than those in the classic 2048 game.

## Implementation

* Variation of the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern.
* Promises are used to ensure correct functionality and that animations complete properly, preventing the user from making the next move until the animations are finished.

## Customization

Even though the current interface features the classic 2048 game, you can easily edit the code to create a custom game.

### Game

The main game class is [GameModel.js](src/js/GameModel.js), which supports passing an object as an argument in its costructor. Possible keys of this object are:

* `gameOptions`: An object with possible keys:
  * `winConditionFnName`: The function name in [WinCondition.js](src/js/gameModel/WinCondition.js). Specifies the win condition of a game.
  * `loseConditionFnName`:The function name in [LoseCondition.js](src/js/gameModel/LoseCondition.js). Specifies the lose condition of a game.
* `gridOptions`: An object with possible keys:
  * `newTileFnName`: The function name in [NewTile.js](src/js/gameModel/NewTile.js). Specifies how to add new tiles after each move, supporting the addition of multiple tiles.
  * `mergeResultFnName`: The function name in [MergeResult.js](src/js/gameModel/MergeResult.js). Specifies the new value of two merged tiles.
  * `mergeScoreFnName`: The function name in [MergeScore.js](src/js/gameModel/MergeScore.js). Specifies the extra score from merging two tiles.
  * `mergeConditionFnName`: The function name in [MergeCondition.js](src/js/gameModel/MergeCondition.js). Specifies when two tiles can merge.
  * `gridBooleanFnName`: The function name in [GridBoolean.js](src/js/gameModel/GridBoolean.js). Specifies a two dimensional boolean array that represents the rows of the board. A value of 1 indicates that the corresponding cell is enabled and can accept tiles, while a value of 0 indicates a disabled cell where tiles cannot occupy or slide through. Disabled cells will display as squares with black background and a white border.
* `initialTiles`: An array of initial tiles. Each tile should be an object with the following required keys:
  * `row`: Row of the tile.
  * `column`: Column of the tile.
  * `value`: The tile value.

If a key isn't defined, the values will default to those of the classic 2048 game. The corresponding functions are listed in the files mentioned above under the `original2048` name.

Edit line 31 of [script.js](src/js/script.js) to pass an object in the constructor, then press 'New Game' to generate a game with your options.

**Note**: If either the `winConditionFnName` or `loseConditionFnName` is modified during gameplay, the changes won't be reflected until the next move.

### Board

You can also customize the appearance and behavior of the board by defining the following custom properties in the root element of [board.css](src/css/board.css).

* `--cell-size`: Size of each cell. Default is `4.5rem`;
* `--cell-gap`: Gap size between cells. Default is `--cell-size / 18`;
* `--cell-border-radius`: Border radius of cells and board. Default is `--cell-size / 18`;
* `--horizontal-slide-duration`: Duration of a slide across the horizontal axis: Default is `125ms`.
* `--vertical-slide-duration`: Duration of a slide across the vertical axis: Default is `125ms`.
* `--zoomin-duration`: Duration of the animation for merging and adding new tiles: Default is `125ms`.

## Dependencies

None. The project uses only HTML, CSS, JavaScript.

## Run locally

Download the `src` folder and use a local web server to serve its contents.

## Screenshots

See [screenshots](screenshots/).
