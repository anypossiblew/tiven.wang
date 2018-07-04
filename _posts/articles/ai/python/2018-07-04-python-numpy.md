---
layout: post
theme: UbuntuMono
title: "Python - NumPy"
excerpt: "NumPy"
modified: 2018-07-04T11:51:25-04:00
categories: articles
tags: [Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5689.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/pyin-hpyu-gyi-republic-of-the-union-of-myanmar-5689
comments: true
share: true
references:
  - id: 1
    title: "NumPy Cheat Sheet"
    url: https://www.dataquest.io/blog/numpy-cheat-sheet/
---

<style>
.blog__post .mdl-card__media.mdl-color-text--grey-50 {
  background-blend-mode: difference;
}
</style>

* TOC
{:toc}

[NumPy][numpy] 提供了与 MATLAB 相似的功能与操作方式，因为两者皆为解释型语言，并且都可以让用户在针对数组或矩阵运算时提供较标量运算更快的性能。两者相较之下，MATLAB 提供了大量的扩充工具箱(例如 Simulink )；而 NumPy 则是根基于 Python 这个更现代、完整并且开放源代码的编程语言之上。此外 NumPy 也可以结合其它的 Python 扩充库。例如 SciPy ，这个库提供了更多与 MATLAB 相似的功能；以及 Matplotlib ，这是一个与 MATLAB 内置绘图功能类似的库。而从本质上来说，NumPy 与 MATLAB 同样是利用 BLAS 与 LAPACK 来提供高效率的线性代数运算。

```
$ docker run -it --rm --name my-python3 python:3 bash
```


[numpy]:http://www.numpy.org/
