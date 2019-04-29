$(function() {

    $(function closeHeaderPopup () {
        $('.header__popup-close-js').click(function() {
            $('.header__popup').slideUp('slow', function() {});
        });
    });

});