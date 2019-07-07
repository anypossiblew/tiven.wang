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
    title: "Wireguard VPN: Typical Setup"
    url: "https://www.ckn.io/blog/2017/11/14/wireguard-vpn-typical-setup/"
    
---

* TOC
{:toc}

## gCloud VM Server

Google Compute Engine (called SERVER 1)

* Zone: us-east1-b (use whichever you'd like)
* g1-small (1 vCPU, 1.7GB Memory)
* Static external IP set
* Allow udp/`<51840>` ingress in Firewall rules

### Create gCloud VM

创建一个 google Cloud Compute Engine VM instance, 我选择的区域是 `us-west2` 洛杉矶，操作系统是 `Ubuntu 18.04 LTS`

## WireGuard Server

### Step 1. Install the required packages

首先添加 wireguard 的库 `sudo add-apt-repository ppa:wireguard/wireguard`

```sh
tiven@instance-1:~$ sudo add-apt-repository ppa:wireguard/wireguard

 WireGuard is a novel VPN that runs inside the Linux Kernel. This is the Ubuntu packaging for WireGuard. More info may be found at its website, listed below.

More info: https://www.wireguard.com/
Packages: wireguard wireguard-tools wireguard-dkms

Install with: $ apt install wireguard

For help, please contact <email address hidden>
 More info: https://launchpad.net/~wireguard/+archive/ubuntu/wireguard
Press [ENTER] to continue or ctrl-c to cancel adding it

gpg: keyring '/tmp/tmp4mj9c0ro/secring.gpg' created
gpg: keyring '/tmp/tmp4mj9c0ro/pubring.gpg' created
gpg: requesting key 504A1A25 from hkp server keyserver.ubuntu.com
gpg: /tmp/tmp4mj9c0ro/trustdb.gpg: trustdb created
gpg: key 504A1A25: public key "Launchpad PPA for wireguard-ppa" imported
gpg: Total number processed: 1
gpg:               imported: 1  (RSA: 1)
OK
```

然后更新软件信息 `sudo apt-get update`

```sh
tiven@instance-1:~$ sudo apt-get update
...
Fetched 1,943 kB in 2s (865 kB/s)
Reading package lists... Done
```

安装 wireguard `sudo apt-get install wireguard`

```sh
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

### Step 2. Create a private key

We need to generate a private key on this server

```sh
tiven@instance-1:~$ (umask 077 && printf "[Interface]\nPrivateKey = " | sudo tee /etc/wireguard/wg0.conf > /dev/null)
tiven@instance-1:~$ wg genkey | sudo tee -a /etc/wireguard/wg0.conf | wg pubkey | sudo tee /etc/wireguard/publickey
28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
```

这里输出的是客户端需要的 public key, 也可以通过下面命令获得

```sh
tiven@instance-1:~$ cat /etc/wireguard/publickey
28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
```

### Step 3. Create the configuration file

编辑配置文件 `sudo nano /etc/wireguard/wg0.conf`

```sh
[Interface]
PrivateKey = MNMNCJ/4Ruybx/KE9fiBqTEtcdZe2PFszV+C3JKAlUs=
ListenPort = 51840
SaveConfig = true
Address = 10.0.0.1/24
```

然后启动 wg 服务 `sudo systemctl start wg-quick@wg0`

## Client

客户端可以选用开源的 TunSafe, 手机上使用 WireGuard 客户端比较好

### 配置

使用 TunSafe 可以生成 Key Pair, 其中 `private key` 配在客户端, `public key` 配在服务端. 客户端配置文件

```text
[Interface]
PrivateKey = cNHR6bAs278DH1JhQmlzQWUumPwWKAAbVTcqrFKxVUc=
Address = 10.0.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = 28CNION3/w0iHlTy/f22ltd+4OLdDwrofK2KOSyGjDg=
Endpoint = 35.198.219.20:51840
AllowedIPs = 0.0.0.0/0
```

在 gCloud VM 上使用命令 `sudo wg set wg0 peer 439nCgce2+BRJVIvn8UoTt2w8oS842VFJVntCIXXUCI= allowed-ips 10.0.0.2/32` 把客户端的 `public key` 更新到服务端上. 然后重启查看服务信息

```sh
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

```sh
tiven@instance-1:~$ sudo systemctl enable wg-quick@wg0
Created symlink from /etc/systemd/system/multi-user.target.wants/wg-quick@wg0.service to /lib/systemd/system/wg-quick@.service.
```

到目前为止, 客户端（TunSafe）和服务端（VPS）双方可通信，但要让客户端能使用服务端的网络访问互联网则需要为服务端设置路由转发规则。

## IP forwarding in server

```sh
PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o ens4 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o ens4 -j MASQUERADE
SaveConfig = true
```

https://www.stavros.io/posts/how-to-configure-wireguard/

启用 IP 转发功能 `sudo nano /etc/sysctl.conf`
```
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

保存设置 `sudo sysctl -p`，使用 `echo 1 > /proc/sys/net/ipv4/ip_forward` 设置一下现在的配置就不用重启系统了。

请使用最新版的 Ubuntu 系统，我的版本是 Ubuntu 18.04.1 LTS (GNU/Linux 4.15.0-1025-gcp x86_64)。旧版本如 16.04 在网络上可能会有问题。

https://www.reddit.com/r/China/comments/68lk5n/wireguard_in_china/

https://github.com/StreisandEffect/streisand/issues/413

http://blog.zorinaq.com/my-experience-with-the-great-firewall-of-china/

https://wiki.archlinux.org/index.php/WireGuard

https://www.ericlight.com/wireguard-part-one-installation.html

### DNS Leak

http://dnsleak.com

https://www.ckn.io/blog/2017/11/14/wireguard-vpn-typical-setup/

安装 unbound DNS (亲测成功@20190705)

```sh
sudo apt-get install unbound unbound-host
sudo curl -o /var/lib/unbound/root.hints https://www.internic.net/domain/named.cache
sudo nano /etc/unbound/unbound.conf
```

填入如下内容，`10.0.0.0` 是你设置的 wireguard 地址范围

```yaml
server:

  num-threads: 4

  #Enable logs
  verbosity: 1

  #list of Root DNS Server
  root-hints: "/var/lib/unbound/root.hints"

  #Use the root servers key for DNSSEC
  auto-trust-anchor-file: "/var/lib/unbound/root.key"

  #Respond to DNS requests on all interfaces
  interface: 0.0.0.0
  max-udp-size: 3072

  #Authorized IPs to access the DNS Server
  access-control: 0.0.0.0/0                 refuse
  access-control: 127.0.0.1                 allow
  access-control: 10.0.0.0/24         allow

  #not allowed to be returned for public internet  names
  private-address: 10.0.0.0/24

  # Hide DNS Server info
  hide-identity: yes
  hide-version: yes

  #Limit DNS Fraud and use DNSSEC
  harden-glue: yes
  harden-dnssec-stripped: yes
  harden-referral-path: yes

  #Add an unwanted reply threshold to clean the cache and avoid when possible a DNS Poisoning
  unwanted-reply-threshold: 10000000

  #Have the validator print validation failures to the log.
  val-log-level: 1

  #Minimum lifetime of cache entries in seconds
  cache-min-ttl: 1800

  #Maximum lifetime of cached entries
  cache-max-ttl: 14400
  prefetch: yes
  prefetch-key: yes
```

```sh
sudo chown -R unbound:unbound /var/lib/unbound
sudo systemctl enable unbound
sudo systemctl status unbound
```

> The problem with Ubuntu 18.04 is the systemd-resolved service which is listening on port 53 and therefore conflicts with unbound. Below in the solution which has also been added to the readme.
>
> If there is another service listening on port 53, you will have issues with getting DNS resolution working.
It is therefore advisable to either disable or change the port of any service already using port 53.
An example of this is the systemd-resolved service on Ubuntu 18.04. You should switch off binding to port 53 by editing the file /etc/systemd/resolved.conf as follows:
  ```yaml
  DNSStubListener=no
  ```
>Reboot the VPN server and DNS resolution will work as expected.

在 gcloud vm 里测试一下 DNS 服务怎么样

```sh
nslookup www.google.com. 10.0.0.1
Server:         10.0.0.1
Address:        10.0.0.1#53
Non-authoritative answer:
Name:   www.google.com
Address: 172.217.14.100
Name:   www.google.com
Address: 2607:f8b0:4007:80e::2004

#Testing DNSSEC
sudo unbound-host -C /etc/unbound/unbound.conf -v ietf.org
[1562334351] libunbound[1951:0] notice: init module 0: validator
[1562334351] libunbound[1951:0] notice: init module 1: iterator
ietf.org has address 4.31.198.44 (secure)
ietf.org has IPv6 address 2001:1900:3001:11::2c (secure)
ietf.org mail is handled by 0 mail.ietf.org. (secure)
```

### Tor

## azirevpn

## Streisand

https://github.com/StreisandEffect/streisand

https://twitter.com/streisandvpn

http://blackholecloud.com/

## 其他环境客户端

### Linux

add-apt-repository is a command line utility for adding PPA (Personal Package Archive) in Ubuntu and Debian Systems. Install the following package based on your operating system to have the add-apt-repository command. install software-properties-common package to get add-apt-repository command.

```sh
sudo apt-get install -y software-properties-common
```

To install clang version (currently 6.0) run:

```sh
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