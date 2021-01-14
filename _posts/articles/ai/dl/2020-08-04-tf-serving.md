---
layout: post
theme: IBMPlexSerif
series: 
  url: tensorflow2
  title: TensorFlow 2
title: "Serving with Docker"
excerpt: "One of the easiest ways to get started using TensorFlow Serving is with Docker."
modified: 2020-08-04T11:51:25-04:00
categories: articles
tags: [TensorFlow, Deep Learning, Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6311.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/nouadhibou-mauritania-6311
comments: true
share: true
mathjax: true
---

* TOC
{:toc}

运行一个预先创建好的模型的服务容器

> 在运行 `tensorflow/serving` 容器时要使用 `--mount` 来挂载文件目录

```
docker run -t --rm -p 8501:8501 --name tf_serving --mount type=bind,source=${PWD}/serving/tensorflow_serving/servables/tensorflow/testdata/saved_model_half_plus_two_cpu,target=/models/half_plus_two -e MODEL_NAME=half_plus_two tensorflow/serving &
```

```
curl -d '{"instances": [1.0, 2.0, 5.0]}' \
  -X POST http://localhost:8501/v1/models/half_plus_two:predict
```

https://www.tensorflow.org/tfx/serving/architecture

https://www.tensorflow.org/tfx/tutorials/serving/rest_simple

运行一个 MNIST 服务容器

[Serving a TensorFlow Model MNIST](https://www.tensorflow.org/tfx/serving/serving_basic)

按步骤来, 我们已经下载了 serving 项目代码

```sh
# 进入项目目录
$ cd serving
# 删除可能已经存在的目标文件目录
$ rm -rf /tmp/mnist
# 使用脚本运行 docker 容器来运行 python 脚本
$ tools/run_in_docker.sh python tensorflow_serving/example/mnist_saved_model.py /tmp/mnist
```