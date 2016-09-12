(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        exports = factory( root, require('turf'), require('AQITurf') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['exports', 'turf', 'AQITurf'], factory);
    } else {
        // Browser globals
        factory( root, root.turf, root.AQITurf );
    }
}(this, function ( module, turf, AQITurf ) {

function AQITin(options) {
	this.setOptions(options);
}

AQITin.prototype = new AQITurf();

/**
 * update the aqi data
 * 
 * @param data aqi data
 * @return is the aqi data updated
 */
AQITin.prototype.updateAqiData = function(data) {
	
	var features = [];

	var updated = false;
	for (var i = data.length - 1; i >= 0; i--) {
		var exist = false;
		var city = data[i];
		for (var j = this.aqiData.length - 1; j >= 0; j--) {
			if(data[i].x === this.aqiData[j].x) {
				if(city.stamp > this.aqiData[j].stamp) {
					this.aqiData[j] = city;
					updated = true;
				}
				exist = true;
				break;
			}
		}
		if(!exist) {
			city.aqi = Number(city.aqi) ? Number(city.aqi) : '-';
			this.aqiData.push(data[i]);
			features.push(turf.point([parseFloat(city.lon), parseFloat(city.lat)], 
				{city: city, fillColor: this.options.legend.classify(city.aqi) }));
			updated = true;
		}
	}

	if(features.length) {
		var fc = turf.featureCollection(features);
		Array.prototype.push.apply(this.aqiFeatures, features);
		return fc;
	}else {
		return null;
	}
};

AQITin.prototype.toGeoJSON = function() {
	var featureCollection = this.getAQIFeatureCollection();

	var tinGeoJSON = turf.tin(featureCollection, 'city');
	for (var i = 0; i < tinGeoJSON.features.length; i++) {
        var properties  = tinGeoJSON.features[i].properties;
        var citys = [];
        if(properties.a.aqi !== '-') {
        	citys.push(properties.a.aqi);
        }
        if(properties.b.aqi !== '-') {
        	citys.push(properties.b.aqi);
        }
        if(properties.c.aqi !== '-') {
        	citys.push(properties.c.aqi);
        }
        properties.aqi = citys.reduce(function(a,b){return a+b;}, 0) / (citys.length || 1);

        properties['fillColor'] = this.options.legend.classify(properties.aqi);
        
        properties['fillOpacity'] = .3;
    }

    // Array.prototype.push.apply(tinGeoJSON.features, featureCollection.features);
    return tinGeoJSON;
};

    return module.AQITin = AQITin;
}));