function AQIHex(options) {
	this.options = options;
	this.aqiData = [];
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
	
	var updated = false;
	for (var i = data.length - 1; i >= 0; i--) {
		var exist = false;
		for (var j = this.aqiData.length - 1; j >= 0; j--) {
			if(data[i].x === this.aqiData[j].x) {
				if(data[i].stamp > this.aqiData[j].stamp) {
					this.aqiData[j] = data[i];
					updated = true;
				}
				exist = true;
				break;
			}
		}
		if(!exist) {
			this.aqiData.push(data[i]);
			updated = true;
		}
	}
	return updated;
};

AQIHex.prototype.toGeoJSON = function(options) {
	options = options || this.options;
	var hexgrid = turf.hexGrid(options.bounds, options.cellWidth );
	var points = this.toFeatureCollection();
	var average = turf.collect(hexgrid, points, 'city', 'citys');
	average.features.forEach(function(feature) {
		feature.properties.aqi = feature.properties.citys.reduce(function(a,b){return a+b.aqi;}, 0) 
									/ (feature.properties.citys.length || 1);
		feature.properties.fillColor = this.legend(feature.properties.aqi);
		if(!feature.properties.aqi) {
			feature.properties.fillOpacity = 0;
			feature.properties.opacity = 0;
		}else {
			feature.properties.fillOpacity = .3;
		}
		
	}.bind(this));

	Array.prototype.push.apply(average.features, points.features);
	return average;
};

AQIHex.prototype.toFeatureCollection = function() {
	var features = [];
	for (var i = this.aqiData.length - 1; i >= 0; i--) {
		var city = this.aqiData[i];
		if(Number(city.aqi)) {
			city.aqi = Number(city.aqi);
			features.push(turf.point([parseFloat(city.lon), parseFloat(city.lat)], 
				{city: city, aqi: city.aqi, fillColor: this.legend(city.aqi), fillOpacity: 1}));
		}		
	}
	this.featureCollection = turf.featureCollection(features);
	return this.featureCollection;
};

AQIHex.prototype.legend = function(aqi) {
	var color = "White";
	if(aqi === 0) {
		return color;
	}else if(aqi <= 50) {
		color = "Green";
	}else if(aqi <= 100) {
		color = "Yellow";
	}else if(aqi <= 150) {
		color = "Orange";
	}else if(aqi <= 200) {
		color = "red";
	}else if(aqi <= 300) {
		color = "Purple";
	}else if(aqi > 300) {
		color = "Maroon";
	}
	return color;
};