---
layout: post
theme: IBMPlexSerif
series: 
  url: tensorflow
  title: TensorFlow
title: "Time Series Forecasting with Convolutional Neural Networks"
excerpt: "Time Series Forecasting with Convolutional Neural Networks"
modified: 2018-08-04T11:51:25-04:00
categories: articles
tags: [TensorBoard, Nerual Networks, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6043.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/kabupaten-aceh-utara-indonesia-6043
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

对于波形 $$\mathbf{x}=\{x_1,\dots,x_T\}$$ 的 joint probability (联合概率)可分解为 product of conditional probabilities (条件概率乘积)，如下:

$$\displaystyle p(\mathbf{x})=\prod_{t=1}^Tp(x_t|x_1,\dots,x_{t-1})$$

causal convolution / masked convolution

https://jeddy92.github.io/JEddy92.github.io/ts_seq2seq_conv/

https://github.com/JEddy92/TimeSeries_Seq2Seq/blob/master/notebooks/TS_Seq2Seq_Conv_Intro.ipynb

[Conditional probability distribution][wiki/Conditional_probability_distribution]

[Convolution](/articles/dl-mathematical-foundations/#Convolution)

https://deepmind.com/blog/wavenet-generative-model-raw-audio/

https://arxiv.org/pdf/1806.02199.pdf

Deep Self-Organization: Interpretable Discrete Representation Learning on Time Series

PixelCNN http://sergeiturukin.com/2017/02/22/pixelcnn.html

Auto-Regressive Generative Models (PixelRNN, PixelCNN++) https://towardsdatascience.com/auto-regressive-generative-models-pixelrnn-pixelcnn-32d192911173

https://towardsdatascience.com/3-facts-about-time-series-forecasting-that-surprise-experienced-machine-learning-practitioners-69c18ee89387

{% include_relative deep_learning_references.md %}