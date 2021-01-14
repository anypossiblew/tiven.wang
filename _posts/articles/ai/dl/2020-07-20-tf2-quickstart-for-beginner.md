---
layout: post
theme: IBMPlexSerif
series: 
  url: tensorflow2
  title: TensorFlow 2
title: "quickstart for beginners"
excerpt: "Start our journey with TensorFlow"
modified: 2020-03-18T11:51:25-04:00
categories: articles
tags: [TensorFlow, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6311.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/nouadhibou-mauritania-6311
comments: true
share: true
mathjax: true
---

* TOC
{:toc}

This short introduction uses `Keras` to:

下面是一个完整的数字图片识别的程序

```python
import tensorflow as tf

mnist = tf.keras.datasets.mnist

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

print(x_test.shape)

model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28)),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10)
])

loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)

model.compile(optimizer='adam',
              loss=loss_fn,
              metrics=['accuracy'])
model.fit(x_train, y_train, epochs=5)

probability_model = tf.keras.Sequential([
  model,
  tf.keras.layers.Softmax()
])

probability_model(x_test[:5])
```

对我来说重点是理解 [The Sequential model](https://www.tensorflow.org/guide/keras/sequential_model) 是干什么的?

[layers.Dense]()

https://keras.io/zh/getting-started/sequential-model-guide/

