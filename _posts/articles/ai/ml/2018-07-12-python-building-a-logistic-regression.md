---
layout: post
theme: IBMPlexSerif
title: "Python - Building A Logistic Regression"
excerpt: "Building A Logistic Regression with Python, 用线性模型解决回归任务中的二分类任务"
modified: 2018-07-12T11:51:25-04:00
categories: articles
tags: [Logistic Regression, Linear Model, Regression, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2147.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/los-angeles-united-states-2147
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "ML Cheatsheet - Logistic Regression"
    url: http://ml-cheatsheet.readthedocs.io/en/latest/logistic_regression.html
  - id: 2
    title: "UFLDL Tutorial - Logistic Regression"
    url: http://ufldl.stanford.edu/tutorial/supervised/LogisticRegression/
---

* TOC
{:toc}

安装必要的程序包
```
pip3 install scikit-learn
```

引入需要用的包组件
```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
```

创建训练数据
```python
x_data = np.array([1,2,2.5,3,4,3,3.5,4,5,6,7])
y_data = np.array([0,0,  0,0,0,1,  1,1,1,1,1])
plt.plot(x_data,y_data, 'o')
plt.show()
```

训练数据并预测
```python
# all parameters not specified are set to their defaults
logisticRegr = LogisticRegression()
logisticRegr.fit(x_data.reshape(-1, 1), y_data.reshape(-1, 1))
# Predict
logisticRegr.predict([[2],[3],[8]])
```

## Classification

Statistical classification is a problem studied in machine learning. It is a type of supervised learning, a method of machine learning where the categories are predefined, and is used to categorize new probabilistic observations into said categories. When there are only two categories the problem is known as statistical [binary classification](https://en.wikipedia.org/wiki/Binary_classification).

Some of the methods commonly used for binary classification are:

* Decision trees
* Random forests
* Bayesian networks
* Support vector machines
* Neural networks
* Logistic regression
* Probit model

[zhihu - 分类与回归区别是什么？](https://www.zhihu.com/question/21329754)

[zhihu - 用于数据挖掘的分类算法有哪些，各有何优劣？](https://www.zhihu.com/question/24169940)

## Logistic Regression

关于逻辑回归经典的例子如考试通过与否与学习时间的关系，如下图

![Exam pass logistic curve](https://upload.wikimedia.org/wikipedia/commons/6/6d/Exam_pass_logistic_curve.jpeg)
{: .center.middle}

直观表达为，学习很努力学习时间很长的人可以说几乎是要通过的，不怎么学习的人可以说几乎是不会通过的。那么问题在于那些一瓶子不满半瓶子咣当的学生，考试会不会通过呐。这就是可以使用逻辑回归（或者叫对数几率回归）模型进行评估。

### Sigmoid Function

[Sigmoid Function][wiki/Sigmoid_function] (S 函数) 是[Logistic Function][wiki/Logistic_function] 的一种特殊情况，它被用作为 Logistic Regression 的模型，公式为

$$ \sigma(z) = \frac{e^{z}}{1 + e^{z}} = \frac{1}{1+e^{-z}} $$

直观看在趋于正无穷或负无穷时，函数趋近平滑状态，Sigmoid 函数因为输出范围（0，1），所以二分类的概率常常用这个函数。

在函数拟合时令

$$ z = wx + b $$

## Decision boundary

## Making predictions

## Cost function

### Cross Entropy

在分类问题中，预测结果是（或可以转化成）输入样本属于 n 个不同分类的对应概率，而不可能是准确的说是（1）或者不是（0）。比如对于一个 4 分类问题，期望给定的某一个样本 x 输出应该为 p = [0,1,0,0] ，意思是 x 是第二类的概率为 1 是其他类的概率为 0 ，也就是说 x 绝对属于第二类。但在实际计算中往往没有这么理想，结果可能的会是 q =[0.2,0.4,0.4,0]，那么我们就要想办法计算两者之间的差距，进而找到使其最小的办法。

$$H(p,q) = -\sum_x p(x)log(q(x))$$

如把 $$p$$ $$q$$ 看成两个概率分布，则可以把此公式称为这两个概率分布的交叉熵（[Cross Entropy][wiki/Cross_entropy]）.
如果 $$p$$ $$q$$ 是同一个概率分布，那么上面公式就是该概率分布的熵，公式可写为

$$H(p) = -\sum_x p(x)log(p(x))$$

熵实际是对随机变量的比特量和顺次发生概率相乘再总和的数学期望。

我们知道在均方误差函数中样本之间的权重是一样的，没有人比其他人特殊。但在分类问题中不同，出现概率越小的样本越值得我们注意，也就是说在进行模型拟合时优先避免出现小概率事件。

那么“概率越小权重越大”用模型函数怎么表示呐？这就可以使用交叉熵函数了。在 $$y^{(i)} \in \{0,1\}$$ 二分类问题上交叉熵可以结合成下面的函数

$$J(\theta) = - \sum_i \left(y^{(i)} \log( h_\theta(x^{(i)}) ) + (1 - y^{(i)}) \log( 1 - h_\theta(x^{(i)}) ) \right)$$

## Gradient descent

### Derivative of Sigmoid Function

我们的 Sigmoid Function 的导函数 [Derivative of sigmoid function](https://math.stackexchange.com/questions/78575/derivative-of-sigmoid-function-sigma-x-frac11e-x) 为

$$\dfrac{d}{dz}\sigma(z) = \sigma(z)(1 - \sigma(z))$$

https://stats.stackexchange.com/questions/250937/which-loss-function-is-correct-for-logistic-regression

https://towardsdatascience.com/logistic-regression-using-python-sklearn-numpy-mnist-handwriting-recognition-matplotlib-a6b31e2b166a

https://medium.com/data-science-group-iitr/logistic-regression-simplified-9b4efe801389


[wiki/Logistic_regression]:https://en.wikipedia.org/wiki/Logistic_regression
[wiki/Sigmoid_function]:https://en.wikipedia.org/wiki/Sigmoid_function
[wiki/Logistic_function]:https://en.wikipedia.org/wiki/Logistic_function
[wiki/Cross_entropy]:https://en.wikipedia.org/wiki/Cross_entropy
[wiki/Logarithm]:https://en.wikipedia.org/wiki/Logarithm