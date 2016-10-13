"use strict";
let POSITION_WIDTH = 55;
let POSITION_HEIGHT = 250;

let activePlayer;

let canvas,
    ctx,
    CANVAS_WIDTH = 840,
    CANVAS_HEIGHT = 600,
    CANVAS_OFFSET_TOP = 60,
    canvasOffsetLeft,
    DIE_COORDINATES_1 = [2.5, 60],
    DIE_COORDINATES_2 = [2.5, 130];

let winner;
let pieceCounter = 0;
let selectedPiece = false;
let die1, die2;
let dieImage1, dieImage2;
let availableMoves;
let boardPicture = document.getElementById('board');
let holdingPiece = false;
let cursorX, cursorY;
let availableMovesAmount;
let spentMoves;

let whiteDice = 0;
let blackDice = 0;

let board = [
    // 0-11
    {index: 0, x: {start: 728, end: 728 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 1, x: {start: 672, end: 672 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 2, x: {start: 616, end: 616 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 3, x: {start: 560, end: 560 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 4, x: {start: 504, end: 504 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 5, x: {start: 448, end: 448 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 6, x: {start: 342, end: 342 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 7, x: {start: 286, end: 286 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 8, x: {start: 230, end: 230 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 9, x: {start: 174, end: 174 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 10, x: {start: 118, end: 118 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 11, x: {start: 62, end: 62 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    // 12-23
    {index: 12, x: {start: 62, end: 62 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 13, x: {start: 118, end: 118 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 14, x: {start: 174, end: 174 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 15, x: {start: 230, end: 230 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 16, x: {start: 286, end: 286 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 17, x: {start: 342, end: 342 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 18, x: {start: 448, end: 448 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 19, x: {start: 504, end: 504 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 20, x: {start: 560, end: 560 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 21, x: {start: 616, end: 616 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 22, x: {start: 672, end: 672 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {index: 23, x: {start: 728, end: 728 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},

    // Positions for score pieces
    {index: 24, x: {start: 790, end: 830}, y: {start: 560, end: 381}, piecesOn: []},
    {index: 25, x: {start: 790, end: 830}, y: {start: 40, end: 219}, piecesOn: []}
];

let out = new Map();
out.set('white', {x: {start: 62 - POSITION_WIDTH, end: 62}, y: {start: 300, end: 350}, piecesOn: []});
out.set('black', {x: {start: 62 - POSITION_WIDTH, end: 62}, y: {start: 515, end: 550}, piecesOn: []});
