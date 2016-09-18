'use strict';

// generate supercluster.js from the repo root with:
// browserify index.js -s supercluster > demo/supercluster.js

importScripts('supercluster.min.js');

var now = Date.now();

var index;

getJSON('./fixtures/places.json', function (geojson) {
    console.log('loaded ' + geojson.length + ' points JSON in ' + ((Date.now() - now) / 1000) + 's');

    // initialize cluster index
    index = supercluster({
        log: true,
        radius: 60,
        extent: 256,
        maxZoom: 18
    }).load(geojson.features);

    console.log(index.getTile(0, 0, 0));

    // post a message when the index is ready
    postMessage({ready: true});
});

// calculate the inbound index when the map request
self.onmessage = function (e) {
    if (e.data) {
        postMessage(index.getClusters(e.data.bbox, e.data.zoom));
    }
};

// function getJSON(url, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.responseType = 'json';
//     xhr.setRequestHeader('Accept', 'application/json');
//     xhr.onload = function () {
//         if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
//             callback(xhr.response);
//         }
//     };
//     xhr.send();
// }

function getJSON(url, callback) {
    var features = [];
    for (var i = 50000; i >= 0; i--) {
        var feature = {
            type: "Feature",
            properties: {},
            geometry: {
                "type": "Point",
                "coordinates": [Math.random()*50 + 70, Math.random()*20 + 25]
            }
        };
        features.push(feature);
    }
    callback({
        "type": "FeatureCollection",
        "features":features
    });
}
