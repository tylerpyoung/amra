// $.deparam
!function(e){if("function"==typeof require&&"object"==typeof exports&&"object"==typeof module){try{var t=require("jquery")}catch(e){}module.exports=e(t)}else if("function"==typeof define&&define.amd)define(["jquery"],function(t){return e(t)});else{var o;try{o=(0,eval)("this")}catch(e){o=window}o.deparam=e(o.jQuery)}}(function(e){var t=function(e,t){var o={},r={true:!0,false:!1,null:null};return e?(e.replace(/\+/g," ").split("&").forEach(function(e){var n,i=e.split("="),a=decodeURIComponent(i[0]),l=o,c=0,f=a.split("]["),p=f.length-1;if(/\[/.test(f[0])&&/\]$/.test(f[p])?(f[p]=f[p].replace(/\]$/,""),p=(f=f.shift().split("[").concat(f)).length-1):p=0,2===i.length)if(n=decodeURIComponent(i[1]),t&&(n=n&&!isNaN(n)&&+n+""===n?+n:"undefined"===n?void 0:void 0!==r[n]?r[n]:n),p)for(;c<=p;c++)l=l[a=""===f[c]?l.length:f[c]]=c<p?l[a]||(f[c+1]&&isNaN(f[c+1])?{}:[]):n;else"[object Array]"===Object.prototype.toString.call(o[a])?o[a].push(n):!{}.hasOwnProperty.call(o,a)?o[a]=n:o[a]=[o[a],n];else a&&(o[a]=t?void 0:"")}),o):o};return e&&(e.prototype.deparam=e.deparam=t),t});

window.cookieVehicle = undefined;

var wheelpros = wheelpros || {};
wheelpros.cookie = function () {
    return {
        setCookie: function (name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        },

        getCookie: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        eraseCookie: function (name) {
            this.setCookie(name, '', -1);
            document.cookie = name+'=; Max-Age=-99999999;';
        }

    }
}();

wheelpros.fitmentAPI = function ($) {
    //typeof fitment_ajax_url === 'undefined'
    return {
        load: function (query_uri) {
            query_uri = encodeURI(query_uri);
            return $.ajax({
                'method': 'POST',
                'url': fitment_ajax_url,
                'data': {
                    'query_uri': query_uri,
                    '_wpnonce': fitment_ajax_nonce
                }
            });
        },
        post: function (query_uri, data) {
            query_uri = encodeURI(query_uri);
            return $.ajax({
                'method': 'POST',
                'url': fitment_ajax_url,
                'data': {
                    'query_uri': query_uri,
                    'query_data': data,
                    '_wpnonce': fitment_ajax_nonce
                }
            });
        },
        getYears: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/vehicle/years/' + (param == '' ? '' : '?'+param));
        },
        getMakes: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/vehicle/makes/' + (param == '' ? '' : '?'+param));
        },
        getModels: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/vehicle/models/' + (param == '' ? '' : '?'+param));
        },
        getWheels: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/wheel/search/' + (param == '' ? '' : '?'+param));
        },
        getWheelsByVehicle: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/wheel/search-byvehicle/' + (param == '' ? '' : '?'+param));
        },
        getWheel: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/wheel/' + (param == '' ? '' : '?'+param));
        },
        getVehicles: function (options) {
            var param = typeof options !== 'undefined' ? $.param(options) : '';
            return this.load('/vehicle/search/' + (param == '' ? '' : '?'+param));
        },
        getVehicle: function (vehicleId) {
            return this.load('/vehicle/?id='+vehicleId);
        },
        checkFitVehicle: function (vehicleId) {
        	return this.load('/wheel/check-fit-vehicle/?fitsVehicle='+vehicleId);
        },
        checkStag: function (vehicleId, models) {
        	var obj = {fitsVehicle: vehicleId};
        	if (models) obj.wheels = models;
        	return this.post('/wheel/check-stag/', obj);
        }
    }
}(jQuery);

wheelpros.RideStylerAPI = function ($, settings) {
    var rideStylerUrl = 'https://api.ridestyler.net/',
    apiKey = '3cd405e4eb104ed2852043a9bd70fde5';

    return {
        load: function (url, data) {
            var lurl = url.toLowerCase(),
                urlParts = lurl.split('/'), urlStr = lurl,

                controllerSettings = urlParts[0] in settings ? settings[urlParts[0]] : {},
                urlSettings = urlStr in settings ? settings[urlStr] : {};

            return $.ajax({
                'method': 'post',
                'url': rideStylerUrl + url,
                'data': $.extend({'key': apiKey}, controllerSettings, urlSettings, data)
            });
        },
        Vehicle: function () {
            function imageRenderDataFromOptions(options) {
                options = options || {};

                options = $.extend({
                    'Width': 600,
                    'Height': 280,
                    'PositionX': 1,
                    'PositionY': 2
                }, options);

                return options;
            }

            return {
                search: function(terms) {
                    if (typeof terms === 'undefined') return false;
                    var params = [];

                    if (!$.isArray(terms)) params.push({'Search': terms.toString(), 'ID': '0'});
                    else {
                        for (var i = 0; i < terms.length; i++) {
                            params.push({'Search': terms[i].toString(), 'ID': i});
                        }
                    }
                    
                    return wheelpros.RideStylerAPI.load('vehicle/search', {'Parameters': params, 'Options': {'IncludePaintSchemes': true} });
                },
                getImage: function (options) {
                    options = $.extend({
                        'type': 'side',
                        'color': '#dedede'
                    }, options);

                    if (typeof options.configurationID === "undefined") return undefined;

                    var data = $.extend({
                        'VehicleConfiguration': options.configurationID,
                        'PaintColor': options.color,
                        'Type': options.type
                    }, imageRenderDataFromOptions(options));

                    if (typeof options.tireOptionID !== "undefined") data.VehicleTireOption = options.tireOptionID;

                    return rideStylerUrl + 'vehicle/render?' + $.param($.extend({key: apiKey}, data));
                }
            }
        }(),
        Wheel: function () {
        	return {
        		CanBeRendered: function (PartNumbers, VehicleConfiguration) {
        			if (!PartNumbers || !VehicleConfiguration) return false;
        			if (!$.isArray(PartNumbers)) PartNumbers = [PartNumbers];
                    
                    wheelpros.RideStylerAPI.load('wheel/canberendered', {
                    	'PartNumbers': PartNumbers, 
                    	'VehicleConfiguration': VehicleConfiguration
                    });
        		}
        	}
        }()
    }
}(jQuery, {});

