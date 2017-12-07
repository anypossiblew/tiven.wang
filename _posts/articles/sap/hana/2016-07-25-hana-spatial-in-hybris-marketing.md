---
layout: post
title: HANA Spatial in Hybris Marketing
excerpt: "SAP HANA内存数据库提供Spatial库并PAL库对基于地理空间信息（Geospatial）的大数据分析的原生支持。基于地理空间信息的大数据分析（Big Data Analytic）在例如精准营销（CEI）、智慧城市、定位应急响应、无人机应用、优化农业生产等很多场景中得到广泛应用。"
modified: 2016-07-26T15:49:25-04:00
categories: articles
tags: [HANA, 内存数据库, geospatial, 地理空间, Big data, 大数据, Hybris Marketing]
image:
  feature: /images/masthead-geospatial.jpg
comments: true
share: true
references:
  - title: "Predictive Analysis Library (PAL)"
    url: "http://help.sap.com/saphelp_hanaplatform/helpdata/en/32/731a7719f14e488b1f4ab0afae995b/frameset.htm"
---

* TOC
{:toc}

世界正变得越来越数字化，大数据正在以这种或那种方式影响着每个人的生活。 我们在日常生活中所做的一切都会留下数字痕迹(或者数据)，也就是大数据，我们可以利用和分析这些数据来让我们的生活更加美好。 其中一项是大数据分析在地理信息上的应用，两者相结合可以为人们的生活提供方便，为企业创造价值。 在这些技术各自的领域有着大大小小的企业和数据平台， SAP [HANA](/tags#HANA) 内存数据库作为大数据分析重要的平台同样也提供对地理空间信息（Geospatial infomation）的支持。在这篇文章中我们来介绍一下SAP HANA Spatial基础和在Hybris Marketing营销产品中的应用。

## 基于地理空间的大数据分析

![Esri HANA Image](/images/hana-spatial/esri-hana.jpg)
{: .pull-right}

得益于GPS卫星、手机信号塔和物联网的发展，我们很容易能够精确跟踪到人或物体的位置信息，在日常生活中我们每天都会产生和收集大量这样的地理位置数据。但这些地理空间数据是非常庞大的，要分析起来谈何容易。<br>地理空间信息的大数据分析分为三个过程：存储、分析和展示。

* 对于“存储”SAP HANA提供原生功能[Spatial](http://help.sap.com/hana_options_spatial)对地理空间数据进行存储和计算。

* 对于分析不仅有HANA Spatial拥有丰富的function可以对地理空间数据进行计算，同时HANA还有[Predictive Analysis Library (PAL)](http://help.sap.com/saphelp_hanaplatform/helpdata/en/32/731a7719f14e488b1f4ab0afae995b/frameset.htm)预测分析库进行分析预测以及PAL还可以支持使用R语言进行预测分析计算。

* 对于数据可视化展示SAP HANA就没有那么强大了，但HANA是一个开放的开发平台，支持大部分web页面展示技术，所以你可以使用第三方强大的数据可视化技术或地图可视化技术，与此同时SAP HANA已经寻求与著名的地理信息供应商[Esri](http://www.esri.com/landing-pages/sap-hana)的合作，通过双方的强大技术为客户提供地理空间数据的分析及可视化。

## HANA Spatial介绍
空间数据（Spatial Data）是描述在一定的空间内物体的位置，形状和方向的数据。空间数据（Spatial Data）以点，线串和多边形的形式表示为二位几何。

* 对于表示物体的点，线串和多边形SAP HANA提供了不同于一般数据库字段类型的spatial data type如ST_Point和ST_Polygon

![Spatial Data Type Image](/images/hana-spatial/spatial-data-type.jpg)
{: .pull-right}
<br>如图所示，HANA Spatial Data Types
<br>Spatial Data Type Syntax:

```sql
SELECT NEW ST_Point(), NEW ST_Point(3,4) FROM dummy;
```

* 对于一定的空间

SAP HANA Spatial支持开放标准的[Spatial Reference Systems](http://spatialreference.org/)。SAP HANA中默认的SRID(Spatial Reference Identifier)为0，另外还有WGS84对应的SRID 4326和WGS 84 (planar)对应的SRID 1000004326。
<br>Spatial Reference Identifier Syntax:

```sql
SELECT NEW ST_Point('POINT (0 0)', 4326).ST_Distance( NEW ST_Point('POINT (45 45)', 4326), 'meter') FROM dummy;
SELECT NEW ST_Point('POINT (0 0)', 1000004326).ST_Distance( NEW ST_Point('POINT (45 45)', 1000004326), 'meter') FROM dummy;
```

如果想要学习HANA Spatial的基本知识可以参考HANA官方demo [SAP HANA INteractive Education (SHINE)](https://github.com/SAP/hana-shine/tree/master/Tutorials/SHINE-SpatialScenario)。
<figure>
	<img src="/images/hana-spatial/spatial2.png" alt="SHINE-SpatialScenario Business Partners">
	<figcaption>HANA Spatial应用-SAP HANA SHINE-SpatialScenario的Business Partners界面</figcaption>
</figure>

## 在精准营销中的应用
基于地理空间的大数据分析在现实世界中有很多应用场景，例如智慧城市、定位应急响应、无人机应用、优化农业生产以及零售精准营销。

其中零售行业的客户精准营销，是通过利用

* “冷数据”进行用户属性分析和智能标签分类。通过性别、年龄职业、收入等维度，知道“用户是什么样的人”。
* “热数据”通过地理围栏实时捕获用户场景，抓住营销机会，实时触达目标用户，知道“用户在哪里干什么”。
* “温数据”通过近期活跃应用、去过的地方等具有一定时效性的行为数据，知道“用户最近对什么感兴趣”。

进行准确地分析和勾画用户,了解用户此时此地所需所想，帮助广告主找到最精准的受众。

## SAP Hybris Marketing
作为精准营销重要的产品，SAP [Hybris Marketing](https://www.hybris.com/zh/marketing)支持用户开展基于情境的实时营销。通过开展个性化的营销活动，使你可以吸引客户，让客户满意，并培养品牌关系。
![Hybris Marketing](/images/hybris-marketing/resource-management-solutions.svg)

### 细分人群
hybris 细分营销 通过利用HANA内存数据库的能力能够实时高效地细分任意数据源中的目标受众。这样，你就可以针对营销计划确定合适的目标受众，在多个渠道提供个性化的营销信息。

而目标受众的地理位置是其细分的一项重要的数据。Hybris Marketing的细分可以通过地理空间元素如圆和多边形快速建立细分模型，并进一步创建目标人群进行精准营销。
<figure>
	<img src="/images/hybris-marketing/segmentation-geolocation.png" alt="Hybris Marketing Segmentation">
	<figcaption>Hybris Marketing通过地理空间进行细分人群</figcaption>
</figure>

### 人群的地理空间属性
目标受众的地理空间属性不仅仅是提供其所在的位置信息，真正的大数据挖据可以根据目标受众位置信息关联延伸出很多属性。例如通过某人的收货地址或经常所在的位置得到其所居住的小区信息，然后再关联小区的房价得到其大致的消费水平和消费倾向，接下来就可以对其进行精准营销了。再比如通过某人去过的地点和时间可以分析出其消费水平和生活习惯，进一步对其进行营销活动。

如此复杂的计算，Hybris Marketing可以利用HANA的扩展库PAL(Predictive Analysis Library)定制开发相应的预测模型进行计算人群的购买倾向等一系列关键指标。

<figure>
	<img src="/images/hybris-marketing/predictive-model.png" alt="Hybris Marketing Predictive Model">
	<figcaption>Hybris Marketing建立预测模型进行计算人群关键指标</figcaption>
</figure>

## 总结

基于地理空间信息的大数据分析在现实世界中的应用越来越广泛，我们有理由相信地理空间信息化的大数据分析还在起步阶段，将来在人类的生产生活中将会发挥更重要的作用。而SAP HANA内存数据库提供对地理空间数据的优秀支持，并结合其强大的预测库PAL成为地理空间信息大数据分析重要的平台和工具。SAP HANA Spatial在SAP的产品中已经广泛应用，也将会更深入的应用在各个行业产品中。
