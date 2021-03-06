---
layout: post
theme: Merriweather
title: "Deep Learning - Recurrent Neural Networks"
excerpt: "Recurrent Neural Networks with Deep Learning"
modified: 2018-08-01T11:51:25-04:00
categories: articles
tags: [RNNs, TensorFlow, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5901.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/pomeroy-united-states-5901
comments: true
share: true
references:
  - id: 1
    title: "Understanding LSTM Networks"
    url: https://colah.github.io/posts/2015-08-Understanding-LSTMs/
  - id: 2
    title: "Towards Data Science - The fall of RNN / LSTM"
    url: https://towardsdatascience.com/the-fall-of-rnn-lstm-2d1594c74ce0
  - id: 3
    title: "The Unreasonable Effectiveness of Recurrent Neural Networks"
    url: http://karpathy.github.io/2015/05/21/rnn-effectiveness/
---

* TOC
{:toc}

[Recurrent Neural Networks][wiki/Recurrent_neural_network]

[Markov chain][wiki/Markov_chain] model

https://colah.github.io/posts/2015-08-Understanding-LSTMs/

https://www.tensorflow.org/tutorials/sequences/recurrent

在使用神经网络时，很重要的一点是正确的处理数据维度。Recurrent Neural Networks 输入数据一般使用 3D 容积输入
* Mini-batch Size 一批多少个数据
* Number of columns in our vector per time-step 每一步向量里多少列
* Number of time-steps 多少步

![IMAGE: recurrent neural networks input](/images/tensorflow/recurrent-neural-networks-input.png)
{: .center.middle}

## LSTMs

梯度消失问题 ([vanishing gradient problem][wiki/Vanishing_gradient_problem])

[Long short-term memory (LSTM)][wiki/Long_short-term_memory]

[Gated recurrent unit][wiki/Gated_recurrent_unit] (GRUs) are a gating mechanism in recurrent neural networks, introduced in 2014 by Kyunghyun Cho et al. Their performance on polyphonic music modeling and speech signal modeling was found to be similar to that of long short-term memory (LSTM). However, GRUs have been shown to exhibit better performance on smaller datasets. They have fewer parameters than LSTM, as they lack an output gate.

## RMSprop optimizer

https://www.quora.com/Why-is-it-said-that-RMSprop-optimizer-is-recommended-in-training-recurrent-neural-networks-What-is-the-explanation-behind-it

http://ruder.io/optimizing-gradient-descent/

## Hyperparameters

`hidden_layer_size` 如何选择?

[BPTT][wiki/Backpropagation_through_time]

https://distill.pub/2016/augmented-rnns/

{% include_relative tensorflow_references.md %}
{% include_relative deep_learning_references.md %}