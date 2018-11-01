if ('undefined' == typeof window.jQuery) {
  document.getElementById('woocommerce-content').className += ' loaded';
  document.getElementById('shipping_section_button').style.display = 'none';
  document.getElementById('billing_section_button').style.display = 'none';

} else {
  jQuery(function ($) {

  // Go to first section
  if ($('form.checkout').length) {

    /*
    MULTI-PART CHECKOUT
    Convert WooCommerce checkout page to mdelivery_section_buttonulti-part process */

    // Disable enter button
    $(document).on("keypress", 'form', function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        // console.log('this is disabled!!!!');
        e.preventDefault();
        return false;
      }
    });

    // Enable shipping form
    $('#ship-to-different-address-checkbox').attr('checked', 'checked').change();

    // Get page elements
    var page_title = $('#woo-page-title');
    var shipping_section = $('#shipping_section');
    var billing_section = $('#billing_section');
    var contact_section = $('#contact_section');
	var notes_section = $('#notes_section');
    // var payment_section = $('#payment');
    var shipping_button = $('#shipping_section_button');
    var billing_button = $('#billing_section_button');
    var delivery_button = $('#delivery_section_button');
    var billing_back_button = $('#billing_section_back_button');
    var billing_save_button = $('#billing_save_button');
    var shipping_save_button = $('#shipping_save_button');
    var contact_save_button = $('#contact_save_button');
    var payment_save_button = $('#payment_save_button');
    var payment_section = $('#payment_section');

    var shipping_section_button_warning = $('#shipping_section_button_warning');
    var billing_section_button_warning = $('#billing_section_button_warning');
    var submit_payment_warning = $('#submit_payment_warning');
    var cc_type_warning = $('#cc_type_warning');

    // Disable loading when forms have been changed
    $('form.checkout').off('change keydown');

    //$('.logged-in #billing_section_button').prop("disabled",false);
    $('.logged-in #billing_section_button').removeClass("msa-disabled");

    $(".billing-save-wrap").appendTo($(".woocommerce-billing-fields"));
    $(".shipping-save-wrap").appendTo($(".woocommerce-shipping-fields"));
    $(".payment-save-wrap").appendTo($(".woocommerce-payment-fields"));
    // $("#billing_phone_field").insertBefore($('p.create-account'));
    // $("#billing_email_field").insertBefore($('p.create-account'));
    $("#billing_phone_field").appendTo($('.woocommerce-contact-fields'));
    $("#billing_email_field").appendTo($('.woocommerce-contact-fields'));
    $(".woocommerce-account-fields").appendTo($(".woocommerce-contact-fields"));
    $(".contact-save-wrap").appendTo($(".woocommerce-contact-fields"));

    // show contact fields if phone or email isn't filled in
    var phone_number_length = $('#billing_phone').val().length;
    var email_valid = validateEmail($('#billing_email').val());
    if (email_valid && phone_number_length > 9) {
      $("#contact_section").hide();
    } else if (!email_valid) {
      $("#billing_email").css('display', 'inline-block');
    }

    // Check bill to same address checkbox if logged in (user probably set this in their last order already)
    if ($("body").hasClass("logged-in")) {
      $('#bill-to-same-address-checkbox').prop('checked', false);
    } else {
      $('#bill-to-same-address-checkbox').prop('checked', true);
    }

    if ($("#bill-to-same-address-checkbox").is(":checked")) {
      $(".woocommerce-billing-fields").slideUp(0);
      $("#billing_section .mini-section").show();
      updateBillingForm();
      minimizeSection('billing', false);
      $('#billing_section .mini-section-edit').hide();
    }

    // minimizeSection function
    function minimizeSection(section_slug, revert, instant) {
      var current_section = $('#' + section_slug + '_section');
      var current_section_fields = current_section.find('.woocommerce-' + section_slug + '-fields');
      if (!current_section_fields.length) {
        current_section_fields = current_section;
      }
      var current_section_add_fields = current_section.find('.woocommerce-additional-fields');
      var mini_section = current_section.find('.mini-section');
      var slide_speed = (instant === true) ? 0 : 'fast';

      if (revert === true) {
        // Hide mini-section and show fields
        if (mini_section.length) {
          mini_section.stop().slideUp(slide_speed, function () {
            current_section_fields.stop().slideDown(slide_speed);
          });
        }

        // Show additional fields (Shipping)
        if (current_section_add_fields.length) {
          current_section_add_fields.show();
        }

      } else {
        // Get address
        var address_lines = '';
        var new_line = true;
        // var end_line_ids = ['shipping_last_name', 'shipping_company', 'shipping_address_2', 'shipping_address_1', 'shipping_state', 'billing_last_name', 'billing_company', 'billing_address_1', 'billing_address_2', 'billing_postcode', 'billing_phone'];
        var end_line_ids = ['shipping_last_name', 'shipping_company', 'shipping_address_2', 'shipping_address_1', 'shipping_postcode', 'billing_last_name', 'billing_company', 'billing_address_1', 'billing_address_2', 'billing_postcode', 'billing_phone'];
        var ignore_ids = ['shipping_country', 'billing_country', 'account_password', 'paymetric-card-number', 'paymetric-card-expiry', 'paymetric-card-cvc'];
        current_section_fields.find('input, select').not(':checkbox').each(function () {
          if (ignore_ids.indexOf($(this).attr('id')) === -1 && $(this).val().length > 0) {
            if (new_line) {
              address_lines += '<div class="mini-section-line">';
              address_lines += $(this).val();
              // console.log(address_lines);
              new_line = false;
            } else {
              address_lines += ' ' + $(this).val();
              // console.log(address_lines);
            }

            if (end_line_ids.indexOf($(this).attr('id')) !== -1) {
              address_lines += '</div>';
              new_line = true;
            }
          }
        });

        // Make sure the last div gets closed.
        if (new_line === false) {
          address_lines += '</div>';
        }

        // Check for account
        if (section_slug == 'contact') {
          if ($('#createaccount').is(':checked')) {
            address_lines += '<div class="mini-section-line italic">You are creating an account</div>';
          }
        }

        // Check for payment info
        if (section_slug == 'payment') {
          var cc_num = $('#paymetric-card-number').val();
          var last_four = cc_num.substr(cc_num.length - 4);
          var exp_date = $('#paymetric-card-expiry').val();
          address_lines += '<div class="mini-section-line italic">**** **** **** ' + last_four + '</div>';
          address_lines += '<div class="mini-section-line italic">Exp: ' + exp_date + '</div>';
        }

        // Create mini-section if not exist
        if (mini_section.length == 0) {
          // console.log(' ^ Creating mini-section first!');

          // Create section and add to DOM
          // mini_section = $('<div class="mini-section"><div class="mini-section-address"></div><div class="mini-section-edit"><i class="fal fa-pencil"></i> Edit</div></div>').hide();
          mini_section = $('<div class="mini-section"><div class="mini-section-address"></div><button class="mini-section-edit" type="button"><i class="fal fa-pencil"></i> Edit</button></div>').hide();
          current_section_fields.before(mini_section);

          mini_section.find('.mini-section-edit').click(function (e) {
              var mini_section_id = $(this).closest('div[id]').attr('id').replace('_section', '');
              if (mini_section_id == 'contact' || mini_section_id == 'billing' || mini_section_id == 'payment') {
                goToSection('billing', true);
              } else {
                goToSection('shipping', true);
              }
          // Edit Buttons can edit on review page below
          //   //$('#submit_payment').prop("disabled",true);
          //   // $('#submit_payment_warning').show();
          //   minimizeSection(section_slug, true);
          //   $('#billing_section_back_button').prop("disabled", true);
          //   // Minimize other sections when edit button is clicked
          //   // $('#submit_payment').prop("disabled",true);
          //   $('#submit_payment').addClass("msa-disabled");
          //   var edit_button_clicked = $(e.target).closest('[id]')[0].id.replace('_section', '');
          //   // console.log(edit_button_clicked);
          //   // if the screen has an invalid input disable edit Button
          //   if ($('#customer_details').hasClass('woocommerce-invalid')) {
          //     $('.mini-section-edit').prop("disabled", true);
          //   }
          //   // if section has an invalid input disable update Button
          //   var sections = ['payment', 'billing', 'shipping', 'contact'];
          //   for (var i = 0; i < sections.length; i++) {
          //     if (sections[i] !== edit_button_clicked) {
          //       //console.log('hellow: '+sections[i]);
          //       minimizeSection(sections[i], false);
          //     } else {
          //       validateForm([edit_button_clicked], edit_button_clicked + '_save_button');
          //       $("#customer_details input").keyup(function () {
          //         validateForm([edit_button_clicked], edit_button_clicked + '_save_button');
          //         // console.log("#"+edit_button_clicked+"_save_button");
          //         if ($("#" + edit_button_clicked + "_save_button").is(":disabled")) {
          //           $('.mini-section-edit').prop("disabled", true);
          //         } else {
          //           $('.mini-section-edit').prop("disabled", false);
          //         }
          //       });
          //
          //     }
          //   }
          //
          });
        }
        // $(".woocommerce button.mini-section-edit").click(function(){
        //   var edit_button_clicked = $(this).closest('div[id]').attr('id');
        //   alert(edit_button_clicked);
        // });

        // Add address to html
        // console.log(address_lines);
        mini_section.find('.mini-section-address').html(address_lines);

        // Hide fields and show mini-section
        current_section_fields.stop().slideUp(slide_speed, function () {
          mini_section.stop().slideDown(slide_speed);
        });

        // Hide additional fields (Shipping)
        if (current_section_add_fields.length) {
          current_section_add_fields.hide();
        }

      }
    }

    // Get Credit Card function
    function getCreditCardType(number) {
      var cardDetails = creditCardType(number);
      var cardType = false;
      if (cardDetails.length == 1) {
        cardType = cardDetails[0].type;
      }
      return cardType;
    }

    // Accepted Credit Card
    function acceptedCreditCardType(number) {
      var cardType = getCreditCardType(number);
      var accepted = false;
      if (cardType) {
        var acceptedCC = ["visa", "mastercard", "american-express", "discover"];
        if (acceptedCC.indexOf(cardType) !== -1) {
          accepted = true;
        }
      }
      return accepted;
    }

    // Credit card warning/icon logic
    $("#paymetric-card-number").keyup(function(){
      var number = $("#paymetric-card-number").val().replace(/\s/g,'');
      if (number.length >= 4) {
        if (!acceptedCreditCardType(number)) {
          $('.credit-card-icons i').removeClass('active');
          cc_type_warning.show();
        } else {
          var cardType = getCreditCardType(number);
          $('.credit-card-icons i').removeClass('active');
          $('.credit-card-icons i.'+cardType).addClass('active');
          cc_type_warning.hide();
        }
      } else {
        $('.credit-card-icons i').removeClass('active');
        cc_type_warning.hide();
      }
    });

    // Validate email function
    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    // Validate function
    function validateForm(section_slugs, disabled_button_id) {
      var invalid_ids = [];
      var invalid = false;
      var disabled_button = $('#' + disabled_button_id);
      var warning_message = $('#' + disabled_button_id + '_warning');
      for (var i = 0; i < section_slugs.length; i++) {
        if (invalid) {
          // break;
        }
        var section_slug = section_slugs[i];

        if (section_slug == 'shipping_method') {
          if ($('#shipping_method input:checked').length != 1) {
            var input_id = 'shipping_method';
            invalid_ids.push(input_id);
            invalid = true;
          }
        } else {
          if (section_slug == 'payment') {
            var validation_fields = $('#' + section_slug + '_section input');
          } else {
            // var validation_fields = $('#' + section_slug + '_section p.validate-required input');
            var validation_fields = $('#' + section_slug + '_section p.validate-required input, #' + section_slug + '_section p.validate-required select');
          }
          for (var j = 0; j < validation_fields.length; j++) {
            var input_value = validation_fields[j].value;
            var input_id = validation_fields[j].id;
            var input_length = validation_fields[j].value.length;
            var input_type = validation_fields[j].type;
            if (input_value == '' && input_type !== 'password') {
              invalid_ids.push(input_id);
              invalid = true;
            } else if (input_type == 'email' && !validateEmail(input_value)) {
              invalid_ids.push(input_id);
              invalid = true;
            } else if (input_id == 'billing_phone' && input_value.length < 10) {
              // invalid_ids.push(input_id);
              // invalid = true;
            }
            else if ( input_id == 'paymetric-card-number' && ( input_value.replace(/\D/g, '').length < 14 || input_value.replace(/\D/g, '').length > 19 || !acceptedCreditCardType(input_value.replace(/\D/g, '')) ) ) {
              invalid_ids.push(input_id);
              invalid = true;
            } else if (input_id == 'paymetric-card-expiry') {
              var expiration = input_value.replace(/\D/g, '');
              if (expiration.length == 4) {
                var year = expiration.toString().substring(2, 4);
                var month = expiration.toString().substring(0, 2);
                var today = new Date();
                var year_sub_str = today.getFullYear().toString().substring(0, 2);
                var expiration_date = new Date(year_sub_str+year, month);
                if (today > expiration_date) {
                  invalid_ids.push(input_id);
                  invalid = true;
                } else if (parseInt(month) < 1 || parseInt(month) > 12) {
                  invalid_ids.push(input_id);
                  invalid = true;
                }
              } else {
                invalid_ids.push(input_id);
                invalid = true;
              }
            } else if (input_id == 'paymetric-card-cvc' && (input_length < 3 || input_length > 4)) {
              invalid_ids.push(input_id);
              invalid = true;
            } else if (input_type == 'password') {
              if (($('#createaccount').is(":checked") && input_value == '')) {
                invalid_ids.push(input_id);
                invalid = true;
              }
              //password strength
              // else if (input_value !== '') {
              //   if ( !$('.woocommerce-password-strength').hasClass('strong') && !$('.woocommerce-password-strength').hasClass('good') ) {
              //     invalid_ids.push(input_id);
              //     invalid = true;
              //   }
              // }
            }
          }
        }
      }
      // validate-required woocommerce-invalid woocommerce-invalid-required-field
      // validate-required woocommerce-validated

      // disabled_button.prop("disabled",invalid);
      if (invalid) {
        disabled_button.addClass("msa-disabled");
      } else {
        disabled_button.removeClass("msa-disabled");
        warning_message.hide();
      }
      // console.log('invalid_ids: ', invalid_ids);
      return invalid_ids;
    }

    // updateBillingForm (from shipping form) function
    function updateBillingForm() {
      var checkoutFields = {};
      $("form.checkout.woocommerce-checkout").find("input, textarea, select").each(function () {
        checkoutFields[this.name] = $(this).val();
      });
      checkoutFields['shipping_country_selector'] = $("#select2-shipping_country-container").html();
      for (var key in checkoutFields) {
        var field = key.substr(0, key.indexOf('_'));
        if (field == "shipping") {
          if (key == "shipping_country_selector") {
            $("#select2-billing_country-container").prop('title', checkoutFields[key]);
            $("#select2-billing_country-container").html(checkoutFields[key]);
            $(".select2-results__option").attr("aria-expanded", "false");
            $(".select2-results__option").attr("data-selected", "false");
          } else {
            var billing_key = key.replace("shipping", "billing");
            $("#" + billing_key).val(checkoutFields[key]);
          }
        }
      }
      var stateTitle = $('.select2-results__option[id^=select2-billing_state-result][data-selected="true"]').html();
      $('#select2-billing_state-container').html(stateTitle);
    }

    var current_section = false;

    // func_count = 0;
    // $(document.body).on('updated_cart_totals', function () {console.log('updated_cart_totals');});
    // $(document.body).on('updated_shipping_method', function () {console.log('updated_shipping_method');});
    // $(document.body).on('wc_fragments_refreshed', function () {console.log('wc_fragments_refreshed');});
    // $(document.body).on('updated_wc_div', function () {console.log('updated_wc_div');});
    // $(document.body).on('updated_checkout', function () {console.log('updated_checkout');});
    $(document.body).on('update_checkout wc_fragment_refresh', function () {
      // $('*[data-tosection], #submit_payment').addClass('msa-disabled');
      $('*[data-tosection]:not(.back_button), #submit_payment').addClass('msa-disabled');
    });
    $(document.body).on('updated_cart_totals updated_shipping_method wc_fragments_refreshed updated_wc_div updated_checkout', function () {
      $('#shipping_method input').off('change').change(function() {
        $( document.body ).trigger( 'update_checkout' );
      });
      // $('*[data-tosection], #submit_payment').removeClass('msa-disabled'); // OLD
      $('#submit_payment, .back_button').removeClass('msa-disabled'); // NEW
      // func_count++;
      // console.log('func_count',func_count);
      // $("#payment").addClass('hide-loader');
      if (current_section == 'shipping') {
        // $('#sub-or-total').html("SUBTOTAL");
        $('.order-total').html("");
        $('body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.shipping, body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.tax-total').css('display', 'none');
        validateForm(['shipping'], 'delivery_section_button'); // NEW
      } else if (current_section == 'delivery') {
        $('body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.shipping, body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.tax-total').css('display', 'block');
        // $('#shipping_section_button').removeClass('msa-disabled');
        validateForm(['shipping_method'], 'shipping_section_button');
      } else if (current_section == 'billing') {
        // $('#sub-or-total').html("TOTAL");
        $('body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.shipping').css('display', 'block');
        $('#shipping_method li, #shipping_method li input').css('display', 'none');
        $('#shipping_method input:checked').closest('li').css('display', 'block');
        //$("#shipping_method input").off('change').change(function(){
        // validateForm(['billing','contact','payment', 'shipping_method'], 'billing_section_button');
        validateForm(['billing', 'contact', 'payment'], 'billing_section_button');
        //console.log('changed!');
        //});
      }
    });

    // goToSection function
    function goToSection(section_slug, scroll_to_top) {
      scroll_to_top = (scroll_to_top === true) ? true : false;

      // $('#submit_payment').prop("disabled", true);
      $('#submit_payment').addClass("msa-disabled");

      // Update current section
      current_section = section_slug;

      page_title.html(section_slug.toUpperCase());

      // Blur all inputs
      $('input').each(function () {
        $(this).trigger('blur');
      });

      // Set scroll top
      scroll_to = 0;

      // Show/hide/minimize
      switch (section_slug) {
        case 'shipping':

          $('body').addClass('shipping-section');
          $('body').removeClass('delivery-section billing-section review-section');

          // Unminimize
          minimizeSection('shipping', true, true);

          // Buttons
          shipping_button.hide();
          delivery_button.show();
          billing_button.hide();
          shipping_save_button.hide();
          billing_save_button.hide();
          contact_save_button.hide();
          payment_save_button.hide();
          $('#shipping_section .mini-section-edit').hide();
          $('#billing_section .mini-section-edit').hide();
          $("#submit_payment").hide();
          $("#billing_section_back_button").hide();
          shipping_section_button_warning.hide();
          billing_section_button_warning.hide();
          submit_payment_warning.hide();
          $(".woocommerce-checkout input").off("focusout");

          // Sections
          contact_section.hide();
		  notes_section.hide();
          billing_section.hide();
          // payment_section.stop().slideUp('fast');
          shipping_section.show();
          payment_section.hide();

          // $('#sub-or-total').html("SUBTOTAL");

          $('.order-total').html("");
          $('body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.shipping, body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.tax-total').css('display', 'none');
          // $('#order_review tr.shipping th').removeClass('red-border');

          $('#order_review').removeClass('show-items');

          // Validation
          validateForm(['shipping'], 'delivery_section_button');
          $('p').removeClass('woocommerce-invalid woocommerce-invalid-required-field');
          $("#customer_details input").keyup(function () {
            validateForm(['shipping'], 'delivery_section_button');
          });

          break;


        case 'delivery':

          $('body').addClass('delivery-section');
          $('body').removeClass('shipping-section billing-section review-section');

          if ( $('#billing_address_1').val() == '' || $('#billing_city').val() == '' || $('#billing_state').val() == '' || $('#billing_postcode').val() == '' ) {
            // console.log('billing checked!');
            $('#bill-to-same-address-checkbox').attr('checked', 'checked').change();
          }
          minimizeSection('shipping', false, true);

          // Buttons
          shipping_button.show();
          delivery_button.hide();
          billing_button.hide();
          shipping_save_button.hide();
          billing_save_button.hide();
          contact_save_button.hide();
          payment_save_button.hide();
          $('#shipping_section .mini-section-edit').hide();
          $('#billing_section .mini-section-edit').hide();
          $("#submit_payment").hide();
          $("#billing_section_back_button").hide();
          shipping_section_button_warning.hide();
          billing_section_button_warning.hide();
          submit_payment_warning.hide();

          // Sections
          contact_section.hide();
		  notes_section.hide();
          billing_section.hide();
          // payment_section.stop().slideUp('fast');
          shipping_section.show();
          payment_section.hide();

          billing_back_button.data('tosection', 'shipping');
          $("#billing_section_back_button").show().css('display', 'inline-block');

          $('#shipping_method li').css('display', 'list-item');
          $('#shipping_method li input').css('display', 'inline-block');
          $('body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.shipping, body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.tax-total').css('display', 'block');
          $('#order_review tr.shipping th').removeClass('red-border');

          $('#order_review').addClass('show-items');
          $('#order_review table.shop_table').removeClass('show-items');

          // validateForm(['shipping_method'], 'shipping_section_button');
          break;


        case 'billing':

          $('body').addClass('billing-section');
          $('body').removeClass('shipping-section delivery-section review-section');
          // Unminimize
          minimizeSection('billing', true, true);
          minimizeSection('shipping', false, true); // Why not

          // Back button
          billing_button.show();
          shipping_button.hide();
          shipping_save_button.show();
          billing_save_button.hide();
          contact_save_button.hide();
          payment_save_button.hide();
          // billing_back_button.data('tosection', 'shipping');
          billing_back_button.data('tosection', 'delivery');
          $("#bill-to-same-address").show();
          $('#shipping_section .mini-section-edit').hide();
          $('#billing_section .mini-section-edit').hide();
          $('#contact_section .mini-section-edit').hide();
          $('#contact_section .mini-section').hide();
          $('#contact_section .woocommerce-contact-fields').show();
          $('#payment_section .mini-section').hide();
          $("#submit_payment").hide();
          $("#billing_section_back_button").show().css('display', 'inline-block');
          $(".woocommerce-payment-fields").show();
          shipping_section_button_warning.hide();
          billing_section_button_warning.hide();
          submit_payment_warning.hide();

          // Sections
          contact_section.show();
		  notes_section.hide();
          shipping_section.show();
          // payment_section.stop().slideUp('fast');
          billing_section.show();
          payment_section.show();

          $('#order_review tbody').removeClass('show-items');
          $('#order_review_heading').removeClass('show-items');
          // $('#sub-or-total').html("TOTAL");
          $('body.woocommerce-page.woocommerce-checkout #order_review table.shop_table tfoot tr.shipping').css('display', 'block');

          // $('#shipping_method li').css('display', 'list-item');
          // $('#shipping_method li input').css('display', 'inline-block');

          $('#shipping_method li, #shipping_method li input').css('display', 'none');
          $('#shipping_method input:checked').closest('li').css('display', 'block');
          $('#order_review tr.shipping th').removeClass('red-border');

          // Validation
          // validateForm(['billing','contact','payment', 'shipping_method'], 'billing_section_button');
          validateForm(['billing', 'contact', 'payment'], 'billing_section_button');
          $('p').removeClass('woocommerce-invalid woocommerce-invalid-required-field');
          $('#order_review tr.shipping th').removeClass('red-border');

          var timer;
          $('#customer_details input').keyup(function () {
            clearTimeout(timer);
            timer = setTimeout(function (event) {
              // validateForm(['billing','contact','payment', 'shipping_method'], 'billing_section_button');
              validateForm(['billing', 'contact', 'payment'], 'billing_section_button');
              // console.log($('.woocommerce-password-strength'));
            }, 100);
          });

          $('#createaccount').change(function () {
            // validateForm(['billing','contact','payment', 'shipping_method'], 'billing_section_button');
            validateForm(['billing', 'contact', 'payment'], 'billing_section_button');
          });

          $(".woocommerce-checkout input").focusout(function () {
            // console.log('focus out!');
            // validateForm(['billing','contact','payment', 'shipping_method'], 'billing_section_button');
            validateForm(['billing', 'contact', 'payment'], 'billing_section_button');
          });


          // Billing Address Logic
          if ($("body").hasClass("logged-in")) {
            if (!$("#bill-to-same-address-checkbox").is(":checked")) {
              // $('#bill-to-same-address-checkbox').prop('checked', false);
            }
          } else {
            // $('#bill-to-same-address-checkbox').prop('checked', true);
            // $(".woocommerce-billing-fields").hide();
            //change all billing form fields to same as shipping
            // updateBillingForm();
          }

          if ($("#bill-to-same-address-checkbox").is(":checked")) {
            $(".woocommerce-billing-fields").slideUp(0);
            $("#billing_section .mini-section").show();
            updateBillingForm();
            minimizeSection('billing', false);
            $('#billing_section .mini-section-edit').hide();
          }



          $('#bill-to-same-address-checkbox').change(function () {
            if ($("#bill-to-same-address-checkbox").is(":checked")) {
              $(".woocommerce-billing-fields").slideUp('fast');
              $("#billing_section .mini-section").show();
              updateBillingForm();
              minimizeSection('billing', false);
              $('#billing_section .mini-section-edit').hide();
            } else {
              $("#billing_section .mini-section").hide();
              $(".woocommerce-billing-fields").slideDown('fast');
            }
          });

          shipping_save_button.click(function (e) {
            e.preventDefault();
            if ($('.woocommerce-billing-fields').css('display') == 'none') {
              //$('#submit_payment').prop("disabled",false);
            }
            if ($("#bill-to-same-address-checkbox").is(":checked")) {
              updateBillingForm();
              minimizeSection('billing', false);
            }
            $( document.body ).trigger( 'wc_fragment_refresh' );
            minimizeSection('shipping', false);
            return false;
          });

          break;

        case 'review':

          $('body').addClass('review-section');
          $('body').removeClass('shipping-section delivery-section billing-section');

      	  // Clear notices
      	  $('.woocommerce-error, .woocommerce-message').remove();

          // Minimize
          minimizeSection('shipping', false, true);
          minimizeSection('billing', false, true);
          minimizeSection('payment', false, true);
          minimizeSection('contact', false, true);

          // Buttons
          billing_back_button.data('tosection', 'billing');
          shipping_button.hide();
          billing_button.hide();
          shipping_save_button.show();
          billing_save_button.show();
          payment_save_button.show();
          contact_save_button.show();
          $('#shipping_section .mini-section-edit').show();
          $('#billing_section .mini-section-edit').show();
          $('#contact_section .mini-section-edit').show();
          $("#bill-to-same-address").hide();
          $("#submit_payment").show();
          //$('#submit_payment').prop("disabled", false);
          $('#submit_payment').removeClass("msa-disabled");
          shipping_section_button_warning.hide();
          billing_section_button_warning.hide();
          submit_payment_warning.hide();
          $('#order_review tbody').addClass('show-items');
          $('#order_review_heading').addClass('show-items');
          $('#order_review').addClass('show-items');

          // Validation
          // $('#customer_details input').off("keyup");
          // var timer;
          // $('#customer_details input').keyup(function () {
          //   //$('#submit_payment').prop("disabled", true);
          //   clearTimeout(timer);
          //   timer = setTimeout(function (event) {
          //     // validateForm(['shipping','billing','contact','payment'], 'submit_payment');
          //     validateForm(['contact'], 'contact_save_button');
          //     //$('#submit_payment').prop("disabled", true);
          //     if ($('#contact_save_button').is(":disabled")) {
          //       //$('#submit_payment').prop("disabled",true);
          //     }
          //     if ($('.woocommerce-contact-fields').css('display') !== "none") {
          //       //$('#submit_payment').prop("disabled",true);
          //     }
          //   }, 100);
          // });

          // $('#createaccount').change(function () {
          //   // console.log('CREATE ACCOUNT 2');
          //   // if( $(this).is(':checked') ) {
          //   //     // $("#account_password").val("").change();
          //   //     $("div.create-account").slideDown();
          //   // }
          //   validateForm(['contact'], 'contact_save_button');
          //   if ($('#contact_save_button').is(":disabled")) {
          //     //$('#submit_payment').prop("disabled",true);
          //   }
          //   if ($('.woocommerce-contact-fields').css('display') !== "none") {
          //     //$('#submit_payment').prop("disabled",true);
          //   }
          // });

          $('#shipping_method li, #shipping_method li input').css('display', 'none');
          $('#shipping_method input:checked').closest('li').css('display', 'block');


          // Sections
          contact_section.show();
		  notes_section.show();
          shipping_section.show();
          billing_section.show();
          payment_section.stop().slideDown('fast');
          break;
      }

      // Scroll up
      // if(scroll_to_top){
      //     scroll_to = parseInt( $('form.checkout').offset().top ) - 100;
      //     console.log('scrolling to '+((isNaN(scroll_to))? 0 : scroll_to), scroll_to);
      //     $('html, body').animate({
      //         scrollTop: (isNaN(scroll_to))? 0 : scroll_to
      //     }, 500);
      // }
      if (scroll_to_top) {
        $('html, body').animate({
          scrollTop: 0
        }, 0);
      }
    }

    // $(document.body).on( 'updated_checkout', function(){
    //     // Update payment_section var
    //     payment_section = $('#payment');
    //
    //     // Check section, hide if not on review section
    //     if(current_section !== 'review'){
    //         payment_section.hide();
    //     }
    // });

    // Button click handlers
    delivery_button.click(function (e) {
      e.preventDefault();
      if (!$(this).hasClass("msa-disabled")) {
        $(document.body).trigger('update_checkout');
        shipping_section_button_warning.hide();
        billing_section_button_warning.hide();
        submit_payment_warning.hide();
        goToSection($(this).data('tosection'), true);
      }
      return false;
    });
    shipping_button.click(function (e) {
      e.preventDefault();
      if (!$(this).hasClass("msa-disabled")) {
        // $(document.body).trigger('update_checkout');
        shipping_section_button_warning.hide();
        billing_section_button_warning.hide();
        submit_payment_warning.hide();
        goToSection($(this).data('tosection'), true);
      }
      return false;
    });
    billing_button.click(function (e) {
      e.preventDefault();
      if (!$(this).hasClass("msa-disabled")) {
        // console.log('isnt disabled!');
        shipping_section_button_warning.hide();
        billing_section_button_warning.hide();
        submit_payment_warning.hide();
        goToSection($(this).data('tosection'), true);
      }
      return false;
    });
    billing_back_button.click(function (e) {
      e.preventDefault();
      // console.log('back button click!');
      $('.woocommerce-error, .woocommerce-message').remove();
      goToSection($(this).data('tosection'), true);
      return false;
    });
    shipping_save_button.click(function (e) {
      e.preventDefault();
      minimizeSection('shipping', false);
      // if($('.woocommerce-billing-fields').css('display') == 'none') {
      //   $('#submit_payment').prop("disabled",false);
      // }
      // $('#submit_payment').prop("disabled",false);
      $('#submit_payment').removeClass("msa-disabled");
      $('#billing_section_back_button').prop("disabled", false);
      $('#submit_payment_warning').hide();
      return false;
    });
    billing_save_button.click(function (e) {
      e.preventDefault();
      minimizeSection('billing', false);
      // if($('.woocommerce-shipping-fields').css('display') == 'none') {
      //   $('#submit_payment').prop("disabled",false);
      // }
      $('#billing_section_back_button').prop("disabled", false);
      // $('#submit_payment').prop("disabled",false);
      $('#submit_payment').removeClass("msa-disabled");
      $('#submit_payment_warning').hide();
      return false;
    });
    contact_save_button.click(function (e) {
      e.preventDefault();
      minimizeSection('contact', false);
      // $('#billing_section_button').prop("disabled",false);
      // if($('.woocommerce-billing-fields').css('display') == 'none' && $('.woocommerce-shipping-fields').css('display') == 'none') {
      //   $('#submit_payment').prop("disabled",false);
      // }
      $('#billing_section_back_button').prop("disabled", false);
      //$('#submit_payment').prop("disabled",false);
      $('#submit_payment').removeClass("msa-disabled");
      $('#submit_payment_warning').hide();
      return false;
    });
    payment_save_button.click(function (e) {
      e.preventDefault();
      minimizeSection('payment', false);
      // $('#billing_section_button').prop("disabled",false);
      // if($('.woocommerce-billing-fields').css('display') == 'none' && $('.woocommerce-shipping-fields').css('display') == 'none') {
      //   $('#submit_payment').prop("disabled",false);
      // }
      $('#billing_section_back_button').prop("disabled", false);
      //$('#submit_payment').prop("disabled",false);
      $('#submit_payment').removeClass("msa-disabled");
      $('#submit_payment_warning').hide();
      return false;
    });

    $('.woocommerce button').click(function (e) {
      // $.fn.matchHeight._update()
      e.preventDefault();
      if ($(this).hasClass('msa-disabled')) {
        var button_id = $(this).attr('id');
        var invalid_ids = [];
        if ($(this).data('tosection') == 'review') {
          invalid_ids = validateForm(['billing', 'contact', 'payment'], 'billing_section_button');
        } else if ($(this).data('tosection') == 'delivery') {
          invalid_ids = validateForm(['shipping'], 'delivery_section_button');
        } else if ($(this).data('tosection') == 'billing') {
          // invalid_ids = validateForm(['shipping_method'], 'shipping_section_button');
        } else if (button_id == 'submit_payment') {
          invalid_ids = validateForm(['shipping', 'billing', 'contact', 'payment'], 'submit_payment');
          $('#submit_payment').addClass("msa-disabled");
        }
        for (var i = 0; i < invalid_ids.length; i++) {
          if (invalid_ids[i] == 'shipping_method') {
            $('#order_review tr.shipping th').addClass('red-border');
            // console.log('added red border to #order_review tr.shipping th');
          } else {
            $("#" + invalid_ids[i]).closest('p').removeClass('woocommerce-validated').addClass('woocommerce-invalid woocommerce-invalid-required-field');
          }
        }
        $("#" + button_id + "_warning").show();
      }
    });

    // $(window).load(function(){
    //
    // // Go to first section
    goToSection('shipping', false);
    //
    // // Show page
    $('#woocommerce-content').addClass('loaded');

    // });

    } else {
      $('#woo-page-title').hide();
      $('#woocommerce-content').addClass('loaded');
    }
  });

}
