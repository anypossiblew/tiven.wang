---
layout: post
title: HANA Spatial with Baidu Map
excerpt: "SAP HANA Spatial在SAP各产品中的应用越来越广泛，同时以SAP HANA为基础的产品在中国市场得到快速成长，SAP产品中的地图在进入中国市场时经常会遇到本土化的问题。作为国内知名的地图供应商百度地图Baidu Map经常被用来作为地图可视化的工具。但国外的产品在本地化的过程中总是会遇到水土不服的问题。"
modified: 2016-07-26T17:49:25-04:00
categories: articles
tags: [Baidu Map, HANA Spatial, WGS-84, SRS]
image:
  feature: masthead-geospatial.jpg
comments: true
share: true
references:
  - title: "Mapping the world grid"
    url: "http://www.bibliotecapleyades.net/ciencia/antigravityworldgrid/ciencia_antigravityworldgrid01.htm"
  - title: "Map in wikipedia"
    url: "https://en.wikipedia.org/wiki/Map"
  - title: "Leaflet - a JavaScript library for interactive maps"
    url: "http://leafletjs.com/"
---

* TOC
{:toc}

SAP HANA Spatial在SAP各产品中的应用越来越广泛，同时以SAP HANA为基础的产品在中国市场得到快速成长，SAP产品中的地图在进入中国市场时经常会遇到本土化的问题。作为国内知名的地图供应商百度地图经常被用来作为地图可视化的工具。但国外的产品在本地化的过程中总是会遇到水土不服的问题，本篇文章就来探讨一下如何在HANA Spatial中进行地理空间信息的本土化。

## 背景

### HANA Spatial
关于HANA Spatial的介绍参考另一篇[HANA Spatial in Action](/articles/hana-spatial-in-action)。

### 百度地图

