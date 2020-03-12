---
layout: post
theme: UbuntuMono
star: true
series:
  url: abap-cds
  title: ABAP CDS
title: UI Annotations
excerpt: "UI CDS Annotations 注解的作用详解"
modified: 2019-12-27T12:00:00-00:00
categories: articles
tags: [CDS, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5981.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/shardara-kazakhstan-5981
comments: true
share: true
---

* TOC
{:toc}

## @UI.dataPoint

### KPI Trend

#### KPI value arrow direction

The direction of the arrow pointing up or down depends on the property values (`ReferenceValue`, `UpDifference`, `DownDifference`) mentioned under `TrendCalculation` in the annotations and KPI value.

The sequence of conditions to compute arrow direction are as follows:

* if `(upDifference and strongUpDifference is not defined or 0 ) and (KPI value – referance value >= 0)` then **trend-up**
* if `(downDifference and strongDownDifference is not defined or 0) and (KPI value – referance value <= 0)` then **trend-down**
* if `(if strongUpDifference is defined) and (KPI value – referance value >= strongUpDifference )` then **strong-up**
* if `(if upDifference is defined) and (KPI value – referance value >= upDifference )` then **trend-up**
* if `(if strongDownDifference is defined) and (KPI value – referance value <= strongDownDifference )` then **strong-down**
* if `(if downDifference is defined) and (KPI value – referance value <= downDifference )` then **trend-down**

### KPI Value Color

It depends on `Criticality` or `CriticalityCalculation` from data point annotation. If you are using `Criticality`, it will take the color based on what is provided, `Negative/Critical/Positive`.

If you are using `CriticalityCalculation`, following are the cases depending on the `ImprovementDirection` –

* `Minimize/Minimizing`
    * `Positive` if `Value <= ToleranceHigh` (takes priority)
    * `Negative` if `Value > DeviationHigh`
* `Maximize/Maximizing`
    * `Positive` if `Value >= ToleranceLow` (takes priority)
    * `Negative` if `Value < DeviationLow`
* `Target`
    * `Positive` if `ToleranceLow <= Value <= ToleranceHigh` (takes priority)
    * `Negative` if `DeviationHigh < Value < DeviationLow`

实例，以最大化为优的情况配置如下

```typescript
{
    @UI.dataPoint: {
        criticalityCalculation: {
            improvementDirection:           #MAXIMIZE,
            toleranceRangeLowValueElement: 'KPIToleranceRangeLowValue',
            deviationRangeLowValueElement: 'KPIDeviationRangeLowValue'
        }
    }
    @DefaultAggregation: #SUM
    KPIRevenue;

    @DefaultAggregation: #SUM
    KPIToleranceRangeLowValue,

    @DefaultAggregation: #SUM
    KPIDeviationRangeLowValue
}
```

以目标值为优的情况配置如下

```typescript
{
    @UI.dataPoint: {
        criticalityCalculation: {
            improvementDirection:           #TARGET,
            toleranceRangeLowValueElement: 'KPIToleranceRangeLowValue',
            toleranceRangeHighValueElement: 'KPIToleranceRangeHighValue',
            deviationRangeLowValueElement: 'KPIDeviationRangeLowValue',
            deviationRangeHighValueElement: 'KPIDeviationRangeHighValue'
        }
    }
    @DefaultAggregation: #SUM
    KPIRevenue;

    @DefaultAggregation: #SUM
    KPIToleranceRangeLowValue,

    @DefaultAggregation: #SUM
    KPIToleranceRangeHighValue,

    @DefaultAggregation: #SUM
    KPIDeviationRangeLowValue,

    @DefaultAggregation: #SUM
    KPIDeviationRangeHighValue
}
```

### KPI Value Unit

### Visualization Type

对于一个表示 KPI 的 data point 数据来说可以有很多种可视化的表现形式，例如 SAP vocabularies UI 有以下几种：

* **Number**	        0	Visualize as a number
* **BulletChart**	    1	Visualize as bullet chart - requires TargetValue
* **Progress**	        2	Visualize as progress indicator - requires TargetValue
* **Rating**	        3	Visualize as partially or completely filled stars/hearts/... - requires TargetValue
* **Donut**	            4	Visualize as donut, optionally with missing segment - requires TargetValue
* **DeltaBulletChart**	5	Visualize as delta bullet chart - requires TargetValue

如果前端框架是我们自己开发的，那么我们也可以增加一些表现形式如 仪表盘 Guages 等。

## @UI.selectionField

Annotations belonging to `UI.selectionField` allow filtering a list of data. `UI.selectionField` annotations are usually used in an initial page floorplan as **filter bar**.

```typescript
@UI.selectionField.position: 30

```
