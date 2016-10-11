"use strict";
$(function() {

    $('#start').click(function() {

        $('#form').hide();
        $('.players').show();

        // let windowWidth = screen.width;
        let windowWidth = $(window).width();
        canvasOffsetLeft = (windowWidth - CANVAS_WIDTH) / 2;
        $('#left').css('width', canvasOffsetLeft + 'px');

    });

    document.getElementById('myCanvas').addEventListener('click', getMouseClickLocation, false);

    $('myCanvas').onmousemove = function(event) {
        cursorX = event.pageX - canvasOffsetLeft;
        cursorY = event.pageY - CANVAS_OFFSET_TOP;
    }
});
