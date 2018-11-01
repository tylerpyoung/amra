jQuery(document).ready(function ($) {
  // $('#vehicleModal').modal('show');
  // $('#wizardModal').modal('show');

  (function() {
  // define variables
    var items = document.querySelectorAll(".timeline li");

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

  function onEventShowElement() {
    for (var i = 0; i < items.length; i++) {
      if (elementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", onEventShowElement);
  window.addEventListener("resize", onEventShowElement);
  window.addEventListener("scroll", onEventShowElement);

})();

  $('.enable-after-ready').attr('disabled', false);

  var isWindows = false;
  var isMobile = false;
  var isiPhone = false;
  if (window.navigator.platform.substring(0,3) == "Win") {
    isWindows = true;
  }
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isMobile = true;
    $('body').addClass('is-mobile');
  }
  if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
    isiPhone = true;
  }

  // Navbar
  $('#navbarCollapse').on('shown.bs.collapse', function() {
    if (isMobile) {
      $('html, body').addClass('no-scroll-overflow');
    }
  });
  $('#navbarCollapse').on('hide.bs.collapse', function() {
    if (isMobile) {
      $('html, body').removeClass('no-scroll-overflow');
    }
  });
  // For animated nav icon https://codepen.io/designcouch/pen/Atyop
  $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
		$(this).toggleClass('open');
	});

  var attributeObj = {
    "finish": {
      "attribute_id": "2",
      "attribute_name": "finish",
      "attribute_label": "Finish",
      "attribute_type": "select",
      "attribute_orderby": "name",
      "attribute_public": "0",
      "taxonomy": "pa_finish",
      "filter_taxonomy": "filter_finish",
      "meta_name": "finish",
      "use_swatches": true,
      "has_products": true,
      "active": false,
      "terms": [
        {
          "term_id": 390,
          "name": "Black",
          "slug": "black",
          "count": 1,
          "swatch_color": "#0b0b0b",
          "active": false
        },
        {
          "term_id": 391,
          "name": "Blue",
          "slug": "blue",
          "count": 1,
          "swatch_color": "#1155cc",
          "active": true
        },
        {
          "term_id": 335,
          "name": "Charcoal Tint",
          "slug": "charcoal-tint",
          "count": 1,
          "swatch_color": "",
          "active": false
        },
        {
          "term_id": 392,
          "name": "Chrome",
          "slug": "chrome",
          "count": 1,
          "swatch_color": "#eaeaea",
          "active": false
        },
        {
          "term_id": 201,
          "name": "Chrome Plated",
          "slug": "chrome-plated",
          "count": 1,
          "swatch_color": "",
          "active": false
        },
        {
          "term_id": 397,
          "name": "Yellow",
          "slug": "yellow",
          "count": 1,
          "swatch_color": "#ffff00",
          "active": false
        }
      ]
    }
  }

  // Enable Tooltips
  $('[data-toggle="tooltip"]').tooltip();

  //Enable Popovers
  // $(function () {
  //   $('[data-toggle="popover"]').popover();
  // });

  $(function(){
      $('[data-toggle="popover"]:not([data-wp-filter])').popover();
      $('[data-toggle="popover"][data-wp-filter]').popover({
          html : true,
          content: function() {
            var filter = $(this).attr("data-wp-filter"); // 'finish'
            var filterAttributes = attributeObj[filter]['terms'];
            var html = '';
            for (var i = 0; i < filterAttributes.length; i++) {
              html += filterAttributes[i].name;
            }
            // html += "<div class='popover-footer'><button type='button' class='btn btn-primary' id='clear-"+filter+"-filters'>Clear</button><button type='button' class='btn btn-primary' id='apply-"+filter+"-filters'>Apply</button>";
            // PRICE:
            // html += "<input id='priceFilter' data-slider-id='priceFilterSlider' type='text' data-slider-min='0' data-slider-max='20' data-slider-step='1' data-slider-value='14'/><label for='customRange'>$100</label><label for='' class='float-right'>$900</label>";
            return html;
            // return 'html';
          },
          title: function() {
            var filter = $(this).attr("data-wp-filter");
            return attributeObj[filter]['attribute_label'];
          }
      });
  });


  //https://stackoverflow.com/questions/13205103/attach-event-handler-to-button-in-twitter-bootstrap-popover
  // when popover's content is shown
  $('[data-toggle="popover"][data-wp-filter]').on('shown.bs.popover', function() {
    $('#priceFilter2').slider({
    	formatter: function(value) {
    		return '$ ' + value;
    	}
    });
  });


  // when popover's content is hidden
    $('[data-toggle="popover"][data-wp-filter]').on('hidden.bs.popover', function(){
        // clear listeners
        // $("#my-button").off('click');
    });


  // Only show one popover at a time
  $('[data-toggle="popover"]').on('click', function (e) {
    $('[data-toggle="popover"]').not(this).popover('hide');
  });

  // Close popovers when clicking away
  $('body').on('click', function (e) {
    if (($(e.target).data('toggle') !== 'popover' && $(e.target).parent('[data-toggle="popover"]').length == 0) && $(e.target).closest('.popover').length  == 0) {
      $('[data-toggle="popover"]').popover('hide');
    }
    if (!$('li.dropdown').is(e.target)
    && $('li.dropdown').has(e.target).length === 0
    && $('.show').has(e.target).length === 0) {
        $('li.dropdown').removeClass('show');
        $('.dropdown-menu').removeClass('show');
        $('li.dropdown > a').attr('aria-expanded', false);
    }
  });

  $('[data-toggle="popover"]').on('shown.bs.popover', function(){
    var number = 0;
    $('#apply-brand-filters').click(function(){

    });
  });

  // Matchheight
  if ($('.matchHeight').length) {
    $('.matchHeight').matchHeight();
  }

  $('nav').on('click', 'a', function (e) {
    if ($(this).attr('href') == '#') e.preventDefault();
  })

  // Home Page Vehicle Search Box
  /*$('.tab-pane').matchHeight(false);
  $('.custom-toggle-item').matchHeight(false);*/

  // Brand Info Toggle Section
  $('.custom-toggle').click(function(){
    var activeItem = $('.custom-toggle-item.active').attr('id');
    var nextItem = $(this).data('toggle-item');
    if ((activeItem !== nextItem) && $('#'+nextItem).length) {
      $('.brand-item').removeClass('active');
      $(this).closest('.brand-item').addClass('active');
      $("html, body").animate({ scrollTop: $('#'+nextItem).closest('.custom-toggle-list').parent().offset().top - $('nav.fixed-top').outerHeight() }, 1000);
      $('#'+activeItem).fadeOut(150, function() {
        $('#'+activeItem).removeClass('active');
        $('#'+nextItem).fadeIn(150, function() {
          $('#'+nextItem).addClass('active');
        });
      });
    }
  });

// Product page
  // Product Image Carousel
  if ($('#saved-wheels-mobile').length) {
    $('#saved-wheels-mobile').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        waitForAnimate: false,
        centerMode: true,
        focusOnSelect: true,
        mobileFirst: true
    });
  }

  if ($('.finishes-image-carousel').length) {
    $('.finishes-image-carousel').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        waitForAnimate: false,
        infinite: true,
        prevArrow: '<button type="button" class="product-specs-carousel-button carousel-button-left"><i class="fal fa-angle-left"></i></button>',
        nextArrow: '<button type="button" class="product-specs-carousel-button carousel-button-right"><i class="fal fa-angle-right"></i></button>',
        responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
        ]
    });
  }

  if ($('.chosen-select').length) {
    $('.chosen-select').chosen({disable_search: true, inherit_select_classes: true});
  }

  // Specs Table Carousel
