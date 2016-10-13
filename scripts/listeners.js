"use strict";
$(function() {
    $('#show-board').click(function() {

        $('#form').hide();
        $('.players').show();
        $('#start-game').show();


        // let windowWidth = screen.width;
        let windowWidth = $(window).width();
        // canvasOffsetLeft = (windowWidth - CANVAS_WIDTH) / 2;
        canvasOffsetLeft = 200;
        $('#left').css('width', canvasOffsetLeft + 'px');

    });

    $('#start-game').click(function() {
        setupGame();
        rollDiceForTurn(startTurn); // Callback to delay Rolling of DiceForPlay();
        $('#start-game').hide();
    });

    document.getElementById('myCanvas').addEventListener('click', getMouseClickLocation, false);
    window.addEventListener('mousemove', function(event) {
        cursorX = event.pageX - canvasOffsetLeft;
        cursorY = event.pageY - CANVAS_OFFSET_TOP;
    });

    document.getElementById('left').onmousedown = function () { return false; }; // Disable random selection ouside of canvas.
});
