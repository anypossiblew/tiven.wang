---
layout: post
title: Analysis of AQI on Map using D3.js and Turf.js
excerpt: "市面上常见的空气质量指数（AQI）展现方式都是简单的标记某个测量位置的测量值，我们想更加全局地把握观察AQI的分布，这里我们研究使用几个不同的统计方式在地图上展现AQI的区分分布效果。沃洛诺伊图（Voronoi Diagram）是根据多个点对空间进行分割的算法，比较适合我们根据监测点计算其所覆盖的区域。"
modified: 2016-10-28T18:00:00-00:00
categories: articles
tags: [D3.js, Turf.js, AQI, Map]
image:
  feature: web/masthead-web.jpg
comments: true
share: true
---

* TOC
{:toc}

## Why

由于人们生活质量的提高和互联网媒体的发展，周围的环境质量越来越受到关注。虽然现在我们已经能从各种渠道获得环境质量的数据，但这并不能满足我们日益增长的智商。我们并不想一直活在人为制造的**霾**下，让我们拨开雾霾重见天日吧。

市面上常见的空气质量指数（AQI）展现方式都是简单的标记某个测量位置的测量值，我们想更加全局地把握观察AQI的分布，这里我们研究使用几个不同的统计方式在地图上展现AQI的区分分布效果。

## Voronoi Diagram

沃洛诺伊图（Voronoi Diagram）是根据多个点对空间进行分割的算法，比较适合我们根据监测点计算其所覆盖的区域。

> 关于Voronoi Diagram可以参考以下链接：<br />
[https://en.wikipedia.org/wiki/Voronoi_diagram](https://en.wikipedia.org/wiki/Voronoi_diagram)<br />
[知乎 - 奶牛和花豹身上的花纹分布是遵循某某规律](https://www.zhihu.com/question/48847026)<br />
[知乎 - 沃罗诺伊图（Voronoi Diagram，也称作Dirichlet tessellation，狄利克雷镶嵌 ）是怎样的](https://www.zhihu.com/question/20317274)
<br/>
这里我们使用 D3.js 的 voronoi function 进行计算，并使用D3.js在地图的tileLayer上画出每个点和多边形区域。

### Use voronoi of D3.js

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

### Demo

<div class="mfp-iframe-scaler">
<iframe width="420" height="100" src="http://labs.tiven.wang/map/realtime-aqi-via-d3-voronoi-on-map.html" frameborder="1"></iframe>
</div>
[See this example stand-alone][1]
{: .center}

## Methods of Turf.js

我们研究使用另外几个算法展现AQI的分布，Turf.js是Mapbox提供的开源库，里面拥有大量针对GeoJSON格式的地理信息数据的算法。其中我们使用isolines, hex和tin分别计算AQI的分布

* [tin][2] 是计算任意三个点之间的三角形区域取三个点的平均值来代表此区域的AQI值，在监测点比较密集的情况下，这种方法有效避免了寄点的出现。但在监测点分布不均匀的情况下，这种方法表现不如voronoi图形效果

* [hex][3] 对地图某个区域预先进行六边形划分，然后计算落在每个六边形区域内的检测值得平均值。这种方式能更好地表现AQI的实际的集中分布地区，避免了没有监测点的区域也计算在内的情况。但其表现要依靠六边形划分的密度

* [isolines][4] 可以计算出AQI不同区间值的分割线，即AQI值等高线。对于观测AQI的区间分布范围有比较好的效果。

[1]:http://labs.tiven.wang/map/realtime-aqi-via-d3-voronoi-on-map.html
[2]:http://labs.tiven.wang/map/realtime-aqi-via-turf-tin-on-map-local.html
[3]:http://labs.tiven.wang/map/realtime-aqi-via-turf-hex-on-map.html
[4]:http://labs.tiven.wang/map/realtime-aqi-via-turf-isolines-on-map.html
