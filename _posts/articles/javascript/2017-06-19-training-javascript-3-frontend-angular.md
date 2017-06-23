---
layout: post
title: Training JavaScript - 3. Angular for Frontend Development
excerpt: "Angular (commonly referred to as 'Angular 2+' or 'Angular 2') is a TypeScript-based open-source front-end web application platform led by the Angular Team at Google and by a community of individuals and corporations to address all of the parts of the developer's workflow while building complex web applications. Angular is a complete rewrite from the same team that built AngularJS."
modified: 2017-06-19T17:00:00-00:00
categories: articles
tags: [Angular, JavaScript]
image:
  feature: nationalgeographic/Strutting-Stork.jpg
comments: true
share: true
references:
  - title: "angular.io"
    url: "https://angular.io/"
---

> [鹳](https://en.wikipedia.org/wiki/Stork)是一个大型水鸟科的通称。包括19个品种。在大多数地球上比较温暖的地带都可以见到它们的踪迹。鹳是候鸟，善于飞行。鹳有很长的腿和细长的带蹼的爪子。它们有又长又结实的尖喙。羽毛通常是白色和黑色的。但有些品种鹳的头上或头上和脖子上几乎没有羽毛。

* TOC
{:toc}

JavaScript Series:

1. [JavaScript Foundation](/articles/training-javascript-1-foundation/) and [Node.js](/articles/professional-node.js/)
2. [Create a backend server by Node.js (JavaScript version)](/articles/training-javascript-2-server-javascript/) or [Create Server by Node.js (TypeScript version)](/articles/training-javascript-2-server-typescript/)
3. **Angular for frontend development**

[Angular](https://en.wikipedia.org/wiki/Angular_(application_platform)) is the frontend part of the [MEAN][MEAN] stack, consisting of [**M**ongoDB][MongoDB] database, [**E**xpress.js][Express.js] web application server framework, [**A**ngular][angular.io] itself, and [**N**ode.js][Node.js] runtime environment.

We follow the [quickstart tutorial](https://angular.io/guide/quickstart) of [angular][angular.io] to create a application in our JavaScript blog series.

> Angular Version 4.2.3

## Quickstart

`npm install -g @angular/cli`

`ng new training-javascript-angular`

`cd training-javascript-angular`

`ng serve --open`

Change the title to **'Tiven's App'** in *src/app/app.component.ts*, then the server will rebuild automatically, and the page in the browser will be refreshed automatically. **ng** keeps the app transpiling and running.

Try to change styles in the file *src/app/app.component.css* and view the different on the page.

`ng build`


## Wechat Message App

In the previous article [Create a backend server by Node.js (JavaScript version)](/articles/training-javascript-2-server-javascript/) we have created a server for receiving wechat messages and storing in the database. Next we follow the tutorial [Tour of Heroes](https://angular.io/tutorial) of angular to create an application **wechat message management application** for managing the wechat messages.

### Component
#### Show Messages List

Add the message list in the file *app.component.html*

```html
<ul class="messages">
  <li *ngFor="let message of messages">
    { { message.text } }
  </li>
</ul>
```

Add the property **messages** in the *AppComponent* class.

```javascript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tiven App';
  messages = [{
    text: 'message 1'
  }, {
    text: 'message 2'
  }];
}
```
Now you can see the message list in the page.

#### Style the messages

Add css styles in file *app.component.css*:

```css
.messages li {
  cursor: pointer;
  position: relative;
  left: 0;
  background-color: #EEE;
  margin: .5em;
  padding: .3em 0;
  height: 1.6em;
  border-radius: 4px;
}
```

#### Handle click events

```javascript
export class AppComponent {
  ...

  selectedMessage: any;

  onSelect(message: any): void {
    this.selectedMessage = message;
  }
}
```

* `onSelect(message: any): void {}`
* `selectedMessage: any;`

```html
<ul class="messages">
  <li *ngFor="let message of messages" (click)="onSelect(message)">
    {{message.text}}
  </li>
</ul>

<div>
  <h2>selected message</h2>
  <div>{{selectedMessage.text}}</div>
</div>
```

* `(click)="onSelect(message)"`
* `<div>{{selectedMessage.text}}</div>`


```html
<div *ngIf="selectedMessage">
</div>
```

### Data Model

Declare the data model type in a independent class:

*message.ts*:

```javascript
export class Message {
  id: number;
  type: string;
  text: string;
}
```

Change the data type declaration in the component class:

```javascript
selectedMessage: Message;

onSelect(message: Message): void {
  this.selectedMessage = message;
}
```

### Services

Split the service logic into a service class:

*message.service.ts*:

```javascript
import { Injectable } from '@angular/core';

import { Message }   from './message';

@Injectable()
export class MessageService {
  getMessages(): Message[] {
    return [
      {
        id: 1,
        type: 'subscribe',
        text: 'message 1'
      }, {
        id: 2,
        type: 'unsubscribe',
        text: 'message 2'
      }
    ];
  }
}
```

* `@Injectable()`

*app.component.ts*:

```javascript
...

import { MessageService }   from './message.service';

@Component({
  ...
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  ...
  messages: Message[];

  constructor(
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
  }

  selectedMessage: Message;

  onSelect(message: Message): void {
    this.selectedMessage = message;
  }
}
```

* `messages: Message[];`
* `providers: [MessageService]`
* `constructor(private messageService: MessageService) {}`
* `ngOnInit(): void {this.messages = this.messageService.getMessages();}`

### HTTP Service

```javascript
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Message }   from './message';

@Injectable()
export class MessageService {

  private messagesUrl = 'http://localhost:6001/api/message';

  constructor(private http: Http) { }

  getMessages(): Promise<Message[]> {
    return this.http.get(this.messagesUrl)
               .toPromise()
               .then(response => response.json() as Message[])
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
```

* `import { Headers, Http } from '@angular/http';`
* `import 'rxjs/add/operator/toPromise';`
* `constructor(private http: Http) { }`
* `getMessages(): Promise<Message[]> {`
* `this.http.get(this.messagesUrl).toPromise().then()`

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

* `import { HttpModule }    from '@angular/http';`
* `imports: [BrowserModule, HttpModule]`

*app.component.ts*:

```javascript
ngOnInit(): void {
  this.messageService.getMessages().then((messages)=> {
    this.messages = messages;
  });
}
```

### Routing

#### Split Message Detail View into a Component

Create file *message-detail.component.ts*:

```javascript
import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Message }        from './message';
import { MessageService } from './message.service';

@Component({
  selector: 'message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: [ './message-detail.component.css' ]
})
export class MessageDetailComponent implements OnInit {
  message: Message;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.messageService.getMessage(+params['id']))
      .subscribe(message => this.message = message);
  }

  goBack(): void {
    this.location.back();
  }
}
```

Create file *message-detail.component.html*:

```html
<div *ngIf="message">
  <h2>{{message.id}} details!</h2>
  <div>
    <label>type: </label>{{message.type}}</div>
  <div>
    <label>text: </label>
    <input [(ngModel)]="message.text" placeholder="text" />
   </div>
  <button (click)="goBack()">Back</button>
</div>
```

Add method **getMessage** in class file *message.service.ts*

```javascript
getMessage(id: number): Promise<Message> {
  const url = `${this.messagesUrl}/${id}`;
  return this.http.get(url)
    .toPromise()
      .then(response => response.json() as Message)
      .catch(this.handleError);;
}
```

#### Add routes in Root Module

```javascript
import { RouterModule, Routes } from '@angular/router';
...
const routes: Routes = [
  { path: 'message/:id',     component: MessageDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MessageDetailComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    ...
  ],
  ...
})
export class AppModule { }
```

* `import { RouterModule, Routes } from '@angular/router';`
* `const routes: Routes = [{ path: 'message/:id',     component: MessageDetailComponent }];`
* `imports: [RouterModule.forRoot(routes)`
* `declarations: [MessageDetailComponent`

Add the router outlet in
```html
<router-outlet></router-outlet>
```

## Serve in Express

`ng build`

copy the files in *dist* into *public* in node.js server project.

## Add UI Library



[angular.io]:https://angular.io/
[MEAN]:https://en.wikipedia.org/wiki/MEAN_(software_bundle)
[MongoDB]:https://en.wikipedia.org/wiki/MongoDB
[Express.js]:https://en.wikipedia.org/wiki/Express.js
[Node.js]:https://nodejs.org/
