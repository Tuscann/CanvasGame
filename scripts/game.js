"use strict";

let fadeCounter = 0;
let animCOunter = 0;

function game() {
    initCanvas();
    renderBoard();
    // setupGame();
}

function update(x, y) {  // Invoked from click listener.
    if (selectedPiece) {
        let moves = dropPiece(x, y);
        selectedPiece = false; // cleanup by moving in dropPiece and renaming,
        availableMovesAmount -= moves;
        winner = countScore();
        if (availableMovesAmount <= 0 || winner) endTurn();
        render();
    } else {
        // if (out.get(activePlayer).piecesOn.length > 0){
        //     selectedPiece = selectingOutPiece(x, y);
        // }
        // else {
        //     selectedPiece = selectingPiece(x, y);
        // }
        selectedPiece = selectingPiece(x, y);
        if (selectedPiece) {
            console.log('on select ' + selectedPiece);
            
            if (selectedPiece.inPlay){
                calculatePossibleMoves(selectedPiece);
            }
            else {
                CalculatePossibleMovesForPieceOut(selectedPiece);
            }
            
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
    renderOutPieces();
    drawDice();
    if (selectedPiece) renderSelectedPiece();
    if (winner) drawEndGame();
}

$(function() {game();});
