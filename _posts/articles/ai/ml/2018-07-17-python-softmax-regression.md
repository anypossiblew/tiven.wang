---
layout: post
theme: IBMPlexSerif
title: "Python - Softmax Regression"
excerpt: "Softmax Regression is a logistic regression class for multi-class classification tasks. 用线性模型解决回归任务中的多分类任务"
modified: 2018-07-17T11:51:25-04:00
categories: articles
tags: [Softmax Regression, Linear Model, Regression, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1591.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/dubai-united-arab-emirates-1591
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "UFLDL Tutorial - Softmax Regression"
    url: http://ufldl.stanford.edu/tutorial/supervised/SoftmaxRegression/
---

* TOC
{:toc}

上一篇 [Python - Building A Logistic Regression](/articles/python-building-a-logistic-regression/) 我们介绍了逻辑回归模型，主要针对的是 1 个特征维度的样本 x 分为 2 类的问题，模型函数如下

$$ f(z) = \frac{e^{z}}{1 + e^{z}} = \frac{1}{1+e^{-z}} $$

$$ z = wx + b $$

那么样本特征扩展到 m 个维度，样本类扩展为 k 个的问题怎么解决呐？

首先对于具有 m 个特征的某一个样本数据我们有以下公式，则 $$\mathbf{w}$$ 为样本特征权重系数的数组

$$ z = w_1x_1 + ... + w_mx_m  + b= \sum_{l=1}^{m} w_l x_l + b= \mathbf{w}^T\mathbf{x} + b $$

那么对于它要计算出其在 k 个分类上的概率分布，则假设有 k 个 $$\mathbf{w}$$ 系数组，则其组成一个矩阵

$$
\begin{align}
\begin{bmatrix}
z_1 \\
z_2 \\
\vdots \\
z_k
\end{bmatrix}
=
\begin{bmatrix}
w_{1,1} & w_{1,2} & \cdots & w_{1,m} \\
w_{2,1} & w_{2,2} & \cdots & w_{2,m} \\
\vdots & \vdots & \ddots & \vdots \\
w_{k,1} & w_{k,2} & \cdots & w_{k,m}
\end{bmatrix}
\begin{bmatrix}
x_1 \\
x_2 \\
\vdots \\
x_m
\end{bmatrix}
+ 
b
=
\begin{bmatrix}
w_{1,1} x_1 + w_{1,2} x_2 + \cdots + w_{1,m} x_m + b \\
w_{2,1} x_1 + w_{2,2} x_2 + \cdots + w_{2,m} x_m + b \\
\vdots \\
w_{k,1} x_1 + w_{k,2} x_2 + \cdots + w_{k,m} x_m + b
\end{bmatrix}
\end{align}
$$

最终计算样本在每个分类上的概率，则有以下公式

$$
\begin{align}
h_w(x) =
\begin{bmatrix}
P(y = 1 | x; w) \\
P(y = 2 | x; w) \\
\vdots \\
P(y = k | x; w)
\end{bmatrix}
=
\frac{1}{ \sum_{j=1}^{k}{\exp(z_j) }}
\begin{bmatrix}
\exp(z_1) \\
\exp(z_2) \\
\vdots \\
\exp(z_k) \\
\end{bmatrix}
\end{align}
$$

## Cost Function

结合上一篇讲的交叉熵的概念，对于一个某一个样本的 Cost Function 可以表示如下

$$
\begin{align}
J(w) = - \left[ \sum_{k=1}^{K}  1\left\{y^{(i)} = k\right\} \log \frac{\exp(z_k)}{\sum_{j=1}^K \exp(z_j)}\right]
\end{align}
$$

