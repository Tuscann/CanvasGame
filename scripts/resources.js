"use strict";
let canvas;
let ctx;
let pieceCounter = 0;
let isPieceSelected = false;
let dice1, dice2;
let availablePositionsToPutPieceIn;
let boardPicture = document.getElementById('board');


function update() {
    if (isPieceSelected) {
        calculatePossibleMoves(isPieceSelected);
    }
    gameTurn();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBoard();
    renderPieces();
    // renderDice();
}

function gameTurn() {

}

function calculatePossibleMoves(selectedPieceId) { // returns list of areas for input collision. TODO: remember to clear list on 'piece.isSelected' listener, when piece is put down.
    // _dev - assignment of dices for tests.
    // [dice1, dice2] = [2, 4];

    availablePositionsToPutPieceIn = [];
    let selectedPiece;
    let selectedPiecePosition;

    // This loop is probably not necessary. I might just assign the piece object itself as argument.
    loop1:
        for (let position of board) {
            for (let piece of position) {
                if (piece.id === selectedPieceId) {
                    selectedPiece = piece;
                    selectedPiecePosition = position;
                    break loop1; // Breaks both loops when finds matching id
                }
            }
        }

    let opponent = (selectedPiece.color === 'white')? 'black': 'white';

    // List of available moves, according to dice and selectedPiece position.
    let moves = [
        selectedPiecePosition + dice1,
        selectedPiecePosition + dice2,
        selectedPiecePosition + dice1 + dice2
    ];

    // Array of booleans, checking if the target position is free, occupied by same team pieces, occupied by 1 opponent team piece or occupied by more opponent pieces.
    let possibleMoves = [
        board[moves[0]].occupiedBy === 'none' ||
        board[moves[0]].occupiedBy === selectedPiece.color ||
        board[moves[0]].occupiedBy === opponent && board[moves[0]].piecesOn.length === 1,

        board[moves[1]].occupiedBy === 'none' ||
        board[moves[1]].occupiedBy === selectedPiece.color ||
        board[moves[1]].occupiedBy === opponent && board[moves[1]].piecesOn.length === 1,
    ];
    possibleMoves.push(
        (possibleMoves[0] || possibleMoves[1]) &&
        (board[moves[2]].occupiedBy === 'none' ||
        board[moves[2]].occupiedBy === selectedPiece.color ||
        board[moves[2]].occupiedBy === opponent && board[moves[2]].piecesOn.length === 1)
    );

    // Adding [0-3] possible positions to list, for dropSelectedPiece listener.
    for (let i = 0; i < 3; i++) {
        if (possibleMoves[i]) {
            availablePositionsToPutPieceIn.push({
                x: {start: board[moves[i]].x.start, end: board[moves[i]].x.end},
                y: {start: board[moves[i]].y.start, end: board[moves[i]].y.end}
            })
        }
    }
}

function setupGame() {

    initPiece('white', 0);
    initPiece('white', 0);

    initPiece('white', 11);
    initPiece('white', 11);
    initPiece('white', 11);
    initPiece('white', 11);
    initPiece('white', 11);

    initPiece('white', 16);
    initPiece('white', 16);
    initPiece('white', 16);

    initPiece('white', 18);
    initPiece('white', 18);
    initPiece('white', 18);
    initPiece('white', 18);
    initPiece('white', 18);

    initPiece('black', 23);
    initPiece('black', 23);

    initPiece('black', 12);
    initPiece('black', 12);
    initPiece('black', 12);
    initPiece('black', 12);
    initPiece('black', 12);

    initPiece('black', 7);
    initPiece('black', 7);
    initPiece('black', 7);

    initPiece('black', 5);
    initPiece('black', 5);
    initPiece('black', 5);
    initPiece('black', 5);
    initPiece('black', 5);
}

function initPiece(color, position) {
    let piece = pieceBuilder(color, position);
    board[position].piecesOn.push(piece);
    board[position].occupiedBy = piece.color;
}

function pieceBuilder(color, position) {
    let PIECE_SIDE = 45;
    let PIECE_SELECTED_SIDE = 60;
    pieceCounter++;

    let piece = {
        id: color + pieceCounter,
        color: color,
        y: (function () { // Positions up to 5 pieces on the position. TODO: implement indication in case of more then 5 pieces.
            let piecesOnPosition = board[position].piecesOn.length;
            if (piecesOnPosition >= 5) {
                return - 800;
            } else {
                if (position < 12) {
                    return board[0].y.start + piecesOnPosition * PIECE_SIDE;
                } else {
                    return board[12].y.start - piecesOnPosition * PIECE_SIDE;
                }
            }
        })(),
        side:PIECE_SIDE,
        selectedSide:PIECE_SELECTED_SIDE,
        img: document.getElementById(color + '-piece'),
        inPlay: true,
        active: false,
        isSelected: false,
        score: false
    };

    return piece;


}

function initCanvas() {
    console.log('Initiating canvas.');

    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
}

function renderBoard() {
    ctx.drawImage(boardPicture, 0, 0);
    // if (boardPicture.complete) {
    //     ctx.drawImage(boardPicture, 0, 0);
    // } else {
    //     boardPicture.onload = function() {
    //         ctx.drawImage(boardPicture, 0, 0);
    //     }
    // }
}

function renderPieces() {
    for (let position of board) {
        for (let piece of position.piecesOn) {
            let image = piece.img,
                x = position.x.start,
                y = piece.y,
                side = (piece.selected)? piece.selectedSide : piece.side;
            // if (image.complete) {
            //         ctx.drawImage(image, x, y, side, side);
            // } else {
            //     image.onload = function() {
            //         ctx.drawImage(image, x, y, side, side);
            //     }
            // }
            ctx.drawImage(image, x, y, side, side);
        }
    }
}

//******************************************************************************
// Raly - Rolling dice
//******************************************************************************
function rollDiceForTurn() {
    let btn = document.getElementById('roll-for-turn');
    btn.addEventListener('click', roll);

    let[whiteDice, whiteDiceImage] = roll('white');
    let[blackDice, blackDiceImage] = roll('black');
    drawDice(whiteDiceImage, blackDiceImage, [2, 12], [2, 120]);

    if (whiteDice == blackDice){
        roll();
    }
}

function rollDiceForPlay(color) {
    // let btn = document.getElementById('roll-for-turn');
    // btn.addEventListener('click', roll);
    //
    // let color = 'white';
    let[die1, dieImage1] = roll(color);
    let[die2, dieImage2] = roll(color);

    drawDice(dieImage1, dieImage2, [2, 60], [2, 80]);
    return [die1, die2];
}

function roll(color) {
    let dice = Math.floor((Math.random() * 6) + 1);

    let diceImage = new Image();
    diceImage.src = 'resources/' + color;

    switch (dice) {
        case 1:
            diceImage.src += 'Dice1.png';
            break;
        case 2:
            diceImage.src += 'Dice2.png';
            break;
        case 3:
            diceImage.src += 'Dice3.png';
            break;
        case 4:
            diceImage.src += 'Dice4.png';
            break;
        case 5:
            diceImage.src += 'Dice5.png';
            break;
        case 6:
            diceImage.src += 'Dice6.png';
            break;
    }
    return [dice, diceImage];
}

function drawDice(dieImage1, dieImage2, diePosition1, diePosition2) {
    ctx.drawImage(dieImage1, diePosition1[0], diePosition1[1], 18, 18);
    ctx.drawImage(dieImage2, diePosition2[0], diePosition2[1], 18, 18);
}



