---
layout: post
theme: XiuKai
star: true
title: 数据可视化大屏设计
excerpt: "How to design big screen for data visualization?"
modified: 2019-07-06T18:00:00-00:00
categories: articles
tags: [CSS, Angular]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1190.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/al-kufrah-libya-1190
comments: true
share: true
references:
  - id: 1
    title: "可能是最详细的大屏数据可视化设计指南"
    url: "https://www.uisdc.com/large-screen-data-visualization-design"
  - id: 2
    title: "《大屏可视化数据》该怎么设计？"
    url: "https://www.25xt.com/appdesign/37310.html"
    
---

* TOC
{:toc}

## 什么是大屏数据可视化

大屏数据可视化是以大屏为主要展示载体的数据可视化设计。

「大面积、炫酷动效、丰富色彩」，大屏易在观感上给人留下震撼印象，便于营造某些独特氛围、打造仪式感。电商双 11 时大屏利用此特点打造了热烈、狂欢的节日氛围，原本看不见的数据可视化后，便能调动人的情绪、引发人的共鸣，传递企业文化和价值。

俗话就是说老板们喜欢我们就得上, 把公司的成绩暴露出来.

## 大屏可视化设计流程

大屏可视化设计开发流程一般为

* 数据分析, 确定维度和指标
* 选择可视化图形
* 确定显示屏幕尺寸
* 页面布局
* 设计页面风格
* 页面设计
* 样图确认
* 定稿开发

不过实际开发中会有不断迭代的过程, 会重复上面流程中的一些步骤.

### Step 1. 数据分析

依据数据的重要程度分为, 这也是决定页面布局的重要维度

* 主: Total KPIs
* 次: with Dimensions
* 辅: Details

需要考虑的数据具体表现形式, 这也决定了选择什么样的图形

* 联系：数据之间的相关性
* 分布：指标里的数据主要集中在什么范围、表现出怎样的规律
* 比较：数据之间存在何种差异、差异主要体现在哪些方面
* 构成：指标里的数据都由哪几部分组成、每部分占比如何

### Step 2. 可视化图形

常用图形及其各种变形

* 柱状图
* 线性图
* 饼图
* 散点图
* 雷达图

选定图表原则是: 易理解、可实现。

#### Charts 库

* [ECharts](https://echarts.apache.org)
* [Highcharts](https://www.highcharts.com/)

### Step . 设计风格

https://s.ui.cn/index.html?keywords=%E5%A4%A7%E5%B1%8F&type=project

https://www.ui.cn/detail/431954.html

#### 配色

https://blog.graphiq.com/finding-the-right-color-palettes-for-data-visualizations-fcd4e707a283
