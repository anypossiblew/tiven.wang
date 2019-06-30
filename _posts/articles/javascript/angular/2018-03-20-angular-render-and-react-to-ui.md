---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Rendering and React to UI
excerpt: "How Angular to Render, React UI and Change Detection?"
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
  - id: 5
    title: "Angular OnPush Change Detection and Component Design - Avoid Common Pitfalls"
    url: "https://blog.angular-university.io/onpush-change-detection-how-it-works/"
  - id: 6
    title: "Understanding Change Detection Strategy in Angular"
    url: "https://alligator.io/angular/change-detection-strategy/"
  - id: 7
    title: "How I optimized Minesweeper using Angular 2 and Immutable.js to make it insanely fast"
    url: "https://www.jvandemo.com/how-i-optimized-minesweeper-using-angular-2-and-immutable-js-to-make-it-insanely-fast/"
  - id: 8
    title: "building angular 2 applications with immutable.js and redux"
    url: "https://houssein.me/redux/immutablejs/angular/2016/07/04/angular2-with-immutablejs-and-redux.html"

---

* TOC
{:toc}

在 [Angular - Setup Dev Project](/articles/angular-setup-dev-project/) 一篇我们看到过一个 Component 类使用 templateUrl 或者 template 属性与 HTML Template 关联在一起。本质上就是需要把 Class 的 property 表示的 Data 与 HTML 表示的 UI 绑定起来，以做到 Data 的变化能反应到 UI 组件上，UI 组件的变化能反映到 Data 上，这就是 Data Binding 。在 Angular 的文档里弱化了原来 [Angularjs Data Binding](https://docs.angularjs.org/guide/databinding) 的技术名词说法，只是在 [Template Syntax][template-syntax] 提到了。这也反映了这种 Data Binding 重要性的降低，或许我们有其他方式?实现 Template Syntax 。Template Syntax 无非是两个问题：Rendering UI 和 React to UI。本篇我们就要讲讲一个 Component class 是如何控制 HTML 的显示（Rendering UI）和响应 HTML 用户操作事件（React to UI）的。

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

通过之前的学习我们知道一个 HTML template 对应一个 Angular Component class，一个 HTML application 是一个 HTML elements 的树，那么一个 Angular application 就是一个 Components 树。

其实 Component 只负责数据模型的逻辑，Angular 底层有一个类 View 负责具体展现的逻辑，真正和 HTML UI element 绑定一起的是 View，所以就是 一个 Component 对应一个 View 对应一个 HTML element，一个 Component 树也就对应一个 View 树。而 change detection 逻辑是在每个 View 里做的。

> A View is a fundamental building block of the application UI. It is the smallest grouping of Elements which are created and destroyed together.
Properties of elements in a View can change, but the structure (number and order) of elements in a View cannot. Changing the structure of Elements can only be done by inserting, moving or removing nested Views via a ViewContainerRef. Each View can contain many View Containers. [[4.](#reference-4)]
{: .Quotes}

> It’s important to note here that all articles on the web and answers on StackOverflow regarding change detection refer to the View I’m describing here as Change Detector Object or ChangeDetectorRef. In reality, there’s no separate object for change detection and View is what change detection runs on. [[4.](#reference-4)]
{: .Quotes}

因为 View 的类 [`ViewRef`][ViewRef] 继承了类 [`ChangeDetectorRef`][ChangeDetectorRef]，所以你可以使用 `ChangeDetectorRef` 类型把 View 注入到 Component 的构造函数中

```typescript
constructor(cd: ChangeDetectorRef) {
}
```

每个 View 都有一个状态  [`ViewState`](https://github.com/angular/angular/blob/5.2x/packages/core/src/view/types.ts#L372-L392) 属性

```typescript
/**
 * Bitmask of states
 */
export const enum ViewState {
  FirstCheck = 1 << 0,    // 0001
  ChecksEnabled = 1 << 1, // 0010
  Errored = 1 << 2,       // 0100
  Destroyed = 1 << 3      // 1000
  ...
}
```

当一个 View 要执行 Change detection 操作时他会递归调用函数 [checkAndUpdateView](https://github.com/angular/angular/blob/5.2x/packages/core/src/view/view.ts) 应用在他本身节点即以他为根节点的子孙节点上。

* 在执行过程中生命周期钩子函数 `onChanges` 会被调用，即使 changed detection 被跳过；
* 在 change detection 过程中更新 DOM ，第一次 change detection 之前插值没有更新前 DOM 会先 rendered；
* 在 change detection 过程中 component view 的状态 State 可能会被更改，是指 Views 的初始状态默认为  `ChecksEnabled`，如果其使用了 `OnPush` strategy 的 change detection 的话，那么在第一次检查后就被改为 `ChecksEnabled=false` 了；

假如有组件 `A -> B -> C`，那么最终顺序是这样的

```text
A: AfterContentInit
A: AfterContentChecked
A: Update bindings
    B: AfterContentInit
    B: AfterContentChecked
    B: Update bindings
        C: AfterContentInit
        C: AfterContentChecked
        C: Update bindings
        C: AfterViewInit
        C: AfterViewChecked
    B: AfterViewInit
    B: AfterViewChecked
A: AfterViewInit
A: AfterViewChecked
```

了解了 change detection 的基本流程，那么我们怎么控制它呢？ Angular 提供了 [`ChangeDetectorRef`][ChangeDetectorRef] 公共接口供程序使用
```typescript
export abstract class ChangeDetectorRef {
  abstract markForCheck(): void;
  abstract detach(): void;
  abstract detectChanges(): void;
  abstract checkNoChanges(): void;
  abstract reattach(): void;
}
```

然后在 Component 的构造函数里注入他，便可使用控制 View change detection

```typescript
constructor(private cd: ChangeDetectorRef, private logger: LoggerService) {
  setTimeout(() => {
    this.cd.detach();
    this.account.name = 'MyName';
  }, 2000);
}
```

* `detach()` 是把 change detector 从 the change detector tree 上拿下来，这样此 View 就不会被自动检查了；
* `detectChanges()` 手动触发一次 change detection 过程，他与`detach()`合并使用可以做到本地化的 change detection 。例如实现一个自定义 5 秒检查一次
  ```typescript
  constructor(private ref: ChangeDetectorRef) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 5000);
  }
  ```
* `reattach()` 重新加入自动检查树 the change detector tree

关于更多详细分析可以参考 [[4.](#reference-4)]

#### Change Detection Strategy

> Angular performs change detection on all components (from top to bottom) every time something changes in your app from something like a user event or data received from a network request. Change detection is very performant, but as an app gets more complex and the amount of components grows, change detection will have to perform more and more work. There’s a way to circumvent that however and set the change detection strategy to OnPush on specific components. Doing this will instruct Angular to run change detection on these components and their sub-tree only when new references are passed to them versus when data is simply mutated. [[6.](#reference-6)]
{: .Quotes}

Angular 新增了 [Change Detection Strategy OnPush][ChangeDetectionStrategy] 来标识某个 Component 只有在输入属性的值的引用发生变化时才进行 change detection 。在实际应用中 `OnPush` 可能有一些坑需要注意[[5.](#reference-5)]

##### Immutables and Observables

Patterns:
* **OnPush** + **Immutables**
* **OnPush** + **Observables** + **markForCheck**

Smarter Change Detection [[2.](#reference-2)]

### When

当 Angular Application 初始化 Rendering 完成后，假设整个 Angular 程序处在静止状态，那么 Angular 怎么知道某个变量发生了变化需要重新更新 UI ?

让我们来想象一下什么样的情况会导致程序状态发生变化。最基本是当用户点击了 UI 上的按钮 Events，或者是程序发送了一个远程服务请求 XHR，还有程序设置的定时器。

* **Events** - click, submit, ...
* **XHR** - Fetching data from a remote server
* **Timers** - setTimeout(), setInterval()

那么 Angular 怎么知道这些事情发生了呢？这就是 [Zone.js][zone.js] 框架要做的，它相当于会创建一台虚拟机，把运行在里面的 JavaScript 程序的 `setTimeout` `setInterval` 等函数都做了封装，所以他会知道什么时候发生了什么事情。只不过 Angular 对 Zone.js 又进行了一层封装，他会监听 `onTurnDone` 事件，如果发生了则说明该进行 change detection 了。

> The short version is, that somewhere in Angular’s source code, there’s this thing called [`ApplicationRef`][ApplicationRef], which listens to `NgZones` `onTurnDone` event. Whenever this event is fired, it executes a `tick()` function which essentially performs change detection. [[2.](#reference-2)]

https://blog.angularindepth.com/the-difference-between-ngdocheck-and-asyncpipe-in-onpush-components-4918ec4b29d4

[template-syntax]:https://angular.io/guide/template-syntax
[ApplicationRef]:https://angular.io/api/core/ApplicationRef
[ChangeDetectorRef]:https://angular.io/api/core/ChangeDetectorRef
[ViewRef]:https://angular.io/api/core/ViewRef
[ChangeDetectionStrategy]:https://angular.io/api/core/ChangeDetectionStrategy
[zone.js]:https://github.com/angular/zone.js/
[immutable.js]:https://github.com/facebook/immutable-js
