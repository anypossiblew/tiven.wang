---
layout: laboratory
title: Map Laboratory by Tiven
excerpt: "A Laboratory for Map layer visualization by Tiven"
tags: [Map, Visualization, D3.js, Leaflet.js, Turf.js]
laboratory:
  title: "Map Laboratory"
  description: "In this laboratory there are many big data analysis application demos on web map. We used a lot of opensource tools, for example Leaflet.js Turf.js D3.js ..."
projects:
  - title: "Super cluster on Baidu Map"
    description: "This project demo implemented super cluster for big data markers on baidu map."
    page: "cluster/"
    previewImage: "images/thumbs/super-cluster-baidu.jpg"
  - title: "D3.js Voronoi on Map"
    description: "Use 'voronoi' function of D3.js to visualize and analysis real-time air quality index (AQI) on leaflet map."
    page: "realtime-aqi-via-d3-voronoi-on-map.html"
    previewImage: "images/thumbs/D3.js-Voronoi-on-Map.jpg"
  - title: "Triangulated Irregular Network on Map"
    description: "Visualize the AQI to triangulated irregular network on leaflet map by 'tin' function of Turj.js."
    page: "realtime-aqi-via-turf-tin-on-map-local.html"
    previewImage: "images/thumbs/Triangulated-Irregular-Network-on-Map.jpg"
  - title: "Visualization by Hexagon on Map"
    description: "Use hexagon to analysis the AQI on map by 'hexGrid' function of Turf.js."
    page: "realtime-aqi-via-turf-hex-on-map.html"
    previewImage: "images/thumbs/Hexagon-on-Map.jpg"
  - title: "Visualization by Isolines on Map"
    description: "Use isolines to analysis the AQI on map by 'isolines' function of Turf.js."
    page: "realtime-aqi-via-turf-isolines-on-map.html"
    previewImage: "images/thumbs/AQI-Isolines-on-Map.jpg"
---

## Super cluster on Baidu Map

