---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Component Styles
excerpt: "How Component Styles work in Angular Application?"
modified: 2019-06-30T18:00:00-00:00
categories: articles
tags: [CSS, Angular]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2090.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/weisswasser-germany-2090
comments: true
share: true
references:
  - id: 1
    title: "Angular - Component Styles"
    url: "https://angular.io/guide/component-styles"
  - id: 2
    title: "Angular :host, :host-context, ::ng-deep - Angular View Encapsulation"
    url: "https://blog.angular-university.io/angular-host-context/"
    
---

* TOC
{:toc}

https://ultimatecourses.com/blog/emulated-native-shadow-dom-angular-2-view-encapsulation#Global_CSS

## Problem

在 Angular 应用程序开发中会遇到怎么设置组件样式的问题, 我想在某个组件中设置另外某个组件的样式, 而且不像要此样式对其他组件中的此组件有影响, 应该怎么设置 CSS 样式呐?

## Solution

> Angular can bundle component styles with components, enabling a more modular design than regular stylesheets.

什么是 a more modular design ?

### CSS Modular Design

styling modularity feature

`:host`

`:host-context`

`/deep/`

### View encapsulation

* ShadowDom
* Native
* Emulated
* None