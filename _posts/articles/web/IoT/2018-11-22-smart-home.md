---
layout: post
theme: UbuntuMono
title: "智能家庭系统"
excerpt: "介绍智能家庭系统相关的技术应用和开发。"
modified: 2018-12-11T11:51:25-04:00
categories: articles
tags: [AliGenie, Smart Home, IoT]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1191.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/al-jawf-libya-1191
comments: true
share: true
---

* TOC
{:toc}


http://www.droidsec.cn/broadlink%E6%99%BA%E8%83%BD%E7%94%9F%E6%80%81%E7%B3%BB%E5%88%97%E6%BC%8F%E6%B4%9E%E8%AF%A6%E8%A7%A3/

https://bot.tmall.com/

https://www.home-assistant.io/hassio/

[pimatic][pimatic] is a home automation framework that runs on node.js. It provides a common extensible platform for home control and automation tasks.

## Home Assistant

> 因为 Hassio 是在线下载安装 home assistant 系统的，所以最好全程保持网络流畅。

[Installation on Docker on Raspberry Pi 3 (RASPBIAN)](https://www.home-assistant.io/docs/installation/docker/#raspberry-pi-3-raspbian)

* What is the difference between Hassbian and HASS.io?

[Hassbian](https://www.home-assistant.io/docs/installation/hassbian/installation/)… Linux OS(I think raspbian) with home Assistant in Virtual Environment.

[HASS.io](https://www.home-assistant.io/hassio/installation/) 122…Resin OS with home Assistant in docker container. There is option to install some useful item direct from UI as well

https://community.home-assistant.io/t/what-is-the-difference-between-hassbian-and-hass-io/35108/14

刷入 hassos_rpi3-1.13.img 到 SD 卡里，然后插入 Raspberry Pi 3 启动。如果没有问题则可以通过此设备获取的 IP 加端口号 8123 访问 Home Assistant 页面，它会提示你需要 20 分钟左右进行安装。如果有问题打不开此页面，则需要 Raspberry Pi 3 连接显示器查看系统。The default username is `root` and the password is empty.

> 我遇到了（使用 `journalctl -fu hassos-supervisor` 查看 hassos-supervisor 服务日志） `journalctl -fu hassos-supervisor = ... certificate has expired or is not yet valid ... Fails install landingpage, retry after 60sec ... ` 这样的问题，可以执行命令 `date -s "2018-11-18 18:38"` 然后重启服务 `systemctl start hassos-supervisor` 解决了我的问题。参考 https://github.com/home-assistant/hassio/issues/644

hassos-supervisor 服务负责下载和创建 Home Assistant 的 Docker 容器。

网速好的情况下应该不会有什么问题，可以看到 Hass.io 菜单，接下来在里面安装 Add-ons。

### Static IP Address

#### Using nmcli to set a static IPV4 address

用用 root 密码为空登录 Hassio，输入命令 `login` 可以进入系统的命令行状态。

```
nmcli connection show
nmcli con show "HassOS default"
nmcli con edit "HassOS default"
nmcli> print ipv4
nmcli> set ipv4.addresses 192.168.100.10/24
Do you also want to set 'ipv4.method' to 'manual'? [yes]:
nmcli> set ipv4.dns 192.168.100.1
nmcli> set ipv4.gateway 192.168.100.1
nmcli> save
nmcli> quit
nmcli con reload
```

https://github.com/home-assistant/hassos/blob/dev/Documentation/network.md

### Add Addons

打开 Hass.io 菜单，选择里面的 ADD-ON STORE，这里是 ADD-ON 的库，也可以再添加。选择 ADD-ON 并点击 Install可以进行安装，安装好后它出现在 DASHBOARD 页面。

* 首先我们选择 Official add-ons 里的 Configurator 安装。安装好后先修改配置里的 password ，然后启动此 ADD-ON ，然后会出现 “OPEN WEB UI” 按钮，点击打开可以创建配置了。 参考 https://www.home-assistant.io/getting-started/configuration/

* SSH Server：选择 Official add-ons 里的 SSH Server 进行安装，安装好后先编辑配置里的 password 字段为用户 root 设置个密码，安全起见最好使用 authorized_keys 而不是 password 的授权方式。启动此 add-on 后便可以使用 `ssh root@<your Pi's IP address>` 登录系统了。这其实是登录的 add-on 的 Docker container 里， Home Assistant 系统的配置目录挂在了 `/config` 目录上。参考 https://www.home-assistant.io/addons/ssh/

https://github.com/home-assistant/hassio-addons

https://github.com/hassio-addons/repository

### Enable SSH Server
对于 Raspberry Pi 系统可以

* https://www.home-assistant.io/addons/ssh/
* https://www.raspberrypi.org/documentation/remote-access/ssh/

但 Hassio 系统是阉割的，SSH 是没有的。对于所有的需求只有通过 ADD-ON （即 Docker containers）来实现。

遇到问题 SSH 和 Configuraor 都装不上，解决不了了。。 换 Hassbian 系统试试。（Hassio 在网络好的情况下又成功了）

### Kodi

为了验证 Home Assistant 的可用性，使用其连接最常用的影音软件 Kodi 来做测试。在同一局域网中的另外一个终端上安装 Kodi 软件，并打开其 [web interface](https://kodi.wiki/view/Web_interface) 功能。

然后通过 SSH Server add-on 在配置文件 _/config/configuration.yaml_ 中添加如下[media_player.kodi](https://www.home-assistant.io/components/media_player.kodi/)配置
```
# Example configuration.yaml entry
media_player:
  - platform: kodi
    host: <Kodi host IP>
```
reload 配置成功后，可以在 Overview 页面看到 Kodi 窗口就可以对 Kodi 进行控制了。

## Hassbian

https://www.home-assistant.io/docs/installation/hassbian/installation/

下载 Hassbian 镜像，刷入 SD 卡，插入 Raspberry Pi 3 启动系统。启动后可以用 IP 扫描软件查看到它的 IP 地址，然后就可以用命令 `ssh pi@<Pi's IP Address>` 登录 Hassbian 系统了，默认用户 `pi` 和密码 `raspberry`。
为了安全起见使用命令 `passwd` 修改用户 pi 的默认密码。

访问 `http://<Pi's IP Address>:8123/` 没有结果时，说明有问题。首先用命令 `ls /home/homeassistant/.homeassistant/` 查看有无东西，然后使用 `systemctl status install_homeassistant.service` 查看安装服务的状态。有可能是 timeout ，可以重复执行 `sudo systemctl start install_homeassistant.service` 直到服务正常启动。 命令 `journalctl -xe` 可以查看服务日志。

`sudo hassbian-config upgrade homeassistant`

```
$ docker run -d --name="home-assistant" -v /home/pi/homeassistant:/config -v /etc/localtime:/etc/localtime:ro --net=host homeassistant/raspberrypi3-homeassistant
```

> 对于墙内用户，Docker 可能无法下载镜像，所以可以配置 Docker proxy 来解决。如何配置 Raspberry Pi 系统上的 Docker proxy 参考 [Config Docker proxy](/articles/kubernetes-cluster-on-raspberry-pi/#docker-proxy)。至于如何设置自己的代理软件可以参考 [Setup Shadowsocks Proxy using Docker](/articles/setup-shadowsocks-proxy-using-docker/)

### Windows 版

在 Windows 系统上为 Home Assistant 创建一个目录叫 homeassistant，然后用命令行进入此命令，运行以下命令创建一个 Home Assistant 的 Docker 容器
```
docker run -d --name="home-assistant" -v "%cd%"/config:/config -e "TZ=America/Los_Angeles" --net=host homeassistant/home-assistant
```

Docker 容器在 Windows 上是通过虚拟机实现的，所以参数 `--net=host` 其实是应用在 hypervisor’s network interface 上的，所以还要通过 `netsh` 命令把实际物理主机的端口号映射到 hypervisor’s vm host。
```
netsh interface portproxy add v4tov4 listenaddress=192.168.3.226 listenport=8123 connectaddress=10.0.75.2 connectport=8123
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8123 connectaddress=10.0.75.2 connectport=8123
```

删除的话用
```
netsh interface portproxy delete v4tov4 listenaddress=192.168.3.226 listenport=8123
netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=8123
```

> 直接用命令形式 `docker run -d --name="home-assistant" -v "%cd%"/config:/config -e "TZ=America/Los_Angeles" -p 8123:8123 homeassistant/home-assistant` 会报错误:<br>
docker: Error response from daemon: driver failed programming external connectivity on endpoint home-assistant (be7e7d4da1a94463a1b47755665162dad8a85376a0c95d75123d324eac289e2e): Error starting userland proxy: mkdir /port/tcp:0.0.0.0:8123:tcp:172.17.0.2:8123: input/output error.

## Hassio on Ubuntu

```
sudo -i

add-apt-repository universe

apt-get update

apt-get install -y apparmor-utils apt-transport-https avahi-daemon ca-certificates curl dbus jq network-manager socat software-properties-common

curl -fsSL get.docker.com | sh

curl -sL "https://raw.githubusercontent.com/home-assistant/hassio-build/master/install/hassio_install" | bash -s
```

[pimatic]:https://pimatic.org/

