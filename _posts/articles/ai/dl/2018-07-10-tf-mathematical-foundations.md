---
layout: post
theme: IBMPlexSerif
title: "TensorFlow - Mathematical Foundations"
excerpt: "The mathematical foundations of TensorFlow"
modified: 2018-07-10T11:51:25-04:00
categories: articles
tags: [TensorFlow, DeepLearning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1068.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/hainan-china-1068
comments: true
share: true
mathjax: true
---

* TOC
{:toc}

[Tensor][wiki/Tensor]: In mathematics, tensors are geometric objects that describe linear relations between geometric vectors, scalars, and other tensors. Elementary examples of such relations include the dot product, the cross product, and linear maps. Geometric vectors, often used in physics and engineering applications, and scalars themselves are also tensors.

In short, tensor is a mathematical term for n-dimensional arrays. For example, a 1×1 tensor is a [scalar][wiki/Scalar], a 1×n tensor is a [vector][wiki/Euclidean_vector], an n×n tensor is a [matrix][wiki/Matrix], and an n×n×n tensor is just a three-dimensional [array][wiki/Array].


[Scalar][wiki/Scalar]

[Vector][wiki/Euclidean_vector]

## Matrix
### 矩阵乘法
矩阵乘法 ([Matrix multiplication][wiki/Matrix_multiplication]) 的结果称为矩阵积 (Matrix product).

矩阵可以用来表示线性映射，矩阵积则可以用来表示线性映射的复合。因此，矩阵乘法是线性代数的基础工具，不仅在数学中有大量应用，在应用数学、物理学、工程学等领域也有广泛使用.

## Statics

### Least Squares

[Least Squares][wiki/Least_squares] 

[zhihu - 最小二乘法](https://www.zhihu.com/topic/19668117/hot)

#### Entropy

* [Cross Entropy][wiki/Cross_entropy]

$$y = xlog(x)$$

![Image: xlogx](/images/tensorflow/desmos-xlogx.png)
{: .center.small}

## Machine Learning

### Loss function

损失函数 ([Loss function][wiki/Loss_function])

* [Cross Entropy][wiki/Cross_entropy]

#### MSE

[MSE (Mean squared error)][wiki/Mean_squared_error]

### Gradient Descent

梯度下降法 ([Gradient Descent][wiki/Gradient_descent])

### Convex function

凸函数 ([Convex function][wiki/Convex_function])

## Calculus

[Calculus][wiki/Calculus]

## Derivative

导数（英语：[Derivative][wiki/Derivative]）是微积分学中重要的基础概念。一个函数在某一点的导数描述了这个函数在这一点附近的变化率。导数的本质是通过极限的概念对函数进行局部的线性逼近。当函数 {\displaystyle f} f的自变量在一点 {\displaystyle x_{0}} x_{0}上产生一个增量 {\displaystyle h} h时，函数输出值的增量与自变量增量 {\displaystyle h} h的比值在 {\displaystyle h} h趋于0时的极限如果存在，即为 {\displaystyle f} f在 {\displaystyle x_{0}} x_{0}处的导数，记作 {\displaystyle f'(x_{0})}


[wiki/Tensor]:https://en.wikipedia.org/wiki/Tensor
[wiki/Scalar]:https://en.wikipedia.org/wiki/Scalar_(mathematics)
[wiki/Euclidean_vector]:https://en.wikipedia.org/wiki/Euclidean_vector
[wiki/Matrix]:https://en.wikipedia.org/wiki/Matrix_(mathematics)
[wiki/Array]:https://en.wikipedia.org/wiki/Array
[wiki/Matrix_multiplication]:https://en.wikipedia.org/wiki/Matrix_multiplication
[wiki/Loss_function]:https://en.wikipedia.org/wiki/Loss_function
[wiki/Mean_squared_error]:https://en.wikipedia.org/wiki/Mean_squared_error
[wiki/Convex_function]:https://en.wikipedia.org/wiki/Convex_function
[wiki/Gradient_descent]:https://en.wikipedia.org/wiki/Gradient_descent
[wiki/Least_squares]:https://en.wikipedia.org/wiki/Least_squares
[wiki/Cross_entropy]:https://en.wikipedia.org/wiki/Cross_entropy
[wiki/Calculus]:https://en.wikipedia.org/wiki/Calculus
[wiki/Derivative]:https://en.wikipedia.org/wiki/Derivative