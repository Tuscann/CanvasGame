"use strict";
let canvas;
let ctx;
let pieceCounter = 0;

let grid = {
    position1: {x: 724, y:40, status: 'free'},
    position2: {x: 669, y:40, status: 'free'},
    position3: {x: 614, y:40, status: 'free'},
    position4: {x: 559, y:40, status: 'free'},
    position5: {x: 504, y:40, status: 'free'},
    position6: {x: 449, y:40, status: 'free'},
    position7: {x: 339, y:40, status: 'free'},
    position8: {x: 284, y:40, status: 'free'},
    position9: {x: 229, y:40, status: 'free'},
    position10: {x: 174, y:40, status: 'free'},
    position11: {x: 119, y:40, status: 'free'},
    position12: {x: 64, y:40, status: 'free'},
    position13: {x: 64, y:505, status: 'free'},
    position14: {x: 119, y:505, status: 'free'},
    position15: {x: 174, y:505, status: 'free'},
    position16: {x: 229, y:505, status: 'free'},
    position17: {x: 284, y:505, status: 'free'},
    position18: {x: 339, y:505, status: 'free'},
    position19: {x: 449, y:505, status: 'free'},
    position20: {x: 504, y:505, status: 'free'},
    position21: {x: 559, y:505, status: 'free'},
    position22: {x: 614, y:505, status: 'free'},
    position23: {x: 669, y:505, status: 'free'},
    position24: {x: 724, y:505, status: 'free'},
};

function pieceBuilder(color) {
    pieceCounter++;
    return {
        id: color + pieceCounter,
        color: color,
        inPlay: true,
        score: false,
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
 
