---
layout: post
title: Use Baidu Map Provider in Leaflet.js
excerpt: "百度地图 Baidu Map 的墨卡托投影映射 Mercator Projection 和经纬度坐标与 Tile Url 都有加偏移，本文介绍如何继承和修改 Leaflet.js 原有 Class 使之适应百度地图的算法，将百度地图展示于 Leaflet.js 框架上"
modified: 2016-10-27T17:00:00-00:00
categories: articles
tags: [Baidu Map, 百度地图, Map, SRS]
mathjax: true
image:
  feature: web/masthead-web.jpg
comments: true
share: true
---

* TOC
{:toc}

## Why

地图在我们各种应用中得到广泛应用，而市面上的地图供应商繁多，在选择使用哪种地图时需要考虑众多因素，而国内的地图又尤其与众不同。常见的地图有百度地图、高德地图，国外的有Google地图、Mapbox地图、CartoDB、Here Map、OpenStreet Map、Stamen Map、Esri Map等等，更是繁多。既然这么多不同地图有没有相同之处呐，当然是有。一般的地图都符合一定的地图空间坐标标准，既然坐标标准都一样，那么就应用有一套可视化机制适合所有符合坐标标准的地图。
由Mapbox提供的开源框架Leaflet.js就可以做到，它不提供地图数据，而只是一个地图可视化的javascript库。

在国内很多国外地图是不能使用的，即使可以但地图细节数据也不够完善。这就需要使用到国内的地图供应商的数据，本篇就是介绍如何在Leaflet.js内使用Baidu地图。

[demo: baidu map in leaflet.js application][3]

## Baidu Map

### Baidu Map SRS

关于空间坐标系统可以参考 [SRS - Spatial Reference System][1]

百度坐标系并不是真正意义上一个新的坐标系，它只不过是在原有的坐标系的基础上进行了偏移加密。关于百度地图的坐标问题请参考 [HANA Spatial with Baidu Map][2]

## Leaflet

### Longitude Latitude to Point Coordinate

地球经纬度坐标(lng,lat)需要先转换成墨卡托投影(Mercator Projection)的点坐标(x,y)(然后点坐标再转换成计算机的像素点坐标)。Leaflet.js 的 `L.Projection` namespace 下的 Classes 即是各种投影算法。

这里就是需要把百度地图坐标（如果你的经纬度坐标是GPS坐标，需要先转换成百度坐标）转换成墨卡托投影(Mercator Projection)的点坐标，转换的数学公式参考[Wolfram MathWorld - Mercator Projection][4]。

<figure class="center">
  <img src="/images/web/map/Cylindrical_Projection_basics2.svg" alt="Mercator Projection">
  <figcaption>Mercator Projection</figcaption>
</figure>

公式如下

\\[ R = 6378137(mi)  地球半径 \\]

\\[ x = R * \pi * \frac{lng}{180} \\]

\\[ \phi = \frac{\pi * lat}{180} \\]

\\[ y = R * \frac{1}{2} * \ln\left(\frac{1+\sin(\phi)}{1-\sin(\phi)}\right) \\]

由于百度地图墨卡托投影坐标进行了偏移加密，所以并不能直接使用上面的标准公式计算。为了方便我们直接调用百度地图javascript的已有方法进行计算

```javascript
/**
 * Projection class for Baidu Spherical Mercator
 *
 * @class BaiduSphericalMercator
 */
L.Projection.BaiduSphericalMercator = {
    /**
     * Project latLng to point coordinate
     *
     * @method project
     * @param {Object} latLng coordinate for a point on earth
     * @return {Object} leafletPoint point coordinate of L.Point
     */
    project: function(latLng) {
        var projection = new BMap.MercatorProjection();
        var originalPoint = new BMap.Point(latLng.lng, latLng.lat);
        var point = projection.lngLatToPoint(originalPoint);
        var leafletPoint = new L.Point(point.x, point.y);
        return leafletPoint;
    },

    /**
     * unproject point coordinate to latLng
     *
     * @method unproject
     * @param {Object} bpoint baidu point coordinate
     * @return {Object} latitude and longitude
     */
    unproject: function (bpoint) {
        var projection= new BMap.MercatorProjection();
        var point = projection.pointToLngLat(
            new BMap.Pixel(bpoint.x, bpoint.y)
        );
        var latLng = new L.LatLng(point.lat, point.lng);
        return latLng;
    },

    /**
     * this is the range of coordinate.
     * Range of pixel coordinate is gotten from
     * BMap.MercatorProjection.lngLatToPoint(180, -90) and (180, 90)
     * After getting max min value of pixel coordinate, use
     * pointToLngLat() get the max lat and Lng.
     */
    bounds: (function () {
        var MAX_X= 20037726.37;
        var MIN_Y= -11708041.66;
        var MAX_Y= 12474104.17;
        var bounds = L.bounds(
            [-MAX_X, MIN_Y], //-180, -71.988531
            [MAX_X, MAX_Y]  //180, 74.000022
        );
        var MAX = 33554432;
        bounds = new L.Bounds(
            [-MAX, -MAX],
            [MAX, MAX]
        );
        return bounds;
    })()
};
```

