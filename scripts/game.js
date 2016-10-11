"use strict";

function game() {
    initCanvas();
    renderBoard();
    setupGame();
}

function update(x, y) {  // Invoked from click listener.
    if (selectedPiece) {
        selectedPiece = false;
    } else {
        selectedPiece = selectingPiece(x, y);
        if (selectedPiece) {
            calculatePossibleMoves(selectedPiece);
            requestAnimationFrame(animationLoop);
        }
    }
}

function animationLoop() {
    updateSelectedPiece();
    render();
    if (selectedPiece) {
        requestAnimationFrame(animationLoop)
    }
}

function updateSelectedPiece() {
    selectedPiece.x.start = cursorX;
    selectedPiece.y.start = cursorY;
}

function render() {
    renderBoard();
    renderStaticPieces();
    if (selectedPiece) renderSelectedPiece();
    // renderDice();
}


game();
