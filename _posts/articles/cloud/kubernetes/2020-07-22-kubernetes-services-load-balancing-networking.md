---
layout: post
theme: UbuntuMono
series:
  url: kubernetes
  title: Kubernetes
title: "Services, Load Balancing, and Networking"
excerpt: "Concepts and resources behind networking in Kubernetes."
modified: 2020-07-22T11:51:25-04:00
categories: articles
tags: [Kubernetes, Cloud]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2022.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/amherst-united-states-2022
comments: true
share: true

---

* TOC
{:toc}

* 在 Kubernetes 中容器暴露成 services 的用处?
* 容器之间的通信机制?
* 负载均衡在 Kubernetes 中的作用?
* Kubernetes 中的网络管理?

## Service

> An abstract way to expose an application running on a set of Pods as a network service.
> With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

### kube-proxy modes

[Comparing kube-proxy modes: iptables or IPVS?](https://www.tigera.io/blog/comparing-kube-proxy-modes-iptables-or-ipvs/)

#### iptables proxy mode

Kube-proxy, the building block of service routing has relied on the battle-hardened iptables to implement the core supported Service types such as ClusterIP and NodePort. However, iptables struggles to scale to tens of thousands of Services because it is designed purely for firewalling purposes and is based on in-kernel rule lists.

#### IPVS proxy mode

[Kubernetes Blog - IPVS-Based In-Cluster Load Balancing Deep Dive](https://kubernetes.io/blog/2018/07/09/ipvs-based-in-cluster-load-balancing-deep-dive)

### Publishing Services (ServiceTypes)


* ClusterIP: Exposes the Service on a cluster-internal IP. Choosing this value makes the Service only reachable from within the cluster. This is the default ServiceType.

* NodePort: Exposes the Service on each Node's IP at a static port (the NodePort). A ClusterIP Service, to which the NodePort Service routes, is automatically created. You'll be able to contact the NodePort Service, from outside the cluster, by requesting <NodeIP>:<NodePort>.

* LoadBalancer: Exposes the Service externally using a cloud provider's load balancer. NodePort and ClusterIP Services, to which the external load balancer routes, are automatically created.

* ExternalName: Maps the Service to the contents of the externalName field (e.g. foo.bar.example.com), by returning a CNAME record

[Exposing pods and services 详细讲解](https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/)

## Ingress

Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.

