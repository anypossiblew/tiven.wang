---
layout: post
theme: XiXiuTi
series: 
  url: angular
  title: Angular
title: Reactive Forms
excerpt: ""
modified: 2018-03-26T18:00:00-00:00
categories: articles
tags: [Reactive, Observable, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DYl7ulJX0AA2r2y.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/975446838034817024
comments: true
share: true
references:
  - id: 1
    title: "Angular guide - HttpClient"
    url: "https://angular.io/guide/http"

---

* TOC
{:toc}

> Angular reactive forms facilitate a **reactive style** of programming that favors explicit management of the data flowing between a non-UI **data model** (typically retrieved from a server) and a UI-oriented **form model** that retains the states and values of the HTML controls on screen. Reactive forms offer the ease of using reactive patterns, testing, and validation.
>
> The component must copy the hero values in the data model into the form model. There are two important implications:
* The developer must understand how the properties of the data model map to the properties of the form model.
* User changes flow from the DOM elements to the form model, not to the data model.
> The form controls never update the data model.

## Import Reactive Forms Module

Registering the reactive forms module

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // other imports ...
    ReactiveFormsModule
  ],
})
export class AppModule { }
```

// TODO
