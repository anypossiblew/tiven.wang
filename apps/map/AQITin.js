function AqiTin(options) {
	this.options = options;
	this.aqiData = [];
};

AqiTin.prototype.setAqiData = function(data) {
	this.aqiData = data;
};

AqiTin.prototype.getAqiData = function(data) {
	return this.aqiData;
};

/**
 * update the aqi data
 * 
 * @param data aqi data
 * @return is the aqi data updated
 */
AqiTin.prototype.updateAqiData = function(data) {
	
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

AqiTin.prototype.toFeatureCollection = function() {
	var features = [];
	for (var i = this.aqiData.length - 1; i >= 0; i--) {
		var city = this.aqiData[i];
		city.aqi = Number(city.aqi) ? Number(city.aqi) : '-';
		features.push(turf.point([parseFloat(city.lon), parseFloat(city.lat)], 
			{city: city, fillColor: this.legend(city.aqi) }));
	}
	this.featureCollection = turf.featureCollection(features);
	return this.featureCollection;
};

AqiTin.prototype.toGeoJSON = function() {
	var featureCollection = this.toFeatureCollection();

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

        properties['fillColor'] = this.legend(properties.aqi);
        
        properties['fillOpacity'] = .3;
    }

    Array.prototype.push.apply(tinGeoJSON.features, featureCollection.features);
    return tinGeoJSON;
};

AqiTin.prototype.legend = function(aqi) {
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