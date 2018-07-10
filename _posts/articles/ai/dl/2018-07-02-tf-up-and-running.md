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
mathjax: true
---

* TOC
{:toc}

## Installation

### use Docker
对于初学者来说从 Docker Container 启动 TensorFlow 学习环境是个不错(不费力)的选择。镜像为 [tensorflow][docker/tensorflow]

如果直接运行，容器会建立一个 [Jupyter][jupyter] notebook 服务来帮助你学习 python 语言

`docker run --name=my-tensorflow -it -p 8888:8888 tensorflow/tensorflow`

还可以运行 bash 命令行工具，然后运行 python 命令行环境
```
$ docker run --name=my-tensorflow -it tensorflow/tensorflow bash
root@06a6c03e3e74:/notebooks# python
Python 2.7.12 (default, Dec  4 2017, 14:50:18)
[GCC 5.4.0 20160609] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

### on Windows

TensorFlow supports Python 3.5.x and 3.6.x on Windows. Note that Python 3 comes with the pip3 package manager, which is the program you'll use to install TensorFlow.
```
> python --version
Python 3.6.6
```

Install CPU-only version of TensorFlow
```
> pip3 install --upgrade tensorflow
```

To install the GPU version of TensorFlow
```
> pip3 install --upgrade tensorflow-gpu
```

[TensorFlow install on Windows](https://www.tensorflow.org/install/install_windows)

## First Graph
现在就来创建一个最简单的 TensorFlow 图，如下图所示

![](/images/tensorflow/simple-tensorflow.png)
{: .center.middle}

TensorFlow 代码如下
```python
import tensorflow as tf
import numpy as np

a = tf.constant(5)
b = tf.constant(2)
c = tf.constant(3)

d = tf.multiply(a,b)
e = tf.add(c,b)
f = tf.subtract(d,e)

with tf.Session() as sess:
    outs = sess.run(f)

print("outs = {}".format(outs))

# Outputs:
outs = 5
```

如果你使用的环境没有 [Matplotlib][matplotlib] 可以通过下面命令安装
```
pip3 install --upgrade matplotlib
```

### Tensor
张量（英语：[Tensor][wiki/Tensor]）是一个可用来表示在一些矢量、标量和其他张量之间的线性关系的多线性函数, 这些线性关系的基本例子有内积、外积、线性映射以及笛卡儿积.

These are our Tensors
```python
print(tf.constant(1).shape)
print(tf.constant([1,2]).shape)
print(tf.constant([[1],[2]]).shape)
print(tf.constant([[1,2]]).shape)
print(tf.constant(np.array([
    [[1,2],
     [3,4]],

    [[5,6],
     [7,8]]])).get_shape())
# Outputs:
()
(2,)
(2, 1)
(1, 2)
(2, 2, 2)
```

## Regression model
假设我们有这样一个数学模型，其实他是一个多元线性回归函数

$$f(x_i) = w^Tx_i + b$$

$$y_i = f(x_i) + \varepsilon_i$$


```python
x = tf.placeholder(tf.float32,shape=[None,3])
y_true = tf.placeholder(tf.float32,shape=None)
w = tf.Variable([[0,0,0]],dtype=tf.float32,name='weights')
b = tf.Variable(0,dtype=tf.float32,name='bias')

y_pred = tf.matmul(w,tf.transpose(x)) + b
```

### Loss Function


### Optimizer

The gradient descent optimizer

### Sampling methods


```python
import tensorflow as tf
import numpy as np
# === Create data and simulate results =====
x_data = np.random.randn(2000,3)
w_real = [0.3,0.5,0.1]
b_real = -0.2

noise = np.random.randn(1,2000)*0.1
y_data = np.matmul(w_real,x_data.T) + b_real + noise

NUM_STEPS = 10

g = tf.Graph()
wb_ = []
with g.as_default():
    x = tf.placeholder(tf.float32,shape=[None,3])
    y_true = tf.placeholder(tf.float32,shape=None)

    with tf.name_scope('inference') as scope:
        w = tf.Variable([[0,0,0]],dtype=tf.float32,name='weights')
        b = tf.Variable(0,dtype=tf.float32,name='bias')
        y_pred = tf.matmul(w,tf.transpose(x)) + b

    with tf.name_scope('loss') as scope:
        loss = tf.reduce_mean(tf.square(y_true-y_pred))

    with tf.name_scope('train') as scope:
        learning_rate = 0.5
        optimizer = tf.train.GradientDescentOptimizer(learning_rate)
        train = optimizer.minimize(loss)

    # Before starting, initialize the variables.  We will 'run' this first.
    init = tf.global_variables_initializer()
    with tf.Session() as sess:
        sess.run(init)      
        for step in range(NUM_STEPS):
            sess.run(train,{x: x_data, y_true: y_data})
            if (step % 5 == 0):
                print(step, sess.run([w,b]))
                wb_.append(sess.run([w,b]))
        print(10, sess.run([w,b]))
```




[docker/tensorflow]:https://hub.docker.com/r/tensorflow/tensorflow/

[jupyter]:http://jupyter.org/
[numpy]:http://www.numpy.org/
[matplotlib]:https://matplotlib.org

[wiki/Tensor]:https://en.wikipedia.org/wiki/Tensor
[wiki/Loss_function]:https://en.wikipedia.org/wiki/Loss_function