通过阅读[百度地图使用者须知](http://lbsyun.baidu.com/index.php?title=open/question)我们知道百度地图使用的坐标体系是经纬度坐标系和墨卡托投影坐标系。这两种坐标体系是国际上常见地图使用的坐标体系，是国际通用的地理空间坐标体系。但是在坐标体系之上还有个坐标标准即[Spatial Reference System(SRS)](https://en.wikipedia.org/wiki/Spatial_reference_system)，有开放标准组织对其进行标准化[http://spatialreference.org/](http://spatialreference.org/)，企业通常会使用此标准。通常经纬度坐标系一般对应的空间参考系统是WGS-84，全球定位系统GPS使用的即是此参考系统。但国内鉴于法律原因必须至少使用国测局制定的GCJ-02空间参考系统。

GCJ-02是在WGS-84的基础上进行了伪随机地偏移，此偏移是连续非线性的（连续：无限接近的两点的偏移的差值无限接近于0；非线性：任意相互接近两点的偏移方向不同）。每个点的偏移距离大概是1公里左右。

百度地图使用的BD-09参考系统是在GCJ-02基础上进行二次加密（伪随机偏移），更加保护了个人隐私。所以在使用百度地图时我们不能直接把各种途径采集来的WGS-84标准的经纬度坐标放在百度地图里使用。百度地图提供了WGS-84转成BD-09的API，但其不会提供反向的转换。

## 问题

### 如何切换地图
如何使用不同供应商的地图，基本上每个地图供应商都会提供自己地图的JavaScript的library，并且每个供应商的library使用都比较类似。所以你只需要按照其相应的API使用规范就可以创建地图。

还有一种方式，此类JavaScript library只提供地图的通用逻辑但不提供地图的数据，如[Leafletjs](http://leafletjs.com/)。目前流行的地图展现方式是通过将地图图片以碎片形式拼接展现的。

为什么Baidu Map不能使用这种方式，因为Baidu地图的图片是有偏移的，所以在用到Leaflet上时你看到的点和其实际GPS坐标不一致。

### 如何存储坐标
由于百度地图进行了加密偏移，所以我们不能把标准的WGS-84经纬度坐标直接用于百度地图。所以我们考虑可能的方式:

* 在用于百度地图的时候调用百度地图API将坐标从WGS-84转换成BD-09。
* 在存储坐标之前从WGS-84转换成BD-09。
* 对于HANA，在view里做计算列，查询时实时转换。

第一种显而易见效率很低，虽然API支持批量转换，但对于大量数据来说也会很慢。并且还有一个问题，如果使用百度地图画区域(得到的是BD-09坐标)圈点坐标即去数据库(存储的是WGS-84)查询所包含坐标点，显然会有偏移所带来的差异。

第二种是比较合适的，在每次存储前转换成百度坐标。既分散了转换需要的时间，又解决了画区域圈点时的差异。但这种方式也有限制：如果系统同时需要使用其他非百度格式的地图，则无法使用这些百度坐标点（既有偏移，又不能反向转换成其他坐标系的点）。

第三种方式可以同时解决在展示是转换的效率问题，画区域圈点时的差异问题，不能同时用在其他坐标系地图上的问题。但HANA View计算列自身的效率如何，这个值得测试。我们在实际测试中发现，由于算法复杂性大，导致在数据量大（百万级）的情况下效率又明显下降。

根据实际项目情况，我们最终选择了第二种方式。

## 解决

### 为百度坐标系新建SRS
选择第二种方式数据库中存储BD-09的坐标数据，同时又要支持WGS-84的坐标数据，我们要在数据库表中可以区分两个格式。WGS-84对应的SRS的ID是4326，我们选择为BD-09创建新的SRS。这样的话在使用百度地图时只查询SRID为xxxxx的坐标数据，在使用WGS-84坐标系的地图时只查询SRID为4326的坐标数据。

创建SRS的SQL语法:

```sql
CREATE SPATIAL REFERENCE SYSTEM "BD 09"
IDENTIFIED BY xxxxx
TYPE ROUND EARTH
SNAP TO GRID 0
TOLERANCE 0
LINEAR UNIT OF MEASURE "meter"
ANGULAR UNIT OF MEASURE "degree"
POLYGON FORMAT 'EvenOdd'
STORAGE FORMAT 'Mixed'
COORDINATE LONGITUDE BETWEEN -180 AND 180
COORDINATE LATITUDE BETWEEN -90 AND 90
DEFINITION 'GEOGCS["BD 09" DATUM["WGS_1984" SPHEROID["WGS 84" 6378137 298.2572236 AUTHORITY["EPSG"  7030]] AUTHORITY["EPSG" 6326]] PRIMEM["Greenwich" 0 AUTHORITY["EPSG" 8901]] UNIT["degree" 0.017453293 AUTHORITY["EPSG" 9122]] AUTHORITY["EPSG" 4326]]'
TRANSFORM DEFINITION '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
ELLIPSOID SEMI MAJOR AXIS 6378137
INVERSE FLATTENING 298.257223563
ORGANIZATION SAP IDENTIFIED BY 0 
;
 
CREATE SPATIAL REFERENCE SYSTEM "BD 09 (planar)"
IDENTIFIED BY 10000xxxxx
TYPE PLANAR
SNAP TO GRID 0.000000001
TOLERANCE 0.000000001
LINEAR UNIT OF MEASURE "planar degree"
ANGULAR UNIT OF MEASURE "degree"
POLYGON FORMAT 'EvenOdd'
STORAGE FORMAT 'INTERNAL'
COORDINATE LONGITUDE BETWEEN -180 AND 180
COORDINATE LATITUDE BETWEEN -90 AND 90
DEFINITION 'GEOGCS["BD 09" DATUM["WGS_1984" SPHEROID["WGS 84" 6378137 298.2572236 AUTHORITY["EPSG"  7030]] AUTHORITY["EPSG" 6326]] PRIMEM["Greenwich" 0 AUTHORITY["EPSG" 8901]] UNIT["degree" 0.017453293 AUTHORITY["EPSG" 9122]] AUTHORITY["EPSG" 4326]]'
TRANSFORM DEFINITION '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
ELLIPSOID SEMI MAJOR AXIS 6378137
INVERSE FLATTENING 298.257223563
ORGANIZATION SAP IDENTIFIED BY 0
;
``` 


### 如何在创建HANA View计算列
参考SAP HANA 官方文档。

## 总结
SAP产品在中国市场经常会遇到本土化的问题，SAP所面对的是国际市场，各种需求都可能出现，所以其产品做得也是非常灵活，总能找到办法解决问题。
