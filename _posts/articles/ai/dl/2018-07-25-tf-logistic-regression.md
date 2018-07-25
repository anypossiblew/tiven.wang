---
layout: post
theme: IBMPlexSerif
title: "TensorFlow - Logistic Regression"
excerpt: "Logistic Regression with TensorFlow. A logistic regression learning algorithm example using TensorFlow library."
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

## Import library

在进行回归模拟之前需要引入用到的组件包，`numpy` 用来构造模拟数据，`tensorflow` 是使用 TensorFlow 的核心包，`matplotlib.pyplot` 用来输出图形便于直观感受数据模型，`sklearn.metrics` `scipy.special`

```python
import numpy as np
np.random.seed(456)
import tensorflow as tf
tf.set_random_seed(456)
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score
from scipy.special import logit
```

[`np.random.seed`](https://stackoverflow.com/questions/21494489/what-does-numpy-random-seed0-do) 和 [`tf.set_random_seed`](https://www.tensorflow.org/api_guides/python/constant_op#Random_Tensors) 是让多次执行产生的随机数组相同。

## TensorFlow variables

`tf.placeholder` 创建需要喂数据（ feed_dict ）的变量（样本数据），`tf.Variable` 创建需要学习的变量（ Learnable parameters ）

```python
# Generate tensorflow graph
with tf.name_scope("placeholders"):
  x = tf.placeholder(tf.float32, (N, 2))
  y = tf.placeholder(tf.float32, (N,))
with tf.name_scope("weights"):
  W = tf.Variable(tf.random_normal((2, 1)))
  b = tf.Variable(tf.random_normal((1,)))
```

## Model

$$f(x) = Wx + b$$

`tf.squeeze` `tf.sigmoid` `tf.round`

```python
with tf.name_scope("prediction"):
  y_logit = tf.squeeze(tf.matmul(x, W) + b)
  # the sigmoid gives the class probability of 1
  y_one_prob = tf.sigmoid(y_logit)
  # Rounding P(y=1) will give the correct prediction.
  y_pred = tf.round(y_one_prob)
```

## Loss function

```python
with tf.name_scope("loss"):
  # Compute the cross-entropy term for each datapoint
  entropy = tf.nn.sigmoid_cross_entropy_with_logits(logits=y_logit, labels=y)
  # Sum all contributions
  l = tf.reduce_sum(entropy)
```

## Optimizer

```python
with tf.name_scope("optim"):
  train_op = tf.train.AdamOptimizer(.01).minimize(l)

with tf.name_scope("summaries"):
  tf.summary.scalar("loss", l)
  merged = tf.summary.merge_all()

train_writer = tf.summary.FileWriter('/tmp/logistic-train', tf.get_default_graph())
```

## Sample Data

```python
# Generate synthetic data
N = 100
# Zeros form a Gaussian centered at (-1, -1)
x_zeros = np.random.multivariate_normal(
    mean=np.array((-1, -1)), cov=.1*np.eye(2), size=(N//2,))
y_zeros = np.zeros((N//2,))
# Ones form a Gaussian centered at (1, 1)
x_ones = np.random.multivariate_normal(
    mean=np.array((1, 1)), cov=.1*np.eye(2), size=(N//2,))
y_ones = np.ones((N//2,))

x_np = np.vstack([x_zeros, x_ones])
y_np = np.concatenate([y_zeros, y_ones])

# Save image of the data distribution
plt.xlabel(r"$x_1$")
plt.ylabel(r"$x_2$")
plt.title("Toy Logistic Regression Data")

# Plot Zeros
plt.scatter(x_zeros[:, 0], x_zeros[:, 1], color="blue")
plt.scatter(x_ones[:, 0], x_ones[:, 1], color="red")
plt.savefig("logistic_data.png")
```

## Running

```python
n_steps = 1000
with tf.Session() as sess:
  sess.run(tf.global_variables_initializer())
  # Train model
  for i in range(n_steps):
    feed_dict = {x: x_np, y: y_np}
    _, summary, loss = sess.run([train_op, merged, l], feed_dict=feed_dict)
    print("loss: %f" % loss)
    train_writer.add_summary(summary, i)

  # Get weights
  w_final, b_final = sess.run([W, b])

  # Make Predictions
  y_pred_np = sess.run(y_pred, feed_dict={x: x_np})
```


[tensorboard]:https://www.tensorflow.org/guide/summaries_and_tensorboard

[wiki/Tensor]:https://en.wikipedia.org/wiki/Tensor
[wiki/Scalar]:https://en.wikipedia.org/wiki/Scalar_(mathematics)
[wiki/Euclidean_vector]:https://en.wikipedia.org/wiki/Euclidean_vector
[wiki/Matrix]:https://en.wikipedia.org/wiki/Matrix_(mathematics)
[wiki/Array]:https://en.wikipedia.org/wiki/Array
[wiki/Matrix_multiplication]:https://en.wikipedia.org/wiki/Matrix_multiplication
[wiki/Loss_function]:https://en.wikipedia.org/wiki/Loss_function
[wiki/Mean_squared_error]:https://en.wikipedia.org/wiki/Mean_squared_error
[wiki/Convex_function]:https://en.wikipedia.org/wiki/Convex_function

[wiki/CNN]:https://en.wikipedia.org/wiki/Convolutional_neural_network
