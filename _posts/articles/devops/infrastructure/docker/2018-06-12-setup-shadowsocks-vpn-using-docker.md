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

首先我们要有一台外网（相对大局域网来说）云服务器，例如 [Google Cloud Platform Compute Engine][google-cloud] 或者 [AWS EC2][aws-ec2] 等。

看一下收费标准，如 [Google Cloud 流量计费标准](https://cloud.google.com/compute/pricing#internet_egress)

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

## ARM

<!-- ```
mkdir shadowsocks
cd shadowsocks
wget -O Dockerfile https://raw.githubusercontent.com/mritd/dockerfile/master/shadowsocks/Dockerfile
wget -O entrypoint.sh https://raw.githubusercontent.com/mritd/dockerfile/master/shadowsocks/entrypoint.sh
docker build -t shadowsocks-arm .
``` -->

`easypi/shadowsocks-libev-arm`镜像在 Raspberry Pi 上可以用
```
docker run --restart=always -d --name shadowsocks-client -p 1080:1080 -e "SERVER_ADDR=35.198.219.20" -e "SERVER_PORT=6443" -e "METHOD=aes-256-cfb" -e "PASSWORD=mypassword" easypi/shadowsocks-libev-arm

curl -x socks5h://127.0.0.1:1080 https://www.youtube.com/
```

linux 的环境变量 `http_proxy` 不支持 socks5 协议的代理，所以我们需要把 socks5 代理转成 http 代理

### polipo
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


### privoxy

`apt-get install privoxy -y`

配置 privoxy ,转换 socks 代理为 http 代理
`nano /etc/privoxy/config`　# 编辑配置文件，设置转换端口以及监听端口
```
orward-socks5 / 127.0.0.1:1080 . # 转换 socks 为 privoxy
listen-address 0.0.0.0:8118 # 监听端口 8118， 0.0.0.0 对外提供连接
```

启动privoxy
`service privoxy start`

设置环境变量
`export http_proxy="http://127.0.0.1:8118"`





https://yq.aliyun.com/articles/599205

https://yq.aliyun.com/articles/87641?spm=a2c4e.11153940.blogcont599205.22.3fcb1482469qsH

https://blog.csdn.net/technofiend/article/details/52452572

https://www.digitalocean.com/community/tutorials/how-to-run-openvpn-in-a-docker-container-on-ubuntu-14-04

https://www.ovpn.com/en/guides/raspberry-pi-raspbian




[google-cloud]:https://console.cloud.google.com/compute
[aws-ec2]:https://aws.amazon.com/ec2/
[docker/shadowsocks]:https://hub.docker.com/r/mritd/shadowsocks/
[kcptun]:https://github.com/xtaci/kcptun
