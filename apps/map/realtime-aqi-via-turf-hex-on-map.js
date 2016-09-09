var aqiHex = new AQIHex({
    bounds: [100,20, 130,40],
    cellWidth: 100
});

var legendControl = L.Control.extend({
 
  options: {
    position: 'topleft',
    collapse: false
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-legend');
 
    container.style.backgroundColor = 'white';

    var div = L.DomUtil.create('div', '', container);

    var toggle = L.DomUtil.create('a', 'leaflet-control-zoom-in', container);
    toggle.text = '▆';
    toggle.href = '#';
    if(!this.options.collapse) {
    	toggle.style.display = "none";
    }
    
    var colors = ["White", "green", "yellow", "orange", "red", "Purple", "Maroon"];
    var labels = [" -  无数据", "<50  优", ">50  良", ">100 轻度污染", ">150 中度污染", ">200 重度污染", ">300 严重污染"];

    colors.forEach(function(color, i) {
    	var legend = L.DomUtil.create('div', 'legend-item', div);

 		legend.innerHTML = '<span style="color:'+color+';">▆</span><span class="legend-label">'+labels[i]+'</span>';
    });

    if(this.options.collapse) {
    	div.style.display = "none";
    }

    L.DomEvent.addListener(container, 'click', function() {
    	if(this.options.collapse) {
    		div.style.display = "block";
    		toggle.style.display = "none";
    		this.options.collapse = false;
    	}else {
    		div.style.display = "none";
    		toggle.style.display = "block";
    		this.options.collapse = true;
    	}
    }.bind(this));
    
    return container;
  },
 
});

var map = L.map('map');
map.setView([34, 119], 5);
map.on("viewreset moveend", onMapChanged);

map.addControl(new legendControl());

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var aqicnLink = '<a href="http://aqicn.org/">http://aqicn.org</a>'

L.tileLayer(
	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map data &copy; ' + mapLink + ' | AQI data &copy; ' + aqicnLink,
		maxZoom: 18
	}
).addTo(map); 

var geojson = L.geoJson({"type":"FeatureCollection",
						 "features":[
						 	{"type":"Feature",
						 	 "geometry":{
						 	 		"type":"Point",
						 	 		"coordinates":[1,1]
						 	 	},
						 	 	"properties": {city:{}}}]},
	{
		style: function (feature) {
        	return {
        		opacity: feature.properties.opacity === undefined ? 0.3 : feature.properties.opacity,
        		weight: 1,
        		color: 'white',
        		fillColor: feature.properties.fillColor, 
        		fillOpacity: feature.properties.fillOpacity || 0
        	};
    	},
    	pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, {
					    radius: 2
					});
	    },
    	onEachFeature: function(feature, layer) {
    		if(feature.geometry.type === 'Point') {
    			layer.bindPopup("<div><span>监测点： "+feature.properties.city.city+"</span><br>"+
    							"<span>AQI类型： "+feature.properties.city.pol+"</span><br>"+
            					"<span>AQI值： </span>"+feature.properties.city.aqi+
            					"<span style='color:"+aqiHex.legend(feature.properties.city.aqi)+";'>▆</span><br>"+
            				 "</div>", {autoPan: false, keepInView: true});
    		}else {
                var content = "<div>";
                feature.properties.citys.forEach(function(city) {
                    content = content + "<span>监测点： "+city.city+"</span><br>" + 
                                "<span>AQI值： </span>"+city.aqi+
                                "<span style='color:"+aqiHex.legend(city.aqi)+";'>▆</span><br>";

                });
                content = content +"</div>";

    			layer.bindPopup(content, {autoPan: false, keepInView: true});
    		}
        }
    }).addTo(map);

onMapChanged({
	target: map
});

function onMapChanged(event) {
	var bounds = event.target.getBounds();
    var zoom = event.target.getZoom();
    zoom = zoom < 5 ? 5 : zoom;

	var url = "https://wind.waqi.info/mapq/bounds/?bounds=((" + bounds.getSouthWest().lat + "," + bounds.getSouthWest().lng + "),(" + bounds.getNorthEast().lat + "," + bounds.getNorthEast().lng + "))&inc=placeholders&k=_2Y2EnEh9mCVkcHT8OSCJWXmpNfEU+PSdRFWgdZg==";

	request = true;
	jQuery.ajax(url).done(function( data ) {
		request = false;

		aqiHex.updateAqiData(data)
		var geoJSON = aqiHex.toGeoJSON({
            bounds: [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat]
            ,cellWidth: 8000/Math.pow(2, zoom)
        });
		geojson.clearLayers();
		geojson.addData(geoJSON);
	},function(err) {
		request = false;
	});
}
