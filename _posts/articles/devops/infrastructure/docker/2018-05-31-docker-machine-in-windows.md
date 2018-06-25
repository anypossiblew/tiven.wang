---
layout: post
theme: UbuntuMono
title: "Docker Machine in Windows"
excerpt: ""
modified: 2018-05-31T11:51:25-04:00
categories: articles
tags: [Docker]
image:
  vendor: twitter
  feature: /media/DedOpscVMAAH2f8.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1001855924359909376
comments: true
share: true
references:
  - title: "Docker Machine"
    url: https://docs.docker.com/machine
---

* TOC
{:toc}

以下 Docker Machine 命令需要在管理员权限下运行。

查看当前主机上的 Docker Machine 列表

`docker-machine ls`

### Hyper-V
创建一个新的 Docker Machine 即虚拟机，在 Windows 10 professional 平台上选择其原生的虚拟机软件 Hyper-V 。首先需要在 Hyper-V Manager 软件里创建一个 Virtual Switch 它被用作虚拟机的网络设备，它有三种类型可选：External 类型的是绑定到物理主机的网络适配器，所以可以访问物理网络；Internal 类型的是可以在虚拟机和物理主机之间进行相互访问；Private 类型的只能在虚拟机之间相互访问。运行 Docker 一般需要连接网络下载软件，所以我们创建一个 External 的 Virtual Switch
```
PS C:\Users\tiven> docker-machine create dev --driver hyperv --hyperv-virtual-switch "MySwitch"
Running pre-create checks...
(dev) Default Boot2Docker ISO is out-of-date, downloading the latest release...
(dev) Latest release for github.com/boot2docker/boot2docker is v18.05.0-ce
(dev) Downloading C:\Users\tiven\.docker\machine\cache\boot2docker.iso from https://github.com/boot2docker/boot2docker/releases/download/v18.05.0-ce/boot2docker.iso...
Creating machine...
(dev) Copying C:\Users\tiven\.docker\machine\cache\boot2docker.iso to C:\Users\tiven\.docker\machine\machines\default\boot2docker.iso...
(dev) Creating SSH key...
(dev) Creating VM...
(dev) Using switch "MySwitch"
(dev) Creating VHD
(dev) Starting VM...
(dev) Waiting for host to start...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: C:\Program Files\Docker\Docker\Resources\bin\docker-machine.exe env dev
```

