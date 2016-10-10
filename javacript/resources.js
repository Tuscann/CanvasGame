"use strict";
let canvas;
let ctx;
let pieceCounter = 0;

let positions = {
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
    position24: {x: 724, y:505, status: 'free'}
};


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
 