marker聚合在地图应用的很多场景中有着广泛使用，不同的地图提供商一般都有提供相应的marker cluster功能或插件，比较常用的如[Marker Clustering plugin for Leaflet](https://github.com/Leaflet/Leaflet.markercluster)。对于百度地图在其官方开源库中也提供了聚合插件[MarkerClusterer标记聚合器](http://lbsyun.baidu.com/index.php?title=open/library)，但性能不尽如人意。这里我们来研究使用Mapbox的[supercluster](https://github.com/mapbox/supercluster)插件做百度地图上的标记聚合功能。

首先clone project [supercluster](https://github.com/mapbox/supercluster)到本地
`git clone https://github.com/mapbox/supercluster.git`
然后使用命令`npm install`下载依赖库，下载完后程序会自动生成dist文件夹，里面会有`supercluster.js`文件即是我们所要用的supercluster插件。

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

这里使用5w个点进行模拟，最终地图效果[Super cluster on Baidu Map](./cluster/)


## Analysis the distribution of AQI on map using D3.js and Turf.js

由于人们生活质量的提高和互联网媒体的发展，周围的环境质量越来越受到关注。虽然现在我们已经能从各种渠道获得环境质量的数据，但这并不能满足我们日益增长的智商。我们并不想一直活在人为制造的**霾**下，让我们拨开雾霾重见天日吧。

市面上常见的空气质量指数（AQI）展现方式都是简单的标记某个测量位置的测量值，我们想更加全局地把握观察AQI的分布，这里我们研究使用几个不同的统计方式在地图上展现AQI的区分分布效果。

### Voronoi Diagram

沃洛诺伊图（Voronoi Diagram）是根据多个点对空间进行分割的算法，比较适合我们根据监测点计算其所覆盖的区域。

> 关于Voronoi Diagram可以参考以下链接：<br />
[https://en.wikipedia.org/wiki/Voronoi_diagram](https://en.wikipedia.org/wiki/Voronoi_diagram)<br />
[知乎 - 奶牛和花豹身上的花纹分布是遵循某某规律](https://www.zhihu.com/question/48847026)<br />
[知乎 - 沃罗诺伊图（Voronoi Diagram，也称作Dirichlet tessellation，狄利克雷镶嵌 ）是怎样的](https://www.zhihu.com/question/20317274)
<br/>
这里我们使用 D3.js 的 voronoi function 进行计算，并使用D3.js在地图的tileLayer上画出每个点和多边形区域。

```javascript
// ... initialize map

// 初始化voronoi工具
var voronoi = d3.voronoi()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });

```

```javascript
// 设置voronoi算法的边界
var bounds = map.getBounds();
var sw = bounds.getSouthWest();
var ne = bounds.getNorthEast();
var topLeft = map.latLngToLayerPoint(new L.LatLng(ne.lat, sw.lng));
var bottomRight = map.latLngToLayerPoint(new L.LatLng(sw.lat, ne.lng));

voronoi.extent([[topLeft.x-1, topLeft.y-1], [bottomRight.x + 1, bottomRight.y + 1]])
```

```javascript
//删除旧的circle
d3.selectAll('.AQIpoint').remove();
// 绘制新的点
var circle = g.selectAll("circle")
  .data(positions)
  .enter()
  .append("circle")
  .attr("class", "AQIpoint")
  .attr("cx", function(d, i) { return d.x; })
  .attr("cy", function(d, i) { return d.y; })
  .attr("r", 2)
  .attr("fill", function(d,i) { 
    return aqiColour(jQuery.isNumeric(d.aqi) ? Number(d.aqi) : -1);
  })
  ;
```

```javascript
// 计算得到voronoi diagram对象
var diagram = voronoi(positions);
  
//删除旧的多边形
svg.selectAll(".volonoi").remove();
// 绘制新的多边形
svg.selectAll("path")
  .data(diagram.polygons())
  .enter()
  .append("svg:path")
  .attr("class", "volonoi")
  .attr("d", function(d) { 
    return d ? "M" + d.join("L") + "Z" : null; 
  })
  .attr("stroke", "white")
  .attr("opacity", .3)
  .attr("fill", function(d,i) { 
    return aqiColour(jQuery.isNumeric(pointdata[i].aqi) ? Number(pointdata[i].aqi) : -1);
  })
  .on("mouseenter", function (d, i) {
      d3.select(this).attr("stroke", "blue");
      closeTooltips(i);
  })
  .on("mouseleave", function () {
      d3.select(this).attr("stroke", "white");
  })
  .on("click", function (d, i) {
    openTooltips(pointdata[i], positions[i], i);
  });
```

最终效果[Voronoi Diagram for AQI on Map](./realtime-aqi-via-d3-voronoi-on-map.html)


### Isolines, Hexagon and Triangulated Irregular Network

我们研究使用另外几个算法展现AQI的分布，Turf.js是Mapbox提供的开源库，里面拥有大量针对GeoJSON格式的地理信息数据的算法。其中我们使用isolines, hex和tin分别计算AQI的分布

* [tin](./realtime-aqi-via-turf-tin-on-map-local.html) 是计算任意三个点之间的三角形区域取三个点的平均值来代表此区域的AQI值，在监测点比较密集的情况下，这种方法有效避免了寄点的出现。但在监测点分布不均匀的情况下，这种方法表现不如voronoi图形效果

* [hex](./realtime-aqi-via-turf-hex-on-map.html) 对地图某个区域预先进行六边形划分，然后计算落在每个六边形区域内的检测值得平均值。这种方式能更好地表现AQI的实际的集中分布地区，避免了没有监测点的区域也计算在内的情况。但其表现要依靠六边形划分的密度

* [isolines](./realtime-aqi-via-turf-isolines-on-map.html) 可以计算出AQI不同区间值的分割线，即AQI值等高线。对于观测AQI的区间分布范围有比较好的效果。

如果你有更好的方法，欢迎[联系我](#three)。