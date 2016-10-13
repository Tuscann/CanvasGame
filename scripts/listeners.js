"use strict";
$(function() {
    $('#show-board').click(function() {

        // $('#form').hide();
        $('.players').show();
        $('#start-game').show();

        let whiteName = $('#player-a-form').val();
        let blackName = $('#player-b-form').val();
        $('#player-a-name').text(whiteName);
        $('#player-b-name').text(blackName);

        $('#form').css('position', 'absolute');
        // let windowWidth = screen.width;
        centerGame();
        // window.addEventListener('resize', centerGame(), false);

    });

    $('#start-game').click(function() {
        setupGame();
        rollDiceForTurn(startTurn); // Callback to delay Rolling of DiceForPlay();
        $('#start-game').hide();

        document.getElementById('left').onmousedown = function () { return false; }; // Disable random selection ouside of canvas.
    });

    document.getElementById('myCanvas').addEventListener('click', getMouseClickLocation, false);
    window.addEventListener('mousemove', function(event) {
        cursorX = event.pageX - canvasOffsetLeft;
        cursorY = event.pageY - CANVAS_OFFSET_TOP;
    });

    // window.addEventListener('resize', centerGame(), false);

});