### Point Coordinate to Pixel Coordinate

墨卡托投影(Mercator Projection)的点坐标point还需要转换成计算机显示屏幕的像素点坐标pixel。Leaflet的Class `L.Transformation` 做此计算。tile为点在zoom=0级别时的tile坐标，每个tile大小为256px × 256px

<figure class="center">
  <img src="/images/web/map/map-tiles.png" alt="Map Tile Coordinate">
  <figcaption>Map Tile Coordinate</figcaption>
</figure>

计算公式如下（有前辈已经算出来了系数\\(\omega\\)我们拿来用）

\\[ \Delta = 0.5 \\]

\\[ \omega = 2^{-8-18} \\]

\\[ tile = point * \omega + \Delta \\]

\\[ pixel = 256 * 2^{zoom} * tile \\]

我们只需要设置\\(\omega\\)\\(\Delta\\)为L.Transformation的系数

```javascript
/**
 * Coordinate system for Baidu EPSG3857
 *
 * @class BEPSG3857
 */
L.CRS.EPSGB3857 = L.extend({}, L.CRS, {
  code: 'EPSG:B3857',
  projection: L.Projection.BaiduSphericalMercator,

  transformation: (function () {
      var z = -18 - 8;
      var scale = Math.pow(2, z);
      return new L.Transformation(scale, 0.5, -scale, 0.5);
  }())
});
```

### Tile Url

Leaflet.js 默认的Tile Url规则是与Tile Coordinate直接对应的,但百度地图的Tile Url也进行了加偏移,转换规则如下

\\[ x_1 = x_0 - 2^{zoom-1} \\]
\\[ y_1 = 2^{zoom-1} - y_0 - 1 \\]

实现代码如下

```javascript
getTileUrl: function (coords) {
    var offset = Math.pow(2, coords.z - 1),
        x = coords.x - offset,
        y = offset - coords.y - 1,
        baiduCoords = L.point(x, y);
    baiduCoords.z = coords.z;
    return L.TileLayer.prototype.getTileUrl.call(this, baiduCoords);
}
```

那么接着`L.TileLayer.prototype.getTileUrl`会使用自定义的 Tile Url Template 进行拼接tile图片地址

```javascript
L.TileLayer.BaiduLayer.desc = {
    Normal: {
        Map: 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl'
    },
    Satellite: {
        Map: 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
        Road: 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl'
    },
    subdomains: '0123456789'
};
```

> 想要使用更多的地图样式，就需要自己去发现其Tile Url Template

完整代码[leaflet-baidu.js][5]

## Create Leaflet Map

创建地图时要设置 `crs:L.CRS.EPSGB3857` 说明地图为百度地图映射系统，添加百度layer为`L.TileLayer.BaiduLayer`

```javascript
var options = {
  crs: L.CRS.EPSGB3857, // Set the CRS to EPSGB3857
  center: [31.207391, 121.608203], // The initial center(baidu BD-09 format) of map
  zoom: 13, // initial zoom of map
  layers: [new L.TileLayer.BaiduLayer("Normal.Map")] // initialize baidu map layer
};
var map = L.map("map", options);
```

### Demo

<div class="mfp-iframe-scaler">
<iframe width="420" height="100" src="/apps/map/leaflet-baidu/" frameborder="1"></iframe>
</div>

[See this example stand-alone][6]
{: .center}

[1]:/articles/hana-spatial-in-action/#srs---spatial-reference-system
[2]:/articles/hana-spatial-with-baidu-map/#section-1
[3]:/apps/map/leaflet-baidu/
[4]:http://mathworld.wolfram.com/MercatorProjection.html
[5]:/apps/map/leaflet-baidu/leaflet-baidu.js
[6]:/apps/map/leaflet-baidu/
