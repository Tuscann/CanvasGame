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
    render();
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
    availableMoves = []; // List of available positions, containing the current position, in case player wants to drop the piece on the same spot.

    let opponent = (selectedPiece.color === 'white')? 'black': 'white';

    // TODO: write function checkForScoring -> check if all pieces of active_player are in the last field;
    // TODO:                                -> check if there are pieces in the out positions for active_player;
    // TODO: If checkForScoring == true -> possible moving to the score box
    // TODO:                       else -> this move is removed from possible moves <- IMPORTANT
    // checkForScoring();

    // List of available availableMovesAmount, according to dice and selectedPiece position. '+' for white player, '-' for black player.
    let moves = [];
    let possibleMoves = [];     // Array of booleans, checking if the target position is free, occupied by same team pieces, occupied by 1 opponent team piece or occupied by more opponent pieces.
    if (allPiecesAtHome()) {
        if (die1 === die2) {

        } else {
            let isAbleToRemoveWithDie1 = (activePlayer === 'white')? die1 + selectedPiece.position === 24 : die1 === selectedPiece.position + 1;
            let isAbleToRemoveWithDie2 = (activePlayer === 'white')? die2 + selectedPiece.position === 24 : die2 === selectedPiece.position + 1;
            if (isAbleToRemoveWithDie1 || isAbleToRemoveWithDie2) {
                (activePlayer === 'white')? availableMoves.push(24) : availableMoves.push(25);
            }
        }
    }

    if (die1 === die2) { // Checks for pair.
        for (let i = 1; i <= availableMovesAmount; i++) {
            moves.push((activePlayer === 'white')? selectedPiecePosition + i * die1 : selectedPiecePosition - (i * die1));
        }

        for (let move of moves) {
            if (move >= 0 && move <= 23) {
                possibleMoves.push(
                    (board[move].occupiedBy === 'none' ||
                    board[move].occupiedBy === selectedPiece.color ||
                    board[move].occupiedBy === opponent && board[move].piecesOn.length === 1)
                )
            } else {
                possibleMoves.push(false);
            }
            if (possibleMoves[possibleMoves.length - 1] === false) {
                break;
            }
        }
    } else {
        moves.push((activePlayer === 'white')? selectedPiecePosition + die1 : selectedPiecePosition - die1);
        moves.push((activePlayer === 'white')? selectedPiecePosition + die2 : selectedPiecePosition - die2);
        moves.push((activePlayer === 'white')? selectedPiecePosition + die1 + die2 : selectedPiecePosition - (die1 + die2));

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
    }

    // Adding [0-3] possible positions to the list.
    for (let i = 0; i < 4; i++) {
        if (possibleMoves[i]) {
            availableMoves.push(moves[i]);
        }
    }

    console.log(availableMoves);
}

function allPiecesAtHome() {
    for (let i = 0, n = board.length; i < n; i++) {
        let position = board[i];
        for (let y = 0, m = board[i].occupiedBy.length; i < m; i++) {
            let piece = position.occupiedBy[y];
            if (piece.inPlay && !piece.inHome()) {
                return false;
            }
        }
    }

    return true;
}

function evaluateMove(position) {
    if (position > 23) { // If moving to Score position.
        return 1;
    }
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
            (moveDistance === die1) ? die1 = Number.POSITIVE_INFINITY : die2 = Number.POSITIVE_INFINITY; // Setting used die to invalid value.
            return 1;
        }
    }
}

// function checkForScoring() {
//
// }

function dropPiece(x, y) {
    for (let position of availableMoves) {
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
            let piece;
            if (position > 23) {
                let xSide = 40;
                let ySide = 10;
                let xPiece = board[position].x.start;
                let yPiece = board[position].y.start + (board[position].piecesOn.length * ySide) + 1;

                piece = selectedPiece;
                piece.x.start = xPiece;
                piece.y.start = yPiece;
                piece.side = {x: xSide, y: ySide};
                piece.position = position;
            } else {
                piece = pieceBuilder(selectedPiece.color, position);
            }
            piece.id = selectedPiece.id;
            board[position].piecesOn.push(piece);
            if (board[position].occupiedBy) board[position].occupiedBy = activePlayer;

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
    let inHome = function() {
        let position = this.position;
        return (position >= 18 && position <= 23);
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
        inHome: inHome,
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
            if (piece.position > 23) { //TODO: Confirm if working...
                let x = piece.x.start;
                let y = piece.y.start;
                let xSide = piece.side.x;
                let ySide = piece.side.y;

                ctx.fillStyle = 'white';
                ctx.fillRect(x, y, xSide, ySide);
            } else {
                let image = piece.img,
                    x = piece.x.start,
                    y = piece.y.start,
                    side = piece.side;

                ctx.drawImage(image, x, y, side, side);
            }
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

function rollDiceForTurn(callback) {
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

    setTimeout(function() {
        activePlayer = firstPlayer;
        callback();
    }, 3000);

    // activePlayer = firstPlayer;
    // return firstPlayer;
}

function rollDiceForPlay() {
    spentMoves = 0;
    let[die1Roll, dieImage1Roll] = roll(activePlayer);
    let[die2Roll, dieImage2Roll] = roll(activePlayer);

    die1 = die1Roll;
    die2 = die2Roll;
    dieImage1 = dieImage1Roll;
    dieImage2 = dieImage2Roll;

    console.log('_DEV_PLAYER_MOVES whiteDice:' + die1 + '; blackDice: ' + die2);
    (die1 === die2)? availableMovesAmount = 4 : availableMovesAmount = 2;
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