var specsSlides = $('#product-specs-carousel .product-specs-carousel-slide').length;
function specsSlickCheck() {
	// if( $(window).width() > 1214 ) {
	if( $(window).width() >= 1620 ) {
		if($('#product-specs-carousel').hasClass('slick-initialized')) {
		  setTimeout(function() {
			$('#product-specs-carousel').slick('unslick');
		  }, 100);
		}
	} else {
		if(!$('#product-specs-carousel').hasClass('slick-initialized')) {
			$('#product-specs-carousel').not('.slick-initialized').slick({
				dots: true,
				arrows: true,
				infinite: false,
				speed: 300,
				slidesToShow: (specsSlides > 6)? 6 : specsSlides,
				slidesToScroll: (specsSlides > 6)? 6 : 1,
				prevArrow: '<button type="button" class="product-specs-carousel-button carousel-button-left"><i class="fal fa-angle-left"></i></button>',
				nextArrow: '<button type="button" class="product-specs-carousel-button carousel-button-right"><i class="fal fa-angle-right"></i></button>',
				responsive: [
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4,
							arrows: true,
							dots: true,
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3,
							arrows: true,
							dots: true,
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
							arrows: true,
							dots: true,
						}
					}
				]
			});
		}
	}
}
specsSlickCheck(); // First run
$('#product-specs-header li a').click(function(e){
	e.preventDefault();
	var clickedDiameter = $(this).data('diameter');
	if( clickedDiameter ) {
		$('#product-specs-header li a.active').removeClass('active');
		$(this).addClass('active');
		$('#product-specs-carousel .product-specs-carousel-row.active').removeClass('active');
		$('#product-specs-carousel .product-specs-carousel-row[data-diameter="'+clickedDiameter+'"]').addClass('active');
    $('#product-specs-carousel .product-specs-carousel-slide').each(function(){
      var even_row = true;
      $(this).find('.product-specs-carousel-row.active').each(function(){
        if( even_row ) {
          $(this).addClass('even_row');
          even_row = false;
        } else {
          even_row = true;
        }
      });
    });
	}
  else if( $(this).attr('id') == 'specs-tab-vehicle' ) {
    $('#product-specs-header li a.active').removeClass('active');
    $(this).addClass('active');
    $('#product-specs-carousel .product-specs-carousel-row').removeClass('active even_row');
    $('#product-specs-carousel .product-specs-carousel-row.fits_vehicle').addClass('active');
    $('#product-specs-carousel .product-specs-carousel-slide').each(function(){
      var even_row = true;
      $(this).find('.product-specs-carousel-row.active').each(function(){
        if( even_row ) {
          $(this).addClass('even_row');
          even_row = false;
        } else {
          even_row = true;
        }
      });
    });
  }
	$.fn.matchHeight._update();
	return false;
});

