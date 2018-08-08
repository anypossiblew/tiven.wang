---
layout: post
theme: Merriweather
title: "Deep Learning - Mathematical Foundations"
excerpt: "The mathematical foundations of Deep Learning"
modified: 2018-07-10T11:51:25-04:00
categories: articles
tags: [TensorFlow, Deep Learning, Python]
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

## Linear Algebra

* [Scalars][wiki/Scalar]
* [Vectors][wiki/Euclidean_vector]
* Matrices
* Tensors
* Hyperplanes

关于线性代数非常直观的讲解可以观看 [YouTube - 3Blue1Brown - Essence of linear algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)

<iframe width="560" height="315" src="https://www.youtube.com/embed/fNk_zzaMoSs" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Matrix

#### 矩阵乘法

* Dot product
* Element-wise product
* Outer product

矩阵乘法 ([Matrix multiplication][wiki/Matrix_multiplication]) 的结果称为矩阵积 (Matrix product).

矩阵可以用来表示线性映射，矩阵积则可以用来表示线性映射的复合。因此，矩阵乘法是线性代数的基础工具，不仅在数学中有大量应用，在应用数学、物理学、工程学等领域也有广泛使用.

#### Linear Dependence and Span

* linear dependence 线性相关
* linearly independent 线性无关
* linear combination 线性组合
* span 生成子空间
* singular square 奇异方阵
* matrix inversion 矩阵逆

#### Special Kinds of Matrices and Vectors

* [diagonal matrix][wiki/Diagonal_matrix] 对角矩阵
* symmetric matrix 对称矩阵
* unit vector 单位向量
* unit norm 单位范数
* orthogonal matrix 正交矩阵

### Norms 范数

向量的大小成为范数 (Norm), $$L^p$$ 的范数定义如下

$$
\displaystyle 
\|x\|_p=(\sum_{i}|x_i|^p)^\frac{1}{p}
$$

最大范数 (max norm) 定义为

$$
\displaystyle 
\|x\|_{\infty}=\max_{i}|x_i|
$$

衡量矩阵的大小可以用 Frobenius 范数 (Frobenius norm):

$$
\displaystyle 
\|A\|_F=\sqrt{\sum_{i,j}A_{i,j}^2}
$$

#### Eigendecomposition 特征分解

* eigenvector 特征向量
* positive definite 正定
* positive semidefinite 半正定
* negative definite 负定
* negative semidefinite 半负定

线性代码应用实例：主成分分析 ([principal components analysis, PCA][wiki/Principal_component_analysis])

### Tensors

[Tensor][wiki/Tensor]: In mathematics, tensors are geometric objects that describe linear relations between geometric vectors, scalars, and other tensors. Elementary examples of such relations include the dot product, the cross product, and linear maps. Geometric vectors, often used in physics and engineering applications, and scalars themselves are also tensors.

In short, tensor is a mathematical term for n-dimensional arrays. For example, a 1×1 tensor is a [scalar][wiki/Scalar], a 1×n tensor is a [vector][wiki/Euclidean_vector], an n×n tensor is a [matrix][wiki/Matrix], and an n×n×n tensor is just a three-dimensional [array][wiki/Array].

## Statistics

* Probabilities
* Distributions
* [Likelihood][wiki/Likelihood] 似然

