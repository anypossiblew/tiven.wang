---
layout: post
theme: IBMPlexSerif
title: "TensorFlow - Deep Networks"
excerpt: "Fundamentals of Deep Networks"
modified: 2018-07-30T11:51:25-04:00
categories: articles
tags: [Deep Networks, TensorFlow, DeepLearning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2170.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/ceel-dheer-somalia-2170
comments: true
share: true
references:
  - id: 1
    title: "A Simple Alpha(Go) Zero Tutorial"
    url: https://web.stanford.edu/~surag/posts/alphazero.html
  - id: 2
    title: "知乎 - 如何简单形象又有趣地讲解神经网络是什么？"
    url: https://www.zhihu.com/question/22553761
---

* TOC
{:toc}

区别于以前典型的前馈神经网络，深度学习神经网络具有以下特点：
* 更多的神经元
* 层之间更复杂的连接方式
* 训练的计算能力爆炸式增长
* 特征自动提取

更多的神经元可以表达更复杂的模型，进而就有更复杂的层之间连接方式（例如卷积神经网络，递归神经网络）。更多的连接意味着更多的参数需要优化，那么其对计算能力也有了爆炸式增长的需求。这些就为构建下一代特征自动提取的神经网络提供了基础。

当前主要的四种深度神经网络架构：
* Unsupervised Pretrained Networks
* Convolutional Neural Networks
* Recurrent Neural Networks
* Recursive Neural Networks

[Reinforcement learning (RL)][wiki/Reinforcement_learning] (强化学习) 

> [AlphaGo Zero][wiki/AlphaGo_Zero] is trained by self-play reinforcement learning. It combines a neural network and [Monte Carlo Tree Search][wiki/Monte_Carlo_tree_search] in an elegant policy iteration framework to achieve stable learning.
{: .Quotes}

> [Q-learning][wiki/Q-learning] is a [reinforcement learning][wiki/Reinforcement_learning] technique used in machine learning. The goal of Q-Learning is to learn a policy, which tells an agent which action to take under which circumstances. It does not require a model of the environment and can handle problems with stochastic transitions and rewards, without requiring adaptations.
{: .Quotes}

https://medium.freecodecamp.org/an-introduction-to-deep-q-learning-lets-play-doom-54d02d8017d8

https://leonardoaraujosantos.gitbooks.io/artificial-inteligence/content/deep_q_learning.html

> The [ImageNet][image-net.org] project is a large visual database designed for use in visual object recognition software research. Over 14 million URLs of images have been hand-annotated by ImageNet to indicate what objects are pictured; in at least one million of the images, bounding boxes are also provided.

[Generative Model][wiki/Generative_model]

https://towardsdatascience.com/deep-generative-models-25ab2821afd3

### Inceptionism

[DEEP DREAM GENERATOR](https://deepdreamgenerator.com)

[Inceptionism][wiki/DeepDream]

[Inceptionism: Going Deeper into Neural Networks](https://ai.googleblog.com/2015/06/inceptionism-going-deeper-into-neural.html)

https://github.com/google/deepdream

### Modeling artistic style

### Generative Adversarial Networks

* https://github.com/carpedm20/DCGAN-tensorflow
* https://www.oreilly.com/ideas/deep-convolutional-generative-adversarial-networks-with-tensorflow

### Recurrent Neural Networks

## Common Architectural Principles of Deep Networks

深度网络的核心组件：
* Parameters
* Layers
* Activation functions
* Loss functions
* Optimization methods
* Hyperparameters

building block networks of deep networks:
* RBMs
* Autoencoders

deep network architectures:
* UPNs
* CNNs
* Recurrent neural networks
* Recursive neural networks

### Core Components

#### Activation functions

Hidden layer 常用的函数包括
* Sigmoid
* Tanh
* Hard tanh
* Rectified linear unit (ReLU) (and its variants)

http://playground.tensorflow.org

### Building Blocks

#### RBMs

A [Restricted Boltzmann Machine (RBM)][wiki/Restricted_Boltzmann_machine] is a generative stochastic artificial neural network that can learn a probability distribution over its set of inputs.

[Boltzmann machine][wiki/Boltzmann_machine]

#### Autoencoders

> In machine learning, [feature learning or representation learning][wiki/Feature_learning] is a set of techniques that allows a system to automatically discover the representations needed for feature detection or classification from raw data. This replaces manual feature engineering and allows a machine to both learn the features and use them to perform a specific task. Feature learning is motivated by the fact that machine learning tasks such as classification often require input that is mathematically and computationally convenient to process. However, real-world data such as images, video, and sensor data has not yielded to attempts to algorithmically define specific features. An alternative is to discover such features or representations through examination, without relying on explicit algorithms.
{: .Quotes}

## 词汇

* **discriminator** 
* **perception** 知觉 the ability to see, hear, or become aware of something through the senses.
* **biological neuron** 生物神经元
* [Backpropagation][wiki/Backpropagation]
* [stochastic](https://www.google.com/search?q=define+stochastic)
* [Convergence]()
* [Support vector machines (SVMs)][wiki/Support_vector_machine]

[wiki/DeepDream]:https://en.wikipedia.org/wiki/DeepDream
[image-net.org]:http://www.image-net.org/
{% include_relative deep_learning_references.md %}
