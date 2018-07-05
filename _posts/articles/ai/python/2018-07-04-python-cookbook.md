---
layout: post
theme: UbuntuMono
title: "Python - Cookbook"
excerpt: "Cookbook for Python"
modified: 2018-07-04T11:51:25-04:00
categories: articles
tags: [Python, Cookbook]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6301.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/mauritania-6301
comments: true
share: true
references:
  - id: 1
    title: "NumPy Cheat Sheet"
    url: https://www.dataquest.io/blog/numpy-cheat-sheet/
---

* TOC
{:toc}

> 因为 python 3 语言变化比较大，和 python 基本不兼容，所以在说 python 都会指明是 3 还是 2 版本的

### Run in Docker
镜像 [`docker pull python`][docker/python]

```
$ docker run -it --rm python:3 bash
root@e7c9f83cdaa9:/# python3
Python 3.7.0 (default, Jul  4 2018, 02:21:01)
[GCC 6.3.0 20170516] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

[docker/python]:https://hub.docker.com/_/python/

## IDE
### VSCode
#### Debugging
