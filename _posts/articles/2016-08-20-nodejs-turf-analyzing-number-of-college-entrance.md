---
layout: post
title: 用Turf分析各省高考生密度
excerpt: "用Turf和Nodejs并使用GeoJSON标准文件做全国各省高考报考人数的密度分析，并在地图上进行展示。"
modified: 2016-08-20T23:51:25-04:00
categories: articles
tags: [Node.js, Turf, GeoJSON, Map]
image:
  feature: nodejs/mashheader-turf.png
comments: true
share: true
references:
  - title: "CARTO — Predict through location"
    url: "https://carto.com/"
---

据教育部网站消息，2015年全国统一高考于6月7日至8日举行。2015年全国高考报名考生共942万人。回忆我们当年的高考，糊里糊涂的就报了志愿，为了让学弟学妹们能够尽量选择自己喜欢的学校和专业，我们有必要为他们做一些数据上的分析。接下来将要展示如何用Turf和Nodejs做地理信息方面的数据分析，和用GeoJSON技术标准的文件在地图上展示区域图。

进行分析之前我们可以先了解一下两个工具，[Turf](http://turfjs.org/)
是一个能用在浏览器或者Node.js环境中做地理信息数据分析的javascript插件。[Node
.js](https://nodejs.org/)是一个建立在[Chrome's JavaScript 
runtime](http://code.google.com/p/v8/)上为方便建立快速、可扩展的网络应用而产生的平台。[GeoJSON](www.geojson.org/)是一种对各种地理数据结构进行编码的格式。GeoJSON对象可以表示几何、特征或者特征集合。GeoJSON支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON里的特征包含一个几何对象和其他属性，特征集合表示一系列特征。如何搭建Node和npm运行环境可以自行查阅相关教程。

## 分析计算

可以clone一个repository

```shell
git clone https://github.com/anypossiblew/analyzing-number-of-entrance
.git
cd analyzing-number-of-entrance
```

使用Node的包管理工具npm安装Turf

```shell
npm install turf
```

新建一个js文件index.js，加载turf和filesystem、csv模块

```javascript
var fs = require('fs');
var csv = require('csv');
var turf = require('turf');
```

加载全国各省区域分布GeoJSON文件

```javascript
fs.readFile('china.geojson', 'utf8', function (err, data) {
 if (err) {
  throw err;
 }
 var china = JSON.parse(data);
});
```

计算每个省的面积，这里使用到了turf.area函数

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

循环各省的item进行计算

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

数据计算过之后，我们要进行计算样式

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

对json进行转化并写入结果文件

```javascript
fs.writeFileSync('number-of-china-entrance.geojson', JSON.stringify(china));
```

## 上传图形化

计算得到geojson文件后，上传到网站[https://carto.com/](https://carto.com/)可以看到实际的效果图。还可以对详细的style进行自定义。
![Image: Carto Number of china entrance](/images/nodejs/carto-number-of-china-entrance.png)
