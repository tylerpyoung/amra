jQuery(document).ready(function ($) {

  // Quantity -/+
  function changeQuantity() {
    $(".input-number-decrement").off('click').click(function(e){
        e.preventDefault();
        $( 'button[name="update_cart"]' ).removeProp( 'disabled');
        $(this).closest('td.product-quantity').find('.btn').removeClass('d-none');
        var $element = $($(this).data('decrease'));
        var value = parseInt($element.val());
        if (value > 0) {
          value -= 1;
          $element.val(value);
        }
    });
    $(".input-number-increment").off('click').click(function(e){
        e.preventDefault();
        $( 'button[name="update_cart"]' ).removeProp( 'disabled');
        $(this).closest('td.product-quantity').find('.btn').removeClass('d-none');
        var $element = $($(this).data('increase'));
        var value = parseInt($element.val());
        value += 1;
        $element.val(value);
    });
  }
  changeQuantity();
  $(document.body).on('updated_cart_totals, updated_shipping_method, wc_fragments_refreshed, updated_wc_div', function(){
    changeQuantity();
  });

  // Cart: Update quantity logic
  $('.woocommerce-cart-form input.qty').on('input', function() {
    $(this).closest('td.product-quantity').find('.custom-update-cart').removeClass('d-none');
  });

  // Checkout Sign In/Up Hide/Show
  $("#activateSignUp").click(function(){
    $('.sign-in-active').fadeOut(function() {
        $('.sign-up-active').fadeIn();
        $("#activateSignIn").css("display","inline-block");
    });
  });
  $("#activateSignIn").click(function(){
    $('.sign-up-active').fadeOut(function() {
        $('.sign-in-active').fadeIn();
        $("#activateSignUp").css("display","inline-block");
    });
  });

});
