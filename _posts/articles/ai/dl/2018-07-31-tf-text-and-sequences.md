---
layout: post
theme: IBMPlexSerif
series: 
  url: tensorflow
  title: TensorFlow
title: "Working with Text and Sequences"
excerpt: "Working with Text and Sequences using Recurrent Neural Networks with TensorFlow"
modified: 2018-07-31T11:51:25-04:00
categories: articles
tags: [RNNs, TensorFlow, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6304.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/mauritania-6304
comments: true
share: true
references:
  - id: 1
    title: "Train your first neural network: basic classification"
    url: https://www.tensorflow.org/tutorials/keras/basic_classification
---

* TOC
{:toc}

[Recurrent Neural Networks][wiki/Recurrent_neural_network]

## Embeddings

> An embedding is a relatively low-dimensional space into which you can translate high-dimensional vectors.

[TensorFlow Guide - Embeddings](https://www.tensorflow.org/guide/embedding)

[Crash Course - Embeddings](https://developers.google.com/machine-learning/crash-course/embeddings/video-lecture)

[Principal component analysis (PCA)][wiki/Principal_component_analysis]  is a statistical procedure that uses an orthogonal transformation to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components.

> 在多元统计分析中，主成分分析（ [Principal components analysis, PCA][wiki/Principal_component_analysis] ）是一种分析、简化数据集的技术。主成分分析经常用于减少数据集的维数，同时保持数据集中的对方差贡献最大的特征。这是通过保留低阶主成分，忽略高阶主成分做到的。这样低阶成分往往能够保留住数据的最重要方面。但是，这也不是一定的，要视具体应用而定。由于主成分分析依赖所给数据，所以数据的准确性对分析结果影响很大。

http://colah.github.io/posts/2014-10-Visualizing-MNIST/

https://github.com/rmeertens/Simplest-Tensorflow-Tensorboard-MNIST-Embedding-Visualisation/blob/master/Minimal%20example%20embeddings.ipynb

{% include_relative tensorflow_references.md %}
{% include_relative deep_learning_references.md %}