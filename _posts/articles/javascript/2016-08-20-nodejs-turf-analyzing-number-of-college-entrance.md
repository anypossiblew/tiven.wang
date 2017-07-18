---
layout: post
title: 用Turf分析各省高考生密度
excerpt: "用Turf和Nodejs并使用GeoJSON标准文件做全国各省高考报考人数的密度分析，并在Carto地图上进行可视化。"
modified: 2016-08-20T23:51:25-04:00
categories: articles
tags: [Node.js, Turf.js, GeoJSON, Map, 大数据]
image:
  feature: /images/nodejs/mashheader-turf.png
comments: true
share: true
references:
  - title: "CARTO - Predict through location"
    url: "https://carto.com/"
  - title: "Mapbox - Maps for Mobile & Web"
    url: "https://www.mapbox.com/"
  - title: "Turf.js"
    url: "http://turfjs.org/"
  - title: "Node.js"
    url: "https://nodejs.org/"
  - title: "Choropleth map"
    url: "https://en.wikipedia.org/wiki/Choropleth_map"
---

* TOC
{:toc}

据教育部网站消息，2015年全国统一高考于6月7日至8日举行。2015年全国高考报名考生共942万人。回忆我们当年的高考，糊里糊涂的就报了志愿，为了让学弟学妹们能够尽量选择自己喜欢的学校和专业，我们有必要为他们做一些大数据的分析。接下来将要展示如何用Turf和Nodejs做地理信息方面的数据分析，继而用GeoJSON技术标准的文件在地图上展示区域分级统计图([{{page.references[4].title}}]({{page.references[4].url}}))。

## Prerequisites
进行分析之前我们可以先了解一下几个工具

* [Turf.js]({{page.references[2].url}})是一个能用在浏览器或者Node.js环境中做地理信息数据分析的javascript插件。

* [Node.js]({{page.references[3].url}})是一个建立在[Chrome's JavaScript runtime](http://code.google.com/p/v8/)上为方便建立快速、可扩展的网络应用而产生的平台。

* [GeoJSON](www.geojson.org/)是一种对各种地理数据结构进行编码的格式。GeoJSON对象可以表示几何、特征或者特征集合。GeoJSON支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON里的特征包含一个几何对象和其他属性，特征集合表示一系列特征。如何搭建Node和npm运行环境可以自行查阅相关教程。

* 对于地理信息数据的图形化有很多种工具或途径，本文使用的是[Carto]({{page.references[0].url}})。Carto侧重于对地理空间大数据的分析预测及可视化，它通过创建数据集然后展示在地图上的简单两步过程，上手非常容易。

* 而[Mapbox]({{page.references[1].url}})则是对地图底图多样化编辑的支持非常强大，可以让你设计出属于自己样式的地图，但过程比较复杂，需要一定的css及编程知识。

## 分析计算
关于本文的代码可以clone下面的repository

```shell
git clone https://github.com/anypossiblew/analyzing-number-of-entrance
.git
cd analyzing-number-of-entrance
```

使用Node的包管理工具npm安装依赖`Turf.js`

```shell
npm install turf
```

然后运行javascript文件，即可得到计算结果

```javascript
node index.js
```

### Turf逻辑介绍
新建一个javascript文件index.js，加载`turf`和`filesystem`、`csv`模块

```javascript
var fs = require('fs');
var csv = require('csv');
var turf = require('turf');
```

全国各省的区域范围我们使用现成的GeoJSON文件，加载全国各省区域范围GeoJSON数据文件

```javascript
fs.readFile('china.geojson', 'utf8', function (err, data) {
 if (err) {
  throw err;
 }
 var china = JSON.parse(data);
});
```

全国各省区域显示如下
![Image: China provinces area](/images/nodejs/china-provinces-area.png)

下面要计算每个省的面积，这里使用到了`turf.area`函数。Turf支持很多Geo操作计算的functions可供选择使用，详情可以参见[Turf API docs](http://turfjs.org/docs/)。

```javascript
for(var i = 0; i < china.features.length; i++) {
  china.features[i].properties.area = (Math.round(turf.area(china.features[i].geometry) * 0.000621371))/100000;
}
```

加载各省高考报考人数csv文件，并用csv模块的parse功能转换成Object数组

```javascript
fs.readFile('number-of-entrance.csv', 'utf8', function (err, data) {
 if (err) {
  throw err;
 }
 csv.parse(data, {columns: true}, function(err, items){
  if (err) {
   throw err;
  }
 });
});
```

循环各省进行计算`人数/面积`的密度

```javascript
items.map(function(item) {
 for(var i = 0; i < china.features.length; i++) {
  if(china.features[i].properties.name == item['省'] ) {
   china.features[i].properties.register_number = item['人数']*10000;
    china.features[i].properties.register_density =  
     (china.features[i].properties.register_number) / china.features[i].properties.area;  
   }
  }
 });
```

数据计算过之后，我们也可以计算style样式（虽然这里可能使用不到，但像这样可以往properties里添加自定义的属性）

```javascript
var min = 0, max = 0;
for(var i = 0; i < china.features.length; i++) {
 var registerDensity = china.features[i].properties.register_density;
 if(registerDensity > max) {
  max = registerDensity;
 }
 if(min == 0 || min > registerDensity) {
  min = registerDensity;
 }
}
for(var i = 0; i < china.features.length; i++) {
 var opacity = Math.floor((china.features[i].properties.register_density-min)/(max-min)*10+1)/10;
 china.features[i].properties.style = {
  fillOpacity: opacity
 };
}
```

把Json格式的结果转换未string类型的变量，然后写入指定文件

```javascript
fs.writeFileSync('number-of-china-entrance.geojson', JSON.stringify(china));
```

## 可视化
通过[https://carto.com/](https://carto.com/)网站进行数据的可视化。

### Data View
创建Map并上传文件`number-of-china-entrance.geojson`到Data view。

![Image: Carto - Number of entrance table](/images/nodejs/carto-number-of-entrance-table.png)

### Map View
在Map View右边栏我们可以在**SQL** tab里编写SQL以获取不同条件的数据进行展示。在**Map layer wizard** tab里可以选择数据展示样式，我们这里选择使用[Choropleth]({{page.references[4].url}})，并为Column使用`register_density`。

![Image: Carto Number of china entrance map](/images/nodejs/carto-number-of-entrance-map.png)

实际的效果图
![Image: Carto Number of china entrance](/images/nodejs/carto-number-of-china-entrance.png)

## 总结
本文通过Node.js强大的javascript运行容器，运行Turf
.js丰富的运算函数，及Carto网站便利的可视化功能，为考生对全国各省高考密度进行了大数据分析，以希望能有所帮助。本文旨在抛砖引玉，通过介绍相关的工具，希望能在地理信息大数据分析上有所启发。
