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

## Machine Learning

### Loss function

损失函数 ([Loss function][wiki/Loss_function])

#### MSE

[MSE (Mean squared error)][wiki/Mean_squared_error]

### Gradient Descent

梯度下降法 ([Gradient Descent][wiki/Gradient_descent])

### Convex function

凸函数 ([Convex function][wiki/Convex_function])


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
