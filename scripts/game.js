"use strict";

function game() {
    initCanvas();
    renderBoard();
    // setupGame();
}

function update(x, y) {  // Invoked from click listener.
    if (selectedPiece) {
        let turnCompleted = dropPeace(x, y);
        selectedPiece = false;
        spentMoves += turnCompleted;
        if (spentMoves === availableMoves) endTurn();
        render();
    } else {
        selectedPiece = selectingPiece(x, y);
        if (selectedPiece) {
            console.log('on select ' + selectedPiece);
            calculatePossibleMoves(selectedPiece);
            requestAnimationFrame(animationLoop);
        }
    }
    
}

function animationLoop() {
    if (selectedPiece) {
        requestAnimationFrame(animationLoop);
        updateSelectedPiece();
    }
    render();
}

function updateSelectedPiece() {
    selectedPiece.x.start = cursorX;
    selectedPiece.y.start = cursorY;
}

function render() {
    renderBoard();
    renderStaticPieces();
    drawDice(dieImage1, dieImage2, DIE_COORDINATES_1, DIE_COORDINATES_2);
    if (selectedPiece) renderSelectedPiece();
    // renderDice();
}

$(function() {game();});
