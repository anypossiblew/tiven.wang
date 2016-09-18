(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.supercluster = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var kdbush = require('kdbush');

module.exports = supercluster;

function supercluster(options) {
    return new SuperCluster(options);
}

function SuperCluster(options) {
    this.options = extend(Object.create(this.options), options);
    this.trees = new Array(this.options.maxZoom + 1);
}

SuperCluster.prototype = {
    options: {
        minZoom: 0,   // min zoom to generate clusters on
        maxZoom: 16,  // max zoom level to cluster the points on
        radius: 40,   // cluster radius in pixels
        extent: 512,  // tile extent (radius is calculated relative to it)
        nodeSize: 64, // size of the KD-tree leaf node, affects performance
        log: false    // whether to log timing info
    },

    load: function (points) {
        var log = this.options.log;

        if (log) console.time('total time');

        var timerId = 'prepare ' + points.length + ' points';
        if (log) console.time(timerId);

        this.points = points;

        // generate a cluster object for each point
        var clusters = points.map(createPointCluster);
        if (log) console.timeEnd(timerId);

        // cluster points on max zoom, then cluster the results on previous zoom, etc.;
        // results in a cluster hierarchy across zoom levels
        for (var z = this.options.maxZoom; z >= this.options.minZoom; z--) {
            var now = +Date.now();

            // index input points into a KD-tree
            this.trees[z + 1] = kdbush(clusters, getX, getY, this.options.nodeSize, Float32Array);

            clusters = this._cluster(clusters, z); // create a new set of clusters for the zoom

            if (log) console.log('z%d: %d clusters in %dms', z, clusters.length, +Date.now() - now);
        }

        // index top-level clusters
        this.trees[this.options.minZoom] = kdbush(clusters, getX, getY, this.options.nodeSize, Float32Array);

        if (log) console.timeEnd('total time');

        return this;
    },

    getClusters: function (bbox, zoom) {
        var tree = this.trees[this._limitZoom(zoom)];
        var ids = tree.range(lngX(bbox[0]), latY(bbox[3]), lngX(bbox[2]), latY(bbox[1]));
        var clusters = [];
        for (var i = 0; i < ids.length; i++) {
            var c = tree.points[ids[i]];
            clusters.push(c.id !== -1 ? this.points[c.id] : getClusterJSON(c));
        }
        return clusters;
    },

    getTile: function (z, x, y) {
        var tree = this.trees[this._limitZoom(z)];
        var z2 = Math.pow(2, z);
        var extent = this.options.extent;
        var r = this.options.radius;
        var p = r / extent;
        var top = (y - p) / z2;
        var bottom = (y + 1 + p) / z2;

        var tile = {
            features: []
        };

        this._addTileFeatures(
            tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom),
            tree.points, x, y, z2, tile);

        if (x === 0) {
            this._addTileFeatures(
                tree.range(1 - p / z2, top, 1, bottom),
                tree.points, z2, y, z2, tile);
        }
        if (x === z2 - 1) {
            this._addTileFeatures(
                tree.range(0, top, p / z2, bottom),
                tree.points, -1, y, z2, tile);
        }

        return tile.features.length ? tile : null;
    },

    _addTileFeatures: function (ids, points, x, y, z2, tile) {
        for (var i = 0; i < ids.length; i++) {
            var c = points[ids[i]];
            tile.features.push({
                type: 1,
                geometry: [[
                    Math.round(this.options.extent * (c.x * z2 - x)),
                    Math.round(this.options.extent * (c.y * z2 - y))
                ]],
                tags: c.id !== -1 ? this.points[c.id].properties : getClusterProperties(c)
            });
        }
    },

    _limitZoom: function (z) {
        return Math.max(this.options.minZoom, Math.min(z, this.options.maxZoom + 1));
    },

    _cluster: function (points, zoom) {
        var clusters = [];
        var r = this.options.radius / (this.options.extent * Math.pow(2, zoom));

        // loop through each point
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            // if we've already visited the point at this zoom level, skip it
            if (p.zoom <= zoom) continue;
            p.zoom = zoom;

            // find all nearby points
            var tree = this.trees[zoom + 1];
            var neighborIds = tree.within(p.x, p.y, r);

            var foundNeighbors = false;
            var numPoints = p.numPoints;
            var wx = p.x * numPoints;
            var wy = p.y * numPoints;

            for (var j = 0; j < neighborIds.length; j++) {
                var b = tree.points[neighborIds[j]];
                // filter out neighbors that are too far or already processed
                if (zoom < b.zoom) {
                    foundNeighbors = true;
                    b.zoom = zoom; // save the zoom (so it doesn't get processed twice)
                    wx += b.x * b.numPoints; // accumulate coordinates for calculating weighted center
                    wy += b.y * b.numPoints;
                    numPoints += b.numPoints;
                }
            }

            clusters.push(foundNeighbors ? createCluster(wx / numPoints, wy / numPoints, numPoints, -1) : p);
        }

        return clusters;
    }
};

function createCluster(x, y, numPoints, id) {
    return {
        x: x, // weighted cluster center
        y: y,
        zoom: Infinity, // the last zoom the cluster was processed at
        id: id, // index of the source feature in the original input array
        numPoints: numPoints
    };
}

