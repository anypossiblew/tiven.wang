---
layout: post
theme: UbuntuMono
title: "Ubuntu as a NAS"
excerpt: "How to setup Ubuntu 18 server as a NAS"
modified: 2019-03-05T14:02:25-04:00
categories: articles
tags: [AliGenie, Smart Home, IoT]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1986.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/privolzhsky-district-astrakhan-oblast-russia-1986
comments: true
share: true
---

* TOC
{:toc}

https://askubuntu.com/questions/1266/how-to-set-up-ubuntu-server-as-a-nas

## 网络存储

### Samba

Ubuntu 安装 Samba 服务可以作为网络存储硬盘。

#### Samba 服务器的安装和配置

https://blog.csdn.net/m0_37806005/article/details/82556216

## 后台下载

Ubuntu 系统上的下载软件可以选 uTorrent 或者 qBittorrent。

### uTorrent

uTorrent 是由 BitTorrent Inc 拥有的封闭源的 BitTorrent 客户端。可以按照 [Ubuntu 17.10 安装BT客户端 uTorrent](https://www.linuxidc.com/Linux/2018-02/151063.htm) 文章步骤安装 uTorrent Web UI 或者 GUI。


### qBittorrent

[How to install qBittorrent with webui on Ubuntu?](https://www.smarthomebeginner.com/install-qbittorrent-webui-ubuntu/)

指定 qBittorrent Web UI 的运行端口号 `qbittorrent-nox --webui-port=XXXX`

## 私有云盘系统

[Seafile](https://www.seafile.com/home/) 是一款开源的企业云盘
[Nextcloud](https://nextcloud.com)
[OwnCloud]
[FreeNAS]
[Syncthing]
[filerun]

### Nextcloud

> 最终我没能在 Ubuntu 系统上跑起来 Nextcloud （问题出在 Nextcloud 连不上 Mysql），而是使用 Docker 容器跑起来的，所以读者可以直接调至 [Nextcloud 安装在 Docker 上](#) 章节。

https://www.logcg.com/archives/2750.html

#### Nextcloud 安装在 Docker 上

##### Installation wizard
直接参考官方 [docker hub nextcloud](https://hub.docker.com/_/nextcloud/) 的 [base-version---apache](https://hub.docker.com/_/nextcloud/#base-version---apache) 章节的 docker-compose 配置进行创建，需要修改的有：
* MYSQL_ROOT_PASSWORD 和 MYSQL_PASSWORD 需要填写
* 端口号 8080 可以改成你想要的

##### Data directory location
可以选择不修改此路径

##### Database choice
首次运行可以使用前台方式 `docker-compose up`，起来之后然后访问 `127.0.0.1:8080` 进行 Nextcloud 初始化配置。填写 admin 账号信息，这里重要的是需要填写数据库信息(对应 db 容器里的环境变量值)。
```
host = db
database user = <MYSQL_USER>
database password = <MYSQL_PASSWORD>
database = <MYSQL_DATABASE>
```

##### Trusted domains
默认只能通过 localhost 链接访问，想要通过 IP 地址或者主机名等访问的话，需要添加到 [config.php](/var/lib/docker/volumes/nextcloud_nextcloud/_data/config/config.php)，例如

```php
'trusted_domains' =>
  array (
   0 => 'localhost',
   1 => 'server1.example.com',
   2 => '192.168.1.50',
   3 => '[fe80::1:50]',
),
```

##### 关于 Docker Volumes

```
$ docker volume ls
$ docker volume inspect nextcloud_nextcloud
```

https://docs.docker.com/storage/volumes/

## Ubuntu Firewall Open Port
如果发现同一局域网的电脑也访问不了此 Ubuntu 系统的端口时，可以查看此 Ubuntu 系统的防火墙状态，是否允许相应端口号的外部访问权限。[How To: Ubuntu Linux Firewall Open Port Command](https://www.cyberciti.biz/faq/how-to-open-firewall-port-on-ubuntu-linux-12-04-14-04-lts/)

https://www.linode.com/docs/security/firewalls/configure-firewall-with-ufw/

例如 `sudo ufw allow from 192.168.0.0/16 to any port 8080 proto tcp`