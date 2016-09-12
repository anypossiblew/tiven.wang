define(["require", "jquery", "leaflet", "LegendControl", "AQILegend", "AQITin"], 
    function(require, jqDumy, leaflet, LegendControl, AQILegend, AQITin) {

var aqiLegend = new AQILegend();
var aqiTin = new AQITin({
    legend: aqiLegend,
});

var map = L.map('map');
map.setView([34, 119], 5);
map.on("viewreset moveend", onMapChanged);

map.addControl(new L.control.LegendControl({
    colors: aqiLegend.colors,
    labels: aqiLegend.labels
}));

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var aqicnLink = '<a href="http://aqicn.org/">http://aqicn.org</a>'

var openStreetMap = L.tileLayer(
	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map data &copy; ' + mapLink + ' | AQI data &copy; ' + aqicnLink,
		maxZoom: 18
	}
); 

var cartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

var baseMaps = {
    "OpenStreetMap": openStreetMap,
    "CartoDB DarkMatter": cartoDB_DarkMatter
};

var geojson = L.geoJson({"type":"FeatureCollection",
						 "features":[
						 	{"type":"Feature",
						 	 "geometry":{
						 	 		"type":"Point",
						 	 		"coordinates":[1,1]
						 	 	},
						 	 	"properties": {city:{}, a:{},b:{},c:{}}}]},
	{
		style: function (feature) {
        	return {
        		opacity: 0,
        		weight: 1,
        		color: 'white',
        		fillColor: feature.properties.fillColor, 
        		fillOpacity: feature.properties.fillOpacity || 1
        	};
    	},
    	onEachFeature: function(feature, layer) {
    		layer.bindPopup("<div><span>监测点： "+feature.properties.a.city+"</span><br>"+
                                "<span>AQI值： </span>"+feature.properties.a.aqi+
                                "<span style='color:"+aqiLegend.classify(feature.properties.a.aqi)+";'>▆</span><br>"+
                                "<span>监测点： "+feature.properties.b.city+"</span><br>"+
                                "<span>AQI值： </span>"+feature.properties.b.aqi+
                                "<span style='color:"+aqiLegend.classify(feature.properties.b.aqi)+";'>▆</span><br>"+
                                "<span>监测点： "+feature.properties.c.city+"</span><br>"+
                                "<span>AQI值： </span>"+feature.properties.c.aqi+
                                "<span style='color:"+aqiLegend.classify(feature.properties.c.aqi)+";'>▆</span><br>"+
                             "</div>", 
                             {autoPan: false});
        }
    }).addTo(map);

var pointLayer = L.geoJson({"type":"FeatureCollection",
                         "features":[
                            {"type":"Feature",
                             "geometry":{
                                    "type":"Point",
                                    "coordinates":[1,1]
                                },
                                "properties": {city:{}}}]},
    {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                        radius: 2,
                        opacity: 0,//feature.properties.opacity === undefined ? 0.3 : feature.properties.opacity,
                        weight: 1,
                        color: 'white',
                        fillColor: feature.properties.fillColor, 
                        fillOpacity: 1
                    });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<div><span>监测点： "+feature.properties.city.city+"</span><br>"+
                                "<span>AQI类型： "+feature.properties.city.pol+"</span><br>"+
                                "<span>AQI值： </span>"+feature.properties.city.aqi+
                                "<span style='color:"+aqiLegend.classify(feature.properties.city.aqi)+";'>▆</span><br>"+
                             "</div>", 
                             {autoPan: false, keepInView: true});
        }
    }).addTo(map); 

var overlayMaps = {
    "监测点": pointLayer,
    "AQI": geojson
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

onMapChanged({
	target: map
});

var request = false;
function onMapChanged(event) {
	var bounds = event.target.getBounds();

	var url = "https://wind.waqi.info/mapq/bounds/?bounds=((" + bounds.getSouthWest().lat + "," + bounds.getSouthWest().lng + "),(" + bounds.getNorthEast().lat + "," + bounds.getNorthEast().lng + "))&inc=placeholders&k=_2Y2EnEh9mCVkcHT8OSCJWXmpNfEU+PSdRFWgdZg==";

	request = true;
	jQuery.ajax(url).done(function( data ) {
		request = false;

        var points = aqiTin.updateAqiData(data);
		if(points) {
            pointLayer.addData(points);
			var geoJSON = aqiTin.toGeoJSON();
			geojson.clearLayers();
			geojson.addData(geoJSON);
		}
	}).always(function() {
                request = false;
            });
}

});