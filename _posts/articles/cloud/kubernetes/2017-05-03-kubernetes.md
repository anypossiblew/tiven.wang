---
layout: post
theme: UbuntuMono
series:
  url: kubernetes
  title: Kubernetes
title: "总览"
excerpt: "Kubernetes"
modified: 2020-07-28T17:00:00-00:00
categories: articles
tags: [Kubernetes]
image:
  feature: /images/web/masthead-web.jpg
comments: true
share: true
showYourTerms: true
references:
  - title: "Gitbooks - Awesome-Kubernetes"
    url: "https://ramitsurana.gitbooks.io/awesome-kubernetes/"
  - title: "7 systems engineering and operations trends to watch in 2018"
    url: https://www.oreilly.com/ideas/7-systems-engineering-and-operations-trends-to-watch-in-2018
  - title: "Cluster Schedulers"
    url: https://medium.com/@copyconstruct/schedulers-kubernetes-and-nomad-b0f2e14a896
---

<style>
.showyourterms .type:before {
  content: "$ "
}
</style>

* TOC
{:toc}

[Gitbooks - Awesome-Kubernetes](https://ramitsurana.gitbooks.io/awesome-kubernetes/)

https://kubernetes.io/

https://github.com/kubernetes/kube-ui

https://github.com/kubernetes/minikube

[让 K8S 在 GFW 内愉快的航行](https://developer.aliyun.com/article/759310)

## Terminology

* **Node**: A worker machine in Kubernetes, part of a cluster.
* **Cluster**: A set of Nodes that run containerized applications managed by Kubernetes. For this example, and in most common Kubernetes deployments, nodes in the cluster are not part of the public internet.
* **Edge router**: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* **Cluster network**: A set of links, logical or physical, that facilitate communication within a cluster according to the Kubernetes networking model.
* **Service**: A Kubernetes Service that identifies a set of Pods using label selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network
