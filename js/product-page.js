var $animationElements = $('.slide-in');
var $window = $(window);

function checkIfInView() {
  var windowHeight = $window.height();
  var windowTopPosition = $window.scrollTop();
  var windowBottomPosition = (windowTopPosition + windowHeight);
 
  $.each($animationElements, function() {
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);
 
    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) &&
        (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('in-view');
    }
  });
}

$window.on('scroll resize', checkIfInView);
$window.trigger('scroll');