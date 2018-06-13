---
layout: post
theme: UbuntuMono
title: "Setup Shadowsocks VPN using Docker"
excerpt: ""
modified: 2018-06-12T11:51:25-04:00
categories: articles
tags: [Shadowsocks, VPN, Docker, AWS]
image:
  vendor: twitter
  feature: /media/Dd5LgMEVwAENVEO.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/999319186018103296
comments: true
share: true
showYourTerms: true
---

<style>
.showyourterms.gce-instance .type:before {
  content: "tiven_wang@instance-1:~$ "
}
</style>

* TOC
{:toc}

首先我们要有一台外网云服务器，例如 [Google Cloud Platform Compute Engine][google-cloud] 或者 [AWS EC2][aws-ec2]

看一下收费标准，如 [Google Cloud 流量计费标准](https://cloud.google.com/compute/pricing#internet_egress)

假设你已经登录创建的虚拟机 SSH，我们选择的是 Ubuntu linux 系统

<div class='showyourterms gce-instance' data-title="GCE tiven_wang@instance-1:~">
  <div class='showyourterms-container'>
    <div class='lines' data-delay='400'>
Welcome to Ubuntu 16.04.4 LTS (GNU/Linux 4.13.0-1017-gcp x86_64)
 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage
  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud
29 packages can be updated.
16 updates are security updates.
Last login: Wed Jun 13 09:17:00 2018 from 100.155.47.154
    </div>
    <div class='type green' data-action='command' data-delay='400'>sudo apt-get update</div>
    <div class='type green' data-action='command' data-delay='400'>sudo apt-get install -y docker.io</div>
  </div>
</div>



https://yq.aliyun.com/articles/599205

https://yq.aliyun.com/articles/87641?spm=a2c4e.11153940.blogcont599205.22.3fcb1482469qsH

https://blog.csdn.net/technofiend/article/details/52452572

https://www.digitalocean.com/community/tutorials/how-to-run-openvpn-in-a-docker-container-on-ubuntu-14-04

https://www.ovpn.com/en/guides/raspberry-pi-raspbian

[google-cloud]:https://console.cloud.google.com/compute
[aws-ec2]:https://aws.amazon.com/ec2/
[docker/shadowsocks]:https://hub.docker.com/r/mritd/shadowsocks/
