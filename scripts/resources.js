"use strict";
let canvas;
let ctx;
let pieceCounter = 0;
let isPieceSelected = false;
let dice1, dice2;
let availablePositionsToPutPieceIn;


function update() {
    if (isPieceSelected) calculatePossibleMoves(isPieceSelected); //TODO: calculate possible moves for 'isPieceSelected' ( holds the id of the selected piece ).
}

function render() {
    ctx.clearRect(0, 0, 840, 600);
    renderBoard();
    renderPieces();
    // rencerDices();
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
}

function pieceBuilder(color, position) {
    pieceCounter++;
    return {
        id: color + pieceCounter,
        color: color,
        y: function() { // Positions up to 5 pieces on the position. TODO: implement indication in case of more then 5 pieces.
            let piecesOnPosition = board[position].piecesOn.length;
            if (piecesOnPosition >= 5) {
                return - 800;
            } else {
                if (position < 12) {
                    return 40 + piecesOnPosition * 55;
                } else {
                    return 560 - piecesOnPosition * 55;
                }
            }
        },
        side:55,
        selectedSide:60,
        img: new Image({
            src: './resources/piece.png'
        }),
        inPlay: true,
        isSelected: false,
        score: false
    }
}

function initCanvas() {
    console.log('Initiating canvas.');

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
}

function renderBoard() {
    console.log('Rendering board.');

    let board = new Image();
    board.src = 'resources/board.png';
    board.onload = function() {
        ctx.drawImage(board, 0, 0);
    };
}

function renderPieces() {
    for (let position of board) {
        for (let piece of position.piecesOn) {
            let image = piece.img,
                x = position.x.start,
                y = piece.y,
                side = piece.side;
            if (piece.selected) {
                side = piece.selectedSide;
            }

            ctx.drawImage(image, x, y, side, side);  // Possibly not working - expecting buggy behaviour, because of 'onload' crap.
        }
    }
}

