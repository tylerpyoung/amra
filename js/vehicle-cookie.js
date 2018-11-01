var vehicleCookie, chosenYear, chosenMake, chosenModel, chosenVehicle;
var minYear = 2012;
if( typeof wheelpros_fitment_vars !== 'undefined' ) {
    // console.log('wheelpros_fitment_vars', wheelpros_fitment_vars);
    var vehicleTypes = wheelpros_fitment_vars['vehicleTypes'];
} else {
    // console.log('Error: Unable to get vehicleTypes!');
    var vehicleTypes = '';
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    setCookie(name, '', -1);
    document.cookie = name+'=; Max-Age=-99999999;';
}

function fitmentRequest(query_uri, callback) {
    jQuery('#vehicle-filter-modal .modal-body select').prop('disabled', true);
    jQuery('#vehicle_filter_apply').prop('disabled', true);
    jQuery('#vehicle-filter-modal .modal-body, #vehicle-filter-modal .modal-footer').css({ 'opacity': '0.5' });

    query_uri = encodeURI(query_uri);
    //console.log('fitmentRequest URI = '+query_uri);

    if( typeof callback === 'function' ) {
        if( typeof fitment_ajax_nonce !== 'undefined' ) {
            jQuery.ajax({
                type:       'POST',
                method:		'POST',
                url:		fitment_ajax_url,
                data:		{
                    'query_uri': query_uri,
                    '_wpnonce': fitment_ajax_nonce,
                },
                //dataType:   'json',
                success:	function( response ) {
                    if( jQuery('#vehicle_filter_body').length ) {
                        jQuery('#vehicle_filter_unavailable').hide();
                        jQuery('#vehicle_filter_body').show();
                    }
                    jQuery('#vehicle-filter-modal .modal-body, #vehicle-filter-modal .modal-footer').css({ 'opacity': '1' });
                    callback( parseResponse( response ) );
                },
                error:      function( err ) {
                    console.log('Vehicle Fitment API Error (URI: '+query_uri+'): ', err);
                    if( jQuery('#vehicle_filter_body').length == 0 ) {
                        jQuery('#vehicle-filter-modal .modal-body').wrapInner('<div id="vehicle_filter_body"></div>');
                        jQuery('#vehicle-filter-modal .modal-body').prepend('<div id="vehicle_filter_unavailable"><center><h3>Uh oh!</h3>The vehicle filter is unavailable at the moment. Please check back later.</center></div>');
                    }
                    jQuery('#vehicle-filter-modal .modal-body, #vehicle-filter-modal .modal-footer').css({ 'opacity': '1' });
                    jQuery('#vehicle_filter_body').hide();
                    jQuery('#vehicle_filter_unavailable').show();
                }
            });
        } else {
            // console.log('Error: Unable to get vehicle data. Access Denied.');
        }
    } else {
        // console.log('Error: Callback is not a function.');
    }
}

function parseResponse(response) {
    try {
        response = JSON.parse(response);
        if( typeof response === 'object' ) {
            return response;
        }
    } catch( err ) {
        // console.log('JSON.parse Error: '+err, response);
    }
    // console.log('Error: Unable to load response.', response);
    return [];
}

function getYears(callback) {
    // http://localhost:17083/api/v1/vehicle/years
    //var response = '[2018,2017,2016,2015]';
    if( vehicleTypes.length ) {
        fitmentRequest('/vehicle/years/?minYear='+minYear+'&vehicleTypes='+vehicleTypes, callback);
    } else {
        fitmentRequest('/vehicle/years/?minYear='+minYear, callback);
    }
}

function getMakes(chosenYear, callback) {
    // http://localhost:17083/api/v1/vehicle/makes?year=2018
    //var response = '["Acura","Alfa Romeo","Aston Martin","Audi"]';
    if( vehicleTypes.length ) {
        fitmentRequest('/vehicle/makes/?year='+chosenYear+'&vehicleTypes='+vehicleTypes, callback);
    } else {
        fitmentRequest('/vehicle/makes/?year='+chosenYear, callback);
    }
}

