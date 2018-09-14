---
layout: post
theme: IBMPlexSerif
series: 
  url: tensorflow
  title: TensorFlow
title: "TensorBoard"
excerpt: "TensorBoard for Nerual Networks"
modified: 2018-08-01T11:51:25-04:00
categories: articles
tags: [TensorBoard, Nerual Networks, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5957.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/loccota-australia-5957
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "Edward - Tensorboard"
    url: http://edwardlib.org/tutorials/tensorboard
---

* TOC
{:toc}

我们先来直观感受一下 TensorFlow 计算图功能的强大

![graph visualization animation](https://www.tensorflow.org/images/graph_vis_animation.gif?hl=zh-cn)

查看计算图先要运行 TensorBoard 使用以下命令（或者 `python -m tensorboard.main`）

`tensorboard --logdir=path/to/log-directory`

其中，logdir 指向 FileWriter 将数据序列化的目录。如果此 logdir 目录下有子目录，而子目录包含基于各个运行的序列化数据，则 TensorBoard 会将所有这些运行涉及的数据都可视化。TensorBoard 运行后，请在您的网络浏览器中转到 localhost:6006 以查看 TensorBoard。

## 标量

TensorBoard 的标量功能是展示记录的某个标量相对于某个变量（如step, relative, wall）的变化。它可以用来记录一个单独的标量的变化，也可以是向量的最大值，最小值，标准差等最终仍然是标量的值。像下面一样添加一个标量记录

```python
tf.summary.scalar('max', tf.reduce_max(var))
```

## Histogram

Histogram（直方图）是表示给定向量里元素的密度分布，它可以被看成是一个密度函数。像下面一样添加一个向量的直方图记录

```python
tf.summary.histogram('histogram', var)
```

https://www.tensorflow.org/guide/tensorboard_histograms

### Distributed

## Graphs