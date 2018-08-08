---
layout: post
theme: IBMPlexSerif
series: 
  url: tensorflow
  title: TensorFlow
title: "Cookbook"
excerpt: "Cookbook for TensorFlow"
modified: 2018-07-25T11:51:25-04:00
categories: articles
tags: [TensorFlow, Cookbook, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1629.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/mount-ney-australia-1629
comments: true
share: true
---

* TOC
{:toc}

## TensorBoard

使用 Docker 容器运行
```
$ docker run -v //c/pathto/tf_logs:/tf_logs  
-p 0.0.0.0:6006:6006 -it tensorflow/tensorflow bash
root@73954ccec665:/notebooks# cd ..
root@73954ccec665:/# tensorboard --logdir tf_logs/
```

直接运行，只需要指定日志目录

```python
tensorboard --logdir=./logs
```

## Keras

[Keras][keras.io] is a high-level neural networks API, written in Python and capable of running on top of TensorFlow, CNTK, or Theano. It was developed with a focus on enabling fast experimentation. *Being able to go from idea to result with the least possible delay is key to doing good research.*

https://medium.com/implodinggradients/tensorflow-or-keras-which-one-should-i-learn-5dd7fa3f9ca0

{% include_relative deep_learning_references.md %}
{% include_relative tensorflow_references.md %}