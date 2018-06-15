---
layout: post
theme: UbuntuMono
title: "Kubernetes - Cluster on Raspberry Pi"
excerpt: "Learn how to deploy a Kubernetes cluster on Raspberry Pis."
modified: 2018-06-11T11:51:25-04:00
categories: articles
tags: [Raspberry PI, Kubernetes, Cloud]
image:
  vendor: twitter
  feature: /media/DfGbYtqX0AEP6EY.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1004755042925273088
comments: true
share: true
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs

---

* TOC
{:toc}

https://rak8s.io/

```
root@kubemaster:~# docker version
Client:
 Version:       17.12.1-ce
 API version:   1.35
 Go version:    go1.10.1
 Git commit:    7390fc6
 Built: Wed Apr 18 01:23:11 2018
 OS/Arch:       linux/amd64

Server:
 Engine:
  Version:      17.12.1-ce
  API version:  1.35 (minimum version 1.12)
  Go version:   go1.10.1
  Git commit:   7390fc6
  Built:        Wed Feb 28 17:46:05 2018
  OS/Arch:      linux/amd64
  Experimental: false
```

```
cd /usr/local
sudo curl -o lantern.deb  https://raw.githubusercontent.com/getlantern/lantern-binaries/master/lantern-installer-64-bit.deb
```