function getModels(chosenYear, chosenMake, callback) { // ;)
    // http://localhost:17083/api/v1/vehicle/models?year=2018&make=Acura
    //var response = '["RDX","TLX"]';
    if( vehicleTypes.length ) {
        fitmentRequest('/vehicle/models/?year='+chosenYear+'&make='+chosenMake+'&vehicleTypes='+vehicleTypes, callback);
    } else {
        fitmentRequest('/vehicle/models/?year='+chosenYear+'&make='+chosenMake, callback);
    }
}

function getWheels(chosenVehicleId, callback) {
    // http://localhost:17083/api/v1/wheel/search?fitsVehicle=123
    //var response = '[{"partNumber":"M36-018737","upc":"761138759795","brandName":"Motegi","modelName":"DV5","modelNumber":"2448","finishCategory":"BLACK","finishDescription":"Gloss Black With Clearcoat","sizeDescription":"17 x 7","diameter":17,"width":7,"centerbore":72.6,"offset":42,"loadRating":1200,"weight":18,"boltPatterns":[],"lastUpdated":"2017-12-04T01:00:05.763","attributes":{"teflonCoated":false,"pvdFinish":false,"stainlessLip":false,"flowFormed":false,"forged":false,"twoPiece":false,"steelWheel":false,"trueBeadLock":false,"offRoadUseOnly":false},"resources":{"catalogImageUrl":"http://images.wheelpros.com/hMR2443.png","accessoryPortalUrl":null}},{"partNumber":"M12-00756","upc":"761138759795","brandName":"Motegi","modelName":"DV5","modelNumber":"2448","finishCategory":"BLACK","finishDescription":"Gloss Black With Clearcoat","sizeDescription":"17 x 7","diameter":17,"width":7,"centerbore":72.6,"offset":42,"loadRating":1200,"weight":18,"boltPatterns":[],"lastUpdated":"2017-12-04T01:00:05.763","attributes":{"teflonCoated":false,"pvdFinish":false,"stainlessLip":false,"flowFormed":false,"forged":false,"twoPiece":false,"steelWheel":false,"trueBeadLock":false,"offRoadUseOnly":false},"resources":{"catalogImageUrl":"http://images.wheelpros.com/hMR2443.png","accessoryPortalUrl":null}},{"partNumber":"M26-04756","upc":"761138759795","brandName":"Motegi","modelName":"DV5","modelNumber":"2448","finishCategory":"BLACK","finishDescription":"Gloss Black With Clearcoat","sizeDescription":"17 x 7","diameter":17,"width":7,"centerbore":72.6,"offset":42,"loadRating":1200,"weight":18,"boltPatterns":[],"lastUpdated":"2017-12-04T01:00:05.763","attributes":{"teflonCoated":false,"pvdFinish":false,"stainlessLip":false,"flowFormed":false,"forged":false,"twoPiece":false,"steelWheel":false,"trueBeadLock":false,"offRoadUseOnly":false},"resources":{"catalogImageUrl":"http://images.wheelpros.com/hMR2443.png","accessoryPortalUrl":null}},{"partNumber":"M33-02756","upc":"761138759795","brandName":"Motegi","modelName":"DV5","modelNumber":"2448","finishCategory":"BLACK","finishDescription":"Gloss Black With Clearcoat","sizeDescription":"17 x 7","diameter":17,"width":7,"centerbore":72.6,"offset":42,"loadRating":1200,"weight":18,"boltPatterns":[],"lastUpdated":"2017-12-04T01:00:05.763","attributes":{"teflonCoated":false,"pvdFinish":false,"stainlessLip":false,"flowFormed":false,"forged":false,"twoPiece":false,"steelWheel":false,"trueBeadLock":false,"offRoadUseOnly":false},"resources":{"catalogImageUrl":"http://images.wheelpros.com/hMR2443.png","accessoryPortalUrl":null}},{"partNumber":"M35-018756M","upc":"761138759795","brandName":"Motegi","modelName":"DV5","modelNumber":"2448","finishCategory":"BLACK","finishDescription":"Gloss Black With Clearcoat","sizeDescription":"17 x 7","diameter":17,"width":7,"centerbore":72.6,"offset":42,"loadRating":1200,"weight":18,"boltPatterns":[],"lastUpdated":"2017-12-04T01:00:05.763","attributes":{"teflonCoated":false,"pvdFinish":false,"stainlessLip":false,"flowFormed":false,"forged":false,"twoPiece":false,"steelWheel":false,"trueBeadLock":false,"offRoadUseOnly":false},"resources":{"catalogImageUrl":"http://images.wheelpros.com/hMR2443.png","accessoryPortalUrl":null}}]';
    fitmentRequest('/wheel/search/?fitsVehicle='+chosenVehicleId, callback);
}

