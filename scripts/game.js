"use strict";

let winner = false;

function gameLoop() {
    initCanvas();
    renderBoard();
    setupGame();

    let FPS = 70;
    let intervalId = setInterval(function() {
        update();
        render();
    }, 1000/FPS);
    if (winner) {
        clearInterval(intervalId);
        endGame();
    }
}

gameLoop();