我们当前使用的 `docker-machine` 版本是 `0.14.0`, 如果遇到这个错误 *"Hyper-V PowerShell Module is not available"*, 可以降低 `docker-machine` 的版本到 `0.13.0` ，即从 [Github](https://github.com/docker/machine/releases) 下载 docker-machine v0.13.0 替换掉 `C:\Program Files\Docker\Docker\Resources\bin\docker-machine.exe`

使用 `docker-machine ssh <vm-name>` 登录 Docker Machine 创建的虚拟机系统

```
PS C:\Users\tiven> docker-machine ssh dev
                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/
 _                 _   ____     _            _
| |__   ___   ___ | |_|___ \ __| | ___   ___| | _____ _ __
| '_ \ / _ \ / _ \| __| __) / _` |/ _ \ / __| |/ / _ \ '__|
| |_) | (_) | (_) | |_ / __/ (_| | (_) | (__|   <  __/ |
|_.__/ \___/ \___/ \__|_____\__,_|\___/ \___|_|\_\___|_|
Boot2Docker version 18.05.0-ce, build HEAD : b5d6989 - Thu May 10 16:35:28 UTC 2018
Docker version 18.05.0-ce, build f150324
docker@dev:~$
```
可以看到此虚拟机安装的系统镜像是 [Boot2Docker][boot2docker/releases]，此镜像内已经预置了 Docker 软件，所以我们可以在此虚拟机系统终端内使用 Docker 命令。从上面的终端日志打印可以看出我们使用的 Boot2Docker 镜像版本是 `version 18.05.0-ce, build HEAD : b5d6989` Docker 版本是 `version 18.05.0-ce, build f150324`
```
docker@dev:~$ docker version
Client:
 Version:      18.05.0-ce
 API version:  1.37
 Go version:   go1.9.2
 Git commit:   f150324
 Built:        Wed May  9 22:11:29 2018
 OS/Arch:      linux/amd64
 Experimental: false
 Orchestrator: swarm

Server:
 Engine:
  Version:      18.05.0-ce
  API version:  1.37 (minimum version 1.12)
  Go version:   go1.10.1
  Git commit:   f150324
  Built:        Wed May  9 22:20:42 2018
  OS/Arch:      linux/amd64
  Experimental: false
```

还可以使用物理主机的 Docker Client 软件访问虚拟机内的 Docker Server Engine (deamon 服务进程)。首先使用 `docker-machine env dev` 查看并设置 Docker 的环境变量，使得物理主机上的 Docker 客户端指向虚拟机里的服务进程
```
PS C:\Users\tiven> docker-machine env dev
$Env:DOCKER_TLS_VERIFY = "1"
$Env:DOCKER_HOST = "tcp://10.59.182.248:2376"
$Env:DOCKER_CERT_PATH = "C:\Users\tiven\.docker\machine\machines\dev"
$Env:DOCKER_MACHINE_NAME = "dev"
$Env:COMPOSE_CONVERT_WINDOWS_PATHS = "true"
# Run this command to configure your shell:
# & "C:\Program Files\Docker\Docker\Resources\bin\docker-machine.exe" env dev | Invoke-Expression
PS C:\Users\tiven> & "C:\Program Files\Docker\Docker\Resources\bin\docker-machine.exe" env dev | Invoke-Expression
```
然后便可以在此终端窗口内操作虚拟机里的 Docker 服务了
```
PS C:\Users\tiven> docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 18.05.0-ce
Storage Driver: aufs
 Root Dir: /mnt/sda1/var/lib/docker/aufs
 Backing Filesystem: extfs
 Dirs: 12
 Dirperm1 Supported: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file logentries splunk syslog
Swarm: inactive
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version: 773c489c9c1b21a6d78b5c538cd395416ec50f88
runc version: 4fc53a81fb7c994640722ac585fa9ca548971871
init version: 949e6fa
Security Options:
 seccomp
  Profile: default
Kernel Version: 4.9.93-boot2docker
Operating System: Boot2Docker 18.05.0-ce (TCL 8.2.1); HEAD : b5d6989 - Thu May 10 16:35:28 UTC 2018
OSType: linux
Architecture: x86_64
CPUs: 1
Total Memory: 986.3MiB
Name: dev
ID: ZIHV:UVHY:KUKF:R7NW:KEFY:2CDZ:5OUT:SJK4:2KRB:UTI4:CZ7D:V4HV
Docker Root Dir: /mnt/sda1/var/lib/docker
Debug Mode (client): false
Debug Mode (server): false
Registry: https://index.docker.io/v1/
Labels:
 provider=hyperv
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
```
接下来我们部署一个 Docker 容器
```
PS C:\Users\tiven> docker run -d --name my-ghost -p 3001:2368 ghost:alpine
72636186597f079cccece3bc9739ff8c99b568da64cf81576b5c6c8b7502f231
```
在浏览器打开链接 `http://<vm-ip>:3001/` 即 *http://10.59.182.248:3001/* 可以看到我们的 ghost Blog 站首页。

总体架构如下图所示

![Image: Docker-Machine-Hyper-V](/images/devops/infrastructure/docker/Docker-Machine-Hyper-V.png)
{: .center.middle}

### VirtualBox
如果使用 VirtualBox 创建 Docker Machine VM 的话要禁用掉 Windows 的 Hyper-V 属性才能使用 VirtualBox 软件
```
docker-machine create dev
```


[boot2docker]:https://github.com/boot2docker/boot2docker
[boot2docker/releases]:https://github.com/boot2docker/boot2docker/releases
