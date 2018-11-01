jQuery(document).ready(function ($) {
  if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
    isiPhone = true;
  }
  function toggleSidenav(sidenav){
    var screenTop = $(document).scrollTop();
    sidenav_inner = sidenav.find('.sidenav-inner');
    sidenav.stop().toggleClass('active');
    if(sidenav.hasClass('active')){
      $('.navbar-default').addClass('position-static');
      sidenav_inner.css({'right': '-10%'}).animate({'right': '0%'}, 300);
    }
    else {
      $('.navbar-default').removeClass('position-static');
      $('html, body').css({'overflow': 'auto','height': 'auto'});
    }
    if (!isiPhone) {
      $("html").scrollTop(screenTop);
    }
  }

  $('*[data-sidenav]').click(function() {
		sidenav = $('#'+$(this).data('sidenav'));
    toggleSidenav(sidenav);
	});

  if($('.sidenav.auto-show').length){
    toggleSidenav($('.sidenav.auto-show').eq(0));
	}

});
