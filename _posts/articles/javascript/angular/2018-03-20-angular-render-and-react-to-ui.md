---
layout: post
theme: 细秀体
title: Angular - Rendering and React to UI
excerpt: ""
modified: 2018-03-20T18:00:00-00:00
categories: articles
tags: [Data Binding, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DWArQW0VAAAQ04c.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/963817882718298112
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - Components and Templates"
    url: "https://angular.io/guide/displaying-data"
  - id: 2
    title: "Angular Change Detection Explained"
    url: "https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html#whats-change-detection-anyways"
  - id: 3
    title: "Zones in Angular"
    url: "https://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html"
  - id: 4
    title: "Everything you need to know about change detection in Angular"
    url: "https://blog.angularindepth.com/everything-you-need-to-know-about-change-detection-in-angular-8006c51d206f"

---

* TOC
{:toc}

在 [Angular - Setup Dev Project](/articles/angular-setup-dev-project/) 一篇我们看到过一个 Component 类使用 templateUrl 或者 template 属性与 HTML Template 关联在一起。本质上就是需要把 Class 的 property 表示的 Data 与 HTML 表示的 UI 绑定起来，以做到 Data 的变化能反应到 UI 组件上，UI 组件的变化能反映到 Data 上，这就是 Data Binding 。在 Angular 的文档里弱化了原来 [Angularjs Data Binding](https://docs.angularjs.org/guide/databinding) 的技术名词说法，只是在 [Template Syntax][template-syntax] 提到了。这也反映了这种 Data Binding 重要性的降低，或许我们有其他方式实现 Template Syntax 。Template Syntax 无非是两个问题：Rendering UI 和 React to UI。本篇我们就要讲讲一个 Component class 是如何控制 HTML 的显示（Rendering UI）和响应 HTML 用户操作事件（React to UI）的。

## Rendering UI
最简单的方式是把变量值插入 HTML Template 内即 Interpolation 。使用双大括号包括的变量或者表达式，在运行时会被取值。

```html
<h1 class="App-title">Welcome to {{ title }}!</h1>
```

或者控制 HTML 标签的属性值，使用 `[属性名]="表达式"`
```html
<span [hidden]="isUnchanged">changed</span>
```

另外就是控制型的内置指令 `Directive` 如 `*ngFor`，`ngIf` 等


## React to UI
响应 HTML UI 事件使用 `(事件类型)="表达式"`
```html
<button (click)="onSave()">Save</button>
```

如果既有展示又有响应事件则形式是 `[(ngModel)]="变量"`

Angular [Template Syntax][template-syntax] 还有其他各种变化的形式，但我们这里只讲抽象层面的主要形式。

## Change Detect
### How

### When



[template-syntax]:https://angular.io/guide/template-syntax
