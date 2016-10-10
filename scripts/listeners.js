"use strict";
$(function() {

    $('#start').click(function() {
        console.log('Showing..Hiding...');

        $('#form').hide();
        $('.players').show();
        $('#game').css('display', 'inline-block');
    });
});
