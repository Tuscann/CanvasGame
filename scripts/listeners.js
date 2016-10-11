"use strict";
$(function() {

    $('#start').click(function() {

        $('#form').hide();
        $('.players').show();

        // let windowWidth = screen.width;
        let windowWidth = $(window).width();
        // canvasOffsetLeft = (windowWidth - CANVAS_WIDTH) / 2;
        canvasOffsetLeft = 200;
        $('#left').css('width', canvasOffsetLeft + 'px');

    });

    document.getElementById('myCanvas').addEventListener('click', getMouseClickLocation, false);

    window.addEventListener('mousemove', function(event) {
        cursorX = event.pageX - canvasOffsetLeft;
        cursorY = event.pageY - CANVAS_OFFSET_TOP;
    });
});
