var wheelpros = wheelpros || {};
wheelpros.collection = function ($) {
	var filtersObject = {},
	currentRequest,
	currentOrderBy;

	var slugFilter = 'filter_brand';

	window.filtersObject = filtersObject;

	function buildBadge(object, extraClass) {
		var $wrap = $('<div/>', {'class': 'alert filter-badge alert-dismissible fade show badge', 'title': object.attrname, 'data-taxonomy': object.taxonomy, 'data-termslug': object.termslug}),
		$msg = $('<strong/>', {'text': object.termname}),
		$dis = $('<a/>', {'class': 'close', 'data-dismiss': 'alert', 'aria-label': 'Close', 'href': '#'}).append($('<span/>', {'aria-hidden': true, 'text': '×'}));
		if (extraClass) $wrap.addClass(extraClass);
		return $wrap.append($msg).append($dis);
	}

	function removeFilterBySlug(tax, slug) {
		if (filtersObject.hasOwnProperty(tax)) {
			var filterArray = filtersObject[tax];
			for (var i = 0; i < filterArray.length; i++) {
				var thisFilter = filterArray[i];
				if (thisFilter.termslug == slug) {
					filterArray.splice(i, 1);
					break;
				}
			}
		}
	}

	function buildCollectionItem(product) {
		//console.log(product);
		var template = $($('#collection-item-template').html());
		template.find('.product_url').attr('href', product.link_url);
		template.find('.save_the_wheel');
		template.find('.product_image').html(product.image);
		template.find('.product_name').text(product.post_title);
		template.find('.product_after_title').text(product.attributes.pa_finish.term_name.toUpperCase());
		template.find('.product_sizes').text(product.all_diameters);
		template.find('.btn-inline-visualize');

		return template.attr({'data-sku': product.sku, 'data-product-id': product.ID, 'data-finish': product.finish, 'data-model': product.model_code, 'data-name': product.post_title});
	}

	function buildMessage(msg) {
		var container = $('<div/>', {'class': 'my-4 mx-auto p-5 rounded shadow-sm alert-light collection-alert'}),
		content = $('<p/>', {'class': 'm-0 text-uppercase'}).html(msg);

		return container.append(content);
	}

	function buildQueryString() {
		var orderedFiltersObject = {};

		Object.keys(filtersObject)
		.sort()
		.forEach(function(v, i) {
			var termsString = $.map(filtersObject[v], function (el) {
				return el.termslug;
			}).join(',');

			if (termsString != '' && !(v == slugFilter && filtersObject[v].length == 1)) orderedFiltersObject[v] = termsString;
		});

		if (typeof currentOrderBy !== 'undefined' && currentOrderBy != '') orderedFiltersObject['orderby'] = currentOrderBy;

		return $.param(orderedFiltersObject);
	}

	function pageLink(absPage, slug) {
		var pathName = location.pathname,
		pathArray = pathName.split('/');

		pathArray = pathArray.filter(function(el) {
			return $.trim(el) !== '';
		});

		if ($.inArray('page', pathArray) > -1)
			pathArray.splice($.inArray('page', pathArray), pathArray.length - $.inArray('page', pathArray));

		var questString = buildQueryString();

		var collectionBase = location.protocol + '//' + location.host + '/' + pathArray.join('/') + '/';

		if (slug) collectionBase = collectionBase + slug + '/';

		if (absPage === 1) return collectionBase + (questString == '' ? '' : '?'+questString);
		else {
			return collectionBase + 'page/' + absPage + '/' + (questString == '' ? '' : '?'+questString);
		}
	}

	function buildPagination(currentPage, totalPage) {
		// currentPage is absolute page number 1, 2 ...
		if (totalPage < 2) return false;

		var paginationContainer = $('<div/>', {'class': 'container text-center pagination-links w-100 my-3'});

		if (currentPage > 1) {
			$('<a/>', {'class': 'prev page-numbers', 'href': pageLink(currentPage - 1), 'text': '« Previous'}).appendTo(paginationContainer);
			$('<a/>', {'class': 'page-numbers', 'href': pageLink(currentPage - 1), 'text': currentPage - 1}).appendTo(paginationContainer);
		}
		$('<span/>', {'class': 'page-numbers current', 'aria-current': 'page', 'text': currentPage}).appendTo(paginationContainer);
		if (currentPage < totalPage) {
			$('<a/>', {'class': 'page-numbers', 'href': pageLink(currentPage + 1), 'text': currentPage + 1}).appendTo(paginationContainer);
			$('<a/>', {'class': 'next page-numbers', 'href': pageLink(currentPage + 1), 'text': 'Next »'}).appendTo(paginationContainer);
		}

		return paginationContainer;
	}

    return {
    	init: function () {
    		var that = this;
    		//Get Params in query string and init filtersObject
    		if (location.search != '') {
    			var params = $.deparam(location.search.slice(1));
    			for (var tax in params) {
	    			if (params.hasOwnProperty(tax)) {
	    				if (tax == 'orderby') currentOrderBy = params[tax];
	    				else {
		    				var filterString = params[tax];
		    				filtersObject[tax] = $.map(filterString.split(','), function (el) {
		    					return {termslug: el};
		    				});
		    			}
	    			}
	    		}
				that.refreshCheckboxesAndCount();
	    		that.refreshBadges();
	    		$('.clear-filters').removeClass('disabled');
    		}

    		window.onpopstate = function(e) {
    			filtersObject = {};
    			if (location.search != '') {
	    			var params = $.deparam(location.search.slice(1));
	    			for (var tax in params) {
		    			if (params.hasOwnProperty(tax)) {
		    				if (tax == 'orderby') currentOrderBy = params[tax];
		    				else {
			    				var filterString = params[tax];
			    				filtersObject[tax] = $.map(filterString.split(','), function (el) {
			    					return {termslug: el};
			    				});
			    			}
		    			}
		    		}
		    		$('.clear-filters').removeClass('disabled');
	    		}
				that.refreshCheckboxesAndCount();
	    		that.refreshBadges();
				that.onAppliedFiltersChanged(true);
			};

    		// Desktop filter animation
			$('.wheelpros-filter-item').on('click', function (e) {
				e.preventDefault();
				var $that = $(this);
				var target = $that.data('target');
				$('.filter-container').slideUp(400, function () {
					$(target).slideDown(400);
					if ($('.product-collection').offset().top - $('html').scrollTop() < $('.navbar').height())
						$('html, body').animate({scrollTop: $('.product-collection').offset().top - $('.navbar').height()})
				})
			});

			// Apply filter - Desktop Filter
			$('.apply-sub-filters').on('click', function (e) {
				e.preventDefault();
				var $that = $(this);
				var target = $that.parents('.sub-filter-container');
				target.slideUp(400, function () {
					$('.filter-container').slideDown(400);
					if ($('.product-collection').offset().top - $('html').scrollTop() < $('.navbar').height())
						$('html, body').animate({scrollTop: $('.product-collection').offset().top - $('.navbar').height()})
				});
				// Apply need to load filters changes, and then refresh checkboxes with new values.
				var unchanged = that.refreshFiltersObject('.filter-checkbox');
				if (!unchanged) {
					that.refreshCheckboxesAndCount();
					that.refreshBadges();
					that.onAppliedFiltersChanged();
				}
			});

			// Back - Desktop Filter
			$('.back-sub-filters').on('click', function (e) {
				e.preventDefault();
				var $that = $(this);
				var target = $that.parents('.sub-filter-container');
				target.slideUp(400, function () {
					$('.filter-container').slideDown(400);
					if ($('.product-collection').offset().top - $('html').scrollTop() < $('.navbar').height())
						$('html, body').animate({scrollTop: $('.product-collection').offset().top - $('.navbar').height()})
				});
				// back does not change anything, just fresh checkboxes.
				that.refreshCheckboxesAndCount();
			});

			$('.clear-filters').on('click', function (e) {
				e.preventDefault();
				filtersObject = {};
				that.refreshCheckboxesAndCount();
				that.refreshBadges();
				that.onAppliedFiltersChanged();
			});

			// Mobile Filter Functions
			$('.filters-mobile').click(function(){
				$('#mobile-filters').addClass('active');
			});

			$('.wheels-sort-mobile').click(function(){
				$('#mobile-sort-filters').addClass('active');
			});

			$('.mobile-side-filter .mobile_filter_close').click(function(){
				$('.mobile-side-filter').removeClass('active');
			});

			$('#mobile-sort-filters a.d-table-row').click(function(){
				if (!$(this).find('div.d-table-cell').hasClass('selected')) {
					$('#mobile-sort-filters a.d-table-row div.d-table-cell').removeClass('selected');
					$(this).find('div.d-table-cell').addClass('selected');
				}
			});

			$('#mobile-filters .filter-list-main .d-table-row').click(function(){
				var filter_id = $(this).data('side-filter');
				var title = $(this).data('filter-title');
				$('#'+filter_id).addClass('active');
				$('#mobile-filters .close').addClass('d-none');
				$('#mobile-filters .back').removeClass('d-none');
				$('#mobile-filters .apply').removeClass('d-none');
				$('#mobile-filters .filter-heading').text(title);
			});

			var filterHeading = $('#mobile-filters .filter-heading').text();

			// Apply filter - Mobile Filter
			$('.mobile-apply-sub-filters').on('click', function (e) {
				e.preventDefault();
				// Apply need to load filters changes, and then refresh checkboxes with new values.
				var unchanged = that.refreshFiltersObject('.mobile-filter-checkbox');
				if (!unchanged) {
					that.refreshCheckboxesAndCount();
					that.refreshBadges();
					that.onAppliedFiltersChanged();
				}

				$('#mobile-filters .filter-list').removeClass('active');
				$('#mobile-filters .close').removeClass('d-none');
				$('#mobile-filters .back').addClass('d-none');
				$('#mobile-filters .apply').addClass('d-none');
				$('#mobile-filters .filter-heading').text(filterHeading);
			});

			// Back - Mobile Filter
			$('.mobile-back-sub-filters').on('click', function (e) {
				e.preventDefault();
				// back does not change anything, just fresh checkboxes.
				that.refreshCheckboxesAndCount();

				$('#mobile-filters .filter-list').removeClass('active');
				$('#mobile-filters .close').removeClass('d-none');
				$('#mobile-filters .back').addClass('d-none');
				$('#mobile-filters .apply').addClass('d-none');
				$('#mobile-filters .filter-heading').text(filterHeading);
			});

			$('body').on('click', '.btn_inline_visualize', function(){
				var $that = $(this),
				sku = $that.data('sku');
				if (sku) {
					
				}
			});

			// Apply filter - Desktop Filter
			$('.banner-sort-form').on('change', 'select', function (e) {
				e.preventDefault();
				var $that = $(this);
				currentOrderBy = $that.val();

				that.onAppliedFiltersChanged();
			});
    	},
    	refreshFiltersObject: function(cbSelector) {
    		var oldFilterObject = $.extend({}, filtersObject);
    		filtersObject = {};
    		var checkedBoxes = $('body').find(cbSelector+':checked');
    		checkedBoxes.each(function(){
    			var $that = $(this),
    			taxonomy = $that.data('taxonomy'),
    			attrname = $that.data('attrname'),
    			termslug = $that.data('termslug'),
    			termname = $that.data('termname');
    			if (filtersObject.hasOwnProperty(taxonomy)) 
    				filtersObject[taxonomy].push({attrname: attrname, termslug: termslug, termname: termname});
    			else 
    				filtersObject[taxonomy] = [{attrname: attrname, termslug: termslug, termname: termname}];
    		});

    		return JSON.stringify(oldFilterObject) == JSON.stringify(filtersObject);
    	},
    	refreshCheckboxesAndCount: function() {
    		var allCheckboxes = $('.filter-checkbox, .mobile-filter-checkbox');
    		allCheckboxes.prop('checked', false);
    		var allCounts = $('.term-count');
    		allCounts.addClass('d-none').text(0);
    		if (typeof filtersObject[slugFilter] !== 'undefined' && filtersObject[slugFilter].length == 1) {
    			setTimeout(function(){
					window.location.href = pageLink(1, filtersObject[slugFilter][0]['termslug']);
				}, 100);
    		}
    		for (var filterTax in filtersObject) {
    			if (filtersObject.hasOwnProperty(filterTax)) {
    				var filterArray = filtersObject[filterTax];
    				var thisCount = $('.term-count[data-tax="'+filterTax+'"]');
    				thisCount.text(filterArray.length);
    				if (filterArray.length) thisCount.removeClass('d-none');
    				for (var i = 0; i < filterArray.length; i++) {
    					var thisFilter = filterArray[i];
    					var desktopCheckbox = $('.filter-checkbox[data-taxonomy="'+filterTax+'"][data-termslug="'+thisFilter.termslug+'"]');
    					// For init purposes
    					thisFilter.attrname = desktopCheckbox.data('attrname');
    					thisFilter.termname = desktopCheckbox.data('termname');
    					desktopCheckbox.prop('checked', true);
    					$('.mobile-filter-checkbox[data-taxonomy="'+filterTax+'"][data-termslug="'+thisFilter.termslug+'"]').prop('checked', true);
    				}
    			}
    		}
    	},
    	refreshCheckboxes: function() {
    		var allCheckboxes = $('.filter-checkbox, .mobile-filter-checkbox');
    		allCheckboxes.prop('checked', false);
    		for (var filterTax in filtersObject) {
    			if (filtersObject.hasOwnProperty(filterTax)) {
    				var filterArray = filtersObject[filterTax];
    				for (var i = 0; i < filterArray.length; i++) {
    					var thisFilter = filterArray[i];
    					var desktopCheckbox = $('.filter-checkbox[data-taxonomy="'+filterTax+'"][data-termslug="'+thisFilter.termslug+'"]');
    					// For init purposes
    					thisFilter.attrname = desktopCheckbox.data('attrname');
    					thisFilter.termname = desktopCheckbox.data('termname');
    					desktopCheckbox.prop('checked', true);
    					//$('.filter-checkbox[data-taxonomy="'+filterTax+'"][data-termslug="'+thisFilter.termslug+'"]').prop('checked', true);
    					$('.mobile-filter-checkbox[data-taxonomy="'+filterTax+'"][data-termslug="'+thisFilter.termslug+'"]').prop('checked', true);
    				}
    			}
    		}
    	},
    	refreshTermCount: function() {
    		var allCounts = $('.term-count');
    		allCounts.text(0);
    		for (var filterTax in filtersObject) {
    			if (filtersObject.hasOwnProperty(filterTax)) {
    				var filterArray = filtersObject[filterTax];
    				$('.term-count[data-tax="'+filterTax+'"]').text(filterArray.length);
    			}
    		}
    	},
    	refreshBadges: function() {
    		// refresh checkboxes before badges
    		var that = this;
    		$('.filter-badge').remove();
    		for (var filterTax in filtersObject) {
    			if (filtersObject.hasOwnProperty(filterTax)) {
    				var filterArray = filtersObject[filterTax];
    				for (var i = 0; i < filterArray.length; i++) {
    					var thisFilter = filterArray[i];
    					var $badge = buildBadge($.extend({'taxonomy': filterTax}, thisFilter));
    					$badge.on('close.bs.alert', function(){
    						var $that = $(this),
    						taxonomy = $that.data('taxonomy'),
    						termslug = $that.data('termslug');
    						removeFilterBySlug(taxonomy, termslug);
    						that.refreshCheckboxesAndCount();
    						that.onAppliedFiltersChanged();
    					})
    					$('.badge-container').append($badge);
    				}
    			}
    		}
    	},
    	onAppliedFiltersChanged: function (noPushState) {
    		var that = this;
    		if ($.isEmptyObject(filtersObject)) $('.clear-filters').addClass('disabled');
    		else $('.clear-filters').removeClass('disabled');
    		$('.next-side').addClass('loading');
    		that.sendFilteringRequest(function (res) {
    			$('#collectionContainer').empty();
    			if (!res) {
    				console.log('In callback. Error occurred');
    				$('.next-side').removeClass('loading');
    				$('#collectionContainer').append(buildMessage('There was an error loading the wheels'));
    			}
    			else {
    				// To-do: process returned data
    				var totalPage = res.max_num_pages,
    				products = res.results;
    				$('.next-side').removeClass('loading');
    				if (!products.length) {
    					$('#collectionContainer').append(buildMessage('There are no wheels matching your criteria'));
    				}
    				else {
	    				for (var i = 0; i < products.length; i++) {
	    					$('#collectionContainer').append(buildCollectionItem(products[i]));
	    				}
	    				var paginationContainer = buildPagination(1, totalPage);
	    				if (paginationContainer) $('#collectionContainer').append(paginationContainer);

	    				// refresh stars
	    				wheelpros.wheels.refreshSavedStars();
	    				wheelpros.wheels.refreshStagBadge();
	    			}

    				// Update URL
					if(history.pushState && !noPushState) {
						window.history.pushState(null, null, pageLink(1));
					}
    			}
    		})
    	},
    	sendFilteringRequest: function (callback) {
    		custom_query_args['taxonomy'] = [];
    		for (var filter in filtersObject) {
    			if (filtersObject.hasOwnProperty(filter)) {
    				var filterArray = filtersObject[filter],
    				termsArr = [];
    				for (var i = 0; i < filterArray.length; i++) {
    					var thisFilter = filterArray[i];
    					termsArr.push(thisFilter.termslug);
    				}
    				custom_query_args['taxonomy'].push({
						'name': filter.replace('filter_', 'pa_'),
						'type': 'slug',
						'value': termsArr
					});
    			}
    		}
    		currentRequest = jQuery.ajax({
				type: 'POST',
				data: custom_query_args,
				url: siteURL + '/wp-json/wheelpros-ajax-products/v1/get_results/',
				dataType: 'text',
				beforeSend : function() {
					if(currentRequest != null) {
						currentRequest.abort();
					}
				}
			}).done(function (data) {
				// Success
				var startIndex = data.indexOf('"{');
				if (startIndex > 0) {
					data = data.substr(startIndex);
					data = $.parseJSON(data);
				}
				try {
					var response = $.parseJSON(data);
					if (typeof callback === 'function') callback(response);
				} catch (e) {
					if (typeof callback === 'function') callback(false);
				}
			}).fail(function (e) {
				// Error
				if( e.statusText !== 'abort' ) {
					console.log('RESPONSE ERROR', e);
					if (typeof callback === 'function') callback(false);
				}
			});
    	}
    }
}(jQuery);
jQuery(document).ready(function () {
	wheelpros.collection.init();
	wheelpros.wheels.init();
})