function createPointCluster(p, i) {
    var coords = p.geometry.coordinates;
    return createCluster(lngX(coords[0]), latY(coords[1]), 1, i);
}

function getClusterJSON(cluster) {
    return {
        type: 'Feature',
        properties: getClusterProperties(cluster),
        geometry: {
            type: 'Point',
            coordinates: [xLng(cluster.x), yLat(cluster.y)]
        }
    };
}

function getClusterProperties(cluster) {
    var count = cluster.numPoints;
    var abbrev = count >= 10000 ? Math.round(count / 1000) + 'k' :
                 count >= 1000 ? (Math.round(count / 100) / 10) + 'k' : count;
    return {
        cluster: true,
        point_count: count,
        point_count_abbreviated: abbrev
    };
}

// longitude/latitude to spherical mercator in [0..1] range
function lngX(lng) {
    return lng / 360 + 0.5;
}
function latY(lat) {
    var sin = Math.sin(lat * Math.PI / 180),
        y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
    return y < 0 ? 0 :
           y > 1 ? 1 : y;
}

// spherical mercator to longitude/latitude
function xLng(x) {
    return (x - 0.5) * 360;
}
function yLat(y) {
    var y2 = (180 - y * 360) * Math.PI / 180;
    return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
}

function extend(dest, src) {
    for (var id in src) dest[id] = src[id];
    return dest;
}

