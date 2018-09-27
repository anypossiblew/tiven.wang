---
layout: post
theme: Merriweather
star: true
series: 
  url: deep-learning
  title: Deep Learning
title: "Neural Networks"
excerpt: "Neural Networks with TensorFlow"
modified: 2018-08-08T11:51:25-04:00
categories: articles
tags: [Neural Networks, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1594.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/corpen-aike-department-argentina-1594
comments: true
share: true
mathjax: true
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

**Deep feedforward network** (深度前馈网络)，也叫 **feedforward neural network** (前馈神经网络) 或者 **multilayer perceptron, MLP** (多层感知机)，是典型的深度学习模型。前馈网络的目标是近似某个函数 $$f^*$$ (理想中的函数)。例如，对于分类器，$$y=f^*(\boldsymbol{x})$$ 将输入 $$\boldsymbol{x}$$ 映射到一个类别 $$y$$ 。前馈网络定义了一个映射 $$\boldsymbol{y}=f(\boldsymbol{x};\boldsymbol{\theta})$$ ，并且学习参数 $$\boldsymbol{\theta}$$ 的值，使它能够得得到最佳的函数近似。这种模型被称为 **feedforward** (前向) 的，是因为信息流过 $$\boldsymbol{x}$$ 的函数，流经用于定义 $$f$$ 的中间计算过程，最终到达输出 $$\boldsymbol{y}$$ 。在模型的输出和模型本身之间没有 **feedback** (反馈) 连接。当前馈神经网络被扩展成包含反馈连接时，他们被称为 recurrent neural nerwork (循环神经网络)，将在 [Deep Learning - Recurrent Neural Networks](/articles/dl-recurrent-neural-networks/) 介绍。

神经网络之所以称作**网络**，是因为他们通常用许多不同函数复合在一起来表示。例如三个函数 $$f^{(1)}$$、$$f^{(2)}$$ 和 $$f^{(3)}$$ 连接在一个链上以形成 $$f(\boldsymbol{x})=f^{(3)}(f^{(2)}(f^{(1)}(\boldsymbol{x})))$$ 。这种情况下，$$f^{(1)}$$ 被称为网络的**第一层**(first layer)，$$f^{(2)}$$ 被称为第二层(second layer)，以此类推。链的全长称为模型的**深度**(depth)。前馈网络的最后一层被称为**输出层**(output layer)，其他的称为**隐藏层**(hidden layer)。网络中每个隐藏层通常都是向量值的，隐藏层的维数决定了模型的**宽度**(width)。向量的每个元素都可以被视为起到类似一个神经元的作用。可以将层想象成向量到向量的单个函数，也可以想象成由许多并行操作的**单元**(unit)组成，每个单元表示一个向量到标量的函数。每个单元在某种意义上又类似一个神经元，它接收的输入来源于许多其他的神经元，并计算它自己的激活值。

> 使用多层向量值表示的想法来源于神经科学。用于计算这些表示的函数 $$f^{(i)}(x)$$ 的选择，也或多或少地受到神经科学观测的指引，这些观测是关于生物神经元计算功能的。然而，现代的神经网络研究受到更多的是来自许多数学和工程学科的指引，并且神经网络的目标并不是完美地给大脑建模。我们最好将前馈神经网络想成是为了实现统计泛化而设计出的函数近似机，它偶尔从我们了接的大脑中提取灵感，但并不是大脑功能的模型。
{: .Quotes}

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

在深入理解神经网络之前，让我们来直观感受一下神经网络的魔幻色彩

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

神经网络最早的一种形式叫 [Perceptron][wiki/Perceptron] (感知器)，一种人工神经网络。它可以被视为一种最简单形式的前馈神经网络，是一种二元线性分类器。感知器的模型函数可以表示为线性变换

$$z = \mathbf{w}\cdot\mathbf{x}+b$$

然后对变换结果使用二分函数，则得到二分类结果

$$f(z)=\left\{ \begin{array}{rcl} 1 && if && z>0 \\ 0 && otherwise\end{array}\right.$$

那么可以看出感知器的模型属于线性函数，即使我们为其添加多层隐藏层形成的多层神经网络，其模型仍然是线性函数。一层网络表示为

$$f^{(1)}(\boldsymbol{x})=\boldsymbol{W}^\top\boldsymbol{x}=\boldsymbol{h}$$

第二层表示为

$$f^{(2)}(\boldsymbol{h})=\boldsymbol{h}^\top\boldsymbol{w}$$ 

那么 

$$f(\boldsymbol{x})=f^{(2)}(f^{(1)}(\boldsymbol{x}))=\boldsymbol{w}^\top\boldsymbol{W}^\top\boldsymbol{x}$$ 

令 $$\boldsymbol{w}'=\boldsymbol{W}\boldsymbol{w}$$ 函数可以重新表示成 $$f(\boldsymbol{x})=\boldsymbol{x}^\top\boldsymbol{w}'$$ 显然仍然是线性的。

线性函数无法解决像 XOR 异或的问题，


In the field of neural networks the perceptron is considered an artificial neuron using the [Heaviside step function][wiki/Heaviside_step_function] (单位阶跃函数) for the activation function. The perceptron training algorithm is considered a supervised learning algorithm. 

Fully connected (FC) network aka Multilayer Perceptron (MLP) aka Feedforward Neural
Network (FNN)

https://www.cybercontrols.org/neuralnetworks

## Multilayer Feed-Forward Networks

The multilayer feed-forward network is a neural network with an input layer, one or more hidden layers, and an output layer.

### Activation Functions

为了扩展线性模型来表示 $$\boldsymbol{x}$$ 的非线性函数，我们可以不把线性模型用于 $$\boldsymbol{x}$$ 本身，而是用在一个变换后的输入 $$\phi(\boldsymbol{x})$$ 上，这里 $$\phi$$ 是一个非线性变换。我们可以认为 $$\phi$$ 提供了一组描述 $$\boldsymbol{x}$$ 的特征，或者认为它提供了 $$\boldsymbol{x}$$ 的一个新的表示。那么我们模型表示为 

$$y=f(\boldsymbol{x};\boldsymbol{\theta},\boldsymbol{w})=\phi(\boldsymbol{x};\boldsymbol{\theta})^\top\boldsymbol{w}$$

其中 $$\phi(\boldsymbol{x};\boldsymbol{\theta})$$ 在深度神经网络中叫作**激活函数** (Activation Function)

常见的激活函数有

* [Sigmoid function][wiki/Sigmoid_function]
* [Hyperbolic function][wiki/Hyperbolic_function]
* [Rectified Linear Unit (ReLU)][wiki/Rectifier]

#### ReLU

[Rectified Linear Unit (ReLU)][wiki/Rectifier] (**线性整流函数**) 又称**修正线性单元**，通常指代以斜坡函数及其变种为代表的非线性函数。

![Image: Rectifier and Softplus functions](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Rectifier_and_softplus_functions.svg/495px-Rectifier_and_softplus_functions.svg.png)
{: .center}

该激活函数是被推荐用于大多数前馈神经网络的默认激活函数，将此函数用于线性变换的输出将产生非线性变换。然而函数仍然非常接近线性，在这种意义上它是具有两个线性部分的分段线性函数。由于整流线性单元几乎是线性的，因此它们保留了许多使得线性模型易于使用基于梯度的方法进行优化的属性。它们还保留了许多使得线性模型能够泛化良好的属性。计算机科学的一个公共原则是，我们可以从最小的组件构建复杂的系统。就像图灵机的内存只需要能够存储 0 或 1 的状态，我们可以从整流线性函数构建一个万能函数近似器。

### Gradient-Based Learning

因为增加了非线性的激活函数，导致了神经网络的大多数我们感兴趣的代价函数都变得非凸。这意味着神经网络的训练通常使用迭代的、基于梯度的优化，仅仅使得代价函数达到一个非常小的值；而不是像用于训练线性回归模型的线性方程求解器，或者用于训练逻辑回归或者 SVM 的凸优化算法那样保证全局收敛。

#### Loss Functions

在大多数情况下，参数模型(parametric model)定义了一个分布 $$p(\boldsymbol{y} \| \boldsymbol{x};\boldsymbol{\theta})$$ 并且简单地使用 最大似然原理(the principle of maximum likelihood)。这意味着我们使用训练数据和模型预测间的 交叉熵(cross-entropy) 作为 代价函数(cost function)。

有时，我们使用一个更简单的方法，不是预测 $$y$$ 的完整概率分布，而是仅仅预测在给定 $$x$$ 的条件下 $$y$$ 的某种统计量。某些专门的损失函数允许我们来训练这些估计量的 预测器(predictor)。

用于训练神经网络的完整的代价函数，通常在我们这里描述的基本代价函数的基础上结合一个 正则项(regularization term)。关于 正则化([regularization][wiki/Regularization]) 我们会专门介绍。

#### Maximum Likelihood

> Many output units involve an $$exp$$ function that can saturate when its argument is very negative. The $$log$$ function in the negative log-likelihood cost function undoes the exp of some output units.

#### Learning Conditional Statistics

均方误差和平均绝对误差在使用基于梯度的优化方法时往往成效不佳。一些饱和的输出单元当结合这些代价函数时会产生非常小的梯度。这就是交叉熵代价函数比均方误差或者平均绝对误差更受欢迎的原因之一了，即使是在没必要估计整个 $$p(y;x)$$ 分布时。

#### Output Units

代价函数的选择与输出单元的选择紧密相关。大多数时候，我们简单地使用数据分布和模型分布间的交叉熵。选择如何表示输出决定了交叉熵函数的形式。

* 用于高斯输出分布的线性单元
* 用于 Bernoulli 输出分布的 sigmoid 单元
* 用于 Multinoulli 输出分布的 softmax 单元
* 其他的输出类型

### 隐藏单元

隐藏单元的激活函数

* 整流线性单元及其扩展
* logistic sigmoid 与双曲正切函数
* 其他隐藏单元

### Backpropagation Learning

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