wheelpros.vehicle = function ($) {

	var vehicleImageHolder = '/wp-content/themes/wheelpros/images/car_gray.png';
	var vehicleImageMissing = '/wp-content/themes/wheelpros/images/car_gray_coming_soon.png';
	var vehicleCookieName = 'vehicle_filter';

	function resetSelectField (field, hide) {
		field = (field instanceof $) ? field : $(field);
		field.val('');
		field.trigger('change');
		field.find('option[value!=""]').remove();
		field.attr('disabled', 'disabled');
		if (hide) field.closest('.form-group').hide();
	}

	function parseResponse (res) {
		try {
			var resp = $.parseJSON(res);
			return resp;
		}
		catch (e) {
			return null;
		}
	}

	/*****************************************************************************************
	 * Vehicle
	 ********************/
	function Vehicle (id) {
	    this.id = id;
	}

	Vehicle.prototype = {
	    getImage: function (options) {
	        options = options || {};
	        var description = this.Description;
	        if ('type' in options) {
	            if (options.type === 'side' && description.HasSideImage === false) return undefined;
	            else if (options.type === 'angle' && description.HasAngledImage === false) return undefined;
	        } else {
	            if (description.HasSideImage === false) return undefined;
	            options.type = 'side';
	        }

	        return wheelpros.RideStylerAPI.Vehicle.getImage(jQuery.extend(options, {
	            'configurationID': description.ConfigurationID,
	            'color': typeof this.paintColor !== 'undefined' ? this.paintColor : '#dedede'
	        }));
	    },
	    getDetails: function () {
	        return wheelpros.fitmentAPI.getVehicle(this.id);
	    },
	    getFullName: function () {
	    	var vehicleFullName = this.year + ' ' + this.makeName + ' ' + this.modelName;
	        vehicleFullName += (this.trim == '' ? '' : ' ' + this.trim);
	        return vehicleFullName;
	    },
	    getDescriptions: function () {
	        return wheelpros.RideStylerAPI.Vehicle.search(this.getFullName());
	    },
	    getDescription: function (type, forceRefresh) {
	    	var that = this;
	    	var def = $.Deferred(),
	    	imageAngle = type != 'angle' ? 'side' : type,
	    	forceRefresh = !!forceRefresh;
	    	if (!forceRefresh) {
	    		// Try localStorage first
	    		var desc = sessionStorage.getItem('vehicle_'+imageAngle+'_'+this.id);
	    		if (desc) {
	    			// Check how old the data, 7 days
	    			var parsedDesc = $.parseJSON(desc),
	    			nowTS = Math.floor(Date.now() / 1000);
	    			if (nowTS - parsedDesc.timestamp < 7 * 24 * 60 * 60) {
		    			def.resolve(parsedDesc);
		    			return def;
		    		}
	    		}
	    	}

	    	that.getDescriptions().done(function (res) {
				if (res.Success && res.Results[0]['Descriptions'].length) {
					var descriptions = res.Results[0]['Descriptions'];
					var selectedDescription;
					for (var i = 0; i < descriptions.length; i++) {
						var description = descriptions[i];
						if (imageAngle == 'side' && description.HasSideImage) {
							selectedDescription = description;
							break;
						}
						if (imageAngle == 'angle' && description.HasAngledImage) {
							selectedDescription = description;
							break;
						}
					}
					if (typeof selectedDescription === 'undefined') selectedDescription = descriptions[0];

					// always update localStorage
					var localStorageEntry = $.extend({timestamp: Math.floor(Date.now() / 1000)}, selectedDescription);
			        sessionStorage.setItem('vehicle_'+imageAngle+'_'+that.id, JSON.stringify(localStorageEntry));

					def.resolve(selectedDescription);
				}
				else {
					// unable to find matching descriptions
					def.reject(null);
				}
			}).fail(function (e) {
				// unable to get valid response
				def.reject(e);
			});

			return def;
	    },
	    getVariations: function (forceRefresh) {
	    	var that = this;
	    	var def = $.Deferred(),
	    	forceRefresh = !!forceRefresh;

	    	if (!forceRefresh) {
	    		// Try sessionStorage first
	    		var partNumbers = sessionStorage.getItem('vehicle_'+this.id);
	    		if (partNumbers) {
	    			partNumbers = $.parseJSON(partNumbers);
	    			def.resolve(partNumbers);
	    			return def;
	    		}
	    	}

	    	wheelpros.fitmentAPI.checkFitVehicle(this.id).done(function (res) {
	    		var sessionStorageEntry = $.parseJSON(res);
	    		sessionStorage.setItem('vehicle_'+that.id, JSON.stringify(sessionStorageEntry));
	    		def.resolve(sessionStorageEntry);
	    	}).fail(function (e) {
				// unable to get valid response
				def.reject(e);
			});

			return def;
	    },
	    getStags: function (forceRefresh) {
	    	var that = this;
	    	var def = $.Deferred(),
	    	forceRefresh = !!forceRefresh;

	    	if (!forceRefresh) {
	    		// Try sessionStorage first
	    		var stags = sessionStorage.getItem('vehicle_stags_'+this.id);
	    		if (stags) {
	    			stags = $.parseJSON(stags);
	    			def.resolve(stags);
	    			return def;
	    		}
	    	}

	    	wheelpros.fitmentAPI.checkStag(this.id).done(function (res) {
	    		var sessionStorageEntry = $.parseJSON(res);
	    		sessionStorage.setItem('vehicle_stags_'+that.id, JSON.stringify(sessionStorageEntry));
	    		def.resolve(sessionStorageEntry);
	    	}).fail(function (e) {
				// unable to get valid response
				def.reject(e);
			});

			return def;
	    },
	    updateCookie: function() {
	    	//paintColor
	    	var cookieObj = {
	    		id: this.id,
	    		year: this.year,
	    		makeName: this.makeName,
	    		modelName: this.modelName,
	    		trim: this.trim,
	    		lugNutSizeTx: this.lugNutSizeTx,
	    		boltPattern: this.boltPattern
	    	}
	    	if (typeof this.paintColor !== 'undefined') cookieObj.paintColor = this.paintColor;
	    	wheelpros.cookie.setCookie( vehicleCookieName, JSON.stringify(cookieObj), 7 );
	    }
	};

	window.Vehicle = Vehicle;

	/***********************************************************************************************
	 * VehicleSelectionForm
	 ******************************/
	function VehicleSelectionForm (container, imageOptions) {
		this.container = container;
		this.imageOptions = typeof imageOptions !== 'object' ? {} : imageOptions;
		this.selectedYear = '';
		this.selectedMake = '';
		this.selectedModel = '';
		this.selectedTrim = undefined;
	}

	VehicleSelectionForm.prototype = {
		init: function (options) {
			var container = (this.container instanceof $) ? this.container : $(this.container);
			this.yearSelect = container.find('.select_year');
			this.makeSelect = container.find('.select_make');
			this.modelSelect = container.find('.select_model');
			this.trimSelect = container.find('.select_trim');
			this.vehicleConfirm = container.find('.select_vehicle_confirm');
			this.vehicleImage = container.find('.selected_vehicle_image');
			this.vehicleInfo = container.find('.selected_vehicle_info');
			this.defaultVehicleInfo = this.vehicleInfo.length ? this.vehicleInfo.text() : '';

			var that = this;

			this.yearSelect.on('change', function () {
				that.selectYear($(this).val());
			});

			this.makeSelect.on('change', function () {
				that.selectMake($(this).val());
			});

			this.modelSelect.on('change', function () {
				that.selectModel($(this).val());
			});

			this.trimSelect.on('change', function () {
				that.selectTrim($(this).find('option:selected').data('trim'));
			});

			that.yearSelect.parent('label').addClass('loading');

			wheelpros.fitmentAPI.getYears(options).done(function (res) {
				var years = parseResponse(res);
				if ($.isArray(years)) {
					resetSelectField(that.yearSelect);
					for (var i = 0; i < years.length; i++) {
						that.yearSelect.append($('<option/>', {'value': years[i], 'text': years[i]}));
					}
					that.yearSelect.attr('disabled', false).parent('label').removeClass('loading');
				}
				else {
					alert('Failed getting Years. Please fresh the page and try again later.')
				}
			});

			// Check Cookie

		},
		selectYear: function (year) {
			this.selectedYear = year;
			var that = this;
			that.onSelectChange();
			resetSelectField(that.makeSelect);
			resetSelectField(that.modelSelect);
			resetSelectField(that.trimSelect, true);
			if (that.selectedYear != '') {
				that.makeSelect.parent('label').addClass('loading');
				wheelpros.fitmentAPI.getMakes({'year': that.selectedYear}).done(function (res) {
					var makes = parseResponse(res);
					if ($.isArray(makes)) {
						for (var i = 0; i < makes.length; i++) {
							that.makeSelect.append($('<option/>', {'value': makes[i], 'text': makes[i]}));
						}
						that.makeSelect.attr('disabled', false).parent('label').removeClass('loading');
					}
					else {
						alert('Failed getting Makes for the specified year. Please try another year.')
					}
				});
			}
		},
		selectMake: function (make) {
			this.selectedMake = make;
			var that = this;
			that.onSelectChange();
			resetSelectField(that.modelSelect);
			resetSelectField(that.trimSelect, true);
			if (that.selectedYear != '' && that.selectedMake != '') {
				that.modelSelect.parent('label').addClass('loading');
				wheelpros.fitmentAPI.getModels({'year': that.selectedYear, 'make': that.selectedMake}).done(function (res) {
					var models = $.parseJSON(res);
					if ($.isArray(models)) {
						for (var i = 0; i < models.length; i++) {
							that.modelSelect.append($('<option/>', {'value': models[i], 'text': models[i]}));
						}
						that.modelSelect.attr('disabled', false).parent('label').removeClass('loading');
					}
					else {
						alert('Failed getting Models for the specified combination. Please try another selection.')
					}
				});
			}
		},
		selectModel: function (model) {
			this.selectedModel = model;
			var that = this;
			that.onSelectChange();
			resetSelectField(that.trimSelect, true);
			if (that.selectedYear != '' && that.selectedMake != '' && that.selectedModel != '') {
				that.modelSelect.parent('label').addClass('loading');
				wheelpros.fitmentAPI.getVehicles({year: that.selectedYear, make: that.selectedMake, model: that.selectedModel}).done(function(res){
					that.modelSelect.parent('label').removeClass('loading');
					var trims = parseResponse(res);
					if ($.isArray(trims)) {
						for (var i = 0; i < trims.length; i++) {
							var thisTrim = trims[i];
							that.trimSelect.append($('<option/>', {'value': thisTrim['id'], 'text': thisTrim['trim']}).data('trim', thisTrim));
						}
						if (trims.length > 1) {
							that.trimSelect.closest('.form-group').show();
							that.trimSelect.attr('disabled', false).parent('label').removeClass('loading');
						}
						else {
							that.trimSelect.find('option').eq(1).prop('selected', true);
							that.trimSelect.trigger('change');
						}
					}
				});
			}
		},
		selectTrim: function (trim) {
			this.selectedTrim = trim;
			var that = this;
			if (typeof trim !== 'undefined') {
				var selectedVehicle = new Vehicle(trim['id']);
				$.extend(selectedVehicle, trim);
				var vehicleFullName = selectedVehicle.getFullName();
				if (that.vehicleImage.length) {
					that.vehicleImage.closest('.vehicle-image-section').addClass('loading');

					var imageAngle = typeof that.imageOptions.type === 'undefined' ? 'side' : that.imageOptions.type;

					selectedVehicle.getDescription(imageAngle, true).done(function(selectedDescription){
						$.extend(that, {'Description': selectedDescription});
						var paintSchemes = selectedDescription.PaintSchemes,
						defaultColor = paintSchemes && paintSchemes.length && paintSchemes[0]['Colors'] && paintSchemes[0]['Colors'].length ? paintSchemes[0]['Colors'][0]['Hex'] : '#dedede';
						that.paintColor = defaultColor;
						var imgUrl = wheelpros.RideStylerAPI.Vehicle.getImage($.extend({
				            'configurationID': selectedDescription.ConfigurationID,
				            'color': defaultColor,
				            'type': imageAngle
				        }, that.imageOptions));

				        that.vehicleImageUrl = imgUrl;

				        // Load image and display
				        var downloadingImage = new Image();
				        downloadingImage.onload = function () {
				        	that.vehicleImage.attr('src', this.src);
							that.vehicleImage.closest('.vehicle-image-section').removeClass('loading');
				        }
				        downloadingImage.onerror = function () {
				        	that.vehicleImage.attr('src', vehicleImageMissing);
							that.vehicleImage.closest('.vehicle-image-section').removeClass('loading');
				        }
				        downloadingImage.src = imgUrl;

						if (that.vehicleInfo.length) that.vehicleInfo.text(vehicleFullName);
						that.vehicleConfirm.attr('disabled', false);
					}).fail(function(e){
						// unable to find matching descriptions
						if (that.vehicleInfo.length) that.vehicleInfo.text(vehicleFullName);
						that.vehicleImage.attr('src', vehicleImageMissing);
						that.vehicleImage.closest('.vehicle-image-section').removeClass('loading');
						that.vehicleConfirm.attr('disabled', false);
					});
				}
				else {
					if (that.vehicleInfo.length) that.vehicleInfo.text(vehicleFullName);
					that.vehicleConfirm.attr('disabled', false);
				}
			}
		},
		onSelectChange: function () {
			this.Description = undefined;
			this.AvailableDescriptions = undefined;
			this.vehicleImageUrl = undefined;
			this.vehicleConfirm.attr('disabled', 'disabled');
			if (this.vehicleInfo.length)
				this.vehicleInfo.text(this.defaultVehicleInfo);
			if (this.vehicleImage.length) 
				this.vehicleImage.attr('src', vehicleImageHolder);
		}
	}

	window.VehicleSelectionForm = VehicleSelectionForm;

	return {
		init: function () {
		    $('body').on('click', '.cookie_remove_vehicle', function (e) {
		    	e.preventDefault();
		    	wheelpros.cookie.eraseCookie(vehicleCookieName);
		    	var goTo = $(this).data('goto');
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
		    });
		},
		onVehicleCookieChange: function () {
			/*********************
			* dom structure
			* .vehicle_cookie_container
			* 	.cookie_vehicle_image
			*	.cookie_vehicle_info
			**********************/
			var vehicleCookie = wheelpros.cookie.getCookie( vehicleCookieName );
		    if( vehicleCookie ) {
		        vehicleCookie = $.parseJSON(vehicleCookie);
		        cookieVehicle = new Vehicle(vehicleCookie.id);
		        $.extend(cookieVehicle, vehicleCookie);
		    	$('body').addClass('has-vehicle-cookie');
		    	//update staggered badge
		    	if ($('.collection-item').length)
		    		wheelpros.wheels.refreshStagBadge();

		        var sideImages = $('body').find('.cookie_vehicle_image'),
		        angleImages = $('body').find('.cookie_vehicle_image_angle'),
		        vehicleColors = $('body').find('.visualizer_vehicle_color').show();

		        var paintsUpdated = false;

		        if (sideImages.length) {
		        	cookieVehicle.getDescription('side').done(function(desc){
		        		$('body').addClass('has-vehicle-side');
		        		var sideCookieVehicle = $.extend(new Vehicle(cookieVehicle.id), cookieVehicle);
		        		$.extend(sideCookieVehicle, {'Description': desc});
		        		sideImages.each(function () {
				        	var that = $(this);
				        	wheelpros.vehicle.updateElementVehicleInfo(sideCookieVehicle, that);
				        });
				        delete sideCookieVehicle;
				        if (!paintsUpdated && vehicleColors.length) {
				        	var paintSchemes = desc.PaintSchemes;
				        	vehicleColors.empty();
				        	if (paintSchemes && paintSchemes.length) {
					        	for (var i = 0; i < paintSchemes.length; i++) {
					        		var thisPaintScheme = paintSchemes[i],
					        		thisColors = thisPaintScheme['Colors'];
					        		if (thisColors && thisColors.length) {
					        			var thisOption = $('<option/>', {'text': thisPaintScheme.SchemeName, 'value': thisColors[0]['Hex']});
					        			if (cookieVehicle.paintColor === thisColors[0]['Hex']) thisOption.prop('selected', 'selected');
					        			vehicleColors.append(thisOption);
					        		}
					        	}
					        	paintsUpdated = true;
					        	vehicleColors.trigger('change');
					        }
					        else vehicleColors.parent().hide();
				        }
		        	}).fail(function(){
		        		$('body').removeClass('has-vehicle-side');
		        		sideImages.each(function(){
		        			$(this).attr('src', vehicleImageMissing);
		        		})
		        	});
		        }
		        if (angleImages.length) {
		        	cookieVehicle.getDescription('angle').done(function(desc){
		        		$('body').addClass('has-vehicle-angle');
		        		var angleCookieVehicle = $.extend(new Vehicle(cookieVehicle.id), cookieVehicle);
		        		$.extend(angleCookieVehicle, {'Description': desc});
		        		angleImages.each(function () {
				        	var that = $(this);
				        	wheelpros.vehicle.updateElementVehicleInfo(angleCookieVehicle, that);
				        });
				        delete angleCookieVehicle;
				        if (!paintsUpdated && vehicleColors.length) {
				        	var paintSchemes = desc.PaintSchemes;
				        	vehicleColors.empty();
				        	if (paintSchemes && paintSchemes.length) {
					        	for (var i = 0; i < paintSchemes.length; i++) {
					        		var thisPaintScheme = paintSchemes[i],
					        		thisColors = thisPaintScheme['Colors'];
					        		if (thisColors && thisColors.length) {
					        			var thisOption = $('<option/>', {'text': thisPaintScheme.SchemeName, 'value': thisColors[0]['Hex']});
					        			if (cookieVehicle.paintColor === thisColors[0]['Hex']) thisOption.prop('selected', 'selected');
					        			vehicleColors.append(thisOption);
					        		}
					        	}
				        		paintsUpdated = true;
				        		vehicleColors.trigger('change');
					        }
					    	else vehicleColors.parent().hide();
				        }
		        	}).fail(function(){
		        		$('body').removeClass('has-vehicle-angle');
		        		angleImages.each(function(){
		        			$(this).attr('src', vehicleImageMissing);
		        		})
		        	});
		        }
		    	
		        $('body').find('.cookie_vehicle_info').text(cookieVehicle.getFullName());
		        $('#vehicleModal').addClass('has-vehicle');

		        // Check saved wheels
		    }
		    else {
		    	$('body').removeClass('has-vehicle-cookie');
		    	$('body').find('.cookie_vehicle_info').text('NO SAVED VEHICLE');
		    	$('body').find('.cookie_vehicle_image').attr('src', vehicleImageHolder);
		    	cookieVehicle = undefined;
		        $('#vehicleModal').removeClass('has-vehicle');
		    }
		},
		onVehicleCookieUpdate: function() {
			// vehicle not change, but properties change (like color)
			 var sideImages = $('body').find('.cookie_vehicle_image'),
			 angleImages = $('body').find('.cookie_vehicle_image_angle');
			 if (cookieVehicle) {
				if (sideImages.length) {
		        	cookieVehicle.getDescription('side').done(function(desc){
		        		var sideCookieVehicle = $.extend(new Vehicle(cookieVehicle.id), cookieVehicle);
		        		$.extend(sideCookieVehicle, {'Description': desc});
		        		sideImages.each(function () {
				        	var that = $(this);
				        	wheelpros.vehicle.updateElementVehicleInfo(sideCookieVehicle, that);
				        });
				        delete sideCookieVehicle;
		        	}).fail(function(){
		        		$('body').removeClass('has-vehicle-side');
		        		sideImages.each(function(){
		        			$(this).attr('src', vehicleImageMissing);
		        		})
		        	});
		        }
		        if (angleImages.length) {
		        	cookieVehicle.getDescription('angle').done(function(desc){
		        		var angleCookieVehicle = $.extend(new Vehicle(cookieVehicle.id), cookieVehicle);
		        		$.extend(angleCookieVehicle, {'Description': desc});
		        		angleImages.each(function () {
				        	var that = $(this);
				        	wheelpros.vehicle.updateElementVehicleInfo(angleCookieVehicle, that);
				        });
				        delete angleCookieVehicle;
		        	}).fail(function(){
		        		$('body').removeClass('has-vehicle-angle');
		        		angleImages.each(function(){
		        			$(this).attr('src', vehicleImageMissing);
		        		})
		        	});
		        }
			}
		},
		updateElementVehicleInfo: function (veh, ele, extraOptions) {
			if (!(veh instanceof Vehicle)) return;
			if (!(ele instanceof $)) ele = $(ele);

	    	var options = typeof ele.data('options') === 'undefined' ? {} : $.extend({}, ele.data('options'));

	    	if (extraOptions) $.extend(options, extraOptions);

	    	if (typeof veh.paintColor !== 'undefined') options.color = veh.paintColor;
	    	if (typeof veh.Visualizer !== 'undefined' && veh.Visualizer.WheelOn) {
	    		options.WheelPartNumber = veh.Visualizer.WheelOn.part_number;
	    	}

	    	ele.closest('.vehicle_cookie_container').addClass('loading');

	    	//options = parseResponse(options);
	    	cookieVehicleImageUrl = veh.getImage(options);

	    	// Load image and display
	        var downloadingImage = new Image();
	        downloadingImage.onload = function () {
	        	ele.attr('src', this.src);
				ele.closest('.vehicle_cookie_container').removeClass('loading');
	        }
	        downloadingImage.onerror = function () {
	        	ele.attr('src', vehicleImageMissing);
				ele.closest('.vehicle_cookie_container').removeClass('loading');
	        }
	        downloadingImage.src = cookieVehicleImageUrl;
		}
	}
}(jQuery);


