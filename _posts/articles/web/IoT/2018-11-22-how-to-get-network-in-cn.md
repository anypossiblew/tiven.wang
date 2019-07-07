---
layout: post
theme: UbuntuMono
title: "教你怎么在国内上网"
excerpt: "教你怎么在国内上网? "
modified: 2018-11-22T11:51:25-04:00
categories: articles
tags: [Raspberry Pi, VPN]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5686.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/dunfield-united-kingdom-5686
comments: true
share: true
references:
  - id: 1
    title: "Iptables详解"
    url: "https://blog.csdn.net/reyleon/article/details/12976341"
  - id: 2
    title: "iptables详解及一些常用规则"
    url: "https://www.jianshu.com/p/ee4ee15d3658 http://seanlook.com/2014/02/23/iptables-understand/ http://www.zsythink.net/archives/1199"
---

* TOC
{:toc}

https://mba811.gitbooks.io/web-study/content/index.html

https://github.com/googlehosts/hosts

https://studymakesmehappy.blogspot.com/2018/06/2018.html

https://openwrt.org/

## Raspberry Pi VPN/Tor 路由

https://www.techapple.com/archives/12838

[用Hostapd创建可用的软AP](https://blog.csdn.net/qq_20448859/article/details/54131187)


pptp-linux

Advanced IP Scanner

[RouteryPi](https://github.com/Phoenix1747/RouteryPi) is a simple WiFi access point made out of a Raspberry Pi Zero W.

https://www.youtube.com/watch?v=4QFrMum4_yE

## 安装 Raspberry PI 系统

从 https://www.raspberrypi.org/downloads 网站下载系统镜像，然后使用 Etcher 刷到闪存。

第一次运行 Raspbian 系统需要连接 显示器、键盘、鼠标（如果没有 Desktop 界面可以不用鼠标）、网线（如果使用有线网络）。首次使用最好修改默认用户 `pi` 的默认密码 `raspberry`。

### 配置系统 SSH

如果有界面可以在使用 开始/首选项/Raspberry Pi Configuration 来设置系统，包括启用 SSH 功能。也可以在终端命令行里运行 `sudo raspi-config` 来设置。

### 远程连接 Raspberry Pi

在电脑终端里使用命令 `ssh pi@192.168.2.193` （ IP 地址更换成你的 Raspberry Pi 的实际 IP 地址）连接上 Raspberry Pi 系统。

## 安装 RouteryPi

[RouteryPi](https://github.com/Phoenix1747/RouteryPi) is a WiFi access point based on a Raspberry Pi Zero W.

在安装 RouteryPi 之前，使用 `sudo apt update && sudo apt full-upgrade` 更新软件库信息，然后重启系统。

可以选择执行 [RouteryPi](https://github.com/Phoenix1747/RouteryPi) 的自动化脚本安装，也可以选择手动安装。为了学习我们选择手动安装相关软件。

* 安装 hostapd 和 bridge-utils ：`sudo apt install hostapd bridge-utils`
* 配置 hostapd.conf
运行命令 `sudo nano /etc/hostapd/hostapd.conf` 编辑 hostapd.conf 文件，填入

```
# Bridge mode
bridge=br0

# Networking interface
interface=wlan0

# WiFi configuration
ssid=RouteryPi
channel=1
hw_mode=g
country_code=CN
ieee80211n=1
ieee80211d=1
wmm_enabled=1

# WiFi security
auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP
wpa_passphrase=YourCustom!PassWordWhichShou1dBePrettyStronG123$%
```

其中 `country_code=US` 要改成你的国家代号，`wpa_passphrase=` 改成你的无线密码。

* 编辑 interfaces `sudo nano /etc/network/interfaces` 填入内容

```
auto lo
iface lo inet loopback

# Ethernet
auto eth0
allow-hotplug eth0
iface eth0 inet manual

# WiFi
auto wlan0
allow-hotplug wlan0
iface wlan0 inet manual
wireless-power off

# Bridge
auto br0
iface br0 inet dhcp
bridge_ports eth0 wlan0
bridge_fd 0
bridge_stp off
```

This will result in the Pi using DHCP which means it can be used in any network. The downside of this is that you have to find out the IP address if you want to, let's say, use SSH. You could use a static IP address by changing the br0(!) interface config a little bit - just google 'static ip raspberry pi'. (For the lazy: https://duckduckgo.com/?q=static+ip+raspberry+pi)

然后重启系统 `sudo reboot`。

* 测试 hostapd：运行命令 `sudo hostapd /etc/hostapd/hostapd.conf` 如果没有自动退出，则运行正常，可以在无线网络中找到这个无线热点了名叫 `RouteryPi`。连接上检验是否能上网。如果有问题可以使用 `sudo hostapd -dd /etc/hostapd/hostapd.conf` 进行调试。如果测试没问题最后一步就是把 hostapd 加入系统服务自动启动。

* 编辑 hostapd `sudo nano /etc/default/hostapd`，填入内容

```
RUN_DAEMON=yes
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

You're ready to go! From now on hostapd will start whenever your Pi boots up.

重启系统后 RouteryPi 无线热点就会自动启动。

最后可以用 [speedtest.net](www.speedtest.net) 测一下网速。

## 为路由器安装 VPN

### 安装 Shawdowsocks VPN

参考 [Setup Shadowsocks client with docker / in ARM architecture](/articles/setup-shadowsocks-proxy-using-docker/#arm)

### IP Forwarding

查询 `net.ipv4.ip_forward` 的值

```
$ sysctl net.ipv4.ip_forward
net.ipv4.ip_forward = 0
```

或者直接输出配置内容 `cat /proc/sys/net/ipv4/ip_forward` 为 0 代表 *disabled*

开启 __IP Forwarding__ 功能

`sysctl -w net.ipv4.ip_forward=1`

或者

`echo 1 > /proc/sys/net/ipv4/ip_forward`

这样只是一次性的，在系统重启后就会消失。
想要持久会更改此设置，在文件 `/etc/sysctl.conf` 中添加一行

```text
net.ipv4.ip_forward = 1
```

http://www.ducea.com/2006/08/01/how-to-enable-ip-forwarding-in-linux/

### iptables

`$ sudo iptables –t nat –A POSTROUTING –o vpn0 -j MASQUERADE`
`$ sudo iptables –A FORWARD –i wlan1 –o vpn0 -j ACCEPT`
`$ sudo iptables –A FORWARD –i vpn0 -o wlan1 –m state --state RELATED,ESTABLISHED –j ACCEPT`

### redsocks

[redsocks][redsocks] allows you to redirect any TCP connection to SOCKS or HTTPS proxy using your firewall, so redirection is system-wide.

安装

`sudo apt-get install redsocks`

配置 /etc/redsocks.conf 文件

```
```

添加 iptables 转发规则。

```
# Specify your shadowsocks server
SS_SERVER_IP=35.198.219.20

iptables -t nat -N REDSOCKS # Create a new chain called REDSOCKS

# Do not redirect to shadowsocks server
iptables -t nat -A REDSOCKS -d $SS_SERVER_IP -j RETURN

# Do not redirect local traffic
iptables -t nat -A REDSOCKS -d 0.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 10.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 127.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 169.254.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 172.16.0.0/12 -j RETURN
iptables -t nat -A REDSOCKS -d 192.168.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 224.0.0.0/4 -j RETURN
iptables -t nat -A REDSOCKS -d 240.0.0.0/4 -j RETURN

# Redirect all TCP traffic to redsocks, which listens on port 12345
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 8118

# These traffic go to REDSOCKS chain first
iptables -t nat -A PREROUTING -p tcp -j REDSOCKS
```

查看 iptables 配置详细列表 `iptables -t nat -L -n`

保存 iptables 配置永久保存？

启动 redsocks 服务

```
root@raspberrypi:/home/pi# /etc/init.d/redsocks start
[ ok ] Starting redsocks (via systemctl): redsocks.service.
```

查看服务运行状态 `systemctl status redsocks`

```
● redsocks.service - Redsocks transparent SOCKS proxy redirector
   Loaded: loaded (/lib/systemd/system/redsocks.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2018-11-27 22:57:30 CST; 12min ago
     Docs: man:redsocks(8)
           file:/usr/share/doc/redsocks/README.gz
  Process: 836 ExecStart=/usr/sbin/redsocks -c ${CONFFILE} (code=exited, status=0/SUCCESS)
  Process: 824 ExecStartPre=/usr/sbin/redsocks -t -c ${CONFFILE} (code=exited, status=0/SUCCESS)
 Main PID: 845 (redsocks)
      CPU: 17ms
   CGroup: /system.slice/redsocks.service
           └─845 /usr/sbin/redsocks -c /etc/redsocks.conf

11月 27 22:57:30 raspberrypi systemd[1]: Starting Redsocks transparent SOCKS proxy redirector...
11月 27 22:57:30 raspberrypi systemd[1]: Started Redsocks transparent SOCKS proxy redirector.
11月 27 22:57:30 raspberrypi redsocks[845]: redsocks started, conn_max=128
```

http://blog.anthonywong.net/2015/07/12/deploy-shadowsocks-chinadns-redsocks-raspberry-pi/

https://blog.chih.me/global-proxy-within-redsocks-and-shadowsocks.html

### Securing DNS Traffic in China

#### DNS 污染

DNS 污染是什么，如何查看 DNS 污染

1. 点“开始”-“运行”-输入 CMD，再输入 `ipconfig /all` ，在下 DNS SERVER 里找到你使用的 DNS 服务器地址。
2. 再输入 nslookup abc.com（你的域名） 你的DNS服务器IP ，来查看是否能解析。
3. 再输入 nslookup abc.com 8.8.8.8 使用 Google 的 DNS 服务器验证。

#### DNScrypt

[SimpleDnscrypt](https://simplednscrypt.org/)

[MacOS 下使用 DNSmasq 和 DNScrypt 防止污染](https://polynomia.github.io/dns_proxy/) 试试 DNSmasq + DNScrypt proxy + DNScrypt server (VPS) 方式防 DNS 污染。

DNS 防污染(DNScrypt)，国内 IP 白名单(DNSmasq)

[Securing DNS Traffic in China
](http://blog.anthonywong.net/2016/01/18/securing-dns-traffic-in-china/)

* 第一步安装 dnscrypt-proxy

`sudo apt-get install dnscrypt-proxy`

/etc/default/dnscrypt-proxy:

```text
DNSCRYPT_PROXY_LOCAL_ADDRESS=127.0.0.1:5353
```

更改配置文件 /etc/dnscrypt-proxy/dnscrypt-proxy.conf

```text
ResolverName dnscrypt.eu-dk
Daemonize no

# LocalAddress only applies to users of the init script. systemd users must
# change the dnscrypt-proxy.socket file.
LocalAddress 127.0.0.1
```

参考 https://github.com/dyne/dnscrypt-proxy/blob/master/dnscrypt-proxy.conf

https://github.com/dyne/dnscrypt-proxy/blob/master/dnscrypt-resolvers.csv

* 查看服务状态

`systemctl status dnscrypt-proxy`
`systemctl status dnscrypt-proxy.socket`

`systemctl disable dnscrypt-proxy.socket`
`systemctl enable dnscrypt-proxy.service`

reboot

用命令启动服务
`sudo dnscrypt-proxy /etc/dnscrypt-proxy/dnscrypt-proxy.conf --resolver-name=dnscrypt.eu-dk`

https://www.opendns.com/

#### DNSCrypt server

[How to setup your own DNSCrypt server in less than 10 minutes](https://github.com/jedisct1/dnscrypt-proxy/wiki/How-to-setup-your-own-DNSCrypt-server-in-less-than-10-minutes)

### dnsmasq

`sudo apt-get install dnsmasq`

systemctl status dnsmasq

如果发现服务启动失败是因为 53 端口号被占用，可以用命令 `sudo netstat -anlp | grep -w LISTEN` 查看系统正在监听的端口号

```text
tcp        0      0 127.0.2.1:53            0.0.0.0:*               LISTEN      1/init
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      864/sshd
tcp        0      0 127.0.0.1:12345         0.0.0.0:*               LISTEN      1747/redsocks
tcp6       0      0 :::22                   :::*                    LISTEN      864/sshd
tcp6       0      0 :::1080                 :::*                    LISTEN      1320/docker-proxy
```

可以看到监听 127.0.2.1:53 的是程序 /init ,这不是系统程序吗，然后用系统命令 `systemctl list-sockets` 查看详情

```text
LISTEN                          UNIT                            ACTIVATES
/dev/rfkill                     systemd-rfkill.socket           systemd-rfkill.service
/run/systemd/fsck.progress      systemd-fsckd.socket            systemd-fsckd.service
/run/systemd/initctl/fifo       systemd-initctl.socket          systemd-initctl.service
/run/systemd/journal/dev-log    systemd-journald-dev-log.socket systemd-journald.service
/run/systemd/journal/socket     systemd-journald.socket         systemd-journald.service
/run/systemd/journal/stdout     systemd-journald.socket         systemd-journald.service
/run/systemd/journal/syslog     syslog.socket                   rsyslog.service
/run/thd.socket                 triggerhappy.socket             triggerhappy.service
/run/udev/control               systemd-udevd-control.socket    systemd-udevd.service
/var/run/avahi-daemon/socket    avahi-daemon.socket             avahi-daemon.service
/var/run/dbus/system_bus_socket dbus.socket                     dbus.service
127.0.2.1:53                    dnscrypt-proxy.socket           dnscrypt-proxy.service
127.0.2.1:53                    dnscrypt-proxy.socket           dnscrypt-proxy.service
kobject-uevent 1                systemd-udevd-kernel.socket     systemd-udevd.service
```

可以看到 127.0.2.1:53 是被 dnscrypt-proxy.socket 这个程序监听使用的。

可以修改 /etc/dnsmasq.conf 配置文件中的 ports 为 5353，这样就不冲突了，然后

配置 DNS
/etc/resolv.conf

curl -x http://127.0.0.1:12345 https://www.youtube.com/

curl -x socks5h://127.0.0.1:1080 https://www.youtube.com/

netstat  -anp | grep 端口号

[redsocks]:https://github.com/darkk/redsocks

## WireGuard

https://www.wireguard.com/

### TunSafe

https://tunsafe.com/

http://www.jpzyfx.com/23798.html

> 2019-03-10 这段时间发现电脑 Windows 系统上的 Tunsafe 可以连上 server 但浏览器连不上网络, 但 Android 端的 Tunsafe 可以使用, 于是我使用了 Android 上一个叫 Proxy Server 的软件把 Android 当作一个代理服务器供电脑使用, 于是电脑就可以上网了.

## ShadowsocksR

https://bmao.tech/blog/shadowsocksr/

https://www.tipsforchina.com/how-to-setup-a-fast-shadowsocks-server-on-vultr-vps-the-easy-way.html
