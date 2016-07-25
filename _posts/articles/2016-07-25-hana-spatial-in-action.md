---
layout: post
title: HANA Spatial in Action
excerpt: "在这些技术各自的领域有着大大小小的企业和数据平台， SAP HANA 内存数据库做为大数据分析重要的平台同样也提供对地理信息（Geospatial infomation）的支持。"
modified: 2016-07-25T13:55:25-04:00
categories: articles
tags: [HANA, geospatial, Big data, Map]
image:
  feature: masthead-geospatial.jpg
comments: true
share: true
---

世界正变得越来越数字化，大数据正在以这种或那种方式影响着每个人的生活。 我们在日常生活中所做的一切都会留下数字痕迹(或者数据)，也就是大数据，我们可以利用和分析这些数据来让我们的生活更加美好。 其中一项是大数据分析在地理信息上的应用，两者相结合可以为人们的生活提供方便，为企业创造价值。 在这些技术各自的领域有着大大小小的企业和数据平台， SAP HANA 内存数据库做为大数据分析重要的平台同样也提供对地理信息（Geospatial infomation）的支持。在这篇文章中我们来介绍一下如何在SAP HANA中存储分析地理信息数据。

# GeoSpatial介绍

![Spatial2 Image]({{ site.url }}/images/hana-spatial/spatial2.png)

# 在Hybris Marketing中的应用

### Body text

SAP 推出了全面的物联网 (IoT) 解决方案组合。借助 SAP 的内存计算 IoT 平台，你能够快速开发、部署和管理自己的实时 IoT 应用和机器对机器 (M2M) 应用。该平台支持你自动化核心流程，并与网络边缘的几乎一切事物相连。

* 充分利用 SAP HANA 的核心功能，例如地理空间数据处理功能、序列数据以及定位服务等
* 在获取实时洞察的同时，管理和监控远程设备
* 创建下一代实时 IoT 应用和 M2M 应用
* 开发不同的 IoT 解决方案，面向各种业务线用例和行业用例

![Smithsonian Image]({{ site.url }}/images/3953273590_704e3899d5_m.jpg)
{: .pull-right}

*This is emphasized*. Donec faucibus. Nunc iaculis suscipit dui. 53 = 125. Water is H<sub>2</sub>O. Nam sit amet sem. Aliquam libero nisi, imperdiet at, tincidunt nec, gravida vehicula, nisl. The New York Times <cite>(That’s a citation)</cite>. <u>Underline</u>. Maecenas ornare tortor. Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus.

HTML and <abbr title="cascading stylesheets">CSS<abbr> are our tools. Mauris a ante. Suspendisse quam sem, consequat at, commodo vitae, feugiat in, nunc. Morbi imperdiet augue quis tellus. Praesent mattis, massa quis luctus fermentum, turpis mi volutpat justo, eu volutpat enim diam eget metus.

### Blockquotes

> Lorem ipsum dolor sit amet, test link adipiscing elit. Nullam dignissim convallis est. Quisque aliquam.

## List Types

### Ordered Lists

1. Item one
   1. sub item one
   2. sub item two
   3. sub item three
2. Item two

### Unordered Lists

* Item one
* Item two
* Item three

## Tables

| Header1 | Header2 | Header3 |
|:--------|:-------:|--------:|
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|----
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|=====
| Foot1   | Foot2   | Foot3   |
{: .table}

## Code Snippets

Syntax highlighting via Rouge

```css
#container {
  float: left;
  margin: 0 -240px 0 0;
  width: 100%;
}
```

Non Rouge code example

    <div id="awesome">
        <p>This is great isn't it?</p>
    </div>

## Buttons

Make any link standout more when applying the `.btn` class.

<div markdown="0"><a href="#" class="btn">This is a button</a></div>
