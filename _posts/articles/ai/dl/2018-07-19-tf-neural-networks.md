---
layout: post
theme: IBMPlexSerif
title: "TensorFlow - Neural Networks"
excerpt: "Neural Networks with TensorFlow"
modified: 2018-07-17T11:51:25-04:00
categories: articles
tags: [Neural Networks, TensorFlow, DeepLearning, Python]
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
* Weight initialization
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
* [Epoch]()

https://www.cnblogs.com/makefile/p/activation-function.html

{% include_relative deep_learning_references.md %}