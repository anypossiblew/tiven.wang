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
---

* TOC
{:toc}

安装必要的程序包
```
pip3 install scikit-learn
pip3 install pandas
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


## classification

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

$$ f(z) = \frac{e^{z}}{1 + e^{z}} = \frac{1}{1+e^{-z}} $$

直观看在趋于正无穷或负无穷时，函数趋近平滑状态，Sigmoid 函数因为输出范围（0，1），所以二分类的概率常常用这个函数。

## Decision boundary

## Making predictions

## Cost function

### Cross-Entropy

[Cross Entropy][wiki/Cross_entropy]

熵实际是对随机变量的比特量和顺次发生概率相乘再总和的数学期望。

## Gradient descent

https://stats.stackexchange.com/questions/250937/which-loss-function-is-correct-for-logistic-regression

https://towardsdatascience.com/logistic-regression-using-python-sklearn-numpy-mnist-handwriting-recognition-matplotlib-a6b31e2b166a

https://medium.com/data-science-group-iitr/logistic-regression-simplified-9b4efe801389


[wiki/Logistic_regression]:https://en.wikipedia.org/wiki/Logistic_regression
[wiki/Sigmoid_function]:https://en.wikipedia.org/wiki/Sigmoid_function
[wiki/Logistic_function]:https://en.wikipedia.org/wiki/Logistic_function
[wiki/Cross_entropy]:https://en.wikipedia.org/wiki/Cross_entropy