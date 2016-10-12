"use strict";


function getMouseClickLocation(event) {
    let clickX = event.clientX - canvasOffsetLeft,
        clickY = event.clientY - CANVAS_OFFSET_TOP;

    console.log('Getting mouse click');
    update(clickX, clickY);
}

function selectingPiece(x, y) {
    for (let position of board) {
        for (let piece of position.piecesOn) {
            if (x > piece.x.start && x < piece.x.end() &&
                y > piece.y.start && y < piece.y.end() &&
                position.occupiedBy === activePlayer) {

                let selectedPiece = position.piecesOn.pop();
                selectedPiece.selected = true;
                selectedPiece.x.start = cursorX;
                selectedPiece.y.start = cursorY;
                selectedPiece.side = 60;

                // Added check if this was last piece on that position.
                // If so - occupiedBy is set on 'none'
                if (position.piecesOn.length == 0){
                    position.occupiedBy = 'none';
                }
                return selectedPiece;
            }
        }
    }

    return false;
}

function selectingOutPiece(x, y) {

    let piece = out.get(activePlayer).piecesOn.pop();
    if (x > piece.x.start
        && x < piece.x.end()
        && y > piece.y.start
        && y < piece.y.end()){

        let selectedPiece = piece;
        selectedPiece.selected = true;
        selectedPiece.x.start = cursorX;
        selectedPiece.y.start = cursorY;
        selectedPiece.side = 60;

        return selectedPiece;
    }
    return false;
}

function startTurn() {
    rollDiceForPlay();
    drawDice(dieImage1, dieImage2, DIE_COORDINATES_1, DIE_COORDINATES_2);
}
function endTurn() {
    (activePlayer === 'white')? activePlayer = 'black' : activePlayer = 'white';
    startTurn();
}

function calculatePossibleMoves(selectedPiece) { // returns list of areas for input collision. TODO: remember to clear list on 'piece.isSelected' listener, when piece is put down.
    // _dev - assignment of dices for tests.
    // [die1, die2] = [2, 4];

    let selectedPiecePosition = selectedPiece.position;
    possiblePositionsToDropPiece = []; // List of available positions, containing the current position, in case player wants to drop the piece on the same spot.

    let opponent = (selectedPiece.color === 'white')? 'black': 'white';

    // List of available availableMoves, according to dice and selectedPiece position. '+' for white player, '-' for black player.
    let moves = [];
    if (die1 === die2) { // Checks for pair.
        for (let i = 1; i <= availableMoves; i++) {
            moves.push((activePlayer === 'white')? selectedPiecePosition + i * die1 : selectedPiecePosition - (i * die1));
        }
    } else { // TODO: Monitor and solve pair issue.1
        moves.push((activePlayer === 'white')? selectedPiecePosition + die1 : selectedPiecePosition - die1);
        moves.push((activePlayer === 'white')? selectedPiecePosition + die2 : selectedPiecePosition - die2);
        moves.push((activePlayer === 'white')? selectedPiecePosition + die1 + die2 : selectedPiecePosition - (die1 + die2));
    }

    // TODO: write function checkForScoring -> check if all pieces of active_player are in the last field;
    // TODO:                                -> check if there are pieces in the out positions for active_player;
    // TODO: If checkForScoring == true -> possible moving to the score box
    // TODO:                       else -> this move is removed from possible moves <- IMPORTANT
    // checkForScoring();

    // Array of booleans, checking if the target position is free, occupied by same team pieces, occupied by 1 opponent team piece or occupied by more opponent pieces.
    let possibleMoves = [];
    if (moves[0] >= 0 && moves[0] <= 23) {
       possibleMoves.push(
           (board[moves[0]].occupiedBy === 'none' ||
            board[moves[0]].occupiedBy === selectedPiece.color ||
            board[moves[0]].occupiedBy === opponent && board[moves[0]].piecesOn.length === 1))
    } else {
        possibleMoves.push(false);
    }

    if (moves[1] >= 0 && moves[1] <= 23) {
        possibleMoves.push(
            (board[moves[1]].occupiedBy === 'none' ||
            board[moves[1]].occupiedBy === selectedPiece.color ||
            board[moves[1]].occupiedBy === opponent && board[moves[1]].piecesOn.length === 1)
        )
    } else {
         possibleMoves.push(false);
    }

    if (moves[2] >= 0 && moves[2] <= 23) {
        possibleMoves.push(
            (possibleMoves[0] || possibleMoves[1]) &&
            (board[moves[2]].occupiedBy === 'none' ||
            board[moves[2]].occupiedBy === selectedPiece.color ||
            board[moves[2]].occupiedBy === opponent && board[moves[2]].piecesOn.length === 1)
        )
    } else {
        possibleMoves.push(false);
    }

    // Adding [0-3] possible positions to the list.
    for (let i = 0; i < 3; i++) {
        if (possibleMoves[i]) {
            possiblePositionsToDropPiece.push(moves[i]);
        }
    }

    console.log(possiblePositionsToDropPiece);
}

