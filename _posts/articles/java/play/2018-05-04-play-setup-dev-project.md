---
layout: post
theme: UbuntuMono
title: "Play Framework: Setup Dev Project"
excerpt: ""
modified: 2018-05-04T11:51:25-04:00
categories: articles
tags: [Play, Reactive, Scala, Java]
image:
  vendor: twitter
  feature: /media/Da_wGJhW4AIaSxO.jpg:large
  credit: National Geographic
  creditlink: https://twitter.com/NatGeoPhotos/status/986270834439393280
comments: true
share: true
---

* TOC
{:toc}

对于初学者来说，通过学习现成完整项目代码进行入门是非常合适的。<br>
下载 [Play Starter Projects](https://www.playframework.com/download) 源代码包或者从 [Github](https://github.com/playframework/play-scala-starter-example) clone 代码。

我们选择 Scala 语言版本的进行学习，前提是安装了 JDK 8 和 sbt （参考 [Scala: Setup Dev Project](/articles/scala-setup-dev-project/)）

下载后进入项目文件夹运行命令 `sbt run` 下载依赖包并编译运行，成功后访问 http://127.0.0.1:9000
