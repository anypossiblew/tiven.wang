---
layout: post
title: Super-cluster plugin on Baidu Map
excerpt: "Marker聚合在地图应用的很多场景中有着广泛使用，不同的地图提供商一般都有提供相应的 marker cluster 功能或插件，比较常用的如 Marker Clustering plugin for Leaflet。对于百度地图在其官方开源库中也提供了聚合插件 MarkerClusterer 标记聚合器，但性能不尽如人意。这里我们来研究使用 Mapbox 的 supercluster 插件做百度地图上的标记聚合功能。"
modified: 2016-10-28T17:00:00-00:00
categories: articles
tags: [Baidu Map, 百度地图, Map, Cluster]
image:
  feature: /images/web/masthead-web.jpg
comments: true
share: true
references:
  - title: "Mapbox Blog - Clustering millions of points on a map with Supercluster"
    url: "https://www.mapbox.com/blog/supercluster/"
---

* TOC
{:toc}

## Why

marker聚合在地图应用的很多场景中有着广泛使用，不同的地图提供商一般都有提供相应的marker cluster功能或插件，比较常用的如[Marker Clustering plugin for Leaflet][1]。对于百度地图在其官方开源库中也提供了聚合插件[MarkerClusterer标记聚合器][2]，但性能不尽如人意。这里我们来研究使用Mapbox的[supercluster][3]插件做百度地图上的标记聚合功能。

## Procedure

### Setup project

首先clone project [supercluster][3]到本地
`git clone https://github.com/mapbox/supercluster.git`
然后使用命令`npm install`下载依赖库，下载完后程序会自动生成dist文件夹，里面会有`supercluster.js`文件即是我们所要用的supercluster插件。

### Map

由于对大数据量进行计算需要消耗比较长的CPU时间，为了不让其block住前端页面我们使用浏览器的Web worker封装计算逻辑。

```javascript

// initialize baidu map
// ...

// create a web worker
var worker = new Worker('worker.js');
var ready = false;

// callback on the calculation finished
worker.onmessage = function (e) {
    if (e.data.ready) {
        ready = true;
        update();
    } else {
        markers.clearLayers();
        markers.addData(e.data);
    }
};

// when map changed update markers cluster
function update() {
    if (!ready) return;
    var bounds = map.getBounds();
    worker.postMessage({
        bbox: [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat],
        zoom: map.getZoom()
    });
}

// on map events
map.addEventListener('moveend', update);
map.addEventListener('zoomend', update);
```

### Web worker

Web worker逻辑如下

```javascript
'use strict';

importScripts('supercluster.min.js');

var index;

getJSON('./path/places.json', function (geojson) {

    // initialize cluster index
    index = supercluster({
        log: true,
        radius: 60,
        extent: 256,
        maxZoom: 18
    }).load(geojson.features);

    // post a message when the index is ready
    postMessage({ready: true});
});

// calculate the inbound index when the map request
self.onmessage = function (e) {
    if (e.data) {
        postMessage(index.getClusters(e.data.bbox, e.data.zoom));
    }
};

function getJSON(url, callback) {
    // get the markers FeatureCollection data
    // ...
    callback(/*data*/);
}
```

## Demo

这里使用5w个点进行模拟，最终地图效果

<div class="mfp-iframe-scaler">
<iframe width="420" height="100" src="http://labs.tiven.wang/map/cluster/" frameborder="1"></iframe>
</div>
[See this example stand-alone][4]
{: .center}


[1]:https://github.com/Leaflet/Leaflet.markercluster
[2]:http://lbsyun.baidu.com/index.php?title=open/library
[3]:https://github.com/mapbox/supercluster
[4]:http://labs.tiven.wang/map/cluster/
