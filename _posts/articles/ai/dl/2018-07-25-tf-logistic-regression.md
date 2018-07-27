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
mathjax: true
references:
  - id: 1
    title: "Tensorflow 交叉熵(Cross Entropy)算法实现及应用"
    url: https://blog.csdn.net/u013250416/article/details/78230464
---

* TOC
{:toc}

## Import library

在进行回归模拟之前需要引入用到的组件包，`numpy` 用来构造模拟数据，`tensorflow` 是使用 TensorFlow 的核心包，`sklearn.metrics`

```python
import numpy as np
np.random.seed(456)
import tensorflow as tf
tf.set_random_seed(456)
from sklearn.metrics import accuracy_score
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

* `tf.squeeze` 从矩阵 shape 中，去掉维度为 1 的。例如一个矩阵是的 shape 是 (5,1)，使用过这个函数后，结果为 (5,)。
* `tf.round` 是元素级别的数学计算
* `tf.sigmoid` 是按元素计算 sigmoid 函数值，函数为 $$y = \frac{1}{1+e^{-x}}$$

TensorFlow 跟矩阵相关的计算都可以参考 [Numpy][numpy] 库

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

* `tf.reduce_sum` 默认加总所有元素，也可以指定某些维度加总
* `tf.nn.sigmoid_cross_entropy_with_logits` 计算输入数据与标签数据之间的交叉熵，他适用于 **二分类** 或者 **多目标** 问题
  * 二分类：将目标分为两类
  * 多目标：例如，判断图片中是否包含10种动物。这10个分类之间是相互独立的，但不是相互排斥的。也就是说，图片中可以包含动物x，也可以包含动物y。对于每一个动物类别而言，其实也是一个二分类问题。与多目标问题不同的是，多分类问题要求这10个分类之间是相互排斥的。

令 $$x = logits, z = labels$$ 其公式推导过程如下

$$
z * -log(sigmoid(x)) + (1 - z) * -log(1 - sigmoid(x)) \\
= z * -log(\frac{1}{1 + e^{-x}}) + (1 - z) * -log(\frac{e^{-x}}{1 + e^{-x}}) \\
= z * log(1 + e^{-x}) + (1 - z) * (-log(e^{-x}) + log(1 + e^{-x})) \\
= z * log(1 + e^{-x}) + (1 - z) * (x + log(1 + e^{-x}) \\
= (1 - z) * x + log(1 + e^{-x}) \\
= x - x * z + log(1 + e^{-x})
$$

当 $$x < 0$$ 的时候，为了避免 $$e^{-x}$$ 溢出，将上述等式改为:

$$
x - x * z + log(1 + e^{-x}) \\
= log(e^{x}) - x * z + log(1 + e^{-x}) \\
= - x * z + log(1 + e^{x})
$$

因此，将 $$x > 0$$ 与 $$x < 0$$ 时的情况统一起来可以得到：

$$ max(x, 0) - x * z + log(1 + e^{-abs(x)}) $$

## Optimizer

适应性动量估计法（Adaptive Moment Estimation）是深度学习[梯度下降](/articles/ml-gradient-descent/)优化器的一种，这里用它 ([tf.train.AdamOptimizer][tf/train/AdamOptimizer]) 来对损失函数进行优化

```python
with tf.name_scope("optim"):
  train_op = tf.train.AdamOptimizer(.01).minimize(l)
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
```

## Running

这里定义 $$1000$$ 步去寻找最优解。初始化一个 TensorFlow Session , 然后循环 $$1000$$ 次重复计算优化器模型和损失函数。其实损失函数不用显式指定计算，这里是为了打印日志用。最后再获取一下会话计算出的最终解 $$W, b$$

```python
n_steps = 1000
with tf.Session() as sess:
  sess.run(tf.global_variables_initializer())
  # Train model
  for i in range(n_steps):
    feed_dict = {x: x_np, y: y_np}
    _, loss = sess.run([train_op, l], feed_dict=feed_dict)
    print("loss: %f" % loss)

  # Get weights
  w_final, b_final = sess.run([W, b])

  # Make Predictions
  y_pred_np = sess.run(y_pred, feed_dict={x: x_np})

score = accuracy_score(y_np, y_pred_np)
print("Classification Accuracy: %f" % score)
```

最后再用我们计算出的最优解去预测一下样本数据，然后跟真实分类标签做一下准确度比较，可以得到结果为 $$1$$ .

[tensorboard]:https://www.tensorflow.org/guide/summaries_and_tensorboard

[numpy]:http://www.numpy.org/

[tf/train/AdamOptimizer]:https://www.tensorflow.org/api_docs/python/tf/train/AdamOptimizer

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