function getVehicles(chosenYear, chosenMake, chosenModel, callback) {
    // http://localhost:17083/api/v1/vehicle/search?year=2018&make=Acura&model=RDX
    //var response = '[{"id": 25513, "year": '+chosenYear+', "makeName": "'+chosenMake+'", "modelName": "'+chosenModel+'","trim": "", "boltPattern": "4x156.30", "lugNutSizeTx": "12mmX1.5"}]';
    fitmentRequest('/vehicle/search/?year='+chosenYear+'&make='+chosenMake+'&model='+chosenModel, callback);
}

function getSavedVehicle(vehicleId, callback) {
    // http://localhost:17083/api/v1/vehicle/search?year=2018&make=Acura&model=RDX
    //var response = '[{"id": 25513, "year": '+chosenYear+', "makeName": "'+chosenMake+'", "modelName": "'+chosenModel+'","trim": "", "boltPattern": "4x156.30", "lugNutSizeTx": "12mmX1.5"}]';
    fitmentRequest('/vehicle/?id='+vehicleId, callback);
}

function changeYear(new_year, skip_cookie) {
    if( skip_cookie !== true ) {
        vehicleCookie = false;
    }
    jQuery('#vehicle-filter-make').off('change').find('option[value][value!=""]').remove();
    jQuery('#vehicle-filter-model').off('change').find('option[value][value!=""]').remove();
    chosenYear = new_year;
    if( chosenYear.length ) {
        getMakes( chosenYear, callbackMakes );
    }
}

function callbackYears( allYears ) {
    if( allYears.length ) {
        for( var i=0; i<allYears.length; i++ ) {
            jQuery('#vehicle-filter-year').append('<option value="'+allYears[i]+'">'+allYears[i]+'</option>');
        }

        // Enable year dropdown
        jQuery('#vehicle-filter-year').prop('disabled', false);

        // On year select
        jQuery('#vehicle-filter-year').off('change').change(function() {
            changeYear(jQuery(this).val());
        });

        // Check for cookie value
        if( vehicleCookie ) {
            jQuery('#vehicle-filter-year option[value="'+vehicleCookie['year']+'"]').prop('selected', true);
            //jQuery('#vehicle-filter-year').change();
            changeYear(jQuery('#vehicle-filter-year').val(), true);
        }
    } else {
        // console.log('Error: No years found.');
    }
}

function changeMake(new_make, skip_cookie) {
    if( skip_cookie !== true ) {
        vehicleCookie = false;
    }
    jQuery('#vehicle-filter-model').off('change').find('option[value][value!=""]').remove();
    chosenMake = new_make;
    if( chosenMake.length ) {
        getModels(chosenYear, chosenMake, callbackModels);
    }
}

