---
layout: post
theme: IBMPlexSerif
title: "TensorFlow - Cookbook"
excerpt: "Cookbook for TensorFlow"
modified: 2018-07-25T11:51:25-04:00
categories: articles
tags: [TensorFlow, Cookbook, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1629.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/mount-ney-australia-1629
comments: true
share: true
---

* TOC
{:toc}

## TensorBoard

```
$ docker run -v //c/pathto/tf_logs:/tf_logs  
-p 0.0.0.0:6006:6006 -it tensorflow/tensorflow bash
root@73954ccec665:/notebooks# cd ..
root@73954ccec665:/# tensorboard --logdir tf_logs/
```


[tensorboard]:https://www.tensorflow.org/guide/summaries_and_tensorboard

[wiki/Tensor]:https://en.wikipedia.org/wiki/Tensor
[wiki/Scalar]:https://en.wikipedia.org/wiki/Scalar_(mathematics)
[wiki/Euclidean_vector]:https://en.wikipedia.org/wiki/Euclidean_vector
[wiki/Matrix]:https://en.wikipedia.org/wiki/Matrix_(mathematics)
[wiki/Array]:https://en.wikipedia.org/wiki/Array
[wiki/Matrix_multiplication]:https://en.wikipedia.org/wiki/Matrix_multiplication
[wiki/Loss_function]:https://en.wikipedia.org/wiki/Loss_function
[wiki/Mean_squared_error]:https://en.wikipedia.org/wiki/Mean_squared_error
[wiki/Convex_function]:https://en.wikipedia.org/wiki/Convex_function

[wiki/CNN]:https://en.wikipedia.org/wiki/Convolutional_neural_network
