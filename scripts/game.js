"use strict";

let winner = false;

function game() {
    initCanvas();
    renderBoard();
    setupGame();

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    update();
    render();
    if (!winner) {
        requestAnimationFrame(gameLoop)
    }
}

game();
