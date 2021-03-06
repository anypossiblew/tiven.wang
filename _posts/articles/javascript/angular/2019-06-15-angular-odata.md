---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Consume OData Services
excerpt: "How to consume odata service in Angular Application?"
modified: 2019-06-14T18:00:00-00:00
categories: articles
tags: [OData, Angular, UI5]
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

上一篇 [Angular - UI5 Web Components](/articles/angular-ui5-web-components/) 我们讲到在 Angular Application 上应用 SAP Web Components 来绘制页面，用到 SAP UI5 做 SAP 产品的应用就不得不面对 OData Service. 本篇介绍如何在 Angular 应用中调用 SAP OData Service. 本篇代码 [Github](https://github.com/tiven-wang/angular-tutorial/tree/odata).

## Step 1. Install

我们选择使用包 `angular-odata-es5` 来做 OData Service 客户端，安装此包

`npm i angular-odata-es5 --save`

## Step 2. Proxy

OData Service 通常有[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)限制，所以我们需要在本地起一个代理服务器。我们选择使用 `http-proxy-middleware` 包来创建本地代理服务，`cors` 可以设置代理服务的 [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) 机制。安装它们

```sh
npm install http-proxy-middleware --save-dev
npm install cors --save-dev
```

然后编写脚本如下，其中 `target` 是你要代理的目标服务地址，`/sap/opu` 表示匹配以此开发的 path ，此地址是 SAP 服务的前缀地址。`auth` 是目标服务的 basic 的授权信息。

*setupProxy.js*
```javascript
const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(proxy('/sap/opu', { target: 'http://<your-server>:<port>/', changeOrigin: true, auth: "<user>:<password>" }));

app.listen(3000, function() {
    console.info("Proxy Server on 3000");
});
```

运行此 Local Proxy Server

```text
$ node setupProxy.js
[HPM] Proxy created: /sap/opu  ->  http://<your-server>:<port>/
Proxy Server on 3000
```

## Step 3. Config OData

接下来首先要在 Angular Application 里配置 OData 的设置, 编辑 *app.module.ts* 引入 `angular-odata-es5` 里的一些类

```typescript
import { ODataConfiguration, ODataServiceFactory, IODataResponseModel } from "angular-odata-es5";
```

编写一些配置类，其中新增的 `myIODataResponseModel` 和 `myIODataResults` 类是因为 SAP OData Service 返回的数据结构和此包默认的结构不同，所以我们重新定义了返回数据结构。配置类 `MyODataConfig` 继承了没人的配置类 `ODataConfiguration` 并设置了 `baseUrl` 地址，重写了方法 `extractQueryResultData` 还是因为 SAP OData 返回结构不同所以解析逻辑不同

```typescript
interface myIODataResponseModel<T> extends IODataResponseModel<T> {
  d: myIODataResults<T>;
}

interface myIODataResults<T> {
  results: T[];
}

@Injectable()
class MyODataConfig extends ODataConfiguration {
  baseUrl=environment.oDataBaseUrl+"/sap/opu/odata/sap/SEPMRA_SO_ANA/"

  extractQueryResultData<T>(res: HttpResponse<myIODataResponseModel<T>>): T[] {
    if (res.status < 200 || res.status >= 300) {
        throw new Error('Bad response status: ' + res.status);
    }
    return (res && res.body && res.body.d.results);
  }
}
```

对于 OData Service 的地址，在 production 环境不需要设置 host 而只要 path 就行了，但本地测试的话要设置为 proxy 的 host 地址，所以我们把此信息写在 environment 里。引入 `environment`

```typescript
import { environment } from '../environments/environment';

// baseUrl=environment.oDataBaseUrl+"/sap/opu/odata/sap/SEPMRA_SO_ANA/"
```

在 *src/environments/environment.ts* 里为 `oDataBaseUrl` 属性填上本地的 proxy 地址

```typescript
export const environment = {
  production: false,
  oDataBaseUrl: "http://localhost:3000"
};
```

在 *src/environments/environment.prod.ts* 里为 `oDataBaseUrl` 属性填上空

```typescript
export const environment = {
  production: true,
  oDataBaseUrl: ""
};
```

最后在 `AppModule` 的 Decorator 里加上配置 `HttpClientModule` 和 `providers`

```typescript
@NgModule({
  declarations: [
    ...
  ],
  ...
  imports: [
    ...
    HttpClientModule
  ],
  providers: [
    { provide: ODataConfiguration, useClass: MyODataConfig },
    ODataServiceFactory
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

创建类 `ODataServiceFactory` 的对象会使用到 `HttpClient` 和 `ODataConfiguration` 对象。

## Step 4. Consume OData Service

接下来就是如何使用此 OData 客户端, 对我们的 product-list 进行改造从 OData Service 获取 Products 信息。首先还是引入要用到的类, 为 `ProductListComponent` 新增属性 `odata` 作为客户端，它需要在构造器里进行创建

```typescript
import { ODataServiceFactory, ODataService } from "angular-odata-es5";

export class ProductListComponent implements OnInit {
  products: Product[]
  private odata: ODataService<Product>;
  constructor(private odataFactory: ODataServiceFactory) {
    this.odata = this.odataFactory.CreateService<Product>("SEPMRA_C_ALP_Product");
  }
  ...
}

export interface Product {
  Product: string,
  ProductName: string,
  ProductDescription?: string,
  Price: number
}
```

构造器的输入参数 `odataFactory` 会在运行时被 Angular 注入 `ODataServiceFactory` 实例, 这是在 `AppModule` 中配置的 Provider。

然后就是用 `odataFactory` 创建 `ODataService` 对象，其中参数值 `"SEPMRA_C_ALP_Product"` 对应的是 EntitySet 的名称，`Product` 是我们定义的类，它会与 OData 返回结构中的 entry 类型（字段对应）相对应。

接下来就是执行调用

```typescript
getProducts(){
  this.odata
    .Query()                    //Creates a query object
    .Top(10)
    .Skip(0)
    .OrderBy('Product desc')
    // .Filter('')
    .Select("Product,ProductName,Price")
    .Exec()                     //Fires the request
    .subscribe(                 //Subscribes to Observable<Array<T>>
      products => {
        this.products = this.products.concat(products);
      },
      error => {
        console.error(error);   //Local error handler
      });
  }
```

## Step 5. Service

本节代码 [Github](https://github.com/tiven-wang/angular-tutorial/tree/odata-service).

上面步骤我们演示了如何在 Component 消费 SAP OData Serrvice, 调用代码都是些在 Component 里的, 这并不符合 Angular 给的原则, 除了 View 相关的其他的功能应该从 Component 里剥离出来, 如做成 Service. 关于 Service 和 Dependency Injection 可以参考另一篇 [Angular - Dependency Injection](/articles/angular-dependency-injection/)

> Angular distinguishes components from services to increase modularity and reusability. By separating a component's view-related functionality from other kinds of processing, you can make your component classes lean and efficient.
-- [https://angular.io/guide/architecture-services](https://angular.io/guide/architecture-services)
{: .Notes}

新建一个负责 Product 的 Service

`ng generate service products/product`

并将读取 OData Service 相关的逻辑迁入到此类里

```typescript
import { Injectable } from '@angular/core';
import { ODataServiceFactory, ODataService } from "angular-odata-es5";

@Injectable()
export class ProductService {

  private odata: ODataService<Product>;
  constructor(private odataFactory: ODataServiceFactory) {
    this.odata = this.odataFactory.CreateService<Product>("SEPMRA_C_ALP_Product");
  }

  getOneProduct(id: string) {
    this.odata.Get(id).Select("Product,ProductName,Price").Exec()
      .subscribe(
          product => {
            console.info(product);
          },
          error => {
            console.error(error);
          }
      );
  }

  getProducts(){
    return this.odata
            .Query()                    //Creates a query object
            .Top(10)
            .Skip(0)
            .OrderBy('Product desc')
            // .Filter('')
            .Select("Product,ProductName,Price")
            .Exec()                     //Fires the request

  }
}

export interface Product {
  Product: string,
  ProductName: string,
  ProductDescription?: string,
  Price: number
}
```

这里我们把 Product 的类型定义放在了此 Service 类里, 其他地方将引用这里的类型. 然后 product-list component 便可以简化为从此 Service 里读取数据

```typescript
// Dependency Injection: ProductService
constructor(private productService: ProductService) {
}

ngOnInit() {
  this.productService.getProducts()
    .subscribe(                 //Subscribes to Observable<Array<T>>
      products => {
        this.products.push(...products);
      },
      error => {
        console.error(error);   //Local error handler
      });
}
```

还需要在 `@NgModule` 的配置 `providers` 添加 `ProductService`

```typescript
providers: [
  { provide: ODataConfiguration, useClass: MyODataConfig },
  ODataServiceFactory,
  ProductService
]
```

到这里就把 Product Service 抽离完成了. 顺便再把 OData Config 也抽出来.

`ng generate service odata/ODataConfig`

*odata/odata-config.service.ts*

```typescript
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ODataConfiguration, ODataServiceFactory, IODataResponseModel } from "angular-odata-es5";
import { environment } from '../../environments/environment';

interface MyIODataResponseModel<T> extends IODataResponseModel<T> {
  d: MyIODataResults<T>;
}

interface MyIODataResults<T> {
  results: T[];
}

@Injectable()
export class MyODataConfig extends ODataConfiguration {
  baseUrl=environment.oDataBaseUrl+"/sap/opu/odata/sap/SEPMRA_SO_ANA/"
  
  extractQueryResultData<T>(res: HttpResponse<MyIODataResponseModel<T>>): T[] {
    if (res.status < 200 || res.status >= 300) {
        throw new Error('Bad response status: ' + res.status);
    }
    return (res && res.body && res.body.d.results);
  }
}
```
