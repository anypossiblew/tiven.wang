---
layout: post
theme: Merriweather
title: "Deep Learning - Convolutional Neural Networks"
excerpt: "Convolutional Neural Networks with Deep Learning"
modified: 2018-07-11T11:51:25-04:00
categories: articles
tags: [CNN, TensorFlow, Deep Learning, Python]
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

想要深入理解卷积神经网络，就要理解数学里卷积 (Convolution) 的概念，可以参见 [Convolution](/articles/dl-mathematical-foundations/#Convolution)，还可以阅读 [Chris Olah's blog post - Understanding Convolutions][Understanding-Convolutions]

## Filters and Feature Maps

$$m_{ij}^k = f((W * x)_{ij} + b^k)$$

[tf.nn.conv2d][tf/nn/conv2d]

[tf.nn.max_pool][tf/nn/max_pool]

deep convolutional networks

## Building blocks

### Convolutional layer

神经元可以表示为

$$y = \sigma(Wx + b)$$

### Pooling layer
### ReLU layer
### Fully connected layer
### Loss layer

## 词汇

* locally invariant 局部不变
* fractional max pooling 分数最大池

{% include_relative tensorflow_references.md %}
{% include_relative deep_learning_references.md %}
[Understanding-Convolutions]:http://colah.github.io/posts/2014-07-Understanding-Convolutions/