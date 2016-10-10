"use strict";
let POSITION_WIDTH = 55;
let POSITION_HEIGHT = 250;

let board = [
    // 0-11
    {x: {start: 722, end: 722 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 666, end: 666 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 610, end: 610 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 554, end: 554 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 498, end: 498 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 442, end: 442 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 342, end: 342 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 286, end: 286 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 230, end: 230 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 174, end: 174 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 118, end: 118 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 62, end: 62 + POSITION_WIDTH}, y:{start: 40, end: 40 + POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    // 12-23
    {x: {start: 62, end: 62 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 118, end: 118 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 174, end: 174 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 230, end: 230 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 286, end: 286 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 342, end: 342 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 442, end: 442 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 498, end: 498 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 554, end: 554 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 610, end: 610 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 666, end: 666 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
    {x: {start: 722, end: 722 + POSITION_WIDTH}, y:{start: 560, end: 560 - POSITION_HEIGHT}, piecesOn: [], occupiedBy: 'none'},
];
