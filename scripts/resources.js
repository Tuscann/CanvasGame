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

                return selectedPiece;
            }
        }
    }

    return false;
}

function selectingOutPiece(x, y) {
    console.log(out.get(activePlayer).piecesOn);
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
    else{
        out.get(activePlayer).piecesOn.push(piece);
        console.log(out.get(activePlayer).piecesOn);
    }
    return false;
}

function startTurn() {
    rollDiceForPlay();
    render();
}
function endTurn() {
    if (winner) {
        endGame();
    } else {
        (activePlayer === 'white')? activePlayer = 'black' : activePlayer = 'white';
        updateActivePlayerInHtml();
        startTurn();
    }
}

function updateActivePlayerInHtml() {
    if (activePlayer === 'white') {
        $('.player-turn').css('top', '80px');
    } else {
        $('.player-turn').css('top', '240px');
    }
}

function countScore() {
    if (board[24].piecesOn.length === 15) {
        return 'white';
    } else if (board[25].piecesOn.length === 15) {
        return 'black';
    } else {
        return false;
    }
}

function endGame() {
    removeListeners();
}

function removeListeners() {
    document.getElementById('myCanvas').removeEventListener('click', function () {
        console.log('Removing click listener');
    }, false);
    window.removeEventListener('mousemove', function() {
        console.log('Removing mousemove listener');
    }, false);
}

