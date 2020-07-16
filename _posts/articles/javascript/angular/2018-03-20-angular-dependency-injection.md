---
layout: post
theme: XiXiuTi
star: true
series: 
  url: angular
  title: Angular
title: Dependency Injection
excerpt: "Introduction to services and dependency injection"
modified: 2018-03-20T17:00:00-00:00
categories: articles
tags: [DI, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DU6-GvVW0AEi59M.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px/status/958912795847913472
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - Dependency Injection"
    url: "https://angular.io/guide/dependency-injection"
  - id: 2
    title: "Angular guide - Introduction to services and dependency injection"
    url: "https://angular.io/guide/architecture-services"
---

* TOC
{:toc}

![](https://angular.io/generated/images/guide/architecture/dependency-injection.png)
依赖注入 ([Dependency Injection][Dependency_injection]) 是一种如何创建依赖其他对象的对象的方式，注入 (Injection) 是指传递依赖对象给使用它的对象即客户端。 Dependency Injection 是 [Inversion of Control][Inversion_of_control] 最广泛的一种技术形式。客户端程序把提供他所需依赖的职责代理给了外部程序即 Injector. 对于客户端来说一般有三种接收注入依赖的方式 setter-, interface- 和 constructor-based injection.
{: .pull-right}

## Service and Dependency Injection

![](https://angular.io/generated/images/guide/architecture/injector-injects.png)
Service 是一个很广泛的概念, 它可以是 app 需要的一个 value, function or feature, 它通常是一个具有精准和明确目的的类.
具体哪些职责应该是 Service 的, 这就要先明白 Component 的职责, Component 是负责页面上某一块 UI 的展示和逻辑处理的，除了 UI 相关的逻辑归 Component 其他的任务要交给 Service 来负责如 fetching data from the server, validating user input, or logging directly to the console. 这样定义一个 *injectable service* 类, 便可以将同一个逻辑同一个类注入给任何一个 Component, 做到了共用和通用。
{: .pull-left}

Angular 通过 Component 构造函数中的参数类型发现此 Component 依赖某个服务类，它会首先检查 Injector 中是否已经存在此服务类的对象，如果不存在则通过服务类相应的 Provider 创建一个服务对象添加到 Injector 并，并赋给 Component 构造器。

### @Injectable

`@Injectable` 是 TypeScript 语言中的 [Decorator][typescript-decorators] ，他指明一个类是可以被依赖注入容器管理的。

例如我们使用 [angular-cli][cli.angular.io] 工具创建一个服务类 `Account`

`ng generate service accounts/account`

可以看到生成的代码里为 `Account` 类添加了 `@Injectable()`，表明这是一个可以被注入容器管理的类，尽管他的构造函数没有参数。

> 最佳实践：所有的 Service 类都要使用 `@Injectable` 标注，不管他需不需要依赖注入。
{: .Notes}

为了说明 `Account` 类如何被依赖注入，我们创建另外一个类 `Logger` 作日志管理

`ng generate service logger`

而 `Account` 需要 `Logger` 来做日志管理，然后为 `Account` 创建一个 `LoggerService` 属性，并在构造器函数参数里加入此属性，就像上面说到的三种接收注入依赖的方式之一 **constructor-based injection**:

```typescript
import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';

@Injectable()
export class AccountService {

  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
    this.logger.log('Hi!');
  }

}
```

为了验证更改效果，运行单元测试 `ng test`

```text
Error: StaticInjectorError(DynamicTestModule)[AccountService -> LoggerService]:
  StaticInjectorError(Platform: core)[AccountService -> LoggerService]:
    NullInjectorError: No provider for LoggerService!
```

可以看到此错误信息，说明 `AccountService` 是需要注入依赖 `LoggerService` 类的，但我们还没有在依赖注入容器里配置 `LoggerService` provider 。 修改单元测试文件 *account.service.spec.ts* ， 在 providers 里添加 `LoggerService`

```typescript
import { TestBed, inject } from '@angular/core/testing';

import { AccountService } from './account.service';
import { LoggerService } from '../logger.service';

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService, LoggerService]
    });
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
    expect(service.logger).toBeTruthy();
  }));
});
```

结果就可以了, 依赖注入容器帮我们创建了 `LoggerService` 的实例并赋给了 `AccountService` 的构造函数. 这是在单元测试里如何配置 providers, 那么在运行时代码里呐, 接下来看如何注册 service provider.

## Register a Service Provider

依赖注入容器 (Injector) 是负责创建依赖 (服务, function, value) 并注入到需要他们的类里例如一个 Component 或者另外一个 Service. 依赖注入容器通过提供给他的 providers 得知哪些类是需要管理的依赖。通常你不需要手动创建依赖注入容器，你只需要为支持 providers 属性的装饰器配置 providers 列表 Angular 就知道该怎么创建此容器。最重要的两个支持依赖注入容器的装饰器是 [`@Component`][Component] 和 [`@NgModule`][NgModule] 以及 Service 本身的 [`@Injectable`][Injectable]。这三种形式的区别在于 Scope 不同，Component 上创造出来的依赖是 Component 级别的，不同的 Component 会有自己的依赖实例。NgModule 上创造的依赖在这个 Module 内部唯一，而 @Injectable 可以设置 `providedIn` 来指定自己属于的 Scope，`providedIn: 'root'` 表示被 Application 级别的 Injector 所管理。

### @Component providers

下面代码演示的是如何为一个 Component 添加依赖，在 `@Component` 装饰器里配置 providers 属性为依赖的类，然后在 Component class 里就可以引用这些依赖类的实例

```typescript
import { Component, Inject } from '@angular/core';
import { AccountService } from './accounts/account.service';
import { LoggerService } from './logger.service';

@Component({
  selector: 'App',
  providers: [ AccountService, LoggerService ],
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular App';
  logoUrl = '/assets/logo.svg';

  account: AccountService

  constructor(account: AccountService) {
    this.account = account;
  }

}
```

### @NgModule providers

同样的 `@NgModule` 有可以配置 [providers](https://angular.io/guide/providers) 属性，那么他就会使用这些依赖为其管辖的类创建依赖注入实例。

那么同样都可以配置 providers 他们两者之间有什么区别呢？ 这就涉及到依赖注入容器 Injector 的[继承层级](https://angular.io/guide/hierarchical-dependency-injection)和生命周期的概念。很明显在一个 Module 内 `@NgModule` 的 Injector 在根节点，而其下属的 Components Injector 按照关联关系依次挂在根节点下面。所以 NgModule 和 Components 的 Injector 所拥有的范围（Scope）不同，NgModule Injector 的范围是整个 Injector tree 的全局，而 Component Injector 只能是本节点及以下的范围。而 Dependency Object 在同一个 Scope 内又是单例（[Singleton](https://angular.io/guide/singleton-services)）的 ，所以不同的范围就代表不同的依赖实例。

另外一点是 Injector 的生命周期是伴随其所属的组件的，Component 在销毁时其所拥有的 Injector 也会被销毁，Injector 内的依赖实例同样也会被销毁。而 NgModule 的 Injector 则是从开始到结束。所以如果你想让整个模块内的依赖使用同一个实例，那么就把他放在 `@NgModule` 的 providers 里吧。

## Dependency Providers

https://angular.io/guide/dependency-injection-providers


## DI Advantage

那么依赖注入方式在实际应用中到底有什么好处？接下来我们看看如何方便地替换一个依赖。

假如我们实现了另外一个 `BetterLogger`  类，他继承自 `Logger` 类，用 [angular-cli][cli.angular.io] 创建

`ng generate service loggers/BetterLogger`

```typescript
import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';

@Injectable()
export class BetterLoggerService extends LoggerService {

  logs: string[] = []; // capture logs for testing

  log(message: string) {
    this.logs.push(message);
    console.log(message);
  }
}
```

然后只需要在 providers 里改为

```typescript
providers: [{provide: LoggerService, useClass: BetterLoggerService}]
```

这是书写 providers 的另外一种形式，他表示用子类对象去提供父类类型的依赖。

## 常见问题

[Difference between @Self and @Host Angular Dependency Injection Decorators](https://stackoverflow.com/questions/43728007/difference-between-self-and-host-angular-2-dependency-injection-decorators)


[Dependency_injection]:https://en.wikipedia.org/wiki/Dependency_injection
[Inversion_of_control]:https://en.wikipedia.org/wiki/Inversion_of_control
[cli.angular.io]:https://cli.angular.io/
[typescript-decorators]:http://www.typescriptlang.org/docs/handbook/decorators.html

[Component]:https://angular.io/api/core/Component
[NgModule]:https://angular.io/api/core/NgModule
[Injectable]:https://angular.io/api/core/Injectable
