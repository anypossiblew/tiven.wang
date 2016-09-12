(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        exports = factory( root, require('turf') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['exports', 'turf'], factory);
    } else {
        // Browser globals
        factory( root, root.turf );
    }
}(this, function ( module, turf ) {
    //use b in some fashion.
 	
 	function AQITurf(options) {
		this.options = options;
		this.aqiData = [];
		this.aqiFeatures = [];
	}

	AQITurf.prototype.setOptions = function(options) {
		this.options = options;
	};

	AQITurf.prototype.setAqiData = function(data) {
		this.aqiData = data;
	};

	/**
	 * update the aqi data
	 * 
	 * @param data aqi data
	 * @return is the aqi data updated
	 */
	AQITurf.prototype.updateAqiData = function(data) {
		
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
				
				if(Number(city.aqi)) {
					city.aqi = Number(city.aqi);
					features.push(turf.point([parseFloat(city.lon), parseFloat(city.lat)], 
						{city: city, aqi: city.aqi, fillColor: this.options.legend.classify(city.aqi), fillOpacity: 1}));
					this.aqiData.push(city);
				}	
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

	AQITurf.prototype.getAQIFeatureCollection = function() {
		return turf.featureCollection(this.aqiFeatures);
	};
    // attach properties to the exports object to define
    // the exported module properties.
    return module.AQITurf = AQITurf;
}));