---
layout: post
theme: UbuntuMono
title: "Setup Shadowsocks Proxy using Docker"
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
references:
  - title: "使用ShadowSocks科学上网及突破公司内网"
    url: http://www.devtalking.com/articles/shadowsocks-guide/
  - title: "Medium - 各种加密代理协议的简单对比"
    url: https://medium.com/@Blankwonder/%E5%90%84%E7%A7%8D%E5%8A%A0%E5%AF%86%E4%BB%A3%E7%90%86%E5%8D%8F%E8%AE%AE%E7%9A%84%E7%AE%80%E5%8D%95%E5%AF%B9%E6%AF%94-1ed52bf7a803
---

<style>
.showyourterms.gce-instance .type:before {
  content: "tiven_wang@instance-1:~$ "
}
</style>

* TOC
{:toc}

[Shadowsocks][shadowsocks] is<br/>

A secure socks5 proxy, designed to protect your Internet traffic.

![Image: ss theory](/images/devops/infrastructure/ss/ss-theory.png)
{: .middle.center}

首先我们要有一台外网（相对大局域网来说）云服务器，例如 [Google Cloud Platform Compute Engine][google-cloud] 或者 [AWS EC2][aws-ec2] 等。

看一下收费标准，如 [Google Cloud 流量计费标准](https://cloud.google.com/compute/pricing#internet_egress)

> 本方案在服务端和客户端均使用 [Docker][docker] 工具搭建 Shadowsocks。

## Server
假设你已经登录创建的虚拟机 SSH，我们选择的是 Google Cloud Compute Engine / Ubuntu linux 系统

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

选择使用 Docker 容器镜像 [mritd/shadowsocks][docker/shadowsocks] 来运行 Shadowsocks VPN 服务

<div class='showyourterms gce-instance' data-title="GCE tiven_wang@instance-1:~">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>sudo docker run -dt --name ss -p 6443:6443 mritd/shadowsocks -s "-s 0.0.0.0 -p 6443 -m aes-256-cfb -k mypassword --fast-open"</div>
  </div>
</div>

* `-m` : 指定 shadowsocks 命令，默认为 ss-server
* `-s` : shadowsocks-libev 参数字符串
* `-x` : 开启 kcptun 支持
* `-e` : 指定 kcptun 命令，默认为 kcpserver
* `-k` : kcptun 参数字符串

[KCPTun][kcptun] 是一个使用可信 UDP 来加速 TCP 传输速度的网络软件，参考[使用KCPTun加速Shadowsocks代理](https://blog.csdn.net/farawayzheng_necas/article/details/63255799)。
我们暂时不需要开启。

Docker 容器 Shadowsocks 服务运行在 6443 端口映射成虚拟机的 6443 端口，所以你要为虚拟机的防火墙设置允许外网主机访问虚拟机 6443 端口的规则。

然后再为云虚拟机设置个固定公网 IP ，你就可以使用此 IP 和端口号 6443 （或你自定义的其他端口号）和密码访问 Shadowsocks 服务了。

## Client
Shadowsocks 支持各种平台的客户端程序。
### amd64
```
docker run --restart=always -d --name shadowsocks-client -p 1080:1080 easypi/shadowsocks-libev ss-local -s 35.198.219.20 -p 6443 -m aes-256-cfb -k mypassword -b 0.0.0.0 -l 1080 -t 60 --fast-open
```

### arm
如果要在 arm 架构的 linux 系统上使用 shadowsocks 可以选择 `easypi/shadowsocks-libev-arm` 镜像，如在 Raspberry Pi 上
```
docker run --restart=always -d --name shadowsocks-client -p 1080:1080 -e "SERVER_ADDR=35.198.219.20" -e "SERVER_PORT=6443" -e "METHOD=aes-256-cfb" -e "PASSWORD=mypassword" easypi/shadowsocks-libev-arm

curl -x socks5h://127.0.0.1:1080 https://www.youtube.com/
```

linux 的环境变量 `http_proxy` 不支持 socks5 协议的代理，所以我们需要把 socks5 代理转成 http 代理

### privoxy
[Privoxy][privoxy] 是一款不进行网页缓存且自带过滤功能的代理服务器，针对 HTTP、 HTTPS 协议。通过其过滤功能，用户可以保护隐私、对网页内容进行过滤、管理 Cookie，以及拦阻各种广告等。它也可以与其他代理相连（通常与 [Squid](#squid) 一起使用）。

* `apt-get install privoxy -y` 安装

* 配置 privoxy ,转换 socks 代理为 http 代理

  `nano /etc/privoxy/config` 编辑配置文件，设置转换端口以及监听端口
  ```
  forward-socks5 / 127.0.0.1:1080 . # 转换 socks 为 privoxy
  listen-address 0.0.0.0:8118 # 监听端口 8118， 0.0.0.0 对外提供连接
  ```

* `service privoxy restart` 重启 privoxy 服务
* `systemctl status privoxy.service` 查看服务运行状态
* 测试 `curl --proxy http://127.0.0.1:8118 https://www.google.com`

### polipo
polipo 是另外一种支持 socks5 的 http 代理的工具
```
$ sudo apt-get install polipo
$ polipo socksParentProxy=localhost:1080 &
$ service polipo stop
$ cp /usr/share/doc/polipo/examples/config.sample /etc/polipo/config
$ nano /etc/polipo/config
$ /etc/init.d/polipo restart
$ curl --proxy http://127.0.0.1:8123 https://www.google.com
```

https://www.codevoila.com/post/16/convert-socks-proxy-to-http-proxy-using-polipo


## 课外
### Squid
[Squid Cache][wikipedia/Squid]（简称为 Squid ）是 HTTP 代理服务器软件。Squid 用途广泛的，可以作为缓存服务器，可以过滤流量帮助网络安全，也可以作为代理服务器链中的一环，向上级代理转发数据或直接连接互联网。除了 HTTP 外，对于 FTP 与 HTTPS 的支持也相当好，在 3.0 测试版中也支持了 IPv6。但是 Squid 的上级代理不能使用 SOCKS 协议。


https://yq.aliyun.com/articles/599205

https://yq.aliyun.com/articles/87641?spm=a2c4e.11153940.blogcont599205.22.3fcb1482469qsH

https://blog.csdn.net/technofiend/article/details/52452572

https://www.digitalocean.com/community/tutorials/how-to-run-openvpn-in-a-docker-container-on-ubuntu-14-04

https://www.ovpn.com/en/guides/raspberry-pi-raspbian




[google-cloud]:https://console.cloud.google.com/compute
[aws-ec2]:https://aws.amazon.com/ec2/
[docker/shadowsocks]:https://hub.docker.com/r/mritd/shadowsocks/
[kcptun]:https://github.com/xtaci/kcptun

[shadowsocks]:https://shadowsocks.org/en/index.html
[privoxy]:https://www.privoxy.org/
[wikipedia/Squid]:https://en.wikipedia.org/wiki/Squid_(software)
[wikipedia/Varnish]:https://en.wikipedia.org/wiki/Varnish_(software)

[docker]:https://www.docker.com/