// Window resize event
$(window).on('resize', function() {
	// console.log('Triggered: window resize');
	// $('#product-thumbs').each(function() {
	//   $(this).slick("getSlick").refresh();
	// });
  if ($('#product-thumbs').length)
    $('#product-thumbs').slick("getSlick").refresh();
	specsSlickCheck();
	$.fn.matchHeight._update();
});

// Match spec table row heights
$('.product-specs-carousel-head .product-specs-colhead').matchHeight({ byRow: false });
$('.product-specs-carousel-row').matchHeight({ byRow: false });

  /* OLD
  // Specs Table Carousel
	function specsSlickCheck($ele) {
		var specsSlides = $ele.find('.product-specs-carousel-slide').length;
		if($(window).width() >= 1620) {
			if($ele.hasClass('slick-initialized')) {
				setTimeout(function(){
					$ele.slick('unslick');
				}, 100);
			}
		}else{
			if(!$ele.hasClass('slick-initialized')) {
				$ele.not('.slick-initialized').slick({
					dots: false,
					arrows: true,
					infinite: false,
					speed: 300,
					slidesToShow: (specsSlides > 6)? 6 : specsSlides,
					slidesToScroll: (specsSlides > 6)? 6 : 1,
					prevArrow: '<button type="button" class="product-specs-carousel-button carousel-button-left"><i class="fal fa-angle-left"></i></button>',
					nextArrow: '<button type="button" class="product-specs-carousel-button carousel-button-right"><i class="fal fa-angle-right"></i></button>',
					responsive: [
						{
							breakpoint: 992,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 4,
								arrows: true,
								dots: false,
							}
						},
						{
							breakpoint: 600,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3,
								arrows: true,
								dots: false,
							}
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
								arrows: true,
								dots: false,
							}
						}
					]
				});
			}
			else {
				$ele.slick('slickGoTo', 0);
				$ele[0].slick.refresh();
			}
		}
	}

	$('.product-specs-carousel').each(function(){
		var $that = $(this);
		if ($that.is(':visible')) specsSlickCheck($that); // First run
	});

	// Window resize event
	$(window).on('resize', function() {
		$('.product-specs-carousel').each(function(){
			var $that = $(this);
			if ($that.is(':visible')) specsSlickCheck($that);
		});
	});

	$('.specs-table a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		$('.product-specs-carousel').each(function(){
			var $that = $(this);
			if ($that.is(':visible')) specsSlickCheck($that);
		});
	});
	*/

	$('.product-finish-bar').on('click', '.nav-link', function(e){
		e.preventDefault();
		var $that = $(this),
		finish = $that.data('finish');
		$('.product-finish-bar').find('.nav-link').removeClass('active');
		$that.addClass('active');

		// Todo: Filter/load product image
	});

	$('.product-diameter-bar').on('click', '.nav-link', function(e){
		e.preventDefault();
		var $that = $(this),
		diameter = $that.data('diameter');
		$('.product-diameter-bar').find('.nav-link').removeClass('active');
		$that.addClass('active');

		// set diameter table selection
		$('.specs-table').find('.nav-link[data-diameter="'+diameter+'"]').tab('show');

		// Todo: Filter/load product image
	});

  $('.modal').on('shown.bs.modal', function(){
    //$('html, body').css('overflow', 'hidden');
    $('html, body').addClass('no-scroll-overflow');
  });
  $('.modal').on('hidden.bs.modal', function(){
    //$('html, body').css('overflow', 'auto');
    $('html, body').removeClass('no-scroll-overflow');
  });


