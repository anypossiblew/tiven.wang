---
layout: post
theme: XiuKai
series: 
  url: threejs
  title: Three.js
title: Getting Started
excerpt: "Getting started Three.js in Angular Application?"
modified: 2019-07-08T18:00:00-00:00
categories: articles
tags: [Three.js, Angular, JavaScript]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6124.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/kihei-united-states-6124
comments: true
share: true
    
---

* TOC
{:toc}

## What's WebGL

> WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D and 2D graphics within any compatible web browser without the use of plug-ins. WebGL does so by introducing an API that closely conforms to OpenGL ES 2.0 that can be used in HTML5 `<canvas>` elements.<br><br>
-- [WebGL: 2D and 3D graphics for the web](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

WebGL API 是比较 low-level 的, 对于普通开发者来说太过复杂. 所以就有一些 high-level 的 JavaScript 库对 WebGL API 进行了封装, 如  A-Frame (VR), BabylonJS, PlayCanvas, [three.js][threejs], OSG.JS and CopperLicht, X3D.

[图解WebGL&Three.js工作原理](https://www.cnblogs.com/wanbo/p/6754066.html)

本系列我们就来学习一下 [Three.js][threejs] 如何编写程序.

## Setup Three.js in Angular Application

### Generate Angular Application

生成项目

`ng new threejs --createApplication=false --prefix=threejs --style=scss --routing=true`

生成应用程序(in folder `threejs`)

`ng g application starter --inlineStyle=false --inlineTemplate=false --prefix=threejs --style=scss`

启动应用程序

`ng serve starter`

访问链接 *http://localhost:4200/* 成功便是成功.

### Install Three.js Dependecies

安装 [Three.js][npmjs-three] 依赖包

`npm install three --save`

安装 Three.js 相应的 TypeScript 类型声明包作开发时使用

`npm install @types/three --save-dev`

### Hello world

我们打算在 app.component 组件上用 Three.js 画个东西, 所以首先在 *app.component.html* 中添加一个放画布的页签

:point_down:*app.component.html*

```html
<div class="canvas-wrapper">
  <div #rendererCanvas></div>
</div>
```

在 *app.component.ts* 中添加引入 Three.js 库, 并加入 `@ViewChild` 属性指向准备放画布的页签

:point_down:*app.component.ts*

```typescript
import * as THREE from 'three';

...
export class AppComponent {

  @ViewChild('rendererCanvas', {static: false})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

}
```

如下:point_down:完整代码, 成功便可以看到页面出现一个不停转动的正六面体

```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'threejs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('rendererCanvas', {static: false})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  camera;
  renderer;
  mesh;
  scene;

  ngAfterViewInit() {
    this.init();
    this.animate();
  }
  
  init() {
    let geometry, material;

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();
    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh( geometry, material );
    this.scene.add( this.mesh );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.rendererCanvas.nativeElement.appendChild(this.renderer.domElement);
  }

  animate() {
    window.requestAnimationFrame(()=> {
      this.animate();
    });
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    this.renderer.render( this.scene, this.camera );
  }
}
```

## 基本概念

* World 世界坐标系
* Screen 屏幕坐标系
* Local 局部坐标系

* Camera: 起到虚拟三维空间在一定视角上的投影作用, 同一个三维场景在不同的相机上呈现出来的投影不同(这应该很好理解)
* Scene: 场景, 它是一个把所有三维物体包括起来的容器
* Mesh: 
* Geometry: 三维几何对象, 就是物体
* Material: 材质, 就是物体表面看起来又不同质感的皮肤
* Renderer: 展现函数, 最终在这里进行计算展现结果

https://zhuanlan.zhihu.com/p/25595069


https://zhuanlan.zhihu.com/p/35120118

[threejs]:https://threejs.org/
[npmjs-three]:https://www.npmjs.com/package/three