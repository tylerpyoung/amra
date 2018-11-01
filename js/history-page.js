(function() {
  // define variables
  var items = document.querySelectorAll(".history-timeline-posts");

  // check if an element is in viewport
  function elementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function onEventLoadElement() {
    for (var i = 0; i < items.length; i++) {
      if (elementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", onEventLoadElement);
  window.addEventListener("resize", onEventLoadElement);
  window.addEventListener("scroll", onEventLoadElement);

})();