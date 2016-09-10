function AQIHex(options) {
	this.options = options;
	this.aqiData = [];
	this.aqiFeatures = [];
}

AQIHex.prototype.setAqiData = function(data) {
	this.aqiData = data;
};

/**
 * update the aqi data
 * 
 * @param data aqi data
 * @return is the aqi data updated
 */
AQIHex.prototype.updateAqiData = function(data) {
	
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

AQIHex.prototype.toGeoJSON = function(options) {
	options = options || this.options;
	var hexgrid = turf.hexGrid(options.bounds, options.cellWidth );
	var points = this.getAQIFeatureCollection();
	var average = turf.collect(hexgrid, points, 'city', 'citys');
	var features = [];
	average.features.forEach(function(feature) {
		feature.properties.aqi = feature.properties.citys.reduce(function(a,b){return a+b.aqi;}, 0) 
									/ (feature.properties.citys.length || 1);
		feature.properties.fillColor = this.options.legend.classify(feature.properties.aqi);
		if(!feature.properties.aqi) {
			feature.properties.fillOpacity = 0;
			feature.properties.opacity = 0;
		}else {
			feature.properties.fillOpacity = .3;
		}
		if(feature.properties.citys.length > 0) {
			features.push(feature);
		}
		
	}.bind(this));

	var geoJSON = turf.featureCollection(features);
	// Array.prototype.push.apply(geoJSON.features, points.features);
	return geoJSON;
};

AQIHex.prototype.getAQIFeatureCollection = function() {
	return turf.featureCollection(this.aqiFeatures);
};

AQIHex.prototype.toFeatureCollection = function() {
	var features = [];
	for (var i = this.aqiData.length - 1; i >= 0; i--) {
		var city = this.aqiData[i];
		if(Number(city.aqi)) {
			city.aqi = Number(city.aqi);
			features.push(turf.point([parseFloat(city.lon), parseFloat(city.lat)], 
				{city: city, aqi: city.aqi, fillColor: this.options.legend.classify(city.aqi), fillOpacity: 1}));
		}		
	}
	this.featureCollection = turf.featureCollection(features);
	return this.featureCollection;
};