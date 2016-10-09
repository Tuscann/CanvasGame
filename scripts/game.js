"use strict";

let winner = false;

function gameLoop() {
    initCanvas();
    renderBoard();
    setupGame();

    if (winner) {
        clearInterval(intervalId);
    }
    var FPS = 30;
    let intervalId = setInterval(function() {
        update();
        render();
    }, 1000/FPS);
}

gameLoop();
