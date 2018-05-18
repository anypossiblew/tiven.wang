---
layout: post
theme: UbuntuMono
title: "Try Cloud Foundry - Buildpacks"
excerpt: "Buildpacks provide framework and runtime support for apps. Buildpacks typically examine your apps to determine what dependencies to download and how to configure the apps to communicate with bound services."
modified: 2018-05-09T11:51:25-04:00
categories: articles
tags: [Architecture, CloudFoundry]
image:
  vendor: yourshot.nationalgeographic
  feature: /u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNeZxVNzz27-SruegrZZ_4yjZv2SJTTgB-4kEV8P16ySnVyu_W-Q4sYCvWtpBKVYXZkHlxo5i8RQqijlEy15hpnytLKtG_e-qtCY8qgfqrfZ-XZVQvp2Bna2VcQmyU5pvgmc7VNFU-uAqIYHhMecXTpqBr0X26Se4RRcnrD_CMF1ds/
  credit: Aleš K.
  creditlink: https://yourshot.nationalgeographic.com/profile/293407
comments: true
share: true
references:
  - id: 1
    title: "Buildpacks"
    url: https://docs.cloudfoundry.org/buildpacks/
---

* TOC
{:toc}

Cloud Foundry designates two types of VMs: the component VMs that constitute the platform’s infrastructure, and the host VMs that host apps for the outside world. Within CF, the Diego system distributes the hosted app load over all of the host VMs, and keeps it running and balanced through demand surges, outages, or other changes. Diego accomplishes this through an auction algorithm.

![Image: Cloud Foundry BOSH Containers Architecture](/images/cloud/cf/cloudfoundry-bosh-vms.png "Cloud Foundry BOSH Containers Architecture")
{: .center.middle}

To meet demand, multiple host VMs run duplicate instances of the same app. This means that apps must be portable. Cloud Foundry distributes app source code to VMs with everything the VMs need to compile and run the apps locally. This includes the OS stack that the app runs on, and [a buildpack containing all languages, libraries, and services that the app uses](# "就是说 buildpack 负责应用程序所需要的语言环境 依赖包 依赖服务的安装或关联"). Before sending an app to a VM, the Cloud Controller stages it for delivery by combining stack, buildpack, and source code into a droplet that the VM can unpack, compile, and run. For simple, standalone apps with no dynamic pointers, the droplet can contain a pre-compiled executable instead of source code, language, and libraries.

Buildpack 负责语言环境，依赖包，依赖服务的下载安装或配置。 Droplet 则是负责把 [Stack][stacks]，Buildpack 和 源代码整合起来打包，让 VM 可以直接解压，编译和运行。打包好的 Droplet 包含一个预编译的可执行的文件。

![Image: CloudFoundry VM Droplet Buildpack Stack Architecture](/images/cloud/cf/cloudfoundry-vm-droplet-buildpack-stack-arch.png)
{: .small.center}

> Docker apps do not use stacks.
{: .Notes}

## Buildpack Scripts

A buildpack repository may contain the following five scripts in the bin directory:

* `bin/detect` determines whether or not to apply the buildpack to an app.
* `bin/supply` provides dependencies for an app.
* `bin/finalize` prepares the app for launch.
* `bin/release` provides feedback metadata to Cloud Foundry indicating how the app should be executed.
* `bin/compile` is a deprecated alternative to bin/supply and bin/finalize.

[stacks]:https://docs.cloudfoundry.org/devguide/deploy-apps/stacks.html