/*****************************************************************************************
 * Product
 ********************/
function Product (id) {
    this.product_id = id;
}

Product.prototype = {
	load: function () {
		var that = this;
		var def = jQuery.Deferred();
	    var prod = jQuery.ajax({
	        'method': 'get',
	        'url': '/wp-json/wheelpros/v1/product/description',
	        'data': {'id': that.product_id}
	    }).done(function (res) {
	    	if (res.success) {
	    		var result = res['results'][0];
	    		if (result.product_id == that.product_id) jQuery.extend(that, result);
	    		def.resolve(that);
	    	}
	    }).fail(function (e) {
	    	def.reject(e);
	    });
	    return def;
	}
};

window.Product = Product;

wheelpros.wheels = function ($) {
	var pageSize = 3, currentPage = 0;

	var $savedWheelsWrap = $('.saved-wheels-wrap');
	var $visualizerWrap = $('#vehicleModal');

	function buildSavedWheelRow (wheel, visArray) {
		var left = $('<img/>', {'src': wheel.thumbnail, 'class': 'saved-wheel-thumbnail'}),
		title = $('<h4/>', {'text': wheel.name}).append($('<a/>', {'href': 'javascript:void(0);', 'class': 'saved-wheel-remove'}).append($('<i/>', {'class': 'fal fa-trash-alt'}))),
		infoWrap = $('<div/>', {'class': 'text-secondary product-details-brief'}),
		diameters = $('<p/>', {'class': 'm-0'}).text('Diameters: ' + wheel.diameters),
		finish = $('<p/>', {'class': 'm-0'}).text('Finish: ' + wheel.finish),
		detailsBtn = $('<a/>', {'href': wheel.product_url, 'class': 'btn btn-details d-block btn-primary', 'text': 'VIEW DETAILS'}),
		viewBtn = $('<a/>', {'href': 'javascript:void(0);', 'class': 'btn btn-details btn-outline-primary btn-visualize mt-1', 'text': 'VISUALIZE'});

		infoWrap.append(finish).append(diameters);

		var btnGroup = $('<div/>', {'class': 'py-3 px-2 d-block d-md-table-cell align-top fit-md-cell'}).append(detailsBtn);

		if ($.isArray(visArray) && $.inArray(wheel.part_number, visArray) > -1) btnGroup.append(viewBtn);

		return $('<div/>', {'class': 'd-block d-md-table-row saved-wheel-item'}).data('product', wheel).append($('<div/>', {'class': 'd-block d-md-table-cell p-2 saved-image-wrap'}).append(left)).append($('<div/>', {'class': 'py-3 px-2 d-block d-md-table-cell align-top'}).append(title).append(infoWrap)).append(btnGroup);
	}

	function cookieData(wheels) {
		var cookieArray = [];
		for (var i = 0; i < wheels.length; i++) {
			cookieArray.push({product_id: wheels[i]['product_id'], part_number: wheels[i]['part_number']});
		}
		return cookieArray;
	}

	function parseResponse (res) {
		try {
			var resp = $.parseJSON(res);
			return resp;
		}
		catch (e) {
			return null;
		}
	}

	return {
		savedWheels: [],
		init: function () {
			var that = this;
			// load Saved Wheels
			var savedWheelsCookie = wheelpros.cookie.getCookie( 'saved_wheels');
			if (savedWheelsCookie) {
				that.savedWheels = $.parseJSON(savedWheelsCookie);
				that.refreshSavedStars();
			}
			that.onSavedWheelsChange();
			that.rebuildSavedPagination();

			// Event Handling
			$('body').on('click', '.save_the_wheel', function () {
				var $that = $(this),
				collectionItem = $that.closest('.collection-item'),
				productId = collectionItem.data('product-id'),
				sku = collectionItem.data('sku');

				if (typeof productId !== 'undefined') {
					if ($that.is('.active')) 
						that.remove(productId);
					else 
						that.add({product_id: productId, part_number: sku});
				}
			});

			$('.saved-wheels-pagination').on('click', '.page-numbers', function () {
				var $that = $(this);
				if ($that.is('.next')) currentPage ++;
				if ($that.is('.prev')) currentPage --;
				if (typeof $that.data('page') !== 'undefined') currentPage = $that.data('page');
				that.showWheelsByPage(currentPage, function () {
					that.rebuildSavedPagination();
				});
			});

			$('body').on('click', '.btn-visualize', function () {
				var $that = $(this);
				var wheel = $that.closest('.saved-wheel-item').data('product');
				that.onVisualize(wheel, true);
			});

			$('body').on('click', '.saved-wheel-remove', function () {
				var $that = $(this);
				var wheel = $that.closest('.saved-wheel-item').data('product');
				if (cookieVehicle && cookieVehicle.Visualizer) {
					if (cookieVehicle.Visualizer.WheelOn.id == wheel.id) {
						// Visualize nothing reset the visualizer
						that.onVisualize();
					}
				}
				that.remove(wheel);
			});

			$('body').on('click', '.btn-inline-visualize', function () {
				var collectionItem = $(this).closest('.collection-item');
				var wheel = {part_number: collectionItem.data('sku'), name: collectionItem.data('name'), finish: collectionItem.data('finish'), model_code: collectionItem.data('model'), id: collectionItem.data('product-id')};
				that.onVisualize(wheel, true);
				$('#vehicleModal').modal('show');
			});

			$visualizerWrap.on('change', '.visualizer_wheel_diameter', function(){
				var $that = $(this),
				wheel = $that.data('wheel');
				if (wheel) {
					var thisDiameter = $that.val(),
					thisSku = $that.find('option:selected').eq(0).data('sku');
					wheel.part_number = thisSku;
					wheel.diameter = thisDiameter;
					that.onVisualize(wheel);
				}
			});

		    $('body').on('change', '.visualizer_vehicle_color', function(){
		    	var $that = $(this),
		    	thisColor = $that.val();
		    	if (cookieVehicle) cookieVehicle.paintColor = thisColor;
		    	cookieVehicle.updateCookie();
		    	//wheelpros.vehicle.onVehicleCookieChange();
		    	if (cookieVehicle.Visualizer && cookieVehicle.Visualizer.WheelOn) {
		    		wheelpros.vehicle.onVehicleCookieUpdate();
		    	}
		    	// update color
		    })
		},
		add: function (wheel) {
			var that = this,
			foundWheels = that.savedWheels.filter(function (item) {
				return item.product_id == wheel.product_id;
			});

			if (!foundWheels.length) {
				that.savedWheels.unshift(wheel);
				//Update cookie
				wheelpros.cookie.setCookie('saved_wheels', JSON.stringify(cookieData(that.savedWheels)), 7);
				that.onSavedWheelsChange();
			}
			else {
				console.log('Exists already.');
			}
			that.refreshSavedStars();
		},
		remove: function (wheel) {
			var that = this;
			wheel = wheel instanceof Product ? wheel.product_id : wheel;
			var filteredWheels = that.savedWheels.filter(function (item) {
				return item.product_id != wheel;
			});
			// Update Cookie
			that.savedWheels = filteredWheels;
			wheelpros.cookie.setCookie('saved_wheels', JSON.stringify(cookieData(that.savedWheels)), 7);
			that.refreshSavedStars();
			that.onSavedWheelsChange();
		},
		onSavedWheelsChange: function () {
			var that = this;
			currentPage = 0;
			if (that.savedWheels.length) {
				$savedWheelsWrap.find('.alert').remove();
				that.showWheelsByPage(currentPage, function () {
					that.rebuildSavedPagination();
				});
			}
			else {
				$('.saved-wheels-tbody').empty();
				if ($savedWheelsWrap.length) {
					$('<div/>', {'class': 'alert alert-light text-center p-4', 'role': 'alert', 'text': 'There are no saved wheels.'}).prependTo($savedWheelsWrap);
				}
			}
			$('.saved_count').text(that.savedWheels.length);
		},
		showWheelsByPage: function (page, callback) {
			var that = this,
			alreadyShowed = page*pageSize;
			if (alreadyShowed >= that.savedWheels.length) return;
			var diffAmount = that.savedWheels.length - alreadyShowed;
			amount = diffAmount > 3 ? 3 : diffAmount;
			var needAjaxArray = [];
			$savedWheelsWrap.addClass('loading');
			for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
				if (!(that.savedWheels[i] instanceof Product)) {
					var thisWheelObj = new Product(that.savedWheels[i].product_id);
					that.savedWheels[i] = $.extend(thisWheelObj, that.savedWheels[i]);
				}

				// Check if data loaded
				if (typeof that.savedWheels[i].name === 'undefined') {
					// if not, load it, and push to ajax pool
					needAjaxArray.push(that.savedWheels[i].load());
				}
			}
			if (needAjaxArray.length) {
				$.when.apply(undefined, needAjaxArray).then(function () {
					$('.saved-wheels-tbody').empty();
					if (cookieVehicle)
						cookieVehicle.getVariations().done(function (res) {
							for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
								$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i], res));
							}
							$savedWheelsWrap.removeClass('loading');
							if (typeof callback === 'function') callback();
						}).fail(function () {
							for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
								$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i]));
							}
							$savedWheelsWrap.removeClass('loading');
							if (typeof callback === 'function') callback();
						});
					else {
						for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
							$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i]));
						}
						$savedWheelsWrap.removeClass('loading');
						if (typeof callback === 'function') callback();
					}
				})
			}
			else {
				$('.saved-wheels-tbody').empty();
				if (cookieVehicle) 
					cookieVehicle.getVariations().done(function (res) {
						for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
							$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i], res));
						}
						$savedWheelsWrap.removeClass('loading');
						if (typeof callback === 'function') callback();
					}).fail(function () {
						for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
							$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i]));
						}
						$savedWheelsWrap.removeClass('loading');
						if (typeof callback === 'function') callback();
					});
				else {
					for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
						$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i]));
					}
					$savedWheelsWrap.removeClass('loading');
					if (typeof callback === 'function') callback();
				}
				/*for (var i = alreadyShowed; i < alreadyShowed + amount; i++) {
					$('.saved-wheels-tbody').append(buildSavedWheelRow(that.savedWheels[i]));
				}
				$savedWheelsWrap.removeClass('loading');
				if (typeof callback === 'function') callback();*/
			}
		},
		rebuildSavedPagination: function () {
			var that = this;
			var totalPage = Math.ceil(that.savedWheels.length / pageSize);

			$('.saved-wheels-pagination').empty();

			if (totalPage < 2) return;

			if (currentPage > 0) {
				$('<a/>', {'class': 'prev page-numbers', 'href': 'javascript:void(0);', 'text': '« Prev'}).appendTo('.saved-wheels-pagination');
				$('<a/>', {'class': 'page-numbers', 'href': 'javascript:void(0);', 'data-page': currentPage - 1, 'text': currentPage}).appendTo('.saved-wheels-pagination');
			}
			$('<span/>', {'class': 'page-numbers text-primary', 'aria-current': 'page', 'text': currentPage + 1}).appendTo('.saved-wheels-pagination');
			if (currentPage < totalPage - 1) {
				$('<a/>', {'class': 'page-numbers', 'href': 'javascript:void(0);', 'data-page': currentPage + 1, 'text': currentPage + 2}).appendTo('.saved-wheels-pagination');
				$('<a/>', {'class': 'next page-numbers', 'href': 'javascript:void(0);', 'text': 'Next »'}).appendTo('.saved-wheels-pagination');
			}
		},
		onVisualize: function (wheel, modelChanged) {
			var thatImage = $visualizerWrap.find('.cookie_vehicle_image_angle');

			$visualizerWrap.find('.visualizer-info-row').removeClass('active');
			$visualizerWrap.find('.visualizer_wheel_name').empty();
			$visualizerWrap.find('.visualizer_wheel_finish').empty();

			if (typeof cookieVehicle !== 'undefined') {
	        	thatImage.closest('.vehicle_cookie_container').addClass('loading');
        		
        		cookieVehicle.getDescription('angle').done(function(desc){
	        		var angleCookieVehicle = $.extend(new Vehicle(cookieVehicle.id), cookieVehicle);
	        		$.extend(angleCookieVehicle, {'Description': desc});

	        		if (wheel) {
	        			$.extend(cookieVehicle, {Visualizer: {WheelOn: wheel}});

						$visualizerWrap.find('.visualizer-info-row').addClass('active');
						$visualizerWrap.find('.visualizer_wheel_name').text(wheel.name);
						$visualizerWrap.find('.visualizer_wheel_finish').text(wheel.finish);

						if (modelChanged) {
							$visualizerWrap.find('.visualizer_wheel_diameter').empty();
							wheelpros.fitmentAPI.getWheelsByVehicle({fitsVehicle: cookieVehicle.id, modelCode: wheel.model_code}).done(function(res){
								var wheels = parseResponse(res);
								if (wheels && wheels.length) {
									var filteredWheels = [];
									//filter results by finish
									for (var i = 0; i < wheels.length; i++) {
										var thisWheel = wheels[i];
										if (thisWheel.finishDescription.toUpperCase() == wheel.finish.toUpperCase()) {
											filteredWheels.push(thisWheel);
										}
									}
									filteredWheels.sort(function(a, b) {
										return a.diameter > b.diameter;
									});
									var displayedDiamters = [];
									for (var i = 0; i < filteredWheels.length; i++) {
										var thisWheel = filteredWheels[i];
										var thisDiameter = thisWheel['diameter'];
										if ($.inArray(thisDiameter, displayedDiamters) == -1) {
											var thisOption = $('<option/>', {'value': thisDiameter, 'data-sku': thisWheel['partNumber']}).text(thisDiameter);
											if (i == 0) {
												thisOption.prop('selected', 'selected');
												wheel.part_number = thisWheel['partNumber'];
											}

											$visualizerWrap.find('.visualizer_wheel_diameter').append(thisOption);
											displayedDiamters.push(thisDiameter);
										}
									}

									$visualizerWrap.find('.visualizer_wheel_diameter').data('wheel', wheel);

									wheelpros.vehicle.updateElementVehicleInfo(angleCookieVehicle, thatImage, {'WheelPartNumber': wheel.part_number});
								}
								else
									thatImage.attr('src', vehicleImageMissing);

								delete angleCookieVehicle;
							});
						}
						else {
							wheelpros.vehicle.updateElementVehicleInfo(angleCookieVehicle, thatImage, {'WheelPartNumber': wheel.part_number});
							delete angleCookieVehicle;
						}
	        		}
	        		else {
				    	cookieVehicle.Visualizer = undefined;
				    	wheelpros.vehicle.updateElementVehicleInfo(angleCookieVehicle, thatImage);
				    	delete angleCookieVehicle;
				    }

	        	}).fail(function(){
	        		thatImage.attr('src', vehicleImageMissing);
	        	});
			}
		},
		refreshSavedStars: function () {
			$('.save_the_wheel').each(function () {
				var $that = $(this),
				collectionItem = $that.closest('.collection-item'),
				productId = collectionItem.data('product-id');
				var isActive = false;
				for (var i = 0; i < wheelpros.wheels.savedWheels.length; i++) {
					var thisSavedWheel = wheelpros.wheels.savedWheels[i];
					if (productId == thisSavedWheel.product_id) {
						isActive = true;
						break;
					}
				}
				if (isActive) {
					$that.addClass('active');
					collectionItem.addClass('active');
					$that.find('i').addClass('fas');
				}
				else {
					$that.removeClass('active');
					collectionItem.removeClass('active');
					$that.find('i').removeClass('fas');
				}
			});
		},
		refreshStagBadge: function() {
			if (typeof cookieVehicle !== 'undefined') {
				cookieVehicle.getStags().done(function(stags) {
					console.log(stags);
					$('.collection-item').each(function(){
						var $that = $(this),
						model = $that.data('model'),
						finish = $that.data('finish');
						var isStag = false;
						for (var i = 0; i < stags.length; i++) {
							var thisStag = stags[i];
							if (thisStag.modelCode == model && thisStag.finishDescription.toUpperCase() == finish.toUpperCase()) {
								isStag = thisStag['isStag'];
								break;
							}
						}
						if (isStag) {
							var stagTag = $('<span/>', {'class': 'product-tag stag-tag', 'text': 'STAGGERED '}),
							stagIcon = $('<i/>', {'class': 'fal fa-info-circle stag-tooltip', 'title': 'This wheel is available in staggered fitments'}).tooltip({'trigger': 'manual'});
							stagIcon.on('click', function(){
								$('body').find('.stag-tooltip').not(this).tooltip('hide');
								$(this).tooltip('toggle');
							});
							stagTag.append(stagIcon);
							$that.find('.item-image-container').append(stagTag);
						}
					})
				});
			}
		}
	}
}(jQuery);