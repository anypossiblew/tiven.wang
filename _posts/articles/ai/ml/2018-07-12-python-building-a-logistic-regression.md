---
layout: post
theme: IBMPlexSerif
title: "Python - Building A Logistic Regression"
excerpt: "Building A Logistic Regression with Python"
modified: 2018-07-12T11:51:25-04:00
categories: articles
tags: [Logistic Regression, Regression, Python]
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

Logistic regression 的模型公式为

$$ f(z) = \frac{e^{z}}{1 + e^{z}} = \frac{1}{1+e^{-z}} $$


## sigmoid function

## Decision boundary

## Making predictions

## Cost function

### Cross-Entropy


## Gradient descent

https://towardsdatascience.com/logistic-regression-using-python-sklearn-numpy-mnist-handwriting-recognition-matplotlib-a6b31e2b166a

https://medium.com/data-science-group-iitr/logistic-regression-simplified-9b4efe801389


[wiki/Logistic_regression]:https://en.wikipedia.org/wiki/Logistic_regression