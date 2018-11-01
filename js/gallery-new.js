jQuery(document).ready(function ($) {
  if ($('#gallery').length) {
    var $galleryGrid = $('#gallery').imagesLoaded( function() {
    // init Masonry after all images have loaded
     $galleryGrid.masonry({
       itemSelector: '.gallery-item',
       columnWidth: '.grid-sizer',
       gutter: '.gutter-sizer'
    });
      $galleryGrid.imagesLoaded(function() {
        $galleryGrid.css({opacity: 0}).animate({opacity: 1}, 400);
        $galleryGrid.masonry('layout');
      });
    });
    $('#gallery').photoSwipe();
  }
});
