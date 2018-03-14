---
layout: post
theme: Josefin-Sans
title: Angular vs React vs Vue
excerpt: "比较 Angular React Vue 框架的异同"
modified: 2018-03-13T17:00:00-00:00
categories: articles
tags: [Angular, React, Vue, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DU1f7wwXUAA7TXc.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/958527779393458178
comments: true
share: true
references:
  - id: 1
    title: "Angular2 - how to start and with which IDE"
    url: "https://stackoverflow.com/questions/40840317/angular2-how-to-start-and-with-which-ide"
---

* TOC
{:toc}

现代浏览器端 UI JavaScript 框架（ [Angular][angular], [React][reactjs], [Vue][vuejs] ... ）解决两个问题：Render UI 和 React to UI。这就引出了具体技术概念 Data Binding。数据绑定 Data Binding 是一种连接一个数据模型和用户界面的机制。

Render UI => Templates + Class

React to UI => DOM Events + Listener

两者即是 Data Binding 的两个方向要解决的问题:
* Render UI 需要 UI 绑定 Data model 即 UI 要对 Data model 的变化做出反应
* React to UI 需要 Data model 绑定 UI 即 Data model 要对 UI 的变化做出反应

## Render UI
浏览器端的 UI 语言毋庸置疑是 HTML，那么 Render UI 也就成了 Render HTML 的问题。最初的时候 HTML 也只是为了实现展现文字和提交表单 form 等这类的简单功能，但随着网络的发展，网页想要实现的功能越来越多，可以实现的功能越来越庞大，这就是 [Rich Web Application][rich-web-application] 概念出现的时机。最初实现 Rich Web Application 的思路是在浏览器上安装插件来增强其展现能力，如 [Flash][flashplayer] 和 [Silverlight][silverlight]。但随着移动设备的爆炸式增长，这种浏览器外挂插件的方式平台兼容性和安全性不甚理想。尤其是 Google Chrome 和 HTML5 标准的出现让浏览器本身可以做到更完善，此时是浏览器插件的没落和 native HTML + JavaScript library 的兴起。刚开始的 JavaScript 语言，大家都认为他是小打小闹，实现不了什么高级功能。但随着 [AJAX][Ajax] 技术和 [jQuery][jquery] 库的出现，让我们对 JavaScript 的能力刮目相看。随后出现了大量类似的库如 [Backbone.js][backbonejs] 等，但这些 JavaScript 运行起来对页面都具有侵入性，并没有完全融入到 HTML 标签当中，只是对现有标签进行修饰，就好比叫 **“修理”**。自然而然就会有另外一种方式叫 **“生产”** 的出现，这种方式本身充当 HTML 标签解析器的作用，这种方式的库有 [Angular][angular], [React][reactjs], [Vue][vuejs] 等，就是本篇要讲的这几个库。

还有另外一种技术 [Web Components][webcomponents]，意在彻底解决浏览器扩展 HTML 标签的问题。

### Web Components

> Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Custom components and widgets build on the Web Component standards, will work across modern browsers, and can be used with any JavaScript library or framework that works with HTML.
{: .Quotes}

我们来认识一下 Web Components ，假如你对原始的 HTML 输入框组件不满意，比方说你想要输入框是带单位的数字类型如货币温度等，那么就可以使用下面第三方开发的 HTML 扩展标签，看起来是不是很方便

```html
<base href="https://raw-dot-custom-elements.appspot.com/fooloomanzoo/number-input/2.2.0/">
<script src="webcomponentsjs/webcomponents-lite.js"></script>

<link rel="import" href="number-input/number-input.html">
<link rel="import" href="number-input/integer-input.html">

<span>using units: </span>
<number-input min="-150" step="0.15" max="300" pad-length="3" default="15" unit="°C"></number-input><br>
<span>in percent: </span>
<number-input min="-1" step="0.15" max="3" start-at="1" number-style="percent"></number-input><br>
<span>using currencies: </span>
<number-input min="0" step="0.01" start-at="1000" use-grouping number-style="currency" currency="EUR"></number-input><br>
<span>as integer: </span>
<integer-input min="-150" step="15" max="300" always-sign default="15"></integer-input>
```

### JavaScript Libraries

### Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'App',
  template: `<div class="App">
              <header class="App-header">
                <img width="300" class="App-logo" alt="Angular Logo" [src]="logoUrl">
                <h1 class="App-title">Welcome to {{ title }}!</h1>
              </header>
              <p class="App-intro">
                To get started
              </p>
             </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular App';
  logoUrl = '/assets/logo.svg';
}
```

在网页中使用它
```html
<body>
  <App></App>
</body>
```


### React

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.title = 'React App';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="React Logo" />
          <h1 className="App-title">Welcome to {this.title}!</h1>
        </header>
        <p className="App-intro">
          To get started
        </p>
      </div>
    );
  }
}

export default App;
```

在网页中使用它
```html
<body>
  <div id="root"></div>
</body>
```

```javascript
ReactDOM.render(<App />, document.getElementById('root'));
```


### Vue

## React to UI





https://medium.com/unicorn-supplies/angular-vs-react-vs-vue-a-2017-comparison-c5c52d620176

https://medium.com/unicorn-supplies/9-steps-how-to-choose-a-technology-stack-for-your-web-application-a6e302398e55


[angular]:https://angular.io
[reactjs]:https://reactjs.org/
[vuejs]:https://vuejs.org/
[jquery]:https://jquery.com/
[backbonejs]:http://backbonejs.org/

[webcomponents]:https://www.webcomponents.org/

[Ajax]:https://en.wikipedia.org/wiki/Ajax_(programming)
[rich-web-application]:https://stackoverflow.com/questions/2055430/list-of-rich-web-application-technologies
[silverlight]:https://www.microsoft.com/silverlight/
[flashplayer]:https://www.adobe.com/cn/products/flashplayer.html
