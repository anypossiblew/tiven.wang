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

[NumPy][numpy] 提供了与 MATLAB 相似的功能与操作方式，因为两者皆为解释型语言，并且都可以让用户在针对数组或矩阵运算时提供较标量运算更快的性能。两者相较之下，MATLAB 提供了大量的扩充工具箱(例如 Simulink )；而 NumPy 则是根基于 Python 这个更现代、完整并且开放源代码的编程语言之上。此外 NumPy 也可以结合其它的 Python 扩充库。例如 [SciPy][scipy] ，这个库提供了更多与 MATLAB 相似的功能；以及 Matplotlib ，这是一个与 MATLAB 内置绘图功能类似的库。而从本质上来说，NumPy 与 MATLAB 同样是利用 BLAS 与 LAPACK 来提供高效率的线性代数运算。

### 安装 NumPy 软件包

如果是 python 3 版本的
```
$ docker run -it --rm python:3 bash
root@e7c9f83cdaa9:/# pip3 install -U numpy
Collecting numpy
  Downloading https://files.pythonhosted.org/packages/3f/e7/7f24ef402a5766c677683e313c5595137d754cb9eb1c99627803280e79d5/numpy-1.14.5-cp37-cp37m-manylinux1_x86_64.whl (12.2MB)
    100% |████████████████████████████████| 12.2MB 23kB/s
Installing collected packages: numpy
Successfully installed numpy-1.14.5
root@e7c9f83cdaa9:/# python3
Python 3.7.0 (default, Jul  4 2018, 02:21:01)
[GCC 6.3.0 20170516] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import numpy as np
>>> print(np.array)
<built-in function array>
```

如果是 python 2 版本的
```
$ docker run -it --rm python:2 bash
root@5120f5290b88:/# pip install -U numpy
Collecting numpy
  Downloading https://files.pythonhosted.org/packages/6a/a9/c01a2d5f7b045f508c8cefef3b079fe8c413d05498ca0ae877cffa230564/numpy-1.14.5-cp27-cp27mu-manylinux1_x86_64.whl (12.1MB)
    100% |████████████████████████████████| 12.1MB 76kB/s
Installing collected packages: numpy
Successfully installed numpy-1.14.5
root@5120f5290b88:/# python
Python 2.7.15 (default, Jun 27 2018, 08:49:14)
[GCC 6.3.0 20170516] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import numpy as np
>>> print(np.array)
<built-in function array>
```

鉴于 Docker 容器随时可能被丢弃，所以最好的办法是创建自定义镜像。

*Dockerfile*
```
FROM python:3
RUN pip3 install -U numpy
```
然后构建自己的镜像
`docker build -t py3-data-science .`

有人基于 alpine linux 系统做的镜像，此镜像除了 numpy 包我们还安装了另外的一些 python 的数据科学软件，以后用到的时候再介绍。如下

*Dockerfile*
```
# Below are the dependencies required for installing the common combination of numpy, scipy, pandas and matplotlib
# in an Alpine based Docker image.
FROM alpine:3.7
RUN echo "http://dl-8.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN apk --no-cache --update-cache add gcc gfortran python python-dev py-pip build-base wget freetype-dev libpng-dev openblas-dev
RUN ln -s /usr/include/locale.h /usr/include/xlocale.h
RUN pip install --no-cache-dir numpy scipy pandas matplotlib
```

## Matrix

什么是矩阵

### Array

矩阵在 python 如何表达

### 矩阵运算

同维度矩阵的加减乘除比较，不同维度矩阵的加减乘除比较

### 矩阵操作

转置，对角线，行列式



[numpy]:http://www.numpy.org/
[scipy]:https://www.scipy.org/
