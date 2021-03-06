---
layout: post
theme: UbuntuMono
title: "Linux Cookbook"
excerpt: ""
modified: 2018-06-21T11:51:25-04:00
categories: articles
tags: [Linux]
image:
  vendor: twitter
  feature: /media/DgRBIAKXkAApDrI.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1010003824516517889
comments: true
share: true
---

* TOC
{:toc}


### How to renew or release a Dynamic IP address in Linux
The DHCP client in Linux is called [dhclient][dhclient]. It requests dynamic IP addresses from the DHCP server, which "leases" addresses to clients for a set amount of time. dhclient can be invoked manually to "release" the client's currently assigned IP address, and get another address from the DHCP server.

`sudo dhclient -v`

`sudo dhclient wlan0`

`sudo dhclient -r wlan0`

https://www.computerhope.com/issues/ch001078.htm

### 通过 pid 查看占用端口

`netstat -anp`

### How to set up swap space?
If you want to re-add this service to be started on boot up
```
$ sudo update-rc.d dphys-swapfile defaults
```
修改配置文件
```
$ sudo nano /etc/dphys-swapfile

CONF_SWAPSIZE=1024
```

重启服务
```
$ sudo dphys-swapfile setup
$ sudo dphys-swapfile swapon
```
检查 swap 内存空间
```
$ sudo swapon -s
```
#### References
* https://raspberrypi.stackexchange.com/questions/70/how-to-set-up-swap-space

## Network
### Assign Static IP
修改下面 Network Interfaces 文件，为每个 interface 指定 IP 类型，最好每个 interface 都设置上及时他有默认行为

`sudo nano /etc/network/interfaces`
```
auto enp0s3
iface enp0s3 inet dhcp

auto enp0s8
iface enp0s8 inet static
address 192.168.99.100
netmask 255.255.255.0
network 192.168.99.0
broadcast 192.168.99.255
```

### Change hostname on Ubuntu 18 04

https://websiteforstudents.com/updating-changing-the-hostname-on-ubuntu-18-04-beta-server/

[dhclient]:https://www.computerhope.com/unix/dhclient.htm

### Network

ip addr show

iptables

https://docs.docker.com/network/iptables/

### File Link

[ln](https://en.wikipedia.org/wiki/Ln_(Unix))
