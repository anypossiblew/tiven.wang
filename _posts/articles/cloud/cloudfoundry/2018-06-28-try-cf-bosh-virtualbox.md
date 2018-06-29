---
layout: post
theme: UbuntuMono
title: "BOSH - Installation on VMs using VirtualBox"
excerpt: "Installing BOSH on VMs using VirtualBox"
modified: 2018-06-28T11:51:25-04:00
categories: articles
tags: [BOSH, Cloud Foundry, Cloud]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1972.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/chargheri-india-1972
comments: true
share: true
references:
  - id: 1
    title: "BOSH Lite on VirtualBox"
    url: https://bosh.io/docs/bosh-lite/
  - id: 2
    title: "Deploying Cloud Foundry on Virtualbox using BOSH CLI v2"
    url: https://banck.net/2017/03/deploying-cloud-foundry-virtualbox-using-bosh-cli-v2/
---


* TOC
{:toc}

首先你需要一个 BOSH CLI 工具才能创建和操作 BOSH Platform

https://bosh.io/docs/bosh-lite/

Ubuntu on Windows
```
tiven@PVGN50938586A:~$ curl -o ./Downloads/bosh-cli-3.0.1-linux-amd64 https://s3.amazonaws.com/bosh-cli-artifacts/bosh-c
li-3.0.1-linux-amd64
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 26.3M  100 26.3M    0     0  44774      0  0:10:17  0:10:17 --:--:-- 86886
tiven@PVGN50938586A:~$ chmod +x ~/Downloads/bosh-cli-*
tiven@PVGN50938586A:~$ sudo mv ~/Downloads/bosh-cli-* /usr/local/bin/bosh
tiven@PVGN50938586A:~$ bosh -v
version 3.0.1-712bfd7-2018-03-13T23:26:43Z

Succeeded
```

```
docker run --name my-bosh-cli -it -v ${$pwd}:/usr/local/vbox -w /usr/local/vbox  bosh/cli2
```

```
bosh create-env ./bosh-deployment/bosh.yml \
  --state ./state.json \
  -o ./bosh-deployment/virtualbox/cpi.yml \
  -o ./bosh-deployment/virtualbox/outbound-network.yml \
  -o ./bosh-deployment/bosh-lite.yml \
  -o ./bosh-deployment/bosh-lite-runc.yml \
  -o ./bosh-deployment/uaa.yml \
  -o ./bosh-deployment/credhub.yml \
  -o ./bosh-deployment/jumpbox-user.yml \
  --vars-store ./creds.yml \
  -v director_name=bosh-lite \
  -v internal_ip=192.168.50.6 \
  -v internal_gw=192.168.50.1 \
  -v internal_cidr=192.168.50.0/24 \
  -v outbound_network_name=NatNetwork
```
