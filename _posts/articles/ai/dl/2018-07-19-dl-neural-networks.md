---
layout: post
theme: Merriweather
title: "Deep Learning - Neural Networks"
excerpt: "Neural Networks with TensorFlow"
modified: 2018-08-08T11:51:25-04:00
categories: articles
tags: [Neural Networks, TensorFlow, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1594.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/corpen-aike-department-argentina-1594
comments: true
share: true
references:
  - id: 1
    title: "神经网络浅讲：从神经元到深度学习"
    url: https://www.cnblogs.com/subconscious/p/5058741.html
  - id: 2
    title: "知乎 - 如何简单形象又有趣地讲解神经网络是什么？"
    url: https://www.zhihu.com/question/22553761
  - id: 3
    title: "colah's blog"
    url: http://colah.github.io/
---

* TOC
{:toc}

## 基本概念

* [Neurons][wiki/Neuron] 神经元
* [Activation function][wiki/Activation_function] 激活函数 How should a neuron fire as a response to its input?
* [Loss function][wiki/Loss_function] 损失函数 How do we compute the error made by the network?
* [Hyperparameters][wiki/Hyperparameter] Weight initialization ?
* [Overfitting][wiki/Overfitting]
* [Regularization][wiki/Regularization]

* Full Connected Layer
* Convolutional Layer
* Recurrent Neural Network Layers
* Long Short-Term Memory Cells
* [feedforward neural network][wiki/Feedforward_neural_network] 前馈神经网络
* [recurrent neural network][wiki/Recurrent_neural_network] 递归神经网络 (RNN) - 时间递归神经网络
* [recursive neural network][wiki/Recursive_neural_network] 递归神经网络 (RNN) - 结构递归神经网络
* [Stochastic gradient descent][wiki/Stochastic_gradient_descent]

* [distributed representation][wiki/ANN_distributed_representation]

## Intuitive

* Neural Network 3D Simulation
<iframe width="560" height="315" src="https://www.youtube.com/embed/3JQ3hYko51Y" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

* A.I. Experiments: Visualizing High-Dimensional Space
<iframe width="560" height="315" src="https://www.youtube.com/embed/wvsE8jm1GzE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## 生物学本质

生物神经元 ([Neurons][wiki/Neuron]) 结构
* Soma (cell body) 体细胞
* Dendrites 树突
* Axons 轴突
* Synapses 突触

![Diagram of a typical myelinated vertebrate motor neuron](https://upload.wikimedia.org/wikipedia/commons/a/a9/Complete_neuron_cell_diagram_en.svg)
{: .middle.center}

## Perceptron

The [perceptron][wiki/Perceptron] is a linear model used for binary classification. In the field of neural networks the perceptron is considered an artificial neuron using the [Heaviside step function][wiki/Heaviside_step_function] (单位阶跃函数) for the activation function. The perceptron training algorithm is considered a supervised learning algorithm. 

Fully connected (FC) network aka Multilayer Perceptron (MLP) aka Feedforward Neural
Network (FNN)

https://www.cybercontrols.org/neuralnetworks

## Multilayer Feed-Forward Networks

The multilayer feed-forward network is a neural network with an input layer, one or more hidden layers, and an output layer.

## Training Neural Networks

### Backpropagation Learning

### Activation Functions

### Loss Functions

### Hyperparameters

* Number of layers? Number of neurons?
* Weight initialization (Unsupervised Layer-Wise Pretraining, e.g., RBMs)
* Batch size
* Num. Epochs
* Learning rate
* Momentum

#### Learning Rate

#### Regularization

#### Momentum

#### Sparsity

## 词汇

* **perception** 知觉 the ability to see, hear, or become aware of something through the senses.
* **biological neuron** 生物神经元
* [Backpropagation][wiki/Backpropagation]
* [stochastic](https://www.google.com/search?q=define+stochastic)
* [Convergence]()
* [Support vector machines (SVMs)][wiki/Support_vector_machine]
* Epoch

https://www.cnblogs.com/makefile/p/activation-function.html

## 用 Numpy 实现一个单层神经网络

为了更好地感受神经网络的基本过程，让我们来用 Numpy 创建一个最基本的单层神经网络。
首先看一下我们的 **Train data** 如下

Input_1 | Input_2 | Input_3 | Output |
:-------------: |:-------------: | :-------------: | :-------------: |
0 | 0 | 0 | 0 
0 | 0 | 1 | 0 
0 | 1 | 0 | 1 
1 | 0 | 0 | 0 
1 | 1 | 0 | 1 
1 | 1 | 1 | 1 

本例其实是三维逻辑回归问题，首先引入 Numpy 包里需要用到的工具类
```python
from numpy import exp, array, random, dot
```

然后创建我们的主体，单层神经网络类，它包含了初始化权重方法，激活函数方法，导数方法，前馈函数方法和训练方法
```python
class SingleNeuronNetwork():
    def __init__(self):
        # 为随机数产生器设置种子
        # 以确保每次生成相同的随机数
        random.seed(42)

        # --- 单个神经元模型: 3 个输入连接， 1 个输出连接 ---
        # 所以我们的权重变量是需要三个标量的向量，然后去点称三维的输入数据得到一维的输出
        # 下面生成 3 x 1 矩阵: Floating-point values in (-1, 1)
        self.weights = 2 * random.random((3, 1)) - 1

    # --- 定义 Sigmoid 函数（激活函数） ---
    # 传入神经元的 1 维输出连接 out connection 到此函数 normalize between [0, 1]
    def __sigmoid(self, x):
        return 1 / (1 + exp(-x))

    # --- 定义 Sigmoid 函数的导函数 ---
    def __sigmoid_derivative(self, x):
        return x * (1 - x)

    # --- 定义前馈过程 ---
    def feed_forward(self, inputs):
        # Feed-forward inputs through the single-neuron neural network
        return self.__sigmoid(dot(inputs, self.weights))

    # --- 定义训练过程 ---
    # 循环处理前馈过程，每一循环后根据误差和斜率调整权重参数
    def train(self, train_inputs, train_outputs, num_iterations):
        # 循环训练过程
        for iteration in range(num_iterations):
            # 计算单层前馈神经网络
            output = self.feed_forward(train_inputs)

            # 计算单层神经网络的输出和期望值之间的误差
            error = train_outputs - output

            # 根据原始训练数据，误差和斜率计算权重参数需要调整的大小
            # 1. Less confident weights are adjusted more
            # 2. Inputs, that are zero, do not cause changes to the weights
            adjustment = dot(train_inputs.T, error * 
                             self.__sigmoid_derivative(output))

            # 把调整加到权重参数上
            self.weights += adjustment
```

其中 Sigmoid 函数的导函数参考 [Python - Building A Logistic Regression # Derivative of Sigmoid Function](/articles/python-building-a-logistic-regression/#derivative-of-sigmoid-function)

初始化我们的单层神经网络类
```python
# 初始化一个单层神经网络类
neural_network = SingleNeuronNetwork()
```

查看权重参数初始化时的随机值，初始化训练数据集
```python
print ("训练前的神经网络权重 (random initialization): ")
print (neural_network.weights)

# The train data consists of 6 examples, each consisting of 3 inputs and 1 output
train_inputs = array([[0, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1], [1, 0, 0], [1, 1, 0]])
train_outputs = array([[0, 1, 0, 1, 0, 1]]).T
```

训练 10000 次，并查看训练后的权重值
```python
# 把训练数据集训练 10000 次
neural_network.train(train_inputs, train_outputs, 10000)

print ("训练后的神经网络权重: ")
print (neural_network.weights)
```

### Test data

我们已经训练了神经网络，现在让我们使用训练得到的 weights 参数去预测测试数据看看是否能得到我们想要的结果:

Input_1 | Input_2 | Input_3 | 期望输出 |
:-------------: |:-------------: | :-------------: | :-------------: |
1 | 0 | 0 | 0 
0 | 1 | 1 | 1 

下面就是用我们训练好的权重去预测一下测试数据集
```python
# Test the neural network with a new input
print ("Inferring predicting from the network for [1, 0, 0] -> ?: ")
print (neural_network.feed_forward(array([1, 0, 0])))

print ("Inferring predicting from the network for [0, 1, 1] -> ?: ")
print (neural_network.feed_forward(array([0, 1, 1])))
```

{% include_relative deep_learning_references.md %}