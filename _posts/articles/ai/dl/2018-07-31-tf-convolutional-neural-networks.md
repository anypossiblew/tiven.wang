---
layout: post
theme: IBMPlexSerif
title: "TensorFlow - Convolutional Neural Networks"
excerpt: "Convolutional Neural Networks with TensorFlow"
modified: 2018-07-11T11:51:25-04:00
categories: articles
tags: [CNN, TensorFlow, DeepLearning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5253.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/rosamond-united-states-5253
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "CS231n Convolutional Neural Networks for Visual Recognition"
    url: http://cs231n.github.io/convolutional-networks/
  - id: 2
    title: "Towards Data Science - Cutting-Edge Face Recognition is Complicated. These Spreadsheets Make it Easier."
    url: https://towardsdatascience.com/cutting-edge-face-recognition-is-complicated-these-spreadsheets-make-it-easier-e7864dbf0e1a
---

* TOC
{:toc}

## Filters and Feature Maps

$$m_{ij}^k = f((W * x)_{ij} + b^k)$$

[tf.nn.conv2d][tf/nn/conv2d]

[tf.nn.max_pool][tf/nn/max_pool]

deep convolutional networks

## Building blocks

### Convolutional layer
### Pooling layer
### ReLU layer
### Fully connected layer
### Loss layer

## 词汇

* locally invariant 局部不变
* fractional max pooling 分数最大池

{% include_relative tensorflow_references.md %}
{% include_relative deep_learning_references.md %}