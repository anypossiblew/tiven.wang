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

常用的四种深度神经网络
* Unsupervised Pretrained Networks
* Convolutional Neural Networks
* Recurrent Neural Networks
* Recursive Neural Networks

[Reinforcement learning (RL)][wiki/Reinforcement_learning] (强化学习) 

> [AlphaGo Zero][wiki/AlphaGo_Zero] is trained by self-play reinforcement learning. It combines a neural network and [Monte Carlo Tree Search][wiki/Monte_Carlo_tree_search] in an elegant policy iteration framework to achieve stable learning.
{: .Quotes}

### Inceptionism

[DEEP DREAM GENERATOR](https://deepdreamgenerator.com)

[Inceptionism][wiki/DeepDream]

[Inceptionism: Going Deeper into Neural Networks](https://ai.googleblog.com/2015/06/inceptionism-going-deeper-into-neural.html)

### Modeling artistic style

### Generative Adversarial Networks

* https://github.com/carpedm20/DCGAN-tensorflow
* https://www.oreilly.com/ideas/deep-convolutional-generative-adversarial-networks-with-tensorflow

### Recurrent Neural Networks

## Common Architectural Principles of Deep Networks

* Parameters
* Layers
* Activation functions
* Loss functions
* Optimization methods
* Hyperparameters

### Activation functions

Hidden layer 常用的函数包括
* Sigmoid
* Tanh
* Hard tanh
* Rectified linear unit (ReLU) (and its variants)

http://playground.tensorflow.org


## 词汇

* **discriminator** 
* **perception** 知觉 the ability to see, hear, or become aware of something through the senses.
* **biological neuron** 生物神经元
* [Backpropagation][wiki/Backpropagation]
* [stochastic](https://www.google.com/search?q=define+stochastic)
* [Convergence]()
* [Support vector machines (SVMs)][wiki/Support_vector_machine]

[wiki/DeepDream]:https://en.wikipedia.org/wiki/DeepDream
{% include_relative deep_learning_references.md %}
