---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Router and Navigation
excerpt: "How to add Routers and use Navigation in your Angular Application?"
modified: 2019-06-22T18:00:00-00:00
categories: articles
tags: [Angular]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1808.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/maricopa-united-states-1808
comments: true
share: true
---

* TOC
{:toc}

接上一篇 [Angular - UI5 Web Components](/articles/angular-ui5-web-components/) 我们讲到为 Angular 应用添加了 SAP UI5 Web Components 组件, 使用到了 Tab 来表达不同 Section 之间的切换. 那么对于更复杂一点的页面则需要使用不同的 Page 来表达, 这就会用到 Router 来做到页面之间的切换. 本篇我们来为 Angular 应用增加 Router 功能, 代码可以下载自 [Github](https://github.com/tiven-wang/angular-tutorial/tree/router)

通常我们眼中的浏览器地址栏中的地址, 鼠标点击链接, 以及点击浏览器的后退或前进等都会导致页面的切换, 浏览器会去地址所对应的服务器上请求新的页面内容. 而在 [SPA][angular-spa] 中页面跳转是不需要重新加载, 只需要在同一个页面的上下文环境中切换不同的组件 Components . 那么这样跳转的动作就需要 JavaScript framework 捕捉到并进行处理并展示相应的组件. 对于 Angular 来说这就是 Angular Router 需要做的事情.

## Step 1.  Add Product Detail Component

为了演示两个页面之间的切换, 我们之前有了 Product List 组件, 这里再增加一个 Product Detail 组件来展示某一个 Product 的详细信息, 使用 Angular CLI 命令生成组件

`ng g component product-detail`

## Step 2. Registering a Route

有了两个组件后便可以在 App Module 中注册其 router, 说明哪个路径展示哪个组件. 在 *app.module.ts* 里注册 router, `path` 代表浏览器地址栏中的 path 路径, `component` 表示展示对应哪个 Component

```typescript
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot([
        { path: '', component: ProductListComponent },
        { path: 'products/:productId', component: ProductDetailComponent },
        ])
    ],
})
```

## Step 3. Router Link

有了路由后便可以捕捉到浏览器地址栏中的 path 变化进而展示相应组件, 除了浏览器地址栏中直接输入地址, 还可以在页面其他部分加入链接, 链接到这边. 原始的方法是在 `<a>` 的 `href` 指定地址, 但 Angular 提供了便捷方法指定链接, [`RouterLink`][RouterLink] 它可以便捷得为 `<a>` 加上链接地址. 修改 Product List 增加链接指向 Product Details 页面

```html
<a [title]="product.ProductName + ' details'" [routerLink]="['/products', productId]">{{ product.ProductName }}</a>
```

## Step 4. Add Router Outlet

一切就绪, 但我们的组件展示在什么位置了. 这就需要 [`RouterOutlet`][RouterOutlet] 这样一个出口来指定他们的展示位置, 把之前展示 Product List 的位置改为 router-outlet.

*app.component.html* 中

```html
<ui5-tab text="Products" selected>
    <router-outlet></router-outlet>
</ui5-tab>
```

这样在 Product List 页面中点击 Product Name 的链接就会转到 Product Details 页面

## Step 5. Product Details page

Product Details 页面目前什么都没有, 它是需要根据链接中的参数 (如 ProductId ) 展示相应的 Product 信息

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap }  from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProductsService, Product } from '../products/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product>;
  constructor(private route: ActivatedRoute, private service: ProductsService) {
  }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap)=>{
        return this.service.getProduct(Number(params.get('productId')));
      })
    );
  }

}
```

* `private route: ActivatedRoute` 代表当前的路由信息



[angular-spa]:https://blog.angular-university.io/why-a-single-page-application-what-are-the-benefits-what-is-a-spa/

[RouterLink]:https://angular.io/api/router/RouterLink
[RouterOutlet]:https://angular.io/api/router/RouterOutlet