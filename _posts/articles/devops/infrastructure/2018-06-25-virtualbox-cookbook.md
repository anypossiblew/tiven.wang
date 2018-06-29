---
layout: post
theme: UbuntuMono
title: "VirtualBox Cookbook"
excerpt: "VirtualBox Cookbook"
modified: 2018-06-25T11:51:25-04:00
categories: articles
tags: [VirtualBox, Linux]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2442.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/baku-azerbaijan-2442
comments: true
share: true
---

* TOC
{:toc}

### Add VBoxManage command to Windows PATH
1. Find the folder VBoxManage.exe is in
  It is usually here `C:\Program Files\Oracle\VirtualBox`
2. Verify the VBoxManage folder you have
3. Add the VBoxManage folder to your classpath
4. Close & open CMD prompt. Re-issue VBoxManage
5. DRY (Don’t Repeat Yourself)

#### References
* https://www.build-business-websites.co.uk/add-vboxmanage-to-path/

### Run Vbox in Bash on Windows

VirtualBox relies a lot on the hardware it is running on and it does not understand Bash on Windows. Running Vbox on BoW is never have been the intention of either Canonical, Microsoft or Oracle.

As explained by [Microsoft](http://www.pcworld.com/article/3050473/windows/heres-how-windows-10s-ubuntu-based-bash-shell-will-actually-work.html):

> This is a developer toolset to help you write and build all your code for all your scenarios and platforms.” It’s not a full Ubuntu virtual machine. You can’t use it to host servers, as you could on Linux.
{: .Quotes}

#### References
* https://askubuntu.com/questions/816343/unable-to-install-virtualbox-in-windows-bash-ubuntu-windows-10

### VirtualBox Host-Only Static IP
VirtualBox 虚拟机系统默认都会有 NAT 网络适配器可以用来访问外网，他是走的主机物理网络适配器。但要使 VM 与 Host 或者 VM 与 VM 之间能相互访问的话，可以再增加一个 Host-Only 网络适配器给虚拟机。关于 VirtualBox Network 各种类型的能力参考 [VirtualBox Networking modes](https://www.virtualbox.org/manual/ch06.html#networkingmodes)

Windows 平台：

* 一般默认都会创建一个 “VirtualBox Host-Only Ethernet Adapter” 在 *Windows Network Connections* 里。如果没有可以 VirtualBox 软件里 *File - Host Network Manager* 里新建一个，并设置相关的 IP Parameters ;
* 打开虚拟机的 *Settings - Network* 界面，添加一个 Adapter 并在 Attached to 里选择 Host-only Adapter，然后在 Name 里便可以选择 “VirtualBox Host-Only Ethernet Adapter” ;
* 启动虚拟机 Ubuntu Linux 系统，使用命令 `ifconfig -a` 查看所有的适配器，你会一个没有 IP 的适配器（我的是叫 "enp0s8"）
* 分配个临时地址，可以用此方法检查 IP 是否可用
```
$ ifconfig enp0s8 192.168.99.101 netmask 255.255.255.0 up
```
对于有 DHCP Server 的网络适配器也可以使用 `dhclient` 自动获取 IP
```
$ sudo dhclient -v enp0s8
```
* 分配个永久的静态 IP
```
$ sudo nano /etc/network/interfaces
```
Add the following to configure eth1 to use a static IP address and come up when the system starts.
```
# The host-only network interface
auto enp0s8
iface enp0s8 inet static
address 192.168.99.101
netmask 255.255.255.0
network 192.168.99.0
broadcast 192.168.99.255
```
如果你在此配置文件中发现注释：
```
# ifupdown has been replaced by netplan(5) on this system. see
# /etc/netplan for current configuration.
# To re-enable ifupdown on this system, you can run:
#   sudo apt install ifupdown
```
所以我们不用 netplan 的话还要安装一下 ifupdown 软件
```
$ sudo apt-get update
$ sudo apt-get install ifupdown2
```
重启系统，再次查看 `ifconfig` 可以看到 enp0s8 适配器的地址就是你设置的固定 IP 了。
再也不用担心 IP 地址会变了。

参考 https://gist.github.com/pjdietz/5768124
