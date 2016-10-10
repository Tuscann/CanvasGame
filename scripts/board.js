"use strict";
let POSITION_WIDTH = 55;
let POSITION_HEIGHT = 250;

let board = [
    // 0-11
    {x: {start: 728, end: 728 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 672, end: 672 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 616, end: 616 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 560, end: 560 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 504, end: 504 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 448, end: 448 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 342, end: 342 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 286, end: 286 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 230, end: 230 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 174, end: 174 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 118, end: 118 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 62, end: 62 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    // 12-23
    {x: {start: 62, end: 62 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 118, end: 118 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 174, end: 174 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 230, end: 230 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 286, end: 286 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 342, end: 342 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 448, end: 448 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 504, end: 504 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 560, end: 560 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 616, end: 616 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 672, end: 672 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 728, end: 728 + POSITION_WIDTH}, y:{start: 515, end: 515 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
];
