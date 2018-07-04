---
layout: post
theme: UbuntuMono
title: "TensorFlow - Up and Running"
excerpt: "Start our journey with TensorFlow in Docker container"
modified: 2018-07-02T11:51:25-04:00
categories: articles
tags: [TensorFlow, DeepLearning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6311.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/nouadhibou-mauritania-6311
comments: true
share: true
---

* TOC
{:toc}

### use Docker
对于初学者来说从 Docker Container 启动 TensorFlow 学习环境是个不错(不费力)的选择。

镜像为 [tensorflow][docker/tensorflow]

如果直接运行，容器会建立一个 [jupyter][jupyter] 服务来帮助你学习 python 语言

`docker run -it -p 8888:8888 tensorflow/tensorflow`

还可以运行 bash 命令行工具，然后运行 python 命令行环境
```
$ docker run -it --name=my-tensorflow tensorflow/tensorflow bash
root@06a6c03e3e74:/notebooks# python
Python 2.7.12 (default, Dec  4 2017, 14:50:18)
[GCC 5.4.0 20160609] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

### on Windows

```
> python --version
Python 3.6.4
> python -m pip install --upgrade pip
```


```
#@test {"output": "ignore"}
import tensorflow as tf
import numpy as np

# Set up the data with a noisy linear relationship between X and Y.
num_examples = 50
X = np.array([np.linspace(-2, 4, num_examples), np.linspace(-6, 6, num_examples)])
X += np.random.randn(2, num_examples)
x, y = X
bias_with_x = np.array([(1., a) for a in x]).astype(np.float32)

losses = []
training_steps = 50
learning_rate = 0.002

with tf.Session() as sess:
    # Set up all the tensors, variables, and operations.
    input = tf.constant(bias_with_x)
    target = tf.constant(np.transpose([y]).astype(np.float32))
    weights = tf.Variable(tf.random_normal([2, 1], 0, 0.1))

    tf.global_variables_initializer().run()

    yhat = tf.matmul(input, weights)
    yerror = tf.subtract(yhat, target)
    loss = tf.nn.l2_loss(yerror)

    update_weights = tf.train.GradientDescentOptimizer(learning_rate).minimize(loss)

    for _ in range(training_steps):
        # Repeatedly run the operations, updating the TensorFlow variable.
        update_weights.run()
        losses.append(loss.eval())

    # Training is done, get the final values for the graphs
    betas = weights.eval()
    yhat = yhat.eval()
```

```
$ sudo apt install python-pip
$ pip install --upgrade IPython
```


[docker/tensorflow]:https://hub.docker.com/r/tensorflow/tensorflow/

[jupyter]:http://jupyter.org/
[numpy]:http://www.numpy.org/