function getX(p) {
    return p.x;
}
function getY(p) {
    return p.y;
}

},{"kdbush":2}],2:[function(require,module,exports){
'use strict';

var sort = require('./sort');
var range = require('./range');
var within = require('./within');

module.exports = kdbush;

function kdbush(points, getX, getY, nodeSize, ArrayType) {
    return new KDBush(points, getX, getY, nodeSize, ArrayType);
}

function KDBush(points, getX, getY, nodeSize, ArrayType) {
    getX = getX || defaultGetX;
    getY = getY || defaultGetY;
    ArrayType = ArrayType || Array;

    this.nodeSize = nodeSize || 64;
    this.points = points;

    this.ids = new ArrayType(points.length);
    this.coords = new ArrayType(points.length * 2);

    for (var i = 0; i < points.length; i++) {
        this.ids[i] = i;
        this.coords[2 * i] = getX(points[i]);
        this.coords[2 * i + 1] = getY(points[i]);
    }

    sort(this.ids, this.coords, this.nodeSize, 0, this.ids.length - 1, 0);
}

KDBush.prototype = {
    range: function (minX, minY, maxX, maxY) {
        return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    },

    within: function (x, y, r) {
        return within(this.ids, this.coords, x, y, r, this.nodeSize);
    }
};

function defaultGetX(p) { return p[0]; }
function defaultGetY(p) { return p[1]; }

},{"./range":3,"./sort":4,"./within":5}],3:[function(require,module,exports){
'use strict';

module.exports = range;

function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
    var stack = [0, ids.length - 1, 0];
    var result = [];
    var x, y;

    while (stack.length) {
        var axis = stack.pop();
        var right = stack.pop();
        var left = stack.pop();

        if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
                x = coords[2 * i];
                y = coords[2 * i + 1];
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
            }
            continue;
        }

        var m = Math.floor((left + right) / 2);

        x = coords[2 * m];
        y = coords[2 * m + 1];

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

        var nextAxis = (axis + 1) % 2;

        if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

},{}],4:[function(require,module,exports){
'use strict';

module.exports = sortKD;

function sortKD(ids, coords, nodeSize, left, right, depth) {
    if (right - left <= nodeSize) return;

    var m = Math.floor((left + right) / 2);

    select(ids, coords, m, left, right, depth % 2);

    sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
    sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
}

function select(ids, coords, k, left, right, inc) {

    while (right > left) {
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            select(ids, coords, k, newLeft, newRight, inc);
        }

        var t = coords[2 * k + inc];
        var i = left;
        var j = right;

        swapItem(ids, coords, left, k);
        if (coords[2 * right + inc] > t) swapItem(ids, coords, left, right);

        while (i < j) {
            swapItem(ids, coords, i, j);
            i++;
            j--;
            while (coords[2 * i + inc] < t) i++;
            while (coords[2 * j + inc] > t) j--;
        }

        if (coords[2 * left + inc] === t) swapItem(ids, coords, left, j);
        else {
            j++;
            swapItem(ids, coords, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swapItem(ids, coords, i, j) {
    swap(ids, i, j);
    swap(coords, 2 * i, 2 * j);
    swap(coords, 2 * i + 1, 2 * j + 1);
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

},{}],5:[function(require,module,exports){
'use strict';

module.exports = within;

function within(ids, coords, qx, qy, r, nodeSize) {
    var stack = [0, ids.length - 1, 0];
    var result = [];
    var r2 = r * r;

    while (stack.length) {
        var axis = stack.pop();
        var right = stack.pop();
        var left = stack.pop();

        if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
                if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
            }
            continue;
        }

        var m = Math.floor((left + right) / 2);

        var x = coords[2 * m];
        var y = coords[2 * m + 1];

        if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

        var nextAxis = (axis + 1) % 2;

        if (axis === 0 ? qx - r <= x : qy - r <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? qx + r >= x : qy + r >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

function sqDist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rZGJ1c2gvc3JjL2tkYnVzaC5qcyIsIm5vZGVfbW9kdWxlcy9rZGJ1c2gvc3JjL3JhbmdlLmpzIiwibm9kZV9tb2R1bGVzL2tkYnVzaC9zcmMvc29ydC5qcyIsIm5vZGVfbW9kdWxlcy9rZGJ1c2gvc3JjL3dpdGhpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBrZGJ1c2ggPSByZXF1aXJlKCdrZGJ1c2gnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VwZXJjbHVzdGVyO1xyXG5cclxuZnVuY3Rpb24gc3VwZXJjbHVzdGVyKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgU3VwZXJDbHVzdGVyKG9wdGlvbnMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTdXBlckNsdXN0ZXIob3B0aW9ucykge1xyXG4gICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKE9iamVjdC5jcmVhdGUodGhpcy5vcHRpb25zKSwgb3B0aW9ucyk7XHJcbiAgICB0aGlzLnRyZWVzID0gbmV3IEFycmF5KHRoaXMub3B0aW9ucy5tYXhab29tICsgMSk7XHJcbn1cclxuXHJcblN1cGVyQ2x1c3Rlci5wcm90b3R5cGUgPSB7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgbWluWm9vbTogMCwgICAvLyBtaW4gem9vbSB0byBnZW5lcmF0ZSBjbHVzdGVycyBvblxyXG4gICAgICAgIG1heFpvb206IDE2LCAgLy8gbWF4IHpvb20gbGV2ZWwgdG8gY2x1c3RlciB0aGUgcG9pbnRzIG9uXHJcbiAgICAgICAgcmFkaXVzOiA0MCwgICAvLyBjbHVzdGVyIHJhZGl1cyBpbiBwaXhlbHNcclxuICAgICAgICBleHRlbnQ6IDUxMiwgIC8vIHRpbGUgZXh0ZW50IChyYWRpdXMgaXMgY2FsY3VsYXRlZCByZWxhdGl2ZSB0byBpdClcclxuICAgICAgICBub2RlU2l6ZTogNjQsIC8vIHNpemUgb2YgdGhlIEtELXRyZWUgbGVhZiBub2RlLCBhZmZlY3RzIHBlcmZvcm1hbmNlXHJcbiAgICAgICAgbG9nOiBmYWxzZSAgICAvLyB3aGV0aGVyIHRvIGxvZyB0aW1pbmcgaW5mb1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkOiBmdW5jdGlvbiAocG9pbnRzKSB7XHJcbiAgICAgICAgdmFyIGxvZyA9IHRoaXMub3B0aW9ucy5sb2c7XHJcblxyXG4gICAgICAgIGlmIChsb2cpIGNvbnNvbGUudGltZSgndG90YWwgdGltZScpO1xyXG5cclxuICAgICAgICB2YXIgdGltZXJJZCA9ICdwcmVwYXJlICcgKyBwb2ludHMubGVuZ3RoICsgJyBwb2ludHMnO1xyXG4gICAgICAgIGlmIChsb2cpIGNvbnNvbGUudGltZSh0aW1lcklkKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGEgY2x1c3RlciBvYmplY3QgZm9yIGVhY2ggcG9pbnRcclxuICAgICAgICB2YXIgY2x1c3RlcnMgPSBwb2ludHMubWFwKGNyZWF0ZVBvaW50Q2x1c3Rlcik7XHJcbiAgICAgICAgaWYgKGxvZykgY29uc29sZS50aW1lRW5kKHRpbWVySWQpO1xyXG5cclxuICAgICAgICAvLyBjbHVzdGVyIHBvaW50cyBvbiBtYXggem9vbSwgdGhlbiBjbHVzdGVyIHRoZSByZXN1bHRzIG9uIHByZXZpb3VzIHpvb20sIGV0Yy47XHJcbiAgICAgICAgLy8gcmVzdWx0cyBpbiBhIGNsdXN0ZXIgaGllcmFyY2h5IGFjcm9zcyB6b29tIGxldmVsc1xyXG4gICAgICAgIGZvciAodmFyIHogPSB0aGlzLm9wdGlvbnMubWF4Wm9vbTsgeiA+PSB0aGlzLm9wdGlvbnMubWluWm9vbTsgei0tKSB7XHJcbiAgICAgICAgICAgIHZhciBub3cgPSArRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGluZGV4IGlucHV0IHBvaW50cyBpbnRvIGEgS0QtdHJlZVxyXG4gICAgICAgICAgICB0aGlzLnRyZWVzW3ogKyAxXSA9IGtkYnVzaChjbHVzdGVycywgZ2V0WCwgZ2V0WSwgdGhpcy5vcHRpb25zLm5vZGVTaXplLCBGbG9hdDMyQXJyYXkpO1xyXG5cclxuICAgICAgICAgICAgY2x1c3RlcnMgPSB0aGlzLl9jbHVzdGVyKGNsdXN0ZXJzLCB6KTsgLy8gY3JlYXRlIGEgbmV3IHNldCBvZiBjbHVzdGVycyBmb3IgdGhlIHpvb21cclxuXHJcbiAgICAgICAgICAgIGlmIChsb2cpIGNvbnNvbGUubG9nKCd6JWQ6ICVkIGNsdXN0ZXJzIGluICVkbXMnLCB6LCBjbHVzdGVycy5sZW5ndGgsICtEYXRlLm5vdygpIC0gbm93KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluZGV4IHRvcC1sZXZlbCBjbHVzdGVyc1xyXG4gICAgICAgIHRoaXMudHJlZXNbdGhpcy5vcHRpb25zLm1pblpvb21dID0ga2RidXNoKGNsdXN0ZXJzLCBnZXRYLCBnZXRZLCB0aGlzLm9wdGlvbnMubm9kZVNpemUsIEZsb2F0MzJBcnJheSk7XHJcblxyXG4gICAgICAgIGlmIChsb2cpIGNvbnNvbGUudGltZUVuZCgndG90YWwgdGltZScpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2x1c3RlcnM6IGZ1bmN0aW9uIChiYm94LCB6b29tKSB7XHJcbiAgICAgICAgdmFyIHRyZWUgPSB0aGlzLnRyZWVzW3RoaXMuX2xpbWl0Wm9vbSh6b29tKV07XHJcbiAgICAgICAgdmFyIGlkcyA9IHRyZWUucmFuZ2UobG5nWChiYm94WzBdKSwgbGF0WShiYm94WzNdKSwgbG5nWChiYm94WzJdKSwgbGF0WShiYm94WzFdKSk7XHJcbiAgICAgICAgdmFyIGNsdXN0ZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGMgPSB0cmVlLnBvaW50c1tpZHNbaV1dO1xyXG4gICAgICAgICAgICBjbHVzdGVycy5wdXNoKGMuaWQgIT09IC0xID8gdGhpcy5wb2ludHNbYy5pZF0gOiBnZXRDbHVzdGVySlNPTihjKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbHVzdGVycztcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VGlsZTogZnVuY3Rpb24gKHosIHgsIHkpIHtcclxuICAgICAgICB2YXIgdHJlZSA9IHRoaXMudHJlZXNbdGhpcy5fbGltaXRab29tKHopXTtcclxuICAgICAgICB2YXIgejIgPSBNYXRoLnBvdygyLCB6KTtcclxuICAgICAgICB2YXIgZXh0ZW50ID0gdGhpcy5vcHRpb25zLmV4dGVudDtcclxuICAgICAgICB2YXIgciA9IHRoaXMub3B0aW9ucy5yYWRpdXM7XHJcbiAgICAgICAgdmFyIHAgPSByIC8gZXh0ZW50O1xyXG4gICAgICAgIHZhciB0b3AgPSAoeSAtIHApIC8gejI7XHJcbiAgICAgICAgdmFyIGJvdHRvbSA9ICh5ICsgMSArIHApIC8gejI7XHJcblxyXG4gICAgICAgIHZhciB0aWxlID0ge1xyXG4gICAgICAgICAgICBmZWF0dXJlczogW11cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9hZGRUaWxlRmVhdHVyZXMoXHJcbiAgICAgICAgICAgIHRyZWUucmFuZ2UoKHggLSBwKSAvIHoyLCB0b3AsICh4ICsgMSArIHApIC8gejIsIGJvdHRvbSksXHJcbiAgICAgICAgICAgIHRyZWUucG9pbnRzLCB4LCB5LCB6MiwgdGlsZSk7XHJcblxyXG4gICAgICAgIGlmICh4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZFRpbGVGZWF0dXJlcyhcclxuICAgICAgICAgICAgICAgIHRyZWUucmFuZ2UoMSAtIHAgLyB6MiwgdG9wLCAxLCBib3R0b20pLFxyXG4gICAgICAgICAgICAgICAgdHJlZS5wb2ludHMsIHoyLCB5LCB6MiwgdGlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh4ID09PSB6MiAtIDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fYWRkVGlsZUZlYXR1cmVzKFxyXG4gICAgICAgICAgICAgICAgdHJlZS5yYW5nZSgwLCB0b3AsIHAgLyB6MiwgYm90dG9tKSxcclxuICAgICAgICAgICAgICAgIHRyZWUucG9pbnRzLCAtMSwgeSwgejIsIHRpbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRpbGUuZmVhdHVyZXMubGVuZ3RoID8gdGlsZSA6IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIF9hZGRUaWxlRmVhdHVyZXM6IGZ1bmN0aW9uIChpZHMsIHBvaW50cywgeCwgeSwgejIsIHRpbGUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgYyA9IHBvaW50c1tpZHNbaV1dO1xyXG4gICAgICAgICAgICB0aWxlLmZlYXR1cmVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogMSxcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiBbW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQodGhpcy5vcHRpb25zLmV4dGVudCAqIChjLnggKiB6MiAtIHgpKSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKHRoaXMub3B0aW9ucy5leHRlbnQgKiAoYy55ICogejIgLSB5KSlcclxuICAgICAgICAgICAgICAgIF1dLFxyXG4gICAgICAgICAgICAgICAgdGFnczogYy5pZCAhPT0gLTEgPyB0aGlzLnBvaW50c1tjLmlkXS5wcm9wZXJ0aWVzIDogZ2V0Q2x1c3RlclByb3BlcnRpZXMoYylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfbGltaXRab29tOiBmdW5jdGlvbiAoeikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLm9wdGlvbnMubWluWm9vbSwgTWF0aC5taW4oeiwgdGhpcy5vcHRpb25zLm1heFpvb20gKyAxKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9jbHVzdGVyOiBmdW5jdGlvbiAocG9pbnRzLCB6b29tKSB7XHJcbiAgICAgICAgdmFyIGNsdXN0ZXJzID0gW107XHJcbiAgICAgICAgdmFyIHIgPSB0aGlzLm9wdGlvbnMucmFkaXVzIC8gKHRoaXMub3B0aW9ucy5leHRlbnQgKiBNYXRoLnBvdygyLCB6b29tKSk7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBlYWNoIHBvaW50XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHAgPSBwb2ludHNbaV07XHJcbiAgICAgICAgICAgIC8vIGlmIHdlJ3ZlIGFscmVhZHkgdmlzaXRlZCB0aGUgcG9pbnQgYXQgdGhpcyB6b29tIGxldmVsLCBza2lwIGl0XHJcbiAgICAgICAgICAgIGlmIChwLnpvb20gPD0gem9vbSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHAuem9vbSA9IHpvb207XHJcblxyXG4gICAgICAgICAgICAvLyBmaW5kIGFsbCBuZWFyYnkgcG9pbnRzXHJcbiAgICAgICAgICAgIHZhciB0cmVlID0gdGhpcy50cmVlc1t6b29tICsgMV07XHJcbiAgICAgICAgICAgIHZhciBuZWlnaGJvcklkcyA9IHRyZWUud2l0aGluKHAueCwgcC55LCByKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3VuZE5laWdoYm9ycyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgbnVtUG9pbnRzID0gcC5udW1Qb2ludHM7XHJcbiAgICAgICAgICAgIHZhciB3eCA9IHAueCAqIG51bVBvaW50cztcclxuICAgICAgICAgICAgdmFyIHd5ID0gcC55ICogbnVtUG9pbnRzO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuZWlnaGJvcklkcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSB0cmVlLnBvaW50c1tuZWlnaGJvcklkc1tqXV07XHJcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXIgb3V0IG5laWdoYm9ycyB0aGF0IGFyZSB0b28gZmFyIG9yIGFscmVhZHkgcHJvY2Vzc2VkXHJcbiAgICAgICAgICAgICAgICBpZiAoem9vbSA8IGIuem9vbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kTmVpZ2hib3JzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBiLnpvb20gPSB6b29tOyAvLyBzYXZlIHRoZSB6b29tIChzbyBpdCBkb2Vzbid0IGdldCBwcm9jZXNzZWQgdHdpY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgd3ggKz0gYi54ICogYi5udW1Qb2ludHM7IC8vIGFjY3VtdWxhdGUgY29vcmRpbmF0ZXMgZm9yIGNhbGN1bGF0aW5nIHdlaWdodGVkIGNlbnRlclxyXG4gICAgICAgICAgICAgICAgICAgIHd5ICs9IGIueSAqIGIubnVtUG9pbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIG51bVBvaW50cyArPSBiLm51bVBvaW50cztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2x1c3RlcnMucHVzaChmb3VuZE5laWdoYm9ycyA/IGNyZWF0ZUNsdXN0ZXIod3ggLyBudW1Qb2ludHMsIHd5IC8gbnVtUG9pbnRzLCBudW1Qb2ludHMsIC0xKSA6IHApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsdXN0ZXJzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2x1c3Rlcih4LCB5LCBudW1Qb2ludHMsIGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHg6IHgsIC8vIHdlaWdodGVkIGNsdXN0ZXIgY2VudGVyXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICB6b29tOiBJbmZpbml0eSwgLy8gdGhlIGxhc3Qgem9vbSB0aGUgY2x1c3RlciB3YXMgcHJvY2Vzc2VkIGF0XHJcbiAgICAgICAgaWQ6IGlkLCAvLyBpbmRleCBvZiB0aGUgc291cmNlIGZlYXR1cmUgaW4gdGhlIG9yaWdpbmFsIGlucHV0IGFycmF5XHJcbiAgICAgICAgbnVtUG9pbnRzOiBudW1Qb2ludHNcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBvaW50Q2x1c3RlcihwLCBpKSB7XHJcbiAgICB2YXIgY29vcmRzID0gcC5nZW9tZXRyeS5jb29yZGluYXRlcztcclxuICAgIHJldHVybiBjcmVhdGVDbHVzdGVyKGxuZ1goY29vcmRzWzBdKSwgbGF0WShjb29yZHNbMV0pLCAxLCBpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2x1c3RlckpTT04oY2x1c3Rlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXHJcbiAgICAgICAgcHJvcGVydGllczogZ2V0Q2x1c3RlclByb3BlcnRpZXMoY2x1c3RlciksXHJcbiAgICAgICAgZ2VvbWV0cnk6IHtcclxuICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcclxuICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFt4TG5nKGNsdXN0ZXIueCksIHlMYXQoY2x1c3Rlci55KV1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbHVzdGVyUHJvcGVydGllcyhjbHVzdGVyKSB7XHJcbiAgICB2YXIgY291bnQgPSBjbHVzdGVyLm51bVBvaW50cztcclxuICAgIHZhciBhYmJyZXYgPSBjb3VudCA+PSAxMDAwMCA/IE1hdGgucm91bmQoY291bnQgLyAxMDAwKSArICdrJyA6XHJcbiAgICAgICAgICAgICAgICAgY291bnQgPj0gMTAwMCA/IChNYXRoLnJvdW5kKGNvdW50IC8gMTAwKSAvIDEwKSArICdrJyA6IGNvdW50O1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjbHVzdGVyOiB0cnVlLFxyXG4gICAgICAgIHBvaW50X2NvdW50OiBjb3VudCxcclxuICAgICAgICBwb2ludF9jb3VudF9hYmJyZXZpYXRlZDogYWJicmV2XHJcbiAgICB9O1xyXG59XHJcblxyXG4vLyBsb25naXR1ZGUvbGF0aXR1ZGUgdG8gc3BoZXJpY2FsIG1lcmNhdG9yIGluIFswLi4xXSByYW5nZVxyXG5mdW5jdGlvbiBsbmdYKGxuZykge1xyXG4gICAgcmV0dXJuIGxuZyAvIDM2MCArIDAuNTtcclxufVxyXG5mdW5jdGlvbiBsYXRZKGxhdCkge1xyXG4gICAgdmFyIHNpbiA9IE1hdGguc2luKGxhdCAqIE1hdGguUEkgLyAxODApLFxyXG4gICAgICAgIHkgPSAoMC41IC0gMC4yNSAqIE1hdGgubG9nKCgxICsgc2luKSAvICgxIC0gc2luKSkgLyBNYXRoLlBJKTtcclxuICAgIHJldHVybiB5IDwgMCA/IDAgOlxyXG4gICAgICAgICAgIHkgPiAxID8gMSA6IHk7XHJcbn1cclxuXHJcbi8vIHNwaGVyaWNhbCBtZXJjYXRvciB0byBsb25naXR1ZGUvbGF0aXR1ZGVcclxuZnVuY3Rpb24geExuZyh4KSB7XHJcbiAgICByZXR1cm4gKHggLSAwLjUpICogMzYwO1xyXG59XHJcbmZ1bmN0aW9uIHlMYXQoeSkge1xyXG4gICAgdmFyIHkyID0gKDE4MCAtIHkgKiAzNjApICogTWF0aC5QSSAvIDE4MDtcclxuICAgIHJldHVybiAzNjAgKiBNYXRoLmF0YW4oTWF0aC5leHAoeTIpKSAvIE1hdGguUEkgLSA5MDtcclxufVxyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYykge1xyXG4gICAgZm9yICh2YXIgaWQgaW4gc3JjKSBkZXN0W2lkXSA9IHNyY1tpZF07XHJcbiAgICByZXR1cm4gZGVzdDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WChwKSB7XHJcbiAgICByZXR1cm4gcC54O1xyXG59XHJcbmZ1bmN0aW9uIGdldFkocCkge1xyXG4gICAgcmV0dXJuIHAueTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzb3J0ID0gcmVxdWlyZSgnLi9zb3J0Jyk7XG52YXIgcmFuZ2UgPSByZXF1aXJlKCcuL3JhbmdlJyk7XG52YXIgd2l0aGluID0gcmVxdWlyZSgnLi93aXRoaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZGJ1c2g7XG5cbmZ1bmN0aW9uIGtkYnVzaChwb2ludHMsIGdldFgsIGdldFksIG5vZGVTaXplLCBBcnJheVR5cGUpIHtcbiAgICByZXR1cm4gbmV3IEtEQnVzaChwb2ludHMsIGdldFgsIGdldFksIG5vZGVTaXplLCBBcnJheVR5cGUpO1xufVxuXG5mdW5jdGlvbiBLREJ1c2gocG9pbnRzLCBnZXRYLCBnZXRZLCBub2RlU2l6ZSwgQXJyYXlUeXBlKSB7XG4gICAgZ2V0WCA9IGdldFggfHwgZGVmYXVsdEdldFg7XG4gICAgZ2V0WSA9IGdldFkgfHwgZGVmYXVsdEdldFk7XG4gICAgQXJyYXlUeXBlID0gQXJyYXlUeXBlIHx8IEFycmF5O1xuXG4gICAgdGhpcy5ub2RlU2l6ZSA9IG5vZGVTaXplIHx8IDY0O1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuXG4gICAgdGhpcy5pZHMgPSBuZXcgQXJyYXlUeXBlKHBvaW50cy5sZW5ndGgpO1xuICAgIHRoaXMuY29vcmRzID0gbmV3IEFycmF5VHlwZShwb2ludHMubGVuZ3RoICogMik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmlkc1tpXSA9IGk7XG4gICAgICAgIHRoaXMuY29vcmRzWzIgKiBpXSA9IGdldFgocG9pbnRzW2ldKTtcbiAgICAgICAgdGhpcy5jb29yZHNbMiAqIGkgKyAxXSA9IGdldFkocG9pbnRzW2ldKTtcbiAgICB9XG5cbiAgICBzb3J0KHRoaXMuaWRzLCB0aGlzLmNvb3JkcywgdGhpcy5ub2RlU2l6ZSwgMCwgdGhpcy5pZHMubGVuZ3RoIC0gMSwgMCk7XG59XG5cbktEQnVzaC5wcm90b3R5cGUgPSB7XG4gICAgcmFuZ2U6IGZ1bmN0aW9uIChtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZKSB7XG4gICAgICAgIHJldHVybiByYW5nZSh0aGlzLmlkcywgdGhpcy5jb29yZHMsIG1pblgsIG1pblksIG1heFgsIG1heFksIHRoaXMubm9kZVNpemUpO1xuICAgIH0sXG5cbiAgICB3aXRoaW46IGZ1bmN0aW9uICh4LCB5LCByKSB7XG4gICAgICAgIHJldHVybiB3aXRoaW4odGhpcy5pZHMsIHRoaXMuY29vcmRzLCB4LCB5LCByLCB0aGlzLm5vZGVTaXplKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0R2V0WChwKSB7IHJldHVybiBwWzBdOyB9XG5mdW5jdGlvbiBkZWZhdWx0R2V0WShwKSB7IHJldHVybiBwWzFdOyB9XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZ2U7XG5cbmZ1bmN0aW9uIHJhbmdlKGlkcywgY29vcmRzLCBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZLCBub2RlU2l6ZSkge1xuICAgIHZhciBzdGFjayA9IFswLCBpZHMubGVuZ3RoIC0gMSwgMF07XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciB4LCB5O1xuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXhpcyA9IHN0YWNrLnBvcCgpO1xuICAgICAgICB2YXIgcmlnaHQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgdmFyIGxlZnQgPSBzdGFjay5wb3AoKTtcblxuICAgICAgICBpZiAocmlnaHQgLSBsZWZ0IDw9IG5vZGVTaXplKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbGVmdDsgaSA8PSByaWdodDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgeCA9IGNvb3Jkc1syICogaV07XG4gICAgICAgICAgICAgICAgeSA9IGNvb3Jkc1syICogaSArIDFdO1xuICAgICAgICAgICAgICAgIGlmICh4ID49IG1pblggJiYgeCA8PSBtYXhYICYmIHkgPj0gbWluWSAmJiB5IDw9IG1heFkpIHJlc3VsdC5wdXNoKGlkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xuXG4gICAgICAgIHggPSBjb29yZHNbMiAqIG1dO1xuICAgICAgICB5ID0gY29vcmRzWzIgKiBtICsgMV07XG5cbiAgICAgICAgaWYgKHggPj0gbWluWCAmJiB4IDw9IG1heFggJiYgeSA+PSBtaW5ZICYmIHkgPD0gbWF4WSkgcmVzdWx0LnB1c2goaWRzW21dKTtcblxuICAgICAgICB2YXIgbmV4dEF4aXMgPSAoYXhpcyArIDEpICUgMjtcblxuICAgICAgICBpZiAoYXhpcyA9PT0gMCA/IG1pblggPD0geCA6IG1pblkgPD0geSkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChsZWZ0KTtcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobSAtIDEpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChuZXh0QXhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF4aXMgPT09IDAgPyBtYXhYID49IHggOiBtYXhZID49IHkpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobSArIDEpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChyaWdodCk7XG4gICAgICAgICAgICBzdGFjay5wdXNoKG5leHRBeGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydEtEO1xuXG5mdW5jdGlvbiBzb3J0S0QoaWRzLCBjb29yZHMsIG5vZGVTaXplLCBsZWZ0LCByaWdodCwgZGVwdGgpIHtcbiAgICBpZiAocmlnaHQgLSBsZWZ0IDw9IG5vZGVTaXplKSByZXR1cm47XG5cbiAgICB2YXIgbSA9IE1hdGguZmxvb3IoKGxlZnQgKyByaWdodCkgLyAyKTtcblxuICAgIHNlbGVjdChpZHMsIGNvb3JkcywgbSwgbGVmdCwgcmlnaHQsIGRlcHRoICUgMik7XG5cbiAgICBzb3J0S0QoaWRzLCBjb29yZHMsIG5vZGVTaXplLCBsZWZ0LCBtIC0gMSwgZGVwdGggKyAxKTtcbiAgICBzb3J0S0QoaWRzLCBjb29yZHMsIG5vZGVTaXplLCBtICsgMSwgcmlnaHQsIGRlcHRoICsgMSk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdChpZHMsIGNvb3JkcywgaywgbGVmdCwgcmlnaHQsIGluYykge1xuXG4gICAgd2hpbGUgKHJpZ2h0ID4gbGVmdCkge1xuICAgICAgICBpZiAocmlnaHQgLSBsZWZ0ID4gNjAwKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHJpZ2h0IC0gbGVmdCArIDE7XG4gICAgICAgICAgICB2YXIgbSA9IGsgLSBsZWZ0ICsgMTtcbiAgICAgICAgICAgIHZhciB6ID0gTWF0aC5sb2cobik7XG4gICAgICAgICAgICB2YXIgcyA9IDAuNSAqIE1hdGguZXhwKDIgKiB6IC8gMyk7XG4gICAgICAgICAgICB2YXIgc2QgPSAwLjUgKiBNYXRoLnNxcnQoeiAqIHMgKiAobiAtIHMpIC8gbikgKiAobSAtIG4gLyAyIDwgMCA/IC0xIDogMSk7XG4gICAgICAgICAgICB2YXIgbmV3TGVmdCA9IE1hdGgubWF4KGxlZnQsIE1hdGguZmxvb3IoayAtIG0gKiBzIC8gbiArIHNkKSk7XG4gICAgICAgICAgICB2YXIgbmV3UmlnaHQgPSBNYXRoLm1pbihyaWdodCwgTWF0aC5mbG9vcihrICsgKG4gLSBtKSAqIHMgLyBuICsgc2QpKTtcbiAgICAgICAgICAgIHNlbGVjdChpZHMsIGNvb3JkcywgaywgbmV3TGVmdCwgbmV3UmlnaHQsIGluYyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdCA9IGNvb3Jkc1syICogayArIGluY107XG4gICAgICAgIHZhciBpID0gbGVmdDtcbiAgICAgICAgdmFyIGogPSByaWdodDtcblxuICAgICAgICBzd2FwSXRlbShpZHMsIGNvb3JkcywgbGVmdCwgayk7XG4gICAgICAgIGlmIChjb29yZHNbMiAqIHJpZ2h0ICsgaW5jXSA+IHQpIHN3YXBJdGVtKGlkcywgY29vcmRzLCBsZWZ0LCByaWdodCk7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBqKSB7XG4gICAgICAgICAgICBzd2FwSXRlbShpZHMsIGNvb3JkcywgaSwgaik7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB3aGlsZSAoY29vcmRzWzIgKiBpICsgaW5jXSA8IHQpIGkrKztcbiAgICAgICAgICAgIHdoaWxlIChjb29yZHNbMiAqIGogKyBpbmNdID4gdCkgai0tO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvb3Jkc1syICogbGVmdCArIGluY10gPT09IHQpIHN3YXBJdGVtKGlkcywgY29vcmRzLCBsZWZ0LCBqKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgICBzd2FwSXRlbShpZHMsIGNvb3JkcywgaiwgcmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGogPD0gaykgbGVmdCA9IGogKyAxO1xuICAgICAgICBpZiAoayA8PSBqKSByaWdodCA9IGogLSAxO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3dhcEl0ZW0oaWRzLCBjb29yZHMsIGksIGopIHtcbiAgICBzd2FwKGlkcywgaSwgaik7XG4gICAgc3dhcChjb29yZHMsIDIgKiBpLCAyICogaik7XG4gICAgc3dhcChjb29yZHMsIDIgKiBpICsgMSwgMiAqIGogKyAxKTtcbn1cblxuZnVuY3Rpb24gc3dhcChhcnIsIGksIGopIHtcbiAgICB2YXIgdG1wID0gYXJyW2ldO1xuICAgIGFycltpXSA9IGFycltqXTtcbiAgICBhcnJbal0gPSB0bXA7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gd2l0aGluO1xuXG5mdW5jdGlvbiB3aXRoaW4oaWRzLCBjb29yZHMsIHF4LCBxeSwgciwgbm9kZVNpemUpIHtcbiAgICB2YXIgc3RhY2sgPSBbMCwgaWRzLmxlbmd0aCAtIDEsIDBdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgcjIgPSByICogcjtcblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGF4aXMgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgdmFyIHJpZ2h0ID0gc3RhY2sucG9wKCk7XG4gICAgICAgIHZhciBsZWZ0ID0gc3RhY2sucG9wKCk7XG5cbiAgICAgICAgaWYgKHJpZ2h0IC0gbGVmdCA8PSBub2RlU2l6ZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxlZnQ7IGkgPD0gcmlnaHQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChzcURpc3QoY29vcmRzWzIgKiBpXSwgY29vcmRzWzIgKiBpICsgMV0sIHF4LCBxeSkgPD0gcjIpIHJlc3VsdC5wdXNoKGlkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xuXG4gICAgICAgIHZhciB4ID0gY29vcmRzWzIgKiBtXTtcbiAgICAgICAgdmFyIHkgPSBjb29yZHNbMiAqIG0gKyAxXTtcblxuICAgICAgICBpZiAoc3FEaXN0KHgsIHksIHF4LCBxeSkgPD0gcjIpIHJlc3VsdC5wdXNoKGlkc1ttXSk7XG5cbiAgICAgICAgdmFyIG5leHRBeGlzID0gKGF4aXMgKyAxKSAlIDI7XG5cbiAgICAgICAgaWYgKGF4aXMgPT09IDAgPyBxeCAtIHIgPD0geCA6IHF5IC0gciA8PSB5KSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKGxlZnQpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChtIC0gMSk7XG4gICAgICAgICAgICBzdGFjay5wdXNoKG5leHRBeGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXhpcyA9PT0gMCA/IHF4ICsgciA+PSB4IDogcXkgKyByID49IHkpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2gobSArIDEpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChyaWdodCk7XG4gICAgICAgICAgICBzdGFjay5wdXNoKG5leHRBeGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNxRGlzdChheCwgYXksIGJ4LCBieSkge1xuICAgIHZhciBkeCA9IGF4IC0gYng7XG4gICAgdmFyIGR5ID0gYXkgLSBieTtcbiAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG59XG4iXX0=
