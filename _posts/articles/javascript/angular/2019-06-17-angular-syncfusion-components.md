---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Syncfusion Components
excerpt: "How to use Syncfusion Components to create dashboard page in Angular Application?"
modified: 2019-06-17T18:00:00-00:00
categories: articles
tags: [Dashboard, Angular, UI5]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1771.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/webster-county-united-states-1771
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - HttpClient"
    url: "https://angular.io/guide/http"
---

* TOC
{:toc}

本篇代码 [Github](https://github.com/tiven-wang/angular-tutorial/tree/syncfusion).

## Step 1. Install

首先安装 [Essential JS 2 for Angular](https://ej2.syncfusion.com/home/angular.html) 的依赖包

```sh
npm i @syncfusion/ej2-angular-base
npm i @syncfusion/ej2-angular-charts
```

## Step 2. Product Chart

为 Product Chart 新建一个 Component

`ng g component product-chart`

在 *product-chart/product-chart.component.html* 里填入如下内容

```html
<div align='center'>
  <ejs-chart style='display:block;' [chartArea]='chartArea' [width]='width' align='center' id='chartcontainer' 
      [primaryXAxis]='primaryXAxis' [primaryYAxis]='primaryYAxis' [title]='title' [tooltip]='tooltip' (load)='load($event)'>
      <e-series-collection>
          <e-series [dataSource]='data' type='Column' xName='x' yName='y' name='Imports' [marker]='marker'> </e-series>
          <e-series [dataSource]='data1' type='Column' xName='x' yName='y' name='Exports' [marker]='marker'> </e-series>
      </e-series-collection>
  </ejs-chart>
</div>
```

*product-chart/product-chart.component.ts* 内容如下

```typescript
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-product-chart',
  templateUrl: './product-chart.component.html',
  styleUrls: ['./product-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductChartComponent implements OnInit {

  public chartArea: Object = {
    border: {
        width: 0
    }
  };
  //Initializing Chart Width
  public width: string = Browser.isDevice ? '100%' : '60%';
  public data: Object[] = [
      { x: 'Egg', y: 2.2 }, { x: 'Fish', y: 2.4 },
      { x: 'Misc', y: 3 }, { x: 'Tea', y: 3.1 }
  ];
  public data1: Object[] = [
      { x: 'Egg', y: 1.2 }, { x: 'Fish', y: 1.3 },
      { x: 'Misc', y: 1.5 }, { x: 'Tea', y: 2.2 }
  ];
  //Initializing Marker
  public marker: Object = {
      dataLabel: {
          visible: true,
          position: 'Top',
          font: {
              fontWeight: '600', color: '#ffffff'
          }
      }
  }
  //Initializing Primary X Axis
  public primaryXAxis: Object = {
      valueType: 'Category',
      title: 'Food',
      interval: 1,
      majorGridLines: { width: 0 }
  };
  //Initializing Primary Y Axis
  public primaryYAxis: Object = {
      labelFormat: '{value}B',
      edgeLabelPlacement: 'Shift',
      majorGridLines: { width: 0 },
      majorTickLines: { width: 0 },
      lineStyle: { width: 0 },
      labelStyle: {
          color: 'transparent'
      }
  };
  public tooltip: Object = {
      enable: true
  };
    // custom code start
  public load(args: ILoadedEventArgs): void {
      let selectedTheme: string = location.hash.split('/')[1];
      selectedTheme = selectedTheme ? selectedTheme : 'Material';
      args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };
    // custom code end
  public title: string = 'UK Trade in Food Groups - 2015';

  constructor() { }

  ngOnInit() {
  }

}
```

在 *app.component.html* 中加入, 便可以出来 Product Chart 了

```html
<app-product-chart></app-product-chart>
```

## Step 3. Real Data from OData Service

接下来我们把 Chart 的数据改成从真实的 OData Service 取来. 将 `ProductService` 加到 *product-chart.component.ts* 里, 然后在 `ngOnInit` 里调用获取 OData 数据

```typescript
constructor(private productService: ProductService) { }

ngOnInit() {
    this.productService.getProducts().subscribe(products => {
        this.data = products;
    });
}
```

将 OData 取到的 Products 赋值给属性, 然后把 html 中的属性改变一下, 设置成要显示的 Product 的属性 Width 和 Height

```html
<e-series-collection>
  <e-series [dataSource]='data' type='Column' xName='ProductName' yName='Width' name='Product' [marker]='marker'> </e-series>
  <e-series [dataSource]='data' type='Column' xName='ProductName' yName='Height' name='Exports' [marker]='marker'> </e-series>
</e-series-collection>
```

## Step 4. Point Style

下面进行些样式上的设置, 

https://www.syncfusion.com/forums/136792/is-essential-js-2-for-angular-is-open-source-or-it-is-paid

Please Note: Its source code is open and it is not free software.

Essential JS 2 for Angular is a proprietary library of Syncfusion Inc. License is offered in two models that is Community and Paid. Detailed explanation is available in the following link https://github.com/syncfusion/ej2/blob/master/license