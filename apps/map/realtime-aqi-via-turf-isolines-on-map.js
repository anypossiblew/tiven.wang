define(["require", "jquery", "leaflet", "LegendControl", "AQILegend", "AQIIsolines"], function(require, jqDumy, leaflet, LegendControl, AQILegend, AQIIsolines) {

var aqiLegend = new AQILegend();

var aqiHex = new AQIIsolines({
    legend: aqiLegend,
    resolution: 50
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
                                "properties": {citys:[],city:{}}}]},
    {
        style: function (feature) {
            return {
                opacity: .8,//feature.properties.opacity === undefined ? 0.3 : feature.properties.opacity,
                weight: 1,
                color: feature.properties.color,
                fillColor: feature.properties.fillColor, 
                fillOpacity: feature.properties.fillOpacity || 0
            };
        },
        onEachFeature: function(feature, layer) {
            var content = "<div>";
            
            content = content +"</div>";

            layer.bindPopup(content, {autoPan: false, keepInView: true});
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
                        fillOpacity: feature.properties.fillOpacity || 0
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

var updating = false, request = false;
function onMapChanged(event) {

    var bounds = event.target.getBounds();

    var url = "https://wind.waqi.info/mapq/bounds/?bounds=((" + bounds.getSouthWest().lat + "," + bounds.getSouthWest().lng + "),(" + bounds.getNorthEast().lat + "," + bounds.getNorthEast().lng + "))&inc=placeholders&k=_2Y2EnEh9mCVkcHT8OSCJWXmpNfEU+PSdRFWgdZg==";

    function sendRequest() {
        request = true;
        jQuery.ajax(url).done(function( data ) {
                request = false;

                var points = aqiHex.updateAqiData(data);

                if(points) {
                    pointLayer.addData(points);
                    updateHexagon();
                }
                
            }).always(function() {
                request = false;
            });
    }

    function updateHexagon() {
        updating = true;
        var geoJSON = aqiHex.toGeoJSON();
        geojson.clearLayers();
        geojson.addData(geoJSON);
        updating = false;
    }

    if(!request) {
        sendRequest();
    }
}

});