// Collection Page (filters)
/*$('body').on('mouseenter', '.collection-item', function(){
  $(this).addClass('hovered');
});
$('body').on('mouseleave', '.collection-item.hovered', function(){
  $('body').one('transitionend webkitTransitionEnd oTransitionEnd', '.collection-item.hovered', function(){
    $(this).removeClass('hovered');
  });
});*/
  // Show tooltips on tile hover
  /*$(".collection-item").on('mouseenter', function(){
    $('.save-star-container').tooltip('hide');
    $(this).find('.save-star-container').tooltip('show');
  });
  $(".collection-item").on('mouseleave', function(){
    $('.save-star-container').tooltip('hide');
  });*/

  /*if ($('.side-filter').length) {
    //if ($('.side-filter').outerHeight(true) > $('.next-side').outerHeight(true)) {
      $('.match-sides').matchHeight({byRow: false, property: 'height'});
    //}
  }*/

  // Side filter
  /*if ($('#sideFilter').length && $('#collectionContainer').length) {
    // Match min-heights
    if ($('.side-filter').outerHeight(true) > $('.next-side').outerHeight(true)) {
      $('.match-sides').matchHeight({byRow: false, property: 'min-height'});
    }
    // Prevent side filter from scrolling further than collection container
    var $collectionContainer = $('#collectionContainer');
    var $sideFilter = $('#sideFilter');
    var triggerPosition = false;
    $(window).scroll(function() {
      var collectionContainerbottom = $collectionContainer.offset().top + $collectionContainer.outerHeight(true);
      var sideFilterbottom = $sideFilter.offset().top + $sideFilter.outerHeight(true);
      if (sideFilterbottom >= collectionContainerbottom && !triggerPosition) {
        triggerPosition = $(window).scrollTop(); // Remember window scroll position
        $('#sideFilter').removeClass('side-filter-fixed').addClass('side-filter-absolute');
      }
      if (triggerPosition) {
        var windowtop = $(window).scrollTop();
        if (windowtop < triggerPosition) {
          $('#sideFilter').addClass('side-filter-fixed').removeClass('side-filter-absolute');
          triggerPosition = false; // Forget previously set scroll position in case of resize of screen/elements
        }
      }
    });
  }*/

  // Footer TESTING
  $(".card-header").matchHeight();
  function footerAccordion() {
    if ($(window).width() > 767) {
      $('[id^="collapse"]', 'footer').addClass('show');
    } else {
      $('[id^="collapse"]', 'footer').removeClass('show');
      $("#footerAccordion .card-header a").attr("aria-expanded","false");
    }
    $('#footerAccordion a[data-toggle="collapse"]').click(function(e){
      e.preventDefault();
      if ($(window).width() > 767) {
        e.stopPropagation();
      }
    });
  }
  footerAccordion();

  var windowWidth = $(window).width();
  $(window).on('resize', function() {
    if ($(window).width() != windowWidth) {
      footerAccordion();
    }
    // navResize();
  });

  /*Nav tab click*/
  $('li.dropdown').on('mouseenter', function (event) {
    var $that = $(this).find('a');
    var timeOutFunc = setTimeout(function () {
      $('li.dropdown > a').each(function(){
        if (!$(this).is($that) && $(this).parent().hasClass('show')) {
          $(this).attr('aria-expanded', false);
          $(this).parent().removeClass('show');
          $(this).siblings('.dropdown-menu').removeClass('show');
        }
      })
      $that.parent().addClass('show');
      $that.siblings('.dropdown-menu').addClass('show');
      if ($that.attr('aria-expanded') == 'false') {
        $that.attr('aria-expanded', true);
      } else {
        $that.attr('aria-expanded', false);
      }
    }, 300);
    $(this).one('mouseleave', function () {
      clearTimeout(timeOutFunc);
    })
  });

  if (typeof ridestyler !== 'undefined') ridestyler.initialize({ Key: 'c028c54cf0c447c594a862de6ac85d1a' });

	/* Vehicle selection modal */
	if (typeof ridestyler !== 'undefined' && typeof RideStylerVehicleSelectionModal === 'function') {
		var vsmScrollTop = 0;
		var vsmOptions = {
			ConfirmButtonText: 'Confirm',
			ImageSettings: {
					Width: 520,
					Height: 240
			},
			GroupOptions: true,
			IncludeOETireOption: true,
			YearScreenColumns: 2,
			MakeScreenColumns: 1,
			afterBackClicked: function(data) {
			},
			afterOptionSelected: function(data) {
			},
			callback: function(data) {
				// on close
				$('html, body').css('overflow', 'visible');
				$(window).scrollTop(vsmScrollTop);

				if (data.FinalSelectionMade) {
					// final selection made
					$('.vehicle_image').attr('src', data.Vehicle.ImageUrl);
					$('.vehicle_name').text(data.Vehicle.VehicleDescription);
				}
			}
		};
		var rsvsm = new RideStylerVehicleSelectionModal(vsmOptions);

		$('.change-vehicle').on('click', function(e){
			e.preventDefault();
			vsmScrollTop = $(window).scrollTop();
			$('html, body').css('overflow', 'hidden');
			rsvsm.Show();
		});
  }

  $('#navbarCollapseMobile .menu-has-child > .nav-link').on('click', function(e) {
    var target = $(this).data('next');
    if (typeof target !== 'undefined') {
      e.preventDefault();
      $(target).toggleClass('active');
    }
  });

  $('#navbarCollapseMobile .back-link').on('click', function(e) {
    e.preventDefault();
    $(this).parents('.sub-nav-panel').removeClass('active');
  });

  function checkHoverBtn() {
    if ($('.hover-btn-bottom').length) {
      var docTop = $(document).scrollTop(),
      footerTop = $('footer').offset().top,
      windowHeight = $(window).outerHeight();
      if (docTop + windowHeight >= footerTop) $('.hover-btn-bottom').addClass('item-anchored');
      else $('.hover-btn-bottom').removeClass('item-anchored');
    }
  }

  $(window).on('scroll resize',function() {
    checkHoverBtn();
  });

  checkHoverBtn();

  //Video Background
  $('.video-bg-section').each(function () {
    var $that = $(this);
    var videoFrame = $that.find('.video-bg-frame'),
    videoWrapper = $that.find('.video-frame-container');
    var videoW = videoFrame.width();
    videoH = videoFrame.height(),
    videoAR = ( videoW / videoH  ),
    contW = $that.width();
    contH = $that.height(),
    contAR = ( contW / contH  );

    var resizeVideo = function() {
      contW = $that.width();
      contH = $that.height();
      contAR = ( contW / contH );
      console.log('videoAR = '+videoAR+',contAR = '+contAR);
      if( contAR > videoAR ) {
        videoWrapper.css({
          'height': (( contW * videoAR ) * 1.15) + 'px', // 15% larger to account for small errors
          'width': '105%'
        });
      } else {
        videoWrapper.css({
          'width': (( contH * videoAR ) * 1.15) + 'px', // 15% larger to account for small errors
          'height': '105%'
        });
      }
    }

    // Run again on resize
    $(window).resize(function() {
      resizeVideo();
    });

    resizeVideo();

    videoFrame.css({
      'position': 'absolute',
      'width': '100%',
      'height': '100%'
    }).animate({
      'opacity': '1'
    }, 300);

  });

  // Vehicle selection - Desktop Nav
  var topVehicleForm = new VehicleSelectionForm('#top-menu-vehicle');
  topVehicleForm.init({'minYear': 2002});

  $('#top-menu-vehicle .select_vehicle_confirm').on('click', function (e) {
    e.preventDefault();
    if (typeof topVehicleForm.selectedTrim !== 'undefined') {
      var vehicle = topVehicleForm.selectedTrim;

      vehicle.paintColor = topVehicleForm.paintColor;

      // Set cookie
      wheelpros.cookie.setCookie( 'vehicle_filter', JSON.stringify(vehicle), 7 );

      // Refresh page
      setTimeout(function(){
          window.location.href = window.location.origin + '/wheels/';
      }, 100);
    }
  });

  // Vehicle selection - Mobile Nav
  var navVehicleForm = new VehicleSelectionForm('#mobile-menu-vehicle', {type: 'side'});
  navVehicleForm.init({'minYear': 2002});

  $('#mobile-menu-vehicle .select_vehicle_confirm').on('click', function (e) {
    e.preventDefault();
    if (typeof navVehicleForm.selectedTrim !== 'undefined') {
      var vehicle = navVehicleForm.selectedTrim;

      vehicle.paintColor = navVehicleForm.paintColor;

      // Set cookie
      wheelpros.cookie.setCookie( 'vehicle_filter', JSON.stringify(vehicle), 7 );

      // Refresh page
      setTimeout(function(){
          window.location.href = window.location.origin + '/wheels/';
      }, 100);
    }
  });

  var emailFooterTimeout = setInterval(function(){
    var emailInput = $('footer').find('input[type=email]');
    console.log('not yet');
    if (emailInput.length) {
      emailInput.attr('placeholder', 'Email');
      clearInterval(emailFooterTimeout);
    }
  }, 200);

  // Home page vehicle selection
  if ($('#vehicle-selection-tab').length) {
    var homeVehicleForm = new VehicleSelectionForm('#vehicle-selection-tab');
    homeVehicleForm.init({'minYear': 2002});

    $('#vehicle-selection-tab .select_vehicle_confirm').on('click', function (e) {
      e.preventDefault();
      if (typeof homeVehicleForm.selectedTrim !== 'undefined') {
        var vehicle = homeVehicleForm.selectedTrim;

        vehicle.paintColor = homeVehicleForm.paintColor;

        // Set cookie
        wheelpros.cookie.setCookie( 'vehicle_filter', JSON.stringify(vehicle), 7 );

        // Refresh page
        setTimeout(function(){
            window.location.href = window.location.origin + '/wheels/';
        }, 100);
      }
    });
  }

  if($('#modal-select-vehicle').length) {
    var modalVehicleForm = new VehicleSelectionForm('#modal-select-vehicle', {type: 'side'});
    modalVehicleForm.init({'minYear': 2002});
    $('#modal-select-vehicle .select_vehicle_confirm').on('click', function (e) {
      var $that = $(this);
      e.preventDefault();
      if (typeof modalVehicleForm.selectedTrim !== 'undefined') {
        var vehicle = modalVehicleForm.selectedTrim;

        vehicle.paintColor = modalVehicleForm.paintColor;

        // Set cookie
        wheelpros.cookie.setCookie( 'vehicle_filter', JSON.stringify(vehicle), 7 );

        var goTo = $that.data('goto');
        switch (goTo) {
          case 'wheels':
            setTimeout(function(){
              window.location.href = window.location.origin + '/wheels/';
            }, 100);
          break;
        case 'self':
        case 'refresh':
          setTimeout(function(){
            window.location.reload();
          }, 100);
          break;
        default:
          wheelpros.vehicle.onVehicleCookieChange();
        }
      }
    });
  }

  wheelpros.vehicle.init();
  wheelpros.vehicle.onVehicleCookieChange();

  $('.showcase-media-callout').on('click', function(){
    var $that = $(this),
    type = $that.data('media-type'),
    index = $that.data('index');
    $('#mediaModal').find('.modal-content-wrap').empty();
    if (type == 'Image') {
      $('#mediaModal').find('.modal-content-wrap').append($('<img/>', {'src': $that.data('orig-img')}));
    }
    else {
      $('#mediaModal').find('.modal-content-wrap').addClass('m-video').append($('.showcase-video-container[data-index='+index+']').html());
    }
    $('#mediaModal').modal('show');
  });

  $('#mediaModal').on('hidden.bs.modal', function () {
    $(this).find('.modal-content-wrap').removeClass('m-video').empty();
  });

  $('body').on('focus', 'form.ctct-form-custom', function () {
    $(this).attr('autocomplete', 'off');
  });

  $('body').on('click', '.style-wizard-submit', function(){
    var that = $(this),
    parentModelContent = that.closest('.modal-content');

    var allSlides = parentModelContent.find('.style_wizard_slide'),
    selectedStyles = {};
    allSlides.each(function(){
      var $that = $(this),
      thisAttr = $that.data('attr');

      var allSelectedItems = $that.find('.style_wizard_item.selected'),
      selectedArray = [];
      allSelectedItems.each(function(){
        var $this = $(this);
        selectedArray.push($this.data('attr-slug'));
      })
      if (selectedArray.length) selectedStyles[thisAttr] = selectedArray;
    });

    var targetHref = window.location.origin + '/wheels/';
    console.log(selectedStyles);
    if (!$.isEmptyObject(selectedStyles)) {
      var orderedStyles = {};
      Object.keys(selectedStyles)
      .sort()
      .forEach(function(v, i) {
        var termsString = $.map(selectedStyles[v], function (el) {
          return el;
        }).join(',');

        if (termsString != '') orderedStyles[v] = termsString;
      });
      console.log(orderedStyles);
      targetHref += ('?' + $.param(orderedStyles));
    }
    setTimeout(function(){
          window.location.href = targetHref;
    }, 100);
  })
});


