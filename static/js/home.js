//smooth scrolling 
$(document).ready(function() {
    
    'use strict';
    
    // Select all links with hashes
    $('.nav-item, #scroll-to-top')
      .click(function(event) {
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
          && 
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        }
      });
});

//Add bx slider
$(document).ready(function() {  // нужно отцентровать div со слайдером
  $('.bxslider').bxSlider({
      slideWidth: 400,
      auto: true,
      minSlides: 1,
      maxSlides: 1,
      slideMargin: 50,
      shrinkItems: true
  });
});

// // auto submit photo
// $('#upload-photo').change(function(){
//   let frm = document.getElementById("form-photo");
//   frm.submit();
// })

// function chooseFile() {
//   console.log('here 1')
//   $("#upload-photo").click();
// }