[Bayesian probability][wiki/Bayesian_probability] (贝叶斯概率) 是由 [Bayes' theorem][wiki/Bayes_theorem] (贝叶斯理论) 所提供的一种对概率的解释，它采用将概率定义为某人对一个命题信任的程度的概念。贝叶斯理论同时也建议贝叶斯定理可以用作根据新的信息导出或者更新现有的置信度的规则。

### Random Variables

On its own, a **random variable** is just a description of the states that are possible; it
must be coupled with a [probability distribution](#probability-distributions) that specifies how likely each of these states are.

### Probability distributions

At a high level, probabiity distributions provide a mathematical trick that allows you to relax a discrete set of choices into a continuum.

* [Probability mass function, PMF][wiki/Probability_mass_function] 概率质量函数用来描述离散型随机变量的概率的函数，它代表的是变量在某个取值上的概率。
* [Probability density function, PDF][wiki/Probability_density_function] 概率密度函数用来描述连续型随机变量的概率的函数，它代表的是变量在某个取值上的概率密度，要说概率只能是变量在某个区间上的概率，要通过 PDF 在此区间求积分得到此概率。
* [Joint probability distribution][wiki/Joint_probability_distribution] 联合概率分布是对多个随机变量如两个随机变量 $$X$$ 和 $$Y$$ 的概率分布。
* [Marginal probability distribution][wiki/Marginal_distribution] 边缘概率分布是指对于多个变量的联合分布，其中一部分变量（子集）的概率分布。要通过对此子集外的变量函数求和或者积分来计算得到。
* [Conditional probability distribution][wiki/Conditional_probability_distribution] 条件概率分布是指对于多个变量的联合分布，如果指定一部分变量的值的情况下，变量剩下的部分（子集）的概率分布。
* 条件概率的链式法则或者乘法法则，即任何多维随机变量的联合概率分布，都可以分解成只有一个变量的条件概率相乘的形式:<br>
  $$P(x^{(1)},\dots,x^{(n)})=P(x^{(1)})\prod_{i=2}^nP(x^{(i)}|x^{(1)},\dots,x^{(i-1)})$$
* 直觉上是指一次实验中一事件的发生不会影响到另一事件发生的概率，那么称为两个事件的随机变量是独立 (independent) 的，记作$$x \bot y$$。[Conditional independence][wiki/Conditional_independence] (条件独立)是指在给定随机变量 $$z$$ 时两个随机变量$$x$$和$$y$$是独立的，记作
  $$x \bot y|z$$。

#### Bernoulli distribution



### Least Squares

[Least Squares][wiki/Least_squares] 

[zhihu - 最小二乘法](https://www.zhihu.com/topic/19668117/hot)

### Entropy

$$y = xlog(x)$$

![Image: xlogx](/images/tensorflow/desmos-xlogx.png)
{: .center.small}

[Cross-entropy][wiki/Cross_entropy] is a mathematical method for gauging the distance between two probability distributions: Here $$p$$ and $$q$$ are two probability distributions. the notation $$p(x)$$ denotes the probability $$p$$ accords to event $$x$$. Like the $$L2$$ norm, $$H$$ provides a notion of distance. Note that in the case where $$p = q$$ , this quantity is the entropy of $$p$$ and is usually written simply $$H(p)$$. It's a measure of how disorderd the distribution is; The entropy is maximized when all events are equally likely. $$H(p)$$ is always less than or equal to $$H(p, q)$$. In fact, the "further away" distribution $$q$$ is from $$p$$, the larger the cross-entropy gets.

$$H(p,q) = -\sum_x p(x)log(q(x))$$

As an aside, note that unlike $$L2$$ norm, $$H$$ is asymmetric.

### Convolution

[Convolution][wiki/Convolution] 定义

$$(f\ast g)(c) = \sum_a f(a) \cdot g(c-a)$$

[Convolution of probability distributions][wiki/Convolution_of_probability_distributions]

## Calculus

[Calculus][wiki/Calculus]

### Derivative

导数（英语：[Derivative][wiki/Derivative]）是微积分学中重要的基础概念。一个函数在某一点的导数描述了这个函数在这一点附近的变化率。导数的本质是通过极限的概念对函数进行局部的线性逼近。当函数 $$f$$ 的自变量在一点 $$x_0$$ 上产生一个增量 $$h$$ 时，函数输出值的增量与自变量增量 $$h$$ 的比值在 $$h$$ 趋于 0 时的极限如果存在，即为 $$f$$ 在 $$x_{0}$$ 处的导数，记作 $$f'(x_{0})$$ 或 $$\frac{\mathrm{d}f}{\mathrm{d}x}(x_{0})$$ 或 $$\left.\frac{\mathrm{d}f}{\mathrm{d}x}\right\| _{x=x_0}$$ 导函数公式定义为

$$
\displaystyle
f'(x_{0})
= \lim_{\Delta x \to 0}\frac{\Delta x}{\Delta y}
= \lim_{\Delta x \to 0}\frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}
$$

#### Partial derivative

偏导数 ([Partial derivative][wiki/Partial_derivative]) 定义为

$$
\displaystyle
\frac{∂}{∂x_j}f(x_0,x_1,\cdots,x_n) = \lim_{\Delta x \to 0}\frac{\Delta y}{\Delta x} = \lim_{\Delta x \to 0}\frac{f(x_0,x_1,\cdots,x_n)-f(x_0,x_1,\cdots,x_n)}{\Delta x}
$$

#### Directional derivative

方向导数 ([Directional derivative][wiki/Directional_derivative]) 定义为

$$
\displaystyle
\frac{∂}{∂l}f(x_0,x_1,\cdots,x_n) = \lim_{\rho \to 0}\frac{\Delta y}{\Delta x} = \lim_{\rho \to 0}\frac{f(x_0+\Delta x_0,x_1+\Delta x_1,\cdots,x_n+\Delta x_n)-f(x_0,x_1,\cdots,x_n)}{\rho} \\
\rho = \sqrt{(\Delta x_0)^2+(\Delta x_1)^2+\cdots+(\Delta x_n)^2}
$$

## Machine Learning

At a very high level, machine learning is simply the act of function minimization: learning algorithms are nothing more than minima finders for suitably defined functions.

### Loss function

损失函数 ([Loss function][wiki/Loss_function])

All of machine learning, and much of artificial intelligence, boils down to the creation of the right loss function to solve the problem at hand.

* [Cross Entropy][wiki/Cross_entropy]

#### MSE

L1 L2 loss functions

[MSE (Mean squared error)][wiki/Mean_squared_error]

[Why Mean Squared Error and L2 regularization? A probabilistic justification](http://aoliver.org/why-mse)

### Gradient Descent

梯度下降法 ([Gradient Descent][wiki/Gradient_descent])

### Classification and regression

Machine learning algorithms can be broadly categorized as supervised or unsupervised problems. Supervised problems are those for which both datapoints $$x$$ and labels $$y$$ are available, while unsupervised problems have only datapoints $$x$$ without labels $$y$$.

Supervised machine learning can be broken up into the two subproblems of classification and regression.

### Convex function

凸函数 ([Convex function][wiki/Convex_function])

## 专业词汇

* approximation
* continuous function approximation
* numerical 数值
* numerical analysis 数值分析

{% include_relative deep_learning_references.md %}