# Galaxy Invaders

[Galaxy Invaders live][live_site]

[live_site]: http://www.galaxyinvaders.space

Galaxy Invaders is a browser-based game that is inspired by the classic Space Invaders arcade game.

## Features

Galaxy Invaders uses a sprite engine to provide animated ships, bullets, and explosions. It uses the `requestAnimationFrame` browser API to provide fluid and efficient animations. A slightly modified version of Paul Irish's shim layer is implemented for backwards compatibility:

```javascript
function requestAnimFrame(callback) {
  return window.requestAnimationFrame(callback)        ||
         window.webkitRequestAnimationFrame(callback)  ||
         window.mozRequestAnimationFrame(callback)     ||
         window.oRequestAnimationFrame(callback)       ||
         window.msRequestAnimationFrame(callback)      ||
         window.setTimeout(callback, 1000 / 60);
}
```

Four different sprite animations are used to handle the banking of the player's shift to the left and to the right. These are triggered based on animation logic that responds to the user's input, with checks for the completion of an initiated animation skipping.
