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
浏览器端的 UI 语言毋庸置疑是 HTML，那么 Render UI 也就成了 Render HTML 的问题。

### Angular

```typescript
@Component({
  selector: 'app-root',
  template:
`<div style="text-align:center">
  <h1>
    Welcome to {{ title }}!
  </h1>
  <button className="square" (click)="onClickMe()">
    {{ state }}
  </button>
</div>`,
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'my-app';
  state = 'Y';

  onClickMe() {
    this.state = 'X';
  }
}
```

### React

```javascript
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.title = 'my-app';
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <div style="text-align:center">
        <h1>
          Welcome to { this.title }!
        </h1>
        <button className="square" onClick={() => this.setState({value: 'X'})}>
          {this.state.value}
        </button>
      </div>
    );
  }
}
```

### Vue

## React to UI





https://medium.com/unicorn-supplies/angular-vs-react-vs-vue-a-2017-comparison-c5c52d620176

https://medium.com/unicorn-supplies/9-steps-how-to-choose-a-technology-stack-for-your-web-application-a6e302398e55


[angular]:https://angular.io
[reactjs]:https://reactjs.org/
[vuejs]:https://vuejs.org/
