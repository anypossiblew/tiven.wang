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
external_links:
  - title: "Mapping the world grid"
    url: "http://www.bibliotecapleyades.net/ciencia/antigravityworldgrid/ciencia_antigravityworldgrid01.htm"
  - title: "Map in wikipedia"
    url: "https://en.wikipedia.org/wiki/Map"
---

SAP HANA Spatial在SAP各产品中的应用越来越广泛，同时以SAP HANA为基础的产品在中国市场得到快速成长，SAP产品中的地图在进入中国市场时经常会遇到本土化的问题。作为国内知名的地图供应商百度地图经常被用来作为地图可视化的工具。但国外的产品在本地化的过程中总是会遇到水土不服的问题，本篇文章就来探讨一下如何在HANA Spatial中进行地理空间信息的本土化。

# 背景

## HANA Spatial

## Baidu Map

通过阅读[百度地图使用者须知](http://lbsyun.baidu.com/index.php?title=open/question)我们知道百度地图使用的坐标体系是经纬度坐标系和墨卡托投影坐标系。这两种坐标体系是国际上常见地图使用的坐标体系，是国际通用的地理空间坐标体系。但是在坐标体系之上还有个坐标标准即[Spatial Reference System(SRS)](https://en.wikipedia.org/wiki/Spatial_reference_system)，有开放标准组织对其进行标准化[http://spatialreference.org/](http://spatialreference.org/)，企业通常会使用此标准。通常经纬度坐标系一般对应的空间参考系统是WGS-84，全球定位系统GPS使用的即是此参考系统。但国内鉴于法律原因必须至少使用国测局制定的GCJ-02空间参考系统。GCJ-02是在WGS-84的基础上进行了伪随机地偏移，此偏移是连续非线性的（连续：无限接近的两点的偏移的差值无限接近于0；非线性：任意相互接近两点的偏移方向不同）。每个点的偏移距离大概是1公里左右。

百度地图使用的BD-09参考系统是在GCJ-02基础上进行二次加密（伪随机偏移），更加保护了个人隐私。所以在使用百度地图时我们不能直接把各种途径采集来的WGS-84标准的经纬度坐标放在百度地图里使用。百度地图提供了WGS-84转成BD-09的API，但其不会提供反向的转换。

# Switch Map Provider
如何使用不同供应商的地图，基本上每个地图供应商都会提供自己地图的JavaScript的library，并且每个供应商的library使用都比较类似。所以你只需要按照其相应的API使用规范就可以创建地图。

还有一种方式，此类JavaScript library只提供地图的通用逻辑但不提供地图的数据，如leafletjs。目前流行的地图展现方式是通过将地图图片以碎片形式拼接展现的。

为什么Baidu Map不能使用这种方式，以为Baidu地图的图片碎片