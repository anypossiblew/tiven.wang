---
layout: post
theme: IBMPlexSerif
title: "Gradient Descent"
excerpt: "梯度下降法 是一个一阶最优化算法，通常也称为最速下降法。 要使用梯度下降法找到一个函数的局部极小值，必须向函数上当前点对应梯度（或者是近似梯度）的反方向的规定步长距离点进行迭代搜索。如果相反地向梯度正方向迭代进行搜索，则会接近函数的局部极大值点；这个过程则被称为梯度上升法。"
modified: 2018-07-27T11:51:25-04:00
categories: articles
tags: []
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2171.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/ceel-dheer-somalia-2171
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "掘金 - 机器学习概念：梯度下降"
    url: https://juejin.im/post/5ab60bc66fb9a028da7c7b68
---

* TOC
{:toc}

梯度下降法 (Gradient descent) 是一个一阶最优化算法，通常也称为最速下降法。 要使用梯度下降法找到一个函数的局部极小值，必须向函数上当前点对应梯度（或者是近似梯度）的反方向的规定步长距离点进行迭代搜索。如果相反地向梯度正方向迭代进行搜索，则会接近函数的局部极大值点；这个过程则被称为梯度上升法。

## 导数

### Derivative

导函数 ([Derivative][wiki/Derivative]) 定义为

$$
\displaystyle
f'(x_{0})
= \lim_{\Delta x \to 0}\frac{\Delta x}{\Delta y}
= \lim_{\Delta x \to 0}\frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}
$$

### Partial derivative

偏导数 ([Partial derivative][wiki/Partial_derivative]) 定义为

$$
\displaystyle
\frac{∂}{∂x_j}f(x_0,x_1,\cdots,x_n) = \lim_{\Delta x \to 0}\frac{\Delta y}{\Delta x} = \lim_{\Delta x \to 0}\frac{f(x_0,x_1,\cdots,x_n)-f(x_0,x_1,\cdots,x_n)}{\Delta x}
$$

### Directional derivative

方向导数 ([Directional derivative][wiki/Directional_derivative]) 定义为

$$
\displaystyle
\frac{∂}{∂l}f(x_0,x_1,\cdots,x_n) = \lim_{\rho \to 0}\frac{\Delta y}{\Delta x} = \lim_{\rho \to 0}\frac{f(x_0+\Delta x_0,x_1+\Delta x_1,\cdots,x_n+\Delta x_n)-f(x_0,x_1,\cdots,x_n)}{\rho} \\
\\
\rho = \sqrt{(\Delta x_0)^2+(\Delta x_1)^2+\cdots+(\Delta x_n)^2}
$$

## 梯度

梯度 (Gradient) 的定义如下：

$$
\displaystyle
gradf(x_0,x_1,\cdots,x_n)=(\frac{∂f}{∂x_0},\frac{∂f}{∂x_1},\cdots,\frac{∂f}{∂x_n})
$$

定义描述为 **函数在某一点的梯度是这样一个向量，它的方向与取得最大方向导数的方向一致，它的模为方向导数的最大值。**
梯度说明了 **函数在变量空间的某一点处，沿着哪一个方向有着最大的变化率**
梯度属性：
* 梯度是一个向量，有方向有大小
* 梯度的方向是最大方向导数的方向
* 梯度的值的最大方向导数的值

### 梯度下降法


Momentum optimization

[wiki/Derivative]:https://en.wikipedia.org/wiki/Derivative
[wiki/Partial_derivative]:https://en.wikipedia.org/wiki/Partial_derivative
[wiki/Directional_derivative]:https://en.wikipedia.org/wiki/Directional_derivative