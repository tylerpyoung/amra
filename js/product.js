var wheelpros = wheelpros || {};
wheelpros.product = function ($) {
	var selectedObj = {};
	var selectedFinish = undefined;
	
	window.attrsImages = $.parseJSON(attributes_images);
	window.attrVariations = $.parseJSON(attribute_variations);

	var isWheel = $('.product-page-container').data('product_type') == 'wheel';

	var imageSlickOptions = {
		lazyLoad: 'progressive',
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		asNavFor: '#product-thumbs',
		dots: true,
		infinite: true,
		waitForAnimate: false
	},
	thumbSlickOptions = {
		lazyLoad: 'progressive',
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: false,
		asNavFor: '#product-image-carousel',
		focusOnSelect: true,
		arrows: true,
		centerMode: true,
		centerPadding: '60px',
		waitForAnimate: false,
		swipe: false,
		vertical: true
	},
	gallerySlickOptions = {
		lazyLoad: 'progressive',
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		infinite: true,
		waitForAnimate: false
	};

	function parseResponse (res) {
		try {
			var resp = $.parseJSON(res);
			return resp;
		}
		catch (e) {
			return null;
		}
	}

	function initSelectField (field) {
		field = (field instanceof $) ? field : $(field);
		var attr = field.data('attr'),
		options = field.find('option');

		options.each(function(){
			var that = $(this),
			optionAvailable = false;
			if (that.val() != '') {
				for (var i = 0; i < attrVariations.length; i++) {
					var thisAttrs = attrVariations[i]['attributes'];
					if (thisAttrs['attribute_'+attr] == that.val()) {
						optionAvailable = true;
						break;
					}
				}
				if (!optionAvailable) {
					that.remove();
				}
			}
		})

		if (field.data('chosen')) field.trigger('chosen:updated');
	}

	function filterSelectOptions(field, variantions) {
		field =  (field instanceof $) ? field : $(field);
		var attr = field.data('attr');
		field.find('option').each(function () {
			var $that = $(this),
			thisVal = $that.val(),
			found = false;
			if ($.trim(thisVal) != '') {
				for (var i = 0; i < variantions.length; i++) {
					var thisVar = variantions[i],
					thisAttrs = thisVar.attributes;
					if (thisAttrs['attribute_'+attr] == thisVal) {
						found = true;
						break;
					}
				}
				if (!found) $that.attr('disabled', 'disabled');
				else $that.attr('disabled', false);
			}
		});

		field.attr('disabled', false);
		field.parent('label').removeClass('disabled');

		if (field.data('chosen')) field.trigger('chosen:updated');
	}

	function crossCheckBySku(origArr, againstArr) {
		var filtered = [];
		for (var i = 0; i < origArr.length; i++) {
			var ele = origArr[i],
			thisSku = ele.sku;
			for (var j = 0; j < againstArr.length; j++) {
				var thisWheel = againstArr[j];
				if (thisWheel.partNumber == thisSku) {
					ele.wheel = thisWheel;
					filtered.push(ele);
					break;
				}
			}
		}
		return filtered;
	}

    return {
    	init: function () {
    		if ($('.product-chosen-select').length) {
				$('.product-chosen-select').chosen({disable_search: true, inherit_select_classes: true, width: '100%'});
			}

			$('body').on('click', 'a', function(e){
				var inpage = $(this).data('inpage-nav');
				if (inpage) {
					e.preventDefault();
					if ($(inpage).length)
						$('html, body').animate({'scrollTop': $(inpage).offset().top - $('.navbar').outerHeight() - 20});
				}
			});

    		var qObj = $.deparam(location.search.substr(1));
			if (qObj.hasOwnProperty('attribute_pa_finish') && $.trim(qObj['attribute_pa_finish']) != '') {
				selectedFinish = $.trim(qObj['attribute_pa_finish']);
			}

			if (isWheel) {
				// Wheel specific
				wheelpros.product.wheel.init();
			}
			else {
				// Other products specific - Purchasable
				wheelpros.product.others.init();
			}

    	},
    	wheel: function() {
    		var attrOptions = $('.product-page-container').data('attr-options');

    		var varDiameters, varFinishes, varWidths, varOffsets;

    		var gallerySelectionForm = $('.gallery-selection-form');

			function getDiametersByFinish(finish) {
				var diameterArray = [];
				if (attrVariations.length) {
					for (var i = 0; i < attrVariations.length; i++) {
						var thisAttrs = attrVariations[i]['attributes'];
						if (finish) {
							if (thisAttrs['attribute_pa_finish'] == finish) {
								var thisDiameter = thisAttrs['attribute_pa_wheel-diameter'];
								if ($.inArray(thisDiameter, diameterArray) == -1) diameterArray.push(thisDiameter);
							}
						}
					}
				}
				return diameterArray.sort();
			}
			function getFinishes() {
				var finishArray = [];
				if (attrVariations.length) {
					for (var i = 0; i < attrVariations.length; i++) {
						var thisAttrs = attrVariations[i]['attributes'];
						var thisFinish = thisAttrs['attribute_pa_finish'];
						if ($.inArray(thisFinish, finishArray) == -1) finishArray.push(thisFinish);
					}
				}
				return finishArray.sort();
			}
			function filterOptions(select, slugs) {
				if (!(select instanceof $)) select = $(select);
				if (!$.isArray(slugs)) slugs = [slugs];
				if (select.length) {
					select.find('option').each(function() {
						var $that = $(this);
						if ($.inArray($that.val(), slugs) == -1) {
							$that.remove();
						}
					});
				}
				if (select.data('chosen')) select.trigger('chosen:updated');
			}
    		return {
    			init: function() {
		    		varDiameters = attrOptions['pa_wheel-diameter'];
		    		varFinishes = attrOptions['pa_finish'];
		    		varWidths = attrOptions['pa_wheel-width'];
		    		varOffsets = attrOptions['pa_wheel-offset'];

    				// init wheel product
    				var that = this;
    				var vehicleCookie = $.parseJSON(wheelpros.cookie.getCookie('vehicle_filter'));
    				$('#main-switch-finish').on('change', function(){
    					$('#product-photo-block').parent().addClass('loading');
    					var $that = $(this),
						thisVal = $that.val();
						selectedFinish = thisVal;
						$('.selected-diameters').text(getDiametersByFinish(selectedFinish).join(', '));
						var selectedImageObj;
						var targetImageGroup = attrsImages.length ? attrsImages : $.parseJSON(attributes_images);
						if (targetImageGroup.length) {
							for (var i = 0; i < targetImageGroup.length; i++) {
								var thisImage = targetImageGroup[i],
								thisAttrs = thisImage['attributes'];
								var matched = false;
								for (var j = 0; j < thisAttrs.length; j++) {
									if (thisAttrs[j]['slug'] == 'pa_finish') {
										if (thisAttrs[j]['value'] == thisVal) matched = true;
										break;
									}
								}
								if (matched) {
									selectedImageObj = thisImage;
									break;
								}
							}
							if (typeof selectedImageObj !== 'undefined') {
								// Load image and display
						        var downloadingImage = new Image();
						        downloadingImage.onload = function () {
						        	$('#product-photo-block').find('.product-image img').attr('src', this.src);
									$('#product-photo-block').parent().removeClass('loading');
						        }
						        downloadingImage.onerror = function () {
						        	$('#product-photo-block').find('.product-image img').attr('src', '/wp-content/themes/wheelpros/images/coming-soon-2.png');
									$('#product-photo-block').parent().removeClass('loading');
						        }
						        downloadingImage.src = selectedImageObj['image_url'];
							}
						}
    				});
					if (vehicleCookie) {
						that.loadByVehicle(vehicleCookie).done(function() {
							// check filtered list
							if (attrVariations.length) {
								var finishes = getFinishes();
								// check pre-selected finish
								if (typeof selectedFinish !== 'undefined') {
									if ($.inArray(selectedFinish, finishes) == -1) {
										// Wheel has finish that fits the vehicle, but not this one
										$('.vehicle-option-intro').addClass('h-sm').text('THIS FINISH DOES NOT FIT: ');
										$('.vehicle-option-bar').fadeIn();
										// get first finish url and replace the link
										var newUrl = location.protocol + '//' + location.host + location.pathname + '?attribute_pa_finish='+finishes[0];
										$('.finish-not-fit').find('.btn-primary').attr('href', newUrl)
										$('.finish-not-fit').fadeIn();
									}
									else {
										initSelectField('#main-switch-finish');
										// This finish fits
										$('.vehicle-option-intro').text('Viewing options for: ');
										$('.vehicle-option-bar').fadeIn();
										$('.vehicle-fit').fadeIn();
										$('.product-filters-wrap').addClass('active');
									}
								}
								else {
									// There is no pre-selected finish, should pick the first one.
									initSelectField('#main-switch-finish');
									// This finish fits
									$('.vehicle-option-intro').text('Viewing options for: ');
									$('.vehicle-option-bar').fadeIn();
									$('.vehicle-fit').fadeIn();
									$('.product-filters-wrap').addClass('active');
								}

								$('#main-switch-finish').trigger('change');

								// init Gallery
								if (gallerySelectionForm.length) that.gallery.init();
							}
							else {
								// Vehicle Found, but No Match
								$('.vehicle-option-intro').addClass('h-sm').text('THIS WHEEL DOES NOT FIT: ');
								$('.vehicle-option-bar').fadeIn();
								$('.vehicle-not-fit').fadeIn();

								$('#main-switch-finish').trigger('change');

								// init Gallery
								if (gallerySelectionForm.length) that.gallery.init();
							}
						}).fail(function(){
							// Error handling, vehicle not found
						});
					}
					else {
						// Update Diameter list
						$('.selected-diameters').text($.map(varDiameters, function(el) {
							return el.name;
						}).join(', '));
						$('.product-filters-wrap').addClass('active');
						$('#main-switch-finish').trigger('change');

						// init Gallery
						if (gallerySelectionForm.length) that.gallery.init();
					}
    			},
    			gallery: function() {
    				var gallerySelectedObj = {};

					function resetGallerySelectField (field) {
						field = (field instanceof $) ? field : $(field);
						var attr = field.data('attr');
						gallerySelectedObj[attr] = '';
						field.val('');
						field.find('option[value!=""]').remove();
						field.attr('disabled', 'disabled');
						if (field.data('chosen')) field.trigger('chosen:updated');
					}

					function filterGallerySelectOptions(field, variantions) {
						field =  (field instanceof $) ? field : $(field);
						var attr = field.data('attr');
						var options = attrOptions[attr];
						var foundOpitons = [];
						for (var i = 0; i < options.length; i++) {
							var thisOption = options[i],
							thisSlug = thisOption.slug;

							var found = false;
							for (var j = 0; j < variantions.length; j++) {
								var thisVar = variantions[j],
								thisAttrs = thisVar.attributes;
								if (thisAttrs['attribute_'+attr] == thisSlug) {
									found = true;
									break;
								}
							}
							if (found) {
								field.append($('<option/>', {'value': thisOption.slug, 'text': thisOption.name}));
								foundOpitons.push(thisOption);
							}
						}
						if (!foundOpitons.length) {
							return false;
						}
						field.attr('disabled', false);
						gallerySelectionForm.find('.form-group').removeClass('active');
						field.closest('.form-group').addClass('active');
						if (foundOpitons.length === 1) {
							field.find('option:enabled').eq(1).prop('selected', true);
							if (field.data('chosen')) field.trigger('chosen:updated');
							field.trigger('change');
						}
						else 
							if (field.data('chosen')) field.trigger('chosen:updated');

						return true;
					}

					function filterGalleryByAttributes() {
						if (attrVariations) {
							var selectedVariations = attrVariations.filter(function (ele) {
								var attrs = ele.attributes,
								fullMatch = true;
								for (var qKey in gallerySelectedObj) {
					    			if (gallerySelectedObj.hasOwnProperty(qKey)) {
					    				var qVal = $.trim(gallerySelectedObj[qKey]);
					    				if (qVal != '') {
					    					for (var attrKey in attrs) {
					    						var attrVal = $.trim(attrs[attrKey]);
					    						if (attrKey == 'attribute_'+qKey && attrVal != qVal && attrVal != '') {
													fullMatch = false;
													break;
												}
					    					}
					    				}
					    			}
					    		}
								return fullMatch;
							});

							return selectedVariations;
						}
						return [];
					}

					function showGallery(selectedAttrs) {
						var skus = $.map(selectedAttrs, function(el){
							return el.sku;
						});
						// check attrsImages, and sort by images number desc
						var selectedAttrsImages = attrsImages.filter(function(el){
							return $.inArray(el.sku, skus) > -1;
						}).sort(function(a, b) {
							return b.images.length - a.images.length;
						});

						if (selectedAttrsImages.length) {
							/*$('.product-gallery-row').one('transitionend', function(){
								$('.gallery-image-col').addClass('shown');
							});*/
							$('.product-gallery-row').addClass('active');
							$('.gallery-selection-col').animate({'margin-left': 0}, function() {$('.gallery-image-col').animate({'opacity': 1});});
							rebuildGalleryCarousel(selectedAttrsImages[0]['images']);
						}
					}

					function rebuildGalleryCarousel(imageArray) {
						if ($('#gallery-image-carousel').hasClass('slick-initialized')) {
						    $('#gallery-image-carousel').slick('unslick').empty();
						}
						if (imageArray.length) {
						    for (var i = 0; i < imageArray.length; i++) {
						    	var thisImage = imageArray[i];
						    	var pImage = $('<div/>', {'class': 'product-image'}).append($('<img/>', {'alt': 'Product Image', 'data-lazy': thisImage.url, 'src': '/wp-content/themes/wheelpros/images/trans-1000.png'}));
								if ($('#gallery-image-carousel').length) {
								    $('#gallery-image-carousel').append(pImage);
								}
						    }

							if ($('#gallery-image-carousel').length) {
							    $('#gallery-image-carousel').slick(gallerySlickOptions);

								$('#gallery-image-carousel').off('lazyLoaded').on('lazyLoaded', function(){
							    	$(this).parent().removeClass('loading');
							    	$('#gallery-image-carousel').off('lazyLoaded');
							    });
							}

						}
						else {
							var pImage = $('<div/>', {'class': 'product-image'}).append($('<img/>', {'alt': 'Product Image', 'src': '/wp-content/themes/wheelpros/images/coming-soon-2.png'}));
							if ($('#gallery-image-carousel').length) {
							    $('#gallery-image-carousel').append(pImage);
							    $('#gallery-image-carousel').slick(gallerySlickOptions);
							    $('#gallery-image-carousel').parent().removeClass('loading');
							    $('#gallery-image-carousel').off('lazyLoaded');
							}
						}
					}

    				return {
    					init: function() {
    						// init finish select
    						var finishes = getFinishes();
    						if (!finishes.length) return;
    						for (var i = 0; i < varFinishes.length; i++) {
    							var thisFinish = varFinishes[i];

    							if ($.inArray(thisFinish.slug, finishes) > -1)
    								$('#gallery-switch-finish').append($('<option/>', {'value': thisFinish.slug, 'text': thisFinish.name}));
    						}
    						$('#gallery-switch-finish').attr('disabled', false);
    						$('#gallery-switch-finish').closest('.form-group').addClass('active');
    						if ($('#gallery-switch-finish').data('chosen')) $('#gallery-switch-finish').trigger('chosen:updated');

    						$('#gallery-image-carousel').slick(gallerySlickOptions);

    						gallerySelectionForm.on('change', 'select', function() {
    							var $that = $(this),
    							thisAttr = $that.data('attr'),
    							thisVal = $that.val();

    							gallerySelectedObj[thisAttr] = thisVal;
    							if ($that.is('#gallery-switch-finish')) {
    								resetGallerySelectField('#gallery-switch-diameter');
    								resetGallerySelectField('#gallery-switch-width');
    								resetGallerySelectField('#gallery-switch-offset');
    								if ($that.val() != '') {
	    								var selectedAttrs = filterGalleryByAttributes();
	    								if (selectedAttrs.length) {
	    									var shouldContinue = filterGallerySelectOptions('#gallery-switch-diameter', selectedAttrs);
	    									if (!shouldContinue) showGallery(selectedAttrs);
	    								}
	    							}
	    							else {
	    								gallerySelectionForm.find('.form-group').removeClass('active');
										$that.closest('.form-group').addClass('active');
	    							}
    							}
    							else if ($that.is('#gallery-switch-diameter')) {
    								resetGallerySelectField('#gallery-switch-width');
    								resetGallerySelectField('#gallery-switch-offset');
    								if ($that.val() != '') {
	    								var selectedAttrs = filterGalleryByAttributes();
	    								if (selectedAttrs.length) {
	    									var shouldContinue = filterGallerySelectOptions('#gallery-switch-width', selectedAttrs);
	    									if (!shouldContinue) showGallery(selectedAttrs);
	    								}
	    							}
	    							else {
	    								gallerySelectionForm.find('.form-group').removeClass('active');
										$that.closest('.form-group').addClass('active');
	    							}
    							}
    							else if ($that.is('#gallery-switch-width')) {
    								resetGallerySelectField('#gallery-switch-offset');
    								if ($that.val() != '') {
	    								var selectedAttrs = filterGalleryByAttributes();
	    								if (selectedAttrs.length) {
	    									var shouldContinue = filterGallerySelectOptions('#gallery-switch-offset', selectedAttrs);
	    									if (!shouldContinue) showGallery(selectedAttrs);
	    								}
	    							}
	    							else {
	    								gallerySelectionForm.find('.form-group').removeClass('active');
										$that.closest('.form-group').addClass('active');
	    							}
    							}
    							else {
    								// last step
    								if ($that.val() != '') {
	    								var selectedAttrs = filterGalleryByAttributes();
	    								// get sku list from selectedAttrs
	    								showGallery(selectedAttrs);
	    							}
    							}
    						});
    					}
    				}
    			}(),
    			loadByVehicle: function(vehicleCookie) {
    				// reset
    				attrsImages = $.parseJSON(attributes_images);
					attrVariations = $.parseJSON(attribute_variations);

    				var vehicleLoaded = $.Deferred();
    				if (!vehicleCookie) vehicleLoaded.reject();
    				else {
	    				var modelCode = $('.product-page-container').data('model_code');
						var modelName = $('.product-page-container').data('name');

						wheelpros.fitmentAPI.getWheelsByVehicle({fitsVehicle: vehicleCookie.id, modelCode: modelCode}).done(function(res){
							var wheels = parseResponse(res);
							if (wheels && wheels.length) {
								// filter attrVariation and attrsImages
								attrVariations = crossCheckBySku(attrVariations, wheels);
								attrsImages = crossCheckBySku(attrsImages, wheels);
							}
							else {
								attrVariations = [];
								attrsImages = [];
							}
							vehicleLoaded.resolve();
						}).fail(function(){
							vehicleLoaded.reject();
						});
					}

					return vehicleLoaded;
    			}
    		}
    	}(),
    	others: function() {
			function rebuildImageCarousel(imageArray) {
				if ($('#product-image-carousel').length) {
				    $('#product-image-carousel').slick('unslick').empty();
				}
				// Product Image Carousel Thumbnails
				if ($('#product-thumbs').length && !isWheel) {
					$('#product-thumbs').slick('unslick').empty();
				}
				if (imageArray.length) {
				    for (var i = 0; i < imageArray.length; i++) {
				    	var thisImage = imageArray[i];
				    	var pImage = $('<div/>', {'class': 'product-image'}).append($('<img/>', {'alt': 'Product Image', 'data-lazy': thisImage.url, 'src': '/wp-content/themes/wheelpros/images/trans-1000.png'})),
				    	tImage = $('<div/>', {'class': 'p-1 img-wrapper position-relative'}).append($('<img/>', {'class': 'img-fluid', 'alt': 'Product Thumbnail', 'data-lazy': thisImage.thumb, 'src': '/wp-content/themes/wheelpros/images/trans-1000.png'}));

						if ($('#product-image-carousel').length) {
						    $('#product-image-carousel').append(pImage);
						}
						// Product Image Carousel Thumbnails
						if ($('#product-thumbs').length) {
							$('#product-thumbs').append(tImage);
						}
				    }

					if ($('#product-image-carousel').length) {
					    $('#product-image-carousel').slick(imageSlickOptions);

						$('#product-image-carousel').off('lazyLoaded').on('lazyLoaded', function(){
					    	$(this).parent().removeClass('loading');
					    	$('#product-image-carousel').off('lazyLoaded');
					    });
					}
					// Product Image Carousel Thumbnails
					if ($('#product-thumbs').length) {
						$('#product-thumbs').slick(thumbSlickOptions);
					}

				}
				else {
					var pImage = $('<div/>', {'class': 'product-image'}).append($('<img/>', {'alt': 'Product Image', 'src': '/wp-content/themes/wheelpros/images/coming-soon-2.png'})),
			    	tImage = $('<div/>', {'class': 'p-1 img-wrapper position-relative'}).append($('<img/>', {'class': 'img-fluid', 'alt': 'Product Thumbnail', 'src': '/wp-content/themes/wheelpros/images/coming-soon.png'}));

					if ($('#product-image-carousel').length) {
					    $('#product-image-carousel').append(pImage);
					    $('#product-image-carousel').slick(imageSlickOptions);
					    $('#product-image-carousel').parent().removeClass('loading');
					    $('#product-image-carousel').off('lazyLoaded');
					}
				}
			}
			function filterByAttributes() {
				if (attrVariations) {
					var selectedVariations = attrVariations.filter(function (ele) {
						var attrs = ele.attributes,
						fullMatch = true;
						for (var qKey in selectedObj) {
			    			if (selectedObj.hasOwnProperty(qKey)) {
			    				var qVal = $.trim(selectedObj[qKey]);
			    				if (qVal != '') {
			    					for (var attrKey in attrs) {
			    						var attrVal = $.trim(attrs[attrKey]);
			    						if (attrKey == 'attribute_'+qKey && attrVal != qVal && attrVal != '') {
											fullMatch = false;
											break;
										}
			    					}
			    				}
			    			}
			    		}
						return fullMatch;
					});

					return selectedVariations;
				}
				return [];
			}

			/*Clone from MSA*/
		    // Pre-select first finish
		    /*function checkFinish() {
		      if( $('#pa_finish').val() == "" ) {
		        $('#pa_finish option[value][value!=""]').closest('td.value').find('.pa-option').eq(0).click();
		      }
		    }    
		    // Update Attributes
		    var updateAttributesTimeout;
		    var updateAttributesTOCounter = 0;
		    function updateAttributes(update_counter){

		        // Iterate each attribute row and enable/disable custom attributes
		        $('table.variations tr td.value').each(function(){
		            var selectOptions = $(this).find('select > option');
		            var customOptions = $(this).find('a.pa-option');

		            // Iterate custom attributes
		            customOptions.each(function(){
		                var currOption = $(this);
		                var attrValue = currOption.data('attrvalue');
		                var optionEnabled = false;

		                // Iterate select options
		                selectOptions.each(function(){
		                    // Match attribute values
		                    if($(this).attr('value') == attrValue){
		                        // Most likely if it's there then it's enabled, but there is a class we can check.
		                        if($(this).hasClass('enabled')){
		                            optionEnabled = true;
		                        }
		                    }
		                });

		                // Update custom attributes
		                if(optionEnabled){
		                    if(currOption.hasClass('disabled')){
		                        currOption.removeClass('disabled');
		                    }
		                }else{
		                    if(!currOption.hasClass('disabled')){
		                        currOption.removeClass('active').addClass('disabled');
		                    }
		                }
		            });
		        });

		        // Run this function 5 times to make sure it catches the change.
		        // THIS MIGHT BE UNNECESSARY
		        updateAttributesTOCounter = (update_counter === false)? updateAttributesTOCounter : 5;
		        if(updateAttributesTOCounter > 0){
		            updateAttributesTOCounter--;
		            if(update_counter !== false){
		                // If first run, clear timeouts (if any)
		                clearTimeout(updateAttributesTimeout);
		            }
		            updateAttributesTimeout = setTimeout(function(){
		                updateAttributes(false);
		            }, 100);
		        }
		    }

		    // Check for out of stock attributes/options
		    function checkOutOfStock() {
		        // Find active options
		        var chosen_atts = [];
		        $('table.variations tr td.value a.pa-option.active').each(function(){
		            chosen_atts.push({
		                attrSlug: $(this).data('attrslug'),
		                attrValue: $(this).data('attrvalue')
		            });
		        });
		        // Iterate through each option
		        $('table.variations tr td.value a.pa-option').each(function() {
		            var variation_match = false;
		            var is_in_stock = false;
		            var currSlug = $(this).data('attrslug');
		            var currValue = $(this).data('attrvalue');

		            // Look through all variations for something in stock that has the chosen attributes
		            var_loop:
		            for( var i=0; i<attrVariations.length; i++ ) {
		                var all_atts_match = false;
		                var currVariation = attrVariations[i];

		                // Check current attribute
		                var curr_att_matched = false;
		                for( var key in currVariation['attributes'] ) {
		                    var attrSlug = key.replace('attribute_', '');
		                    var attrValue = currVariation['attributes'][key];
		                    if( currSlug == attrSlug && currValue == attrValue ) {
		                        //console.log('        ^ attrSlug '+currSlug+' == '+attrSlug+' && '+currValue+' == '+attrValue);
		                        curr_att_matched = true;
		                        break;
		                    }
		                }
		                if( !curr_att_matched ) {
		                    //console.log('        ^ No match for current attribute.');
		                    continue var_loop;
		                } else {
		                    //console.log('        ^ Match for current attribute.');
		                }

		                // Loop through chosen attributes and the current attribute
		                for( var j=0; j<chosen_atts.length; j++ ) {
		                    var chosenSlug = chosen_atts[j].attrSlug;
		                    var chosenValue = chosen_atts[j].attrValue;

		                    // Check chosen attributes
		                    var chosen_att_matched = false;
		                    for( var key in currVariation['attributes'] ) {
		                        var attrSlug = key.replace('attribute_', '');
		                        var attrValue = currVariation['attributes'][key];

		                        // Skip check if slug matches the currSlug (It won't be two of the same attribute) (SHOULD ONLY HAPPEN IF YOU WANT SAME-SLUG ATTRIBUTES TO BE SELECTABLE)
		                        if( chosenSlug == currSlug ) {
		                            //console.log('         ^ Is same attribute type! '+chosenSlug+' = '+currSlug);
		                            chosen_att_matched = true;
		                            continue;

		                        // Check if values match
		                        } else if( chosenSlug == attrSlug && chosenValue == attrValue ) {
		                            //console.log('         ^ Value match! '+chosenValue+' = '+attrValue);
		                            chosen_att_matched = true;
		                        }
		                    }
		                    if( !chosen_att_matched ) {
		                        //console.log('        ^ No match for chosen attribute '+chosenSlug+': '+chosenValue+'.');
		                        continue var_loop;
		                    }
		                }

		                variation_match = true;
		                if( currVariation['is_in_stock'] ) {
		                    //console.log('         ^ '+currVariation['sku']+' is a match and is in stock!');
		                    is_in_stock = true;
		                    break;
		                } else {
		                    //console.log('         ^ '+currVariation['sku']+' is a match, but out of stock :(');
		                }

		            }

		            if( variation_match === true && is_in_stock === false ) {
		                //console.log('RESULT: Out of stock');
		                $(this).addClass('out_of_stock');
		                $(this).removeClass('no_match_found');
		            } else {
		                $(this).removeClass('out_of_stock');

		                if( variation_match === false ){
		                    //console.log('RESULT: Product doesn\'t exist');
		                    $(this).addClass('no_match_found');
		                } else {
		                    //console.log('RESULT: In stock');
		                    $(this).removeClass('no_match_found');
		                }
		            }
		        });

		    }

		    // Replace images with more specific variation images
		    function checkProductImages() {
		        // Change image (if available)
	            if( attrsImages.length ) {

	                // Collect chosen atts
	                var chosenAtts = [];
	                $('table.variations select').each(function() {
	                    var currSlug = $(this).attr('id');
	                    var currVal = $(this).val();
	                    if( currVal.length ) {
	                        chosenAtts.push({
	                            slug: currSlug,
	                            value: currVal
	                        });
	                    }
	                });
	                //console.log('chosenAtts', chosenAtts);

	                // Find images with at least one matched attribute
	                var image_found = false;
	                var newImages = '';
	                var newImageThumbs = '';
	                var images_found_matches = 0;

					// Loop through variations
					for( var j=0; j<attrsImages.length; j++ ) {
			                    var curr_variation = attrsImages[j];

					    // Count matching attributes
					    var att_matches = 0;
					    for( var i=0; i<chosenAtts.length; i++ ) {
							for( var k=0; k<curr_variation.attributes.length; k++ ) {
							    if( chosenAtts[i].slug == curr_variation.attributes[k].slug && chosenAtts[i].value == curr_variation.attributes[k].value ) {
									att_matches++;
							    }
							}
					    }

					    // If count is higher than previous counts, use this variation
			            if( att_matches > images_found_matches ){
						    if( images_found_matches > 0 ) {
								newImages = '';
								newImageThumbs = '';
						    }
						    //console.log('MATCH FOUND ('+att_matches+' ATT MATCHES)', curr_variation);
	                        // lastSlideSrc = curr_variation.images[0].url;
	                        image_found = true;
	                        images_found_matches = att_matches;

	                        var counter = 0;
	                        // FIX THIS TO ALLOW FOR MULTIPLE IMAGES!
	                        for( var m=0; m<curr_variation.images.length; m++ ) {
	                            // if( curr_variation.images[m].url !== false && curr_variation.images[m].url !== "" && curr_variation.images[m].url !== undefined) {
	                              if(curr_variation.images[m].url) {
	                                if(counter == 0) {
	                                  currentSlideSrc = curr_variation.images[0].url;
	                                }
	                                counter++;
	                                // newImages += '<div class="product-image-wrap"><div class="wp-full-height wp-table"><div class="wp-table-cell-middle"><img src="'+curr_variation.images[m].url+'"></div></div></div>';
	                                newImages += '<div class="product-image-wrap"><img src="'+curr_variation.images[m].url+'"></div>';
	                                newImageThumbs += '<div class="product-thumb"><div class="v-center-slide"><img class="img-responsive" src="'+curr_variation.images[m].url+'" alt=""></div></div>';
	                            }
	                        }
	                        if (counter == 0) {
	                           // newImages += '<div class="product-image-wrap"><div class="wp-full-height wp-table"><div class="wp-table-cell-middle"><img src="'+baseUrl+'/wp-content/themes/msawheels/images/coming-soon-2.png" alt="Coming Soon Image"></div></div></div>';
	                           newImages += '<img src="'+baseUrl+'/wp-content/themes/msawheels/images/coming-soon-2.png" alt="Coming Soon Image"></div>';
	                        }

	                        if (counter <= 3) {
	                          $('#product-thumbs').addClass("slick-noscroll");
	                        } else {
	                          $('#product-thumbs').removeClass("slick-noscroll");
	                        }
	                    }
					}

	                if( image_found || imagesHaveChanged ) {
	                    // Disable slider
	                    $('#product-image-carousel').slick('unslick');
	                    $('#product-thumbs').slick('unslick');

	                    // return false;

	                    if( image_found ) {
	                        imagesHaveChanged = true;

	                        // Remove old photos, add new photos
	                        $('#product-image-carousel').html(newImages);
	                        $('#product-thumbs').html(newImageThumbs);

	                    } else if ( imagesHaveChanged ) {
	                        imagesHaveChanged = false;

	                        // Remove old photos, add original photos
	                        $('#product-image-carousel').html(originalImages);
	                        $('#product-thumbs').html(originalImageThumbs);
	                    }
	                }
	            }
		    }

		    // Custom Attributes Option Click Event
		    function optionClickChange( el, skip_change ){
		        var attrValue = el.data('attrvalue');
		        var optionSelect = el.closest('td').find('select');
		        var selectedOption = el.closest('td').find('a.pa-option.active');

		        // Only allow click if not locked
		        if( !selectedOption.hasClass('bolt-locked') ) {

					// Check for deselect
		        	if (selectedOption[0] == el[0]) {
						// Disallow Finish delesect
						if (el.closest('td')[0] !== finish_container[0]) {
							// De-Activate
							el.removeClass('active');

		            		// Update select value for WooCommerce
		            		optionSelect.val('').change();
						} else {
							return;
						}
					} else {
		            	// Remove all active classes within set
		            	el.closest('td.value').find('a.pa-option').removeClass('active');

		            	// Activate
		            	el.addClass('active');

		            	// Update select value for WooCommerce
		            	optionSelect.val(attrValue).change();
					}

		            // Change image (if available)
		            checkProductImages();

		        } else {

		            // Remove previous notices
		            bolt_pattern_container.find('#vehicle_filter_notice').remove();
		            bolt_pattern_container.append('<div id="vehicle_filter_notice" class="pa-notice warning"><div class="pa-notice-msg">Bolt pattern has been locked to your selected vehicle. <a id="vehicle_filter_remove" href="#">Remove vehicle</a></div></div>');

		        }

		        //}

		        checkOutOfStock();
		    }*/

		    /*End from MSA*/
    		return {
    			init: function(){
    				// init for other products
    				if ($('#product-image-carousel').length) {
						$('#product-image-carousel').slick(imageSlickOptions);
					}
					// Product Image Carousel Thumbnails
					if ($('#product-thumbs').length) {
						$('#product-thumbs').slick(thumbSlickOptions);
					}

					$('#main-switch-finish').on('change', function () {
						var $that = $(this),
						attr = $that.data('attr'),
						newVal = $that.val();

						selectedObj[attr] = newVal;

						$('.product-image-carousel-wrapper').addClass('loading');

						$('.finish-list-url').removeClass('active').filter(function () {
							return $(this).data('finish') === newVal;
						}).addClass('active');

						if (attrsImages) {
							var selectedAttrs = attrsImages.filter(function (ele) {
								var attrs = ele.attributes,
								fullMatch = true;
								for (var qKey in selectedObj) {
					    			if (selectedObj.hasOwnProperty(qKey)) {
					    				var qVal = $.trim(selectedObj[qKey]);
					    				if (qVal != '')
						    				for (var i = 0; i < attrs.length; i++) {
												var thisAttr = attrs[i];
												if (thisAttr['slug'] == qKey && thisAttr['value'] != qVal && thisAttr['value'] != '') {
													fullMatch = false;
													break;
												}
											}
					    			}
					    		}
								return fullMatch;
							});
							var selectedAttrImages = [];
							if (selectedAttrs.length) {
								selectedAttrs.sort(function (a, b) {
									return a.images && b.images && (b.images.length - a.images.length);
								});
								var selectedAttr = selectedAttrs[0];
								selectedAttrImages = selectedAttr['images'];
							}
							rebuildImageCarousel(selectedAttrImages);
						}
					});


					$('.finish-list-url').on('click', function () {
						var $that = $(this),
						attr = $that.data('finish');

						if ($that.is('.active')) return;
						$('.finish-list-url').removeClass('active');
						$that.addClass('active');

						$('#main-switch-finish').val(attr);
						if ($('#main-switch-finish').data('chosen')) $('#main-switch-finish').trigger('chosen:updated');
						$('#main-switch-finish').trigger('change');
						$('html, body').animate({scrollTop: $('.product-image-carousel-wrapper').offset().top-$('nav.navbar').outerHeight()});
					});

					$('.product-filters-wrap').addClass('active');
					$('#main-switch-finish').trigger('change');

					// Add to cart
					$('.product-options').find('table.variations').addClass('active');
					$('.product-options').siblings('.product-price').show();

				    // Update custom attributes on select change & variation update
				    // MIGHT NOT NEED ALL 3, MAYBE JUST USE woocommerce_update_variation_values
				    /*$('table.variations tr td.value select').change(function(){
				        updateAttributes();
				    });
				    $('.variations_form').on('woocommerce_variation_select_change', function(){
				        // console.log('Triggered: woocommerce_variation_select_change');
				        updateAttributes();
				    });
				    var firstRunRan = false;
				    $('.variations_form').on('woocommerce_update_variation_values', function(){
				        // console.log('Triggered: woocommerce_update_variation_values');
				        updateAttributes();
				        if( firstRunRan === false ) {
				            firstRunRan = true;
				            firstRun();
				        }
				    });

				    // Price watch
				    $('.single_variation_wrap').before($('h5.product-price'));
				    $('.single_variation_wrap').on('hide_variation', function(e){
				        // Fired when the user selects all the required dropdowns / attributes
				        // and a final variation is selected / shown
				        $('h5.product-price').show();
				        $('.single_variation_wrap .woocommerce-variation').stop().removeAttr('style').hide();
				    });
				    $('.single_variation_wrap').on('show_variation', function(e, variation){
				        // Fired when the user selects all the required dropdowns / attributes
				        // and a final variation is selected / shown
				        $('h5.product-price').hide();
				        $('.single_variation_wrap .woocommerce-variation').stop().removeAttr('style').show();
				    });

			        function firstRun() {
				        checkOutOfStock();
				        checkFinish();
				    }

				    $('table.variations tr td.value a.pa-option').click(function(e){
				        e.preventDefault();
				        optionClickChange($(this));
				        return false;
				    });

				    // Hover tooltips
				    $('table.variations tr td.value a.pa-option.hover-tooltip-trigger').each(function(){
				        if( !$(this).find('.hover-tooltip').length ) {
				            var tooltipValue = $(this).data('tooltip');
				            if(tooltipValue){
				                // Add tooltip
				                $(this).append('<div class="hover-tooltip">'+tooltipValue+'</div>');
				            }
				        }
				    });

				    // First run sync with select dropdown
				    $('table.variations tr td.value').each(function(){
				        var selectValue = $(this).find('select').val();
				        var customOptions = $(this).find('a.pa-option');

				        customOptions.each(function(){
				            var currOption = $(this);
				            var attrValue = currOption.data('attrvalue');

				            if(attrValue == selectValue) {
				                currOption.addClass('active');
				            }

				            // Out of stock tooltips
				            currOption.hover(function(){
				                if( $(this).hasClass('out_of_stock') ) {
				                    if( $(this).hasClass('hover-tooltip-trigger') ) {
				                        var tooltipValue = $(this).data('tooltip');
				                        $(this).find('.hover-tooltip').html(tooltipValue+' (Out of Stock)');
				                    } else {
				                        $(this).append('<div class="out_of_stock-tooltip">Out of stock</div>');
				                    }
				                } else {
				                    if( $(this).hasClass('hover-tooltip-trigger') ) {
				                        var tooltipValue = $(this).data('tooltip');
				                        $(this).find('.hover-tooltip').html(tooltipValue);
				                    }
				                }
				            }, function() {
				                $(this).find('.out_of_stock-tooltip').remove();
				            });
				        });
				    });*/
    			}
    		}
    	}()
    }
}(jQuery);

(function () {
	wheelpros.product.init();
	wheelpros.wheels.init();
})();