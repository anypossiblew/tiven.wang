---
layout: post
theme: XiuKai
star: true
series: 
  url: css
  title: CSS
title: Dashboard Styles
excerpt: "How to design technological sense dashboard using CSS style?"
modified: 2019-06-30T18:00:00-00:00
categories: articles
tags: [CSS, Angular]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1356.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/nizip-turkey-1356
comments: true
share: true
references:
  - id: 1
    title: "知乎 - 98%的人都不知道！让PPT充满科技感的五个技巧"
    url: "https://zhuanlan.zhihu.com/p/38463850"
  - id: 2
    title: "掘金 - 用最短的CSS样式，勾勒大数据演示屏"
    url: "https://juejin.im/post/5b1e2b50f265da6e5546c15d"
  - id: 3
    title: "border-image 的正确用法"
    url: "https://aotu.io/notes/2016/11/02/border-image/index.html"
  - id: 4
    title: "SegmentFault - CSS魔法堂：重拾Border之——图片作边框"
    url: "https://segmentfault.com/a/1190000005039512"
---

* TOC
{:toc}

## Problem

最近公司迫切需要把 SAP ERP 中的重要数据通过 Dashboard 或叫 Cockpit 的形式展现给老板们看, 用 SAP FIORI 或者 Angular 做出来的效果都很一般, 没有那种高大上(炫酷)的感觉. 怎么设计才比较好呐, 今天我们来为 Dashboard 增加点科技感的设计(现在流行的**大屏**风格).

## Solution

### 科技感

什么是科技感? 来看一下知乎上是怎么说的 [98%的人都不知道！让PPT充满科技感的五个技巧](https://zhuanlan.zhihu.com/p/38463850)

总结下来科技感的几个重要属性:

* **颜色** 包括 背景, 渐变色 等
* **透明** 透视感
* **发光** 荧光感
* **线条** 包括 边框, 分割线, 背景图片的线

那么我们就来看怎么用现代的 CSS 技术实现上面几点科技感效果.

### CSS 实现技巧

#### 边框

我们知道 CSS border 属性是设置元素边框的, 但普通的实线或虚线都不够炫, 幸好 CSS 有了 [border-image](https://css-tricks.com/understanding-border-image/) 使我们可以用图片来装饰边框以达到任意炫酷的效果.

`border` + `border-image` 做到用图片来装饰边框, 如下 CSS 代码

```css
#bitmap {
  border: 30px solid transparent;
  border-image: url("http://www.imaoda.com/s/img/tpl/border.png") 5%;
}
```

<iframe height="265" style="width: 100%;" scrolling="no" title="border-image" src="//codepen.io/tiven_wang/embed/NZyjwg/?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tiven_wang/pen/NZyjwg/'>border-image</a> by tiven.wang
  (<a href='https://codepen.io/tiven_wang'>@tiven_wang</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

关于 `border-image` 的详细用法, 请自行查阅资料.

#### 发光

一般牛 B 点的东西还需要会发光, 蓝色荧光的那种. CSS 可以做到, `box-shadow` 和 `text-shadow` 分别可以为 box 和文字发光(人家本身叫阴影, 但我们换个颜色就是光).

只有光环有点违和感, 元素本身要是这种颜色, 所以还要把元素本身改成这种颜色, 即加个背景颜色 `background`

```css
#bitmap {
  box-shadow: 0 0 5rem rgb(0,110,150);
  background: rgba(0,110,150,.3);
}
```

<iframe height="265" style="width: 100%;" scrolling="no" title="box-shadow" src="//codepen.io/tiven_wang/embed/JQpNeg/?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tiven_wang/pen/JQpNeg/'>box-shadow</a> by tiven.wang
  (<a href='https://codepen.io/tiven_wang'>@tiven_wang</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

#### 透明

透视感, 就像是电影里那种在玻璃上显示的一样, 元素叠加在一起, 可以透视很多层. 虽然 `opacity` 是用来设置透明度的, 但它是对整个元素包括内容起作用的, 只是让背景颜色半透明可以用颜色的半透明来做到, 即 `rgba(R, G, B, A)`.

```css
#bitmap {
  background: rgba(0, 110, 150, .5);
}
```

<iframe height="265" style="width: 100%;" scrolling="no" title="opacity" src="//codepen.io/tiven_wang/embed/mZXmZR/?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tiven_wang/pen/mZXmZR/'>opacity</a> by tiven.wang
  (<a href='https://codepen.io/tiven_wang'>@tiven_wang</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

对于毛玻璃效果, `filter: blur(5px);` 这个属性可以做到对整个元素包括其内容进行模糊的效果(你可以使用手动元素位置叠加做到背景毛玻璃效果), 但单纯的背景模糊不久的将来可以使用 `backdrop-filter: blur(5px)` 来做.

#### 颜色

有了科技感的元素, 那么我们就来设置个大场景的科技蓝的背景和主题. 去搜索一个科技蓝的可以作为大场景背景的图片, 然后设置为整个页面的背景图.

```css
body {
  background: url(http://6.eewimg.cn/mp/uploads/2018/09/30/9fa1cbde-c456-11e8-8169-001e676a89bd.jpg);
  background-size: cover;
}
```

<iframe height="265" style="width: 100%;" scrolling="no" title="border-image" src="//codepen.io/tiven_wang/embed/BgYWaM/?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tiven_wang/pen/BgYWaM/'>border-image</a> by tiven.wang
  (<a href='https://codepen.io/tiven_wang'>@tiven_wang</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

再设置一些大小布局上的属性, 整个科技炫酷页面就完成了.

## Animation

除了静态的效果外, 很多元素在变化时还需要动画效果才更炫.

> CSS animations make it possible to animate transitions from one CSS style configuration to another. Animations consist of two components, a style describing the CSS animation and a set of keyframes that indicate the start and end states of the animation’s style, as well as possible intermediate waypoints.

<iframe height="265" style="width: 100%;" scrolling="no" title="animation" src="//codepen.io/tiven_wang/embed/wLmKdy/?height=265&theme-id=dark&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tiven_wang/pen/wLmKdy/'>animation</a> by tiven.wang
  (<a href='https://codepen.io/tiven_wang'>@tiven_wang</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 扩展

### 背景

页面或者组件背景除了使用图形来修饰外, 如果是文艺点的还可以用 CSS 本身的 `background-image` 的渐变颜色函数 `linear-gradient` `radial-gradient` 来装饰.


https://sugar.baidubce.com/dashboard/5e81f0ec04f74164a1d0bae94cd386dc
