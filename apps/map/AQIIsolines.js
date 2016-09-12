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
    // attach properties to the exports object to define
    // the exported module properties.
    return module.AQIIsolines = AQIIsolines;
}));