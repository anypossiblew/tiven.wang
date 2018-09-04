---
layout: post
theme: Merriweather
series: 
  url: deep-learning
  title: Deep Learning
title: "Backpropagation"
excerpt: "Backpropagation for Deep Learning"
modified: 2018-09-04T11:51:25-04:00
categories: articles
tags: [Backpropagation, Nerual Networks, Deep Learning]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1568.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/al-jowf-saudi-arabia-1568
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "CS231n Convolutional Neural Networks for Visual Recognition"
    url: http://cs231n.github.io/convolutional-networks/
---

* TOC
{:toc}

当我们使用前馈神经网络接收输入 $$\boldsymbol{x}$$ 并产生输出 $$\hat{\boldsymbol{y}}$$ 时，信息通过网络向前流动。输入 $$\boldsymbol{x}$$ 提供初始信息，然后传播到每一层的隐藏单元，最终产生输出 $$\hat{\boldsymbol{y}}$$ 。这称之为 向前传播 (forward propagation)。在训练过程中，向前传播可以持续向前直到它产生一个标量代价函数 $$J(\boldsymbol{\theta})$$ 。 **反向传播** (back propagation) 算法允许来自代价函数的信息通过网络向后流动，以便计算梯度。

计算梯度的解析表达式是很直观的，但是数值化地求解这样的表达式在计算上的代价可能很大。反向传播算法使用简单和廉价的程序来实现这个目标。

反向传播仅指用于计算梯度的方法，而另一种算法，例如随机梯度下降，使用该梯度进行学习。

[Calculus on Computational Graphs: Backpropagation](http://colah.github.io/posts/2015-08-Backprop/)

[Backpropagation][wiki/Backpropagation]

http://www.deepideas.net/deep-learning-from-scratch-i-computational-graphs/

{% include_relative deep_learning_references.md %}