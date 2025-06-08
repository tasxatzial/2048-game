# 2048 game

[2048](https://en.wikipedia.org/wiki/2048_(video_game)) is a game created by [Gabriele Cirulli](https://github.com/gabrielecirulli). The objective is to combine tiles with the same numbers to reach the 2048 tile.

This repo contains my own implementation from scratch.

[Live version](https://tasxatzial.github.io/2048-game/)

## Features

* Supports keyboard controls (arrow keys).
* Supports swipe motions for touch devices (mouse or finger).
* Remembers game progress even if browser is closed.

## Implementation

* Variation of the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern.
* Promises are used to ensure that animations complete properly and to prevent multiple moves before the animations finish.

## Customization

Although the current UI features the classic 2048 game, the code can easily be modified to create a [custom game](custom-game.md) or even to add some of the options below directly to the UI.

## Run locally

The project is written in HTML, CSS, JavaScript. Install the required dependencies via `npm install`.

Run the development version:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Build & serve the production version:

```bash
npm run serve
```

Navigate to `/colors.html` to see all possible tile colors.

## Tests

Vitest is used for testing.

The current tests cover most of the core functionality of the game model.

Run the tests:

```bash
npm run test
```

or, if you prefer access to the browser UI:

```bash
npm run test:ui
```

## Deploy

How to deploy to Github Pages:

1) Select **GitHub Actions** from **Settings > Pages > Build and deployment**.
2) Add a classic protection rule in **Settings > Branches**. Select **Require status checks to pass before merging** and add **build-test**.

Now, each time there’s a pull request or push, the project will be built, the tests will run, and if everything goes well, the project will be deployed to `<your-username>.github.io/2048-game/`.

## Screenshots

See [screenshots](screenshots/).