function CalculatePossibleMovesForPieceOut(selectedPiece) {

}
function evaluateMove(position) {
    let moveDistance = Math.abs(position - selectedPiece.position);
    if (die1 === die2) {
        if (moveDistance > die1 * 3) {
            return 4;
        } else if (moveDistance > die1 * 2) {
            return 3;
        } else if (moveDistance > die1) {
            return 2;
        } else {
            return 1;
        }
    } else {
        if (moveDistance === (die1 + die2)) {
            return 2;
        } else {
            (moveDistance === die1) ? die1 = 0 : die2 = 0; // Removing the used die.
            return 1;
        }
    }
}

function checkForScoring() {

}

function dropPiece(x, y) {

    for (let position of possiblePositionsToDropPiece) {
        let dropX = x;
        let dropY = y;

        if (
            (position <= 11 && board[position].x.start <= dropX
            && board[position].x.end >= dropX
            && board[position].y.start <= dropY
            && board[position].y.end >= dropY)
            ||
            (position > 11 && board[position].x.start <= dropX
            && board[position].x.end >= dropX
            && board[position].y.start >= dropY
            && board[position].y.end <= dropY)
        ) {

            checkForOpponentOnPosition(position);

            let piece = pieceBuilder(selectedPiece.color, position);
            piece.id = selectedPiece.id;
            board[position].piecesOn.push(piece);
            board[position].occupiedBy = activePlayer;

            return evaluateMove(position);
        }
    }
    let originalPosition = selectedPiece.position;
    let piece = pieceBuilder(selectedPiece.color, originalPosition);
    piece.id = selectedPiece.id;
    board[originalPosition].piecesOn.push(piece);
    board[originalPosition].occupiedBy = piece.color;
    return 0;
}