function calculatePossibleMoves() { // returns list of areas for input collision.
    // _dev - assignment of dices for tests.
    // [die1, die2] = [2, 4];

    let selectedPiecePosition = selectedPiece.position;
    availableMoves = []; // List of available positions, containing the current position, in case player wants to drop the piece on the same spot.

    let opponent = (selectedPiece.color === 'white')? 'black': 'white';

    // List of available availableMovesAmount, according to dice and selectedPiece position. '+' for white player, '-' for black player.
    let moves = [];
    let possibleMoves = [];     // Array of booleans, checking if the target position is free, occupied by same team pieces, occupied by 1 opponent team piece or occupied by more opponent pieces.
    let allPiecesAtHome = areAllPiecesAtHome();
    if (allPiecesAtHome) {
        let ableToRemoveThisPiece;
        if (die1 === die2) {
            ableToRemoveThisPiece = (activePlayer === 'white')? die1 + selectedPiece.position === 24 : die1 === selectedPiece.position + 1;
        } else {
            let isAbleToRemoveWithDie1 = (activePlayer === 'white')? die1 + selectedPiece.position === 24 : die1 === selectedPiece.position + 1;
            let isAbleToRemoveWithDie2 = (activePlayer === 'white')? die2 + selectedPiece.position === 24 : die2 === selectedPiece.position + 1;
            ableToRemoveThisPiece = isAbleToRemoveWithDie1 || isAbleToRemoveWithDie2;
        }

        if (ableToRemoveThisPiece) {
            if (activePlayer === 'white'){
                availableMoves.push(24);
            } else {
                availableMoves.push(25);
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
        if (die1 != Number.POSITIVE_INFINITY){
            moves.push((activePlayer === 'white')? selectedPiecePosition + die1 : selectedPiecePosition - die1);
        }
        if (die2 != Number.POSITIVE_INFINITY){
            moves.push((activePlayer === 'white')? selectedPiecePosition + die2 : selectedPiecePosition - die2);
        }
        if (die1 != Number.POSITIVE_INFINITY && die2 != Number.POSITIVE_INFINITY){
            moves.push((activePlayer === 'white')? selectedPiecePosition + die1 + die2 : selectedPiecePosition - (die1 + die2));
        }

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

    let noValidMoves = availableMoves.length === 0;
    if (noValidMoves && allPiecesAtHome) {
        if (isSelectedPieceHighest()) {
            availableMoves.push((activePlayer === 'white') ? 24 : 25);
        }
    }

    console.log(availableMoves);
}

function isSelectedPieceHighest() {
    let occupiedPositions = board.filter(position => position.occupiedBy === activePlayer);
    let highestPosition = (activePlayer === 'white')? occupiedPositions[0].index : occupiedPositions[occupiedPositions.length - 1].index;

    return selectedPiece.position === highestPosition;
}

function areAllPiecesAtHome() {

    let minPosition;
    let maxPosition;
    if (activePlayer === 'white') {
        minPosition = 18;
        maxPosition = 23;
    } else {
        minPosition = 0;
        maxPosition = 5;
    }

    for (let position of board) {
        let inHome = position.index >= minPosition && position.index <= maxPosition;
        if (position.occupiedBy === activePlayer && !inHome) {
            return false;
        }
    }

    return true;
}

function CalculatePossibleMovesForPieceOut(selectedPiece) {
    
    let opponent = (selectedPiece.color === 'white')? 'black': 'white';

    availableMoves = [];
    let moves = [];
    let possibleMoves = [];

    if (die1 === die2 && die1 != Number.POSITIVE_INFINITY) { // Checks for pair.
        let move = ((activePlayer === 'white') ? die1 - 1 : 24 - die1);

        let possibleMove =  board[move].occupiedBy === 'none' ||
                            board[move].occupiedBy === selectedPiece.color ||
                            (board[move].occupiedBy === opponent && board[move].piecesOn.length === 1);

        if (possibleMove){
            for (let i = 0; i < 4; i++){
                availableMoves.push(move);
            }
        }

        console.log(availableMoves);
    } else {
        console.log(die1);
        console.log(die2);
        if (die1 != Number.POSITIVE_INFINITY){
            moves.push((activePlayer === 'white')? die1 - 1 : 24 - die1);
        }

        if (die2 != Number.POSITIVE_INFINITY){
            moves.push((activePlayer === 'white')? die2 - 1 : 24 - die2);
        }

        for (let move of moves){
            console.log(move);
            possibleMoves.push(
                (board[move].occupiedBy === 'none' ||
                board[move].occupiedBy === selectedPiece.color ||
                board[move].occupiedBy === opponent && board[move].piecesOn.length === 1)
            )
        }

        for (let i = 0; i < possibleMoves.length; i++){
            if (possibleMoves[i]){
                availableMoves.push(moves[i]);
            }
        }

        console.log(availableMoves);
    }

    if (availableMoves.length === 0){
        //alert('No possible moves.');
        let piece = pieceBuilder(activePlayer, 0);
        dropPieceToOutBox(piece, activePlayer);        
    }
}

function evaluateMove(position, startPosition) {
    if (position > 23) { // If moving to Score position.
        if (die1 !== die2) (startPosition + die1 === 24 || startPosition - die1 === -1)? die1 = Number.POSITIVE_INFINITY : die2 = Number.POSITIVE_INFINITY;
        return 1;
    }
    let moveDistance = Math.abs(position - startPosition);

    if (!selectedPiece.inPlay){
        moveDistance++;
    }

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

function dropPiece(x, y) {
    for (let position of availableMoves) {
        let dropX = x;
        let dropY = y;

        if (
            ((position <= 11 || position === 25)
                && board[position].x.start <= dropX
                && board[position].x.end >= dropX
                && board[position].y.start <= dropY
                && board[position].y.end >= dropY)
            ||
            (position > 11
                && board[position].x.start <= dropX
                && board[position].x.end >= dropX
                && board[position].y.start >= dropY
                && board[position].y.end <= dropY)
        ) {
            let startPosition = selectedPiece.position;
            let piece;
            if (position > 23) {
                let xSide = 40;
                let ySide = 25;
                let xPiece = board[position].x.start;
                let yPiece;
                let img;
                if (position === 24) {
                    yPiece = (board[position].y.start - 15) - (board[position].piecesOn.length * 12) - 1; // Starting down -> going up.
                    img = document.getElementById('white-piece-score');
                    updateScore(24);
                } else {
                    yPiece = (board[position].y.start - 10) + (board[position].piecesOn.length * 12) + 1; // Starting top -> going down.
                    img = document.getElementById('black-piece-score');
                }

                piece = selectedPiece;
                piece.x.start = xPiece;
                piece.y.start = yPiece;
                piece.side = {x: xSide, y: ySide};
                piece.img = img;
                piece.position = position;
            } else {
                checkForOpponentOnPosition(position);
                piece = pieceBuilder(selectedPiece.color, position);
            }

            if (board[startPosition].piecesOn.length == 0){
                board[startPosition].occupiedBy = 'none';
            }

            piece.id = selectedPiece.id;
            board[position].piecesOn.push(piece);
            updateScore();
            if (board[position].occupiedBy) board[position].occupiedBy = activePlayer;

            return evaluateMove(position, startPosition);
        }
    }
    let originalPosition = selectedPiece.position;
    let piece = pieceBuilder(selectedPiece.color, originalPosition);
    piece.id = selectedPiece.id;
    board[originalPosition].piecesOn.push(piece);
    board[originalPosition].occupiedBy = piece.color;

    return 0;
}

function updateScore() {
    let domScore;
    let score;
    if (activePlayer === 'white') {
        domScore = $('#player-a-score');
        score = board[24].piecesOn.length;
    } else {
        domScore = $('#player-b-score');
        score = board[25].piecesOn.length;
    }

    domScore.text(score);
}

function dropPieceBackToGame(x, y) {
    console.log(availableMoves);
    for (let position of availableMoves) {
        let dropX = x;
        let dropY = y;

        if (
            (position <= 11
            && board[position].x.start <= dropX
            && board[position].x.end >= dropX
            && board[position].y.start <= dropY
            && board[position].y.end >= dropY)
            ||
            (position > 11
            && board[position].x.start <= dropX
            && board[position].x.end >= dropX
            && board[position].y.start >= dropY
            && board[position].y.end <= dropY)
        ) {
            let piece;

            checkForOpponentOnPosition(position);
            piece = pieceBuilder(selectedPiece.color, position);

            piece.id = selectedPiece.id;
            piece.inPlay = true;
            board[position].piecesOn.push(piece);
            if (board[position].occupiedBy) board[position].occupiedBy = activePlayer;

            let startPosition = activePlayer == 'white' ? 0 : 23;
            return evaluateMove(position, startPosition);
        }
    }
    
    let piece = pieceBuilder(selectedPiece.color, 0);
    dropPieceToOutBox(piece, selectedPiece.color);
    
    return 0;
}

function dropPieceToOutBox(piece, color) {
    piece.id = selectedPiece.id;
    piece.position = 'out';
    piece.inPlay = false;
    piece.x.start = out.get(color).x.start;
    piece.y.start = out.get(color).y.start;

    out.get(piece.color).piecesOn.push(piece);
}

function checkForOpponentOnPosition(position) {
    if (board[position].piecesOn.length == 1
        && board[position].occupiedBy != activePlayer){
        let pieceOut = board[position].piecesOn.pop();
        let color = activePlayer == 'white' ? 'black' : 'white';

        dropPieceToOutBox(pieceOut, color);
    }
} 

function setupGame() {
    // initPiece('white', 0);
    // initPiece('white', 0);


    // Score testing
    // initPiece('white', 23);
    // initPiece('white', 23);
    //
    // initPiece('white', 22);
    // initPiece('white', 22);
    // initPiece('white', 22);
    // initPiece('white', 22);
    // initPiece('white', 21);
    //
    // initPiece('white', 21);
    // initPiece('white', 20);
    // initPiece('white', 20);
    //
    // initPiece('white', 19);
    // initPiece('white', 19);
    // initPiece('white', 18);
    // initPiece('white', 18);
    // initPiece('white', 18);
    //
    // initPiece('black', 0);
    // initPiece('black', 0);
    //
    // initPiece('black', 1);
    // initPiece('black', 1);
    // initPiece('black', 1);
    // initPiece('black', 1);
    // initPiece('black', 2);
    //
    // initPiece('black', 2);
    // initPiece('black', 3);
    // initPiece('black', 3);
    //
    // initPiece('black', 4);
    // initPiece('black', 4);
    // initPiece('black', 4);
    // initPiece('black', 4);
    // initPiece('black', 4);

    //Real game setup.
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
        return (activePlayer === 'white')? (position >= 18 && position <= 23) : (position >= 0 && position <= 5);
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
            if (piece.position > 23) {
                let image = piece.img;
                let xSide = piece.side.x;
                let ySide = piece.side.y;
                let x = piece.x.start;
                let y = piece.y.start;

                ctx.drawImage(image, x, y, xSide, ySide);
            } else {
                let image = piece.img,
                    x = piece.x.start,
                    y = piece.y.start,
                    side = piece.side;

                ctx.drawImage(image, x, y, side, side);
            }
        }
        if (position.piecesOn.length > 5 && position.index !== 24 && position.index !== 25) {
            renderPlus(position);
        }
    }
}

function renderPlus(position) {
    ctx.font = '40px Monospace';
    ctx.fillStyle = (position.occupiedBy === 'white')? 'black' : 'white';
    if (position.index < 12) {
        ctx.fillText('+', position.x.start + 16, position.y.end - 35);
    } else {
        ctx.fillText('+', position.x.start + 16, position.y.end + 60);
    }

}

function drawEndGame() {
    ctx.fillStyle = 'gray';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let colorCubeWidth = 500,
        colorCubeHeight = 200,
        colorCubeX = (CANVAS_WIDTH - colorCubeWidth) / 2,
        colorCubeY = (CANVAS_HEIGHT - colorCubeHeight) / 2;

    ctx.fillStyle = winner;
    ctx.globalAlpha = 1;
    ctx.fillRect(colorCubeX, colorCubeY, colorCubeWidth, colorCubeHeight);

    ctx.fillStyle = (winner === 'white')? 'black' : 'white';
    ctx.font = '40px Monospace';
    ctx.fillText('BACKGAMMON.js:', colorCubeX + 15, colorCubeY + 50);
    ctx.font = '25px Monospace';
    ctx.fillText('Winner = function() {', colorCubeX + 15, colorCubeY + 10);
    ctx.fillText('    return this.color + \'Player\'', colorCubeX + 15, colorCubeY + 140);
    ctx.fillText('}', colorCubeX + 15, colorCubeY + 180);
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

function rollDiceForTurn(callback) {
    let[rollWhiteDice, whiteDiceImage] = [0, ''];
    let[rollBlackDice, blackDiceImage] = [0, ''];
    
    whiteDice = rollWhiteDice;
    blackDice = rollBlackDice;

    while (whiteDice == blackDice){
        [whiteDice, whiteDiceImage] = roll('white');
        [blackDice, blackDiceImage] = roll('black');
    }

    ctx.drawImage(whiteDiceImage, 200, 275, 70, 70);
    ctx.drawImage(blackDiceImage, 570, 275, 70, 70);

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

function drawDice() {
    ctx.drawImage(dieImage1, DIE_COORDINATES_1[0], DIE_COORDINATES_1[1], 60, 60);
    ctx.drawImage(dieImage2, DIE_COORDINATES_2[0], DIE_COORDINATES_2[1], 60, 60);
}

function centerGame() {
    let windowWidth = $(window).width();
    canvasOffsetLeft = (windowWidth - CANVAS_WIDTH) / 2;
    $('#content').css('margin-left', '-' + (windowWidth - canvasOffsetLeft) + 'px');
}