function callbackMakes( allMakes ) {
    if( allMakes.length ) {
        for( var j=0; j<allMakes.length; j++ ) {
            jQuery('#vehicle-filter-make').append('<option value="'+allMakes[j]+'">'+allMakes[j]+'</option>');
        }

        // Enable year and make dropdowns
        jQuery('#vehicle-filter-year').prop('disabled', false);
        jQuery('#vehicle-filter-make').prop('disabled', false);

        // On make select
        jQuery('#vehicle-filter-make').off('change').change(function() {
            changeMake(jQuery(this).val());
        });

        // Check for cookie value
        if( vehicleCookie ) {
            jQuery('#vehicle-filter-make option[value="'+vehicleCookie['makeName']+'"]').prop('selected', true);
            //jQuery('#vehicle-filter-make').change();
            changeMake(jQuery('#vehicle-filter-make').val(), true);
        }

    } else {
        alert('No wheels found for the specified year.');
    }
}

function changeModel(new_model, skip_cookie) {
    if( skip_cookie !== true ) {
        vehicleCookie = false;
    }
    chosenModel = new_model;
    if( chosenModel.length ) {
        getVehicles(chosenYear, chosenMake, chosenModel, callbackVehicles);
    }
}

function callbackModels( allModels ) {
    if( allModels.length ) {
        for( var k=0; k<allModels.length; k++ ) {
            jQuery('#vehicle-filter-model').append('<option value="'+allModels[k]+'">'+allModels[k]+'</option>');
        }

        // Enable all dropdowns
        jQuery('#vehicle-filter-year').prop('disabled', false);
        jQuery('#vehicle-filter-make').prop('disabled', false);
        jQuery('#vehicle-filter-model').prop('disabled', false);

        // On model select
        jQuery('#vehicle-filter-model').off('change').change(function() {
            changeModel(jQuery(this).val());
        });

        // Check for cookie value
        if( vehicleCookie ) {
            jQuery('#vehicle-filter-model option[value="'+vehicleCookie['modelName']+'"]').prop('selected', true);
            //jQuery('#vehicle-filter-model').change();
            changeModel(jQuery('#vehicle-filter-model').val(), true);
        }
    } else {
        alert('No wheels found for the specified make and year.');
    }
}

function callbackVehicles( allVehicles ) {
    if( allVehicles.length ) {
        chosenVehicle = allVehicles[0];

        // Enable all dropdowns and apply button
        jQuery('#vehicle-filter-year').prop('disabled', false);
        jQuery('#vehicle-filter-make').prop('disabled', false);
        jQuery('#vehicle-filter-model').prop('disabled', false);
        jQuery('#vehicle_filter_apply').prop('disabled', false);

    } else {
        alert('Sorry, vehicle not found. Please try again later.');
    }
}

jQuery(function($){
    // Check for cookie
    vehicleCookie = getCookie( 'vehicle_filter' );
    if( vehicleCookie ) {
        //console.log('vehicleCookie = '+vehicleCookie);
        vehicleCookie = JSON.parse(vehicleCookie);
    }

    if( $('#wheel-filter-modal').length ) {
        // Populate years
        getYears( callbackYears );

        // Apply filter
        $('#vehicle_filter_apply').click(function(){
            if($(this).is(':not(:disabled)')) {

                // Disable dropdowns, button, and lower opacity
                jQuery('#vehicle-filter-modal .modal-body select').prop('disabled', true);
                jQuery('#vehicle_filter_apply').prop('disabled', true);
                jQuery('#vehicle-filter-modal .modal-body, #vehicle-filter-modal .modal-footer').css({ 'opacity': '0.5' });

                // Set cookie
                setCookie( 'vehicle_filter', JSON.stringify(chosenVehicle), 7 );

                // Refresh page
                setTimeout(function(){
                    window.location.reload();
                }, 100);
            }
        });

        // Remove filter
        $('#vehicle_filter_remove').click(function(){
            // Remove cookie
            eraseCookie( 'vehicle_filter' );

            // Refresh page
            window.location.reload();
        });
    }

});