function checkForOpponentOnPosition(position) {
    if (board[position].piecesOn.length == 1
        && board[position].occupiedBy != activePlayer){
        let pieceOut = board[position].piecesOn.pop();
        let color = activePlayer == 'white' ? 'black' : 'white';

        pieceOut.inPlay = false;
        pieceOut.x.start = out.get(color).x.start;
        pieceOut.y.start = out.get(color).y.start;

        out.get(color).piecesOn.push(pieceOut);
        
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

    renderStaticPieces();
}

function initPiece(color, position) {
    let piece = pieceBuilder(color, position);
    board[position].piecesOn.push(piece);
    if (board[position].occupiedBy === 'none') board[position].occupiedBy = piece.color;
}

function pieceBuilder(color, position) {
    let PIECE_SIDE = 45;
    let PIECE_SELECTED_SIDE = 60;
    let OFFSET_LEFT = (POSITION_WIDTH - PIECE_SIDE) / 2;
    pieceCounter++;

    let xStart = board[position].x.start + OFFSET_LEFT,
        xEnd = function() {
            return this.start + PIECE_SIDE;
        };
    let yStart = (function () { // Positions up to 5 pieces on the position. TODO: implement indication in case of more then 5 pieces.
            let piecesOnPosition = board[position].piecesOn.length;
            if (piecesOnPosition >= 5) {
                return - 800;
            } else {
                if (position < 12) {
                    return board[0].y.start + piecesOnPosition * PIECE_SIDE;
                } else {
                    return (board[12].y.start - PIECE_SIDE) - piecesOnPosition * PIECE_SIDE;
                }
            }
        })(),
        yEnd = function() {
            return this.start + PIECE_SIDE;
        };

    let piece = {
        id: color + pieceCounter,
        color: color,
        x: {start: xStart, end: xEnd},
        y: {start: yStart, end: yEnd},
        position: position,
        side: PIECE_SIDE,
        selectedSide: PIECE_SELECTED_SIDE,
        img: document.getElementById(color + '-piece'),
        inPlay: true,
        active: false,
        selected: false,
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
}

function renderStaticPieces() {
    for (let position of board) {
        for (let piece of position.piecesOn) {
            let image = piece.img,
                x = piece.x.start,
                y = piece.y.start,
                side = piece.side;

            ctx.drawImage(image, x, y, side, side);
        }
    }
}

function renderOutPieces() {
    if (out.get('white').piecesOn.length > 0){
        for (let piece of out.get('white').piecesOn){
            let image = piece.img,
                x = piece.x.start,
                y = piece.y.start,
                side = piece.side;

            ctx.drawImage(image, x, y, side, side);
        }
    }
    if (out.get('black').piecesOn.length > 0){
        for (let piece of out.get('black').piecesOn){
            let image = piece.img,
                x = piece.x.start,
                y = piece.y.start,
                side = piece.side;

            ctx.drawImage(image, x, y, side, side);
        }
    }
}

function renderSelectedPiece() {
    let image = selectedPiece.img,
        pieceOffset = selectedPiece.side / 2,
        x = cursorX - pieceOffset,
        y = cursorY - pieceOffset,
        side = selectedPiece.side;

    ctx.drawImage(image, x, y, side, side);
}

//******************************************************************************
// Raly - Rolling dice
//******************************************************************************

function rollDiceForTurn() {
    let[rollWhiteDice, whiteDiceImage] = [0, ''];
    let[rollBlackDice, blackDiceImage] = [0, ''];
    
    whiteDice = rollWhiteDice;
    blackDice = rollBlackDice;

    while (whiteDice == blackDice){
        [whiteDice, whiteDiceImage] = roll('white');
        [blackDice, blackDiceImage] = roll('black');
    }

    drawDice(whiteDiceImage, blackDiceImage, [200, 275], [570, 275]);
    
    let firstPlayer = '';
    if (whiteDice > blackDice) {
        firstPlayer = 'white';
    }
    else {
        firstPlayer = 'black';
    }
    activePlayer = firstPlayer;
    // return firstPlayer;
}

function rollDiceForPlay() {
    spentMoves = 0;
    let[die1Roll, dieImage1Roll] = roll(activePlayer);
    let[die2Roll, dieImage2Roll] = roll(activePlayer);

    die1 = 2;
    die2 = 2;
    dieImage1 = dieImage1Roll;
    dieImage2 = dieImage2Roll;


    // let dieImage1 = new Image();
    // let dieImage2 = new Image();
    // die1 = 2;
    // die2 = 2;
    // dieImage1.src = 'resources/blackDice2.png';
    // dieImage2.src = 'resources/blackDice2.png';

    console.log('_DEV_PLAYER_MOVES whiteDice:' + die1 + '; blackDice: ' + die2);
    (die1 === die2)? availableMoves = 4 : availableMoves = 2;
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
    ctx.drawImage(dieImage1, diePosition1[0], diePosition1[1], 70, 70);
    ctx.drawImage(dieImage2, diePosition2[0], diePosition2[1], 70, 70);
}



