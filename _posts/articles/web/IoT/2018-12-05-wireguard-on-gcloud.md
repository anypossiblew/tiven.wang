---
layout: post
theme: UbuntuMono
title: "SetUp WireGuard server on gCloud"
excerpt: "How to setup a WireGuard server on google cloud?"
modified: 2018-12-06T11:51:25-04:00
categories: articles
tags: [WireGuard, VPN]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1824.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/skali-faroe-islands-1824
comments: true
share: true
references:
  - id: 1
    title: ""
    url: "https://blog.karmacomputing.co.uk/using-wireguard-to-create-a-vpn-tunnel/"
  - id: 2
    title: ""
    url: "https://technofaq.org/posts/2017/10/how-to-setup-wireguard-vpn-on-your-debian-gnulinux-server-with-ipv6-support/"
---

* TOC
{:toc}

## Server

Google Compute Engine (called SERVER 1)

* Zone: us-east1-b (use whichever you'd like)
* g1-small (1 vCPU, 1.7GB Memory)
* Static external IP set
* IP Forwarding turned ON

创建 VM 实例，我选择的区域是 us-west2 洛杉矶，操作系统是 Ubuntu 18.04 LTS


### Step 1 - installing the required packages

首先添加 wireguard 的库

```bash
tiven@instance-1:~$ sudo add-apt-repository ppa:wireguard/wireguard

 WireGuard is a novel VPN that runs inside the Linux Kernel. This is the Ubuntu packaging for WireGuard. More info may be found at its website, listed below.

More info: https://www.wireguard.com/
Packages: wireguard wireguard-tools wireguard-dkms

Install with: $ apt install wireguard

For help, please contact <email address hidden>
 More info: https://launchpad.net/~wireguard/+archive/ubuntu/wireguard
Press [ENTER] to continue or ctrl-c to cancel adding it

gpg: keyring `/tmp/tmp4mj9c0ro/secring.gpg' created
gpg: keyring `/tmp/tmp4mj9c0ro/pubring.gpg' created
gpg: requesting key 504A1A25 from hkp server keyserver.ubuntu.com
gpg: /tmp/tmp4mj9c0ro/trustdb.gpg: trustdb created
gpg: key 504A1A25: public key "Launchpad PPA for wireguard-ppa" imported
gpg: Total number processed: 1
gpg:               imported: 1  (RSA: 1)
OK
```

然后更新软件信息
```
tiven@instance-1:~$ sudo apt-get update
...
Fetched 1,943 kB in 2s (865 kB/s)
Reading package lists... Done
```

安装 wireguard
```
tiven@instance-1:~$ sudo apt-get install wireguard
...
First Installation: checking all kernels...
Building for 4.13.0-1019-gcp and 4.15.0-1025-gcp
Building initial module for 4.13.0-1019-gcp
Done.
wireguard:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/4.13.0-1019-gcp/updates/dkms/
depmod.....
DKMS: install completed.
Building initial module for 4.15.0-1025-gcp
Done.
wireguard:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/4.15.0-1025-gcp/updates/dkms/
depmod.....
DKMS: install completed.
Setting up wireguard-tools (0.0.20181119-wg1~xenial) ...
Setting up wireguard (0.0.20181119-wg1~xenial) ...
Processing triggers for libc-bin (2.23-0ubuntu10) ...
```

### Step 2 - Create a private key

We need to generate a private key on this server
```
tiven@instance-1:~$ (umask 077 && printf "[Interface]\nPrivateKey = " | sudo tee /etc/wireguard/wg0.conf > /dev/null)
tiven@instance-1:~$ wg genkey | sudo tee -a /etc/wireguard/wg0.conf | wg pubkey | sudo tee /etc/wireguard/publickey
28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
```

这里输出的是客户端需要的 public key,也可以通过下面命令获得

```
tiven@instance-1:~$ cat /etc/wireguard/publickey
28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
```

### Step 3 - Create the configuration file

编辑配置文件 `sudo nano /etc/wireguard/wg0.conf`

```
[Interface]
PrivateKey = MNMNCJ/4Ruybx/KE9fiBqTEtcdZe2PFszV+C3JKAlUs=
ListenPort = 51840
SaveConfig = true
Address = 10.0.0.1/24
```

然后启动 wg 服务 `sudo systemctl start wg-quick@wg0`

## Client
客户端可以选用开源的 TunSafe

### Linux
add-apt-repository is a command line utility for adding PPA (Personal Package Archive) in Ubuntu and Debian Systems. Install the following package based on your operating system to have the add-apt-repository command. install software-properties-common package to get add-apt-repository command.
```
sudo apt-get install -y software-properties-common
```

To install clang version (currently 6.0) run:

```
wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | sudo apt-key add -
sudo apt-add-repository "deb http://apt.llvm.org/xenial/ llvm-toolchain-xenial-6.0 main"
sudo apt-get update
sudo apt-get install -y clang-6.0
```
待续。。。

### Raspberry Pi Raspbian
在 Raspbian 系统上安装 TunSafe 客户端，参照 https://tunsafe.com/user-guide/linux

ln -s /usr/local/clang_6.0.0/bin/clang-6.0 /usr/local/clang_6.0.0/bin/clang++-6.0

[Raspberry Pi - Install Clang 6](https://solarianprogrammer.com/2018/04/22/raspberry-pi-raspbian-install-clang-compile-cpp-17-programs/)

```
wget http://releases.llvm.org/6.0.0/clang+llvm-6.0.0-armv7a-linux-gnueabihf.tar.xz
```

> TunSafe 在 Raspbian 系统上安装没有成功。

### 配置
使用 TunSafe 可以生成 Key Pair, private key 配在客户端, public key 配在服务端. 客户端配置文件
```
[Interface]
PrivateKey = cNHR6bAs278DH1JhQmlzQWUumPwWKAAbVTcqrFKxVUc=
Address = 10.0.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = 28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
Endpoint = 35.198.219.20:51840
AllowedIPs = 0.0.0.0/0
```

使用命令 `sudo wg set wg0 peer 439nCgce2+BRJVIvn8UoTt2w8oS842VFJVntCIXXUCI= allowed-ips 10.0.0.2/32` 把客户端的 public key 更新到服务端上

```
tiven@instance-1:~$ sudo systemctl start wg-quick@wg0
tiven@instance-1:~$ ip addr show wg0
8: wg0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1380 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none 
    inet 35.198.219.20/32 scope global wg0
       valid_lft forever preferred_lft forever
tiven@instance-1:~$ systemctl status wg-quick@wg0
● wg-quick@wg0.service - WireGuard via wg-quick(8) for wg0
   Loaded: loaded (/lib/systemd/system/wg-quick@.service; disabled; vendor preset: enabled)
   Active: active (exited) since Wed 2018-12-05 10:14:02 UTC; 56s ago
     Docs: man:wg-quick(8)
           man:wg(8)
           https://www.wireguard.com/
           https://www.wireguard.com/quickstart/
           https://git.zx2c4.com/WireGuard/about/src/tools/man/wg-quick.8
           https://git.zx2c4.com/WireGuard/about/src/tools/man/wg.8
  Process: 8706 ExecStart=/usr/bin/wg-quick up %i (code=exited, status=0/SUCCESS)
 Main PID: 8706 (code=exited, status=0/SUCCESS)

Dec 05 10:14:01 instance-1 systemd[1]: Starting WireGuard via wg-quick(8) for wg0...
Dec 05 10:14:02 instance-1 wg-quick[8706]: [#] ip link add wg0 type wireguard
Dec 05 10:14:02 instance-1 wg-quick[8706]: [#] wg setconf wg0 /dev/fd/63
Dec 05 10:14:02 instance-1 wg-quick[8706]: [#] ip address add 35.198.219.20 dev wg0
Dec 05 10:14:02 instance-1 wg-quick[8706]: [#] ip link set mtu 1380 dev wg0
Dec 05 10:14:02 instance-1 wg-quick[8706]: [#] ip link set wg0 up
Dec 05 10:14:02 instance-1 systemd[1]: Started WireGuard via wg-quick(8) for wg0.
anypossible_w@instance-1:~$ sudo wg
interface: wg0
  public key: 28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
  private key: (hidden)
  listening port: 51840
```

创建为系统服务,当系统启动时自动启动服务
```
tiven@instance-1:~$ sudo systemctl enable wg-quick@wg0
Created symlink from /etc/systemd/system/multi-user.target.wants/wg-quick@wg0.service to /lib/systemd/system/wg-quick@.service.
```

到目前为止,客户端（TunSafe）和服务端（VPS）双方可通信，但要让客户端能使用服务端的网络访问互联网则需要为服务端设置路由转发规则。

## IP forwarding in server

```
PostUp = 
iptables -A FORWARD -i wg0 -j ACCEPT; 
iptables -t nat -A POSTROUTING -o ens4 -j MASQUERADE; 
ip6tables -A FORWARD -i wg0 -j ACCEPT; 
ip6tables -t nat -A POSTROUTING -o ens4 -j MASQUERADE; 
iptables -A FORWARD -i ens4 -j ACCEPT; 
iptables -t nat -A POSTROUTING -o wg0 -j MASQUERADE; 
ip6tables -A FORWARD -i ens4 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o wg0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ens4 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o ens4 -j MASQUERADE; iptables -D FORWARD -i ens4 -j ACCEPT; iptables -t nat -D POSTROUTING -o wg0 -j MASQUERADE; ip6tables -D FORWARD -i ens4 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o wg0 -j MASQUERADE
SaveConfig = true
```

PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o ens4 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o ens4 -j MASQUERADE

PostUp   = 
iptables -A FORWARD -i %i -j ACCEPT; 
iptables -A FORWARD -o %i -j ACCEPT; 
iptables -t nat -A POSTROUTING -o ens4 -j MASQUERADE

PostDown = 
iptables -D FORWARD -i %i -j ACCEPT; 
iptables -D FORWARD -o %i -j ACCEPT; 
iptables -t nat -D POSTROUTING -o ens4 -j MASQUERADE

https://www.stavros.io/posts/how-to-configure-wireguard/

启用 IP 转发功能 `sudo nano /etc/sysctl.conf`
```
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

保存设置 `sudo sysctl -p`，使用 `echo 1 > /proc/sys/net/ipv4/ip_forward` 设置一下现在的配置就不用重启系统了。

请使用最新版的 Ubuntu 系统，我的版本是 Ubuntu 18.04.1 LTS (GNU/Linux 4.15.0-1025-gcp x86_64)。旧版本如 16.04 在网络上可能会有问题。

sudo iptables -t nat -L -v -n

ip route list
ip route show

iptables 和 ip route 区别？

ip route get 180.110.176.73 | sed '/ via [0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/{s/^\(.* via [0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\).*/\1/}' | head -n 1

还是上不了网，只能做到双方相互通信。

https://www.reddit.com/r/China/comments/68lk5n/wireguard_in_china/

https://github.com/StreisandEffect/streisand/issues/413

http://blog.zorinaq.com/my-experience-with-the-great-firewall-of-china/

https://wiki.archlinux.org/index.php/WireGuard

https://www.ericlight.com/wireguard-part-one-installation.html

### DNS Leak

http://dnsleak.com

https://www.ckn.io/blog/2017/11/14/wireguard-vpn-typical-setup/

### Tor


## azirevpn

## Streisand

https://github.com/StreisandEffect/streisand

https://twitter.com/streisandvpn

http://blackholecloud.com/
