---
layout: post
theme: 细秀体
title: Angular - Forms
excerpt: ""
modified: 2018-03-22T18:00:00-00:00
categories: articles
tags: [Angular, TypeScript, JavaScript]
image:
  vendor: yourshot.nationalgeographic
  feature: /u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNeYPaf67wv_Cb2VTf4WrEA6BZw0NvHCYfjH5MgxJsijnvolfLSwzojcKSJtfSkVGzAaqublg8cMB-NKNUzilBQkr1FJH2foUw9jzkc-_74nIFZg9rZ5wZ_8NEzHCGE5guLScDcXYIlNIdLPJZnw0gqMPLLW8Swq43TjzfeqXK0Omz2vg/
  credit: Victor Atelevich
  creditlink: https://yourshot.nationalgeographic.com/profile/1534542/
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - Observables"
    url: "https://angular.io/guide/observables"
  - id: 2
    title: "Taking Advantage of Observables in Angular"
    url: "https://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html"
---

* TOC
{:toc}

先来看一下一个 Component 响应用户输入的方式， Angular event bindings 方式为 `(事件名称)="表达式"` 如 `<button (click)="onClickMe()">Click me!</button>`。

在执行的表达式里还可以传入 `$event` 对象，他代表原始的 DOM 事件对象。我们不推荐这种使用方式，这会打破解耦 Template （用户界面）和 Component （应用程序如何处理用户数据） 的原则，增加他们之间的耦合性。

那么可以换一种方式，使用 template reference variable ，例如 `<input #box (keyup)="onKey(box.value)">`。<br>
进一步 Angular 的 pseudo-event 精细化过滤事件类型以减少计算量，如当点击 enter 时才触发 `<input #box (keyup.enter)="onEnter(box.value)">`。

Form 是应用程序承担用户输入信息的主要形式，你可以用 Form 做各种比如登录，提交帮助请求，提交一个订单，预订机票，约个会议等大量的数据录入任务。那么 Form 界面的用户体验就尤为重要。

## Template-driven forms
先来看一下如何通过 Template 驱动的方式创建 Form 。先生成一个 Model class `Account` <br>
`ng generate class Account`

```typescript
export class Account {
  constructor(
    public username: string,
    public password: string
  ){}  
}
```

然后就可以在 Component class 里创建一个类型为 `Account` 的属性，代表下面要讲的 Form 输入信息的模型变量。

```typescript
...
export class AppComponent {
  account: Account;
  ...
}
```

在使用 template-driven forms 之前要把他的 module 引入进我们的 module 里来。

```typescript
...
import { FormsModule }   from '@angular/forms';

@NgModule({
  ...
  imports: [
    BrowserModule,
    FormsModule
  ],
  ...
})
export class AppModule { }
```

然后就可以在我们的 Template 里添加 Form 了
```html
<form>
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" class="form-control" id="name" required>
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password">
  </div>

  <button type="submit" class="btn btn-success">Submit</button>

</form>
```
这是一个 Form 表单最基本的形式，其中的 CSS classes `form-group`, `form-control`, 和 `btn` 是使用了 [Twitter Bootstrap][bootstrap] 框架。你可以通过链接添加到你的应用程序
```css
@import url('https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css');
```

接下来就是把这个普通的 HTML 与 Angular Component 绑定起来。

### Two-way data binding with ngModel
想要实现双向绑定，就要使用 Directive [`NgModel`][NgModel] ，例如 `<input [(ngModel)]="name" #ctrl="ngModel" required>`。因为 `NgModel` 同时还会把自己暴露([`exportAs`][Directive])为一个变量名 *ngModel* ，所以我们可以把它转给 template reference variable 这里的叫做 `ctrl` ，那么就可以使用变量 `ctrl` 得到 `input` 对应的 `ngModel` 的详细属性了 `<p>Valid: \{\{ ctrl.valid \}\}</p>`。

同样原理可以添加 Form 的 Directive 对象给变量 `<form #userForm="ngForm">` 。这里并没有使用双向绑定的 Directive 呢，那是因为 Angular 自动为 `form` 标签的元素创建了 [`NgForm`][NgForm] directive 。

下面是添加了双向绑定的 Template
```html
<form #userForm="ngForm">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" class="form-control" id="name" required [(ngModel)]="account.username" name="name">
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password" [(ngModel)]="account.password" name="password">
  </div>

  <button type="submit" class="btn btn-success">Submit</button>

</form>
```

### States Control
下面就是根据各个变量的详细状态来控制界面显示，做到对用户更友善。为了方便查看变量或者 HTML element 状态的变化，你可以将他们输出到界面上，开发完后再去掉。例如下面为 `input` 添加变量 `spy` 用以查看他的 class name
```html
<input type="text" class="form-control" id="name" required
       [(ngModel)]="account.username"
       name="name"
       #spy>
<br>TODO: remove this:{{spy.className}}
```

然后你就可以根据元素 Class Name 的实际变化添加不同的 CSS 代码，如
```css
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* green */
}

.ng-touched.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* red */
}
```

再来看一下如何用控制变量控制界面上信息的显示
```html
<input type="text" class="form-control" id="name" required
       [(ngModel)]="account.username"
       name="name"
       #name="ngModel">
<div [hidden]="name.valid || name.pristine" class="alert alert-danger">
  Name is required
</div>
```

更详细的和自定义输入校验请参考 Angular 官方文档 [Form Validation][form-validation] 。


### Submit the form with ngSubmit
Form 完成后就是提交动作了，使用监听 [`NgForm`][NgForm] 的输出事件 `ngSubmit` 来做提交
```html
<form (ngSubmit)="onSubmit()" #userForm="ngForm">
```

还可以为 Submit 按钮添加控制，当 Form 合法时才可以点击提交

```html
<button type="submit" class="btn btn-success"
        [disabled]="!userForm.form.valid">Submit</button>
```

## Reactive forms
Reactive forms is an Angular technique for creating forms in a reactive style.

[bootstrap]:http://getbootstrap.com/css/

[NgModel]:https://angular.io/api/forms/NgModel
[NgForm]:https://angular.io/api/forms/NgForm
[Directive]:https://angular.io/api/core/Directive#exportAs
[ApplicationRef]:https://angular.io/api/core/ApplicationRef
[ChangeDetectorRef]:https://angular.io/api/core/ChangeDetectorRef
[ViewRef]:https://angular.io/api/core/ViewRef
[ChangeDetectionStrategy]:https://angular.io/api/core/ChangeDetectionStrategy
[Component]:https://angular.io/api/core/Component
[NgModule]:https://angular.io/api/core/NgModule
[zone.js]:https://github.com/angular/zone.js/
[immutable.js]:https://github.com/facebook/immutable-js
[form-validation]:https://angular.io/guide/form-validation
