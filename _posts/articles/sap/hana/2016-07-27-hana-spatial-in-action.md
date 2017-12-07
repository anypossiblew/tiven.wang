---
layout: post
title: HANA Spatial in Action
excerpt: "地理空间（geospatial）信息及地图（map）在人们的日常生活和生产中使用越来越广泛。作为程序开发者，深入理解和正确的应用地理空间理论会给我们各种系统带来质的变化。依托HANA内存数据库强大高效的计算能力，HANA Spatial功能可以为基于地理空间信息的大数据分析提供有力的支持。本篇文章将介绍地理空间相关的理论及SAP HANA内存数据库如何对其原生支持的。"
modified: 2016-07-27T11:10:25-04:00
categories: articles
tags: [HANA, HANA Spatial, WGS-84, SRS, 大数据]
image:
  feature: /images/masthead-geospatial.jpg
comments: true
share: true
references:
  - title: "Wikipedia - Spatial Reference System"
    url: "https://en.wikipedia.org/wiki/Spatial_reference_system"
  - title: "Wikipedia - Map projection"
    url: "https://en.wikipedia.org/wiki/Map_projection"
  - title: "Wikipedia - Prime meridian"
    url: "https://en.wikipedia.org/wiki/Prime_meridian"
  - title: "epsg.io"
    url: "https://epsg.io/"
  - title: "SAP HANA Spatial Reference pdf"
    url: "http://help.sap.com/hana/SAP_HANA_Spatial_Reference_en.pdf"

---

* TOC
{:toc}

地理空间（geospatial）信息及地图（map）在人们的日常生活和生产中使用越来越广泛。作为程序开发者，深入理解和正确的应用地理空间理论会给我们各种系统带来质的变化。依托HANA内存数据库强大高效的计算能力，HANA Spatial功能可以为基于地理空间信息的大数据分析提供有力的支持。本篇文章将介绍地理空间相关的理论及SAP HANA内存数据库如何实现HANA Spatial对其原生支持的。

## SRS - Spatial Reference System

### SRS Type
对于地图来说，每一种地图都是一种空间实体，都会对应一个空间参考系统标识（Spatial Reference Identifier (SRID)），每一个SRID对应的空间参考系统（Spatial Reference System (SRS)）都是基于两种椭球映射：平面地球和圆形地球。

* 圆形地球映射
![Round Earth Mapping](/images/hana-spatial/round-earth-mapping.png)

* 平面地球映射
![Flat Earth Mapping](/images/hana-spatial/flat-earth-mapping.jpg)

### SRID
两种类型的映射坐标参考系统都有一些属性如本初子午线即0度经线，距离单位，角度单位，坐标范围等，设置不同的属性可以建立不同的空间参考系统（SRS）。大部分数据库都建立了SRID或者引用了权威机构制定的SRID，权威机构如[European Petroleum Survey Group (EPSG)](http://www.epsg.org/)，可以在网站[http://spatialreference.org/](http://spatialreference.org/)查询其SRS列表。

常用的WGS84空间参考系统的本初子午线即0度经线是格林威治所在经线，坐标范围经度（-180， 180）纬度（-90， 90），另外还有如GRS80。WGS84对应的SRID为EPSG:4326，在WGS84参考系统基础上更改一些属性参数可以等到新的参考系统，如EPSG:42106（WGS84 / Lambert Azim Mozambique）。例如我们可能需要建立某个坐标系只覆盖中国地区，那么其起始点坐标(0,0)可能是在中国地区的中心，范围可能是东经100度到东经140度等等参数。

### Transform coordinates
既然可以自定义很多个不同的空间参考系统，那么就需要在不同的系统之间进行转换坐标。网上有很多在线工具可以做此坐标转换，如[https://epsg.io/transform](https://epsg.io/transform)，开源的javascript工具[http://proj4js.org/](http://proj4js.org/)。

支持空间参考的数据库也会支持坐标转换，后面我们也会介绍HANA的空间坐标转换函数。

## HANA Spatial
HANA提供原生库HANA Spatial对空间参考系统支持。详情参见官方文档[SAP HANA Spatial Reference pdf](http://help.sap.com/hana/SAP_HANA_Spatial_Reference_en.pdf)。

### Data Type
HANA Spatial使用的SRS默认是0，另外提供WGS84 - SRID 4326和WGS 84 (planar) - SRID 1000004326。HANA Spatial还提供多种拥有面向对象的属性的空间数据类型，如：

![HANA Spatial Data Type Image](/images/hana-spatial/spatial-data-type.jpg)

语法举例：

```sql
SELECT NEW ST_Point(2.25, 3.41).ST_X() FROM dummy;
ALTER TABLE SpatialShapes ADD (location ST_POINT(1000004326));
CREATE COLUMN TABLE MYSCHEMA.SpatialShapes_GEOMETRIES
(
ShapeID integer,
SHAPE1 ST_Point,
SHAPE2 ST_GEOMETRY
);

SELECT NEW ST_Point( 1.0, 2.0 ).ST_AsGeoJSON() FROM dummy;
```

具体数据类型使用方法、表的空间类型的列如何创建和插入。

### Methods
HANA Spatial数据拥有面向对象的属性方法，多种构造方法，属性方法如ST_Transform，操作方法如ST_Intersection。

```sql
SELECT NEW ST_Polygon( 'Polygon(( 0 0, 2 0, 1 2, 0 0 ))' ).ST_Contains( NEW ST_Point( 1, 1 ) ) FROM dummy;
SELECT new ST_Point('POINT(-86 36)',4326).ST_Transform(1000004326) from dummy;
```

### Clustering
HANA Spatial还支持聚合方法，并支持多种算法如K-Means。 使用语法：

```sql
SELECT
	 ST_AsSVGAggr(centroid)
from (SELECT
	 ST_ClusterId() AS cluster_id,
	 ST_ClusterCentroid() AS centroid,
	 COUNT(*) AS number_of_households,
	 AVG(INCOME) AS average_cluster_income
	FROM HOUSEHOLDS
	WHERE INCOME > 120000
	GROUP CLUSTER BY LOCATION USING KMEANS CLUSTERS 100 HAVING COUNT(*) >= 300)
;

SELECT
	 cluster_id,
	 REVENUE,
	 VM_ID,
	 RANK() OVER (PARTITION BY cluster_id
	order by REVENUE ASC) AS rank,
	 LOCATION
FROM (SELECT
	 ST_ClusterID() OVER (CLUSTER BY LOCATION USING DBSCAN EPS 100 MINPTS 5) AS cluster_id,
	 REVENUE,
	 VM_ID,
	 LOCATION
	FROM VENDING_MACHINES
	WHERE REVENUE < 60000)
ORDER BY cluster_id
;
```

### Create SRS
HANA Spatial如何创建新的SRS，语法样例：

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

## 总结
SAP HANA内存数据库提供Spatial库原生支持空间参考功能，对需要使用地理空间系统的产品来说至关重要。依托HANA内存数据库强大高效的计算能力，HANA Spatial功能可以为基于地理空间信息的大数据分析提供有力的支持。
