function AQIIsolines(options) {
	this.setOptions(options);
}

AQIIsolines.prototype = new AQITurf();

AQIIsolines.prototype.toGeoJSON = function() {
	var points = this.getAQIFeatureCollection();

	var breaks = this.options.legend.thresholds;
	var isolined = turf.isolines(points, 'aqi', this.options.resolution, breaks);

	isolined.features.forEach(function(feature) {
		feature.properties.color = this.options.legend.classify(feature.properties.aqi);
	}.bind(this));
	return isolined;
};