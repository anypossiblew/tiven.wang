---
layout: post
theme: UbuntuMono
title: "Try CloudFoundry - Docker"
excerpt: "How Docker works in Cloud Foundry."
modified: 2018-05-10T11:51:25-04:00
categories: articles
tags: [Architecture, CloudFoundry]
image:
  vendor: twitter
  feature: /media/DcxFO1EX4AIpyci.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/994245741240639488
comments: true
share: true
references:
  - id: 1
    title: "Using Docker in Cloud Foundry"
    url: https://docs.cloudfoundry.org/adminguide/docker.html
---

* TOC
{:toc}

## Garden
**Garden is**

A rich *golang* client and server for container creation and management with pluggable backends for The Open Container Initiative Spec and windows.

Garden is a platform-agnostic Go API for container creation and management, with pluggable backends for different platforms and runtimes. This package contains the canonical client, as well as a server package containing an interface to be implemented by backends.


![Image: CloudFoundry Garden BOSH Architecture](/images/cloud/cf/cloudfoundry-garden-bosh.png "CloudFoundry Garden BOSH Architecture")
{: .center}

## How Garden-runC Creates Containers

Diego currently uses Garden-runC to construct Linux containers.

Both Docker and Garden-runC use libraries from the Open Container Initiative (OCI) to build Linux containers. After creation, these containers use name space isolation, or namespaces, and control groups, or cgroups, to isolate processes in containers and limit resource usage. These are common kernel resource isolation features used by all Linux containers.

Before Garden-runC creates a Linux container, it creates a file system that is mounted as the root file system of the container. Garden-runC supports mounting Docker images as the root file systems for the containers it creates.

When creating a container, both Docker and Garden-runC perform the following actions:

Fetch and cache the individual layers associated with a Docker image
Combine and mount the layers as the root file system
These actions produce a container whose contents exactly match the contents of the associated Docker image.

Earlier versions of Diego used Garden-Linux. For more information, see the Garden topic.


![Image: CloudFoundry Garden-runC Architecture](/images/cloud/cf/cloudfoundry-garden-runc.png)
{: .center}


[guardian]:https://github.com/cloudfoundry/guardian/
