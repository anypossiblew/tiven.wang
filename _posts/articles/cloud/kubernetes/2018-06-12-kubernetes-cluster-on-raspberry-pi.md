---
layout: post
theme: UbuntuMono
title: "Kubernetes - Cluster on Raspberry Pi"
excerpt: "Learn how to deploy a Kubernetes cluster on Raspberry Pis."
modified: 2018-06-11T11:51:25-04:00
categories: articles
tags: [Raspberry PI, Kubernetes, Cloud]
image:
  vendor: twitter
  feature: /media/DfGbYtqX0AEP6EY.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1004755042925273088
comments: true
share: true
showYourTerms: true
references:
  - title: "Kubernetes on (vanilla) Raspbian Lite"
    url: https://gist.github.com/alexellis/fdbc90de7691a1b9edb545c17da2d975
---

<style>
.showyourterms.raspberrypi .type:before {
  content: "root@raspberrypi:~ $ "
}
</style>

![Gif: raspberry pi](/images/devops/infrastructure/raspberrypi/raspberry-pi.gif)
{: .middle.center}
<br/>

* TOC
{:toc}

首先就安装 Docker，This installs 17.12 or newer.
<div class='showyourterms raspberrypi active' data-title="Raspberry Pi">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>curl -sSL get.docker.com | sh && usermod pi -aG docker</div>
    <div class='lines' data-delay='3000'>
# Executing docker install script, commit: 36b78b2
Warning: the "docker" command appears to already exist on this system.

If you already have Docker installed, this script can cause trouble, which is
why we're displaying this warning and provide the opportunity to cancel the
installation.

If you installed the current Docker package using this script and are using it
again to update Docker, we urge you to migrate your image store before upgrading
to v1.10+.

You can find instructions for this here:
https://github.com/docker/docker/wiki/Engine-v1.10.0-content-addressability-migration

You may press Ctrl+C now to abort this script.
+ sleep 20</div><div class='lines' data-delay='10000'>
+ sh -c apt-get update -qq &gt;/dev/null
+ sh -c apt-get install -y -qq apt-transport-https ca-certificates curl >/dev/null
+ sh -c curl -fsSL "https://download.docker.com/linux/raspbian/gpg" | apt-key add -qq - &gt;/dev/null
Warning: apt-key output should not be parsed (stdout is not a terminal)
+ sh -c echo "deb [arch=armhf] https://download.docker.com/linux/raspbian stretch edge" &gt; /etc/apt/sources.list.d/docker.list
+ [ raspbian = debian ]
+ sh -c apt-get update -qq &gt;/dev/null
+ sh -c apt-get install -y -qq --no-install-recommends docker-ce &gt;/dev/null
+ sh -c docker version
Client:
 Version:      18.05.0-ce
 API version:  1.37
 Go version:   go1.9.5
 Git commit:   f150324
 Built:        Wed May  9 22:24:36 2018
 OS/Arch:      linux/arm
 Experimental: false
 Orchestrator: swarm

Server:
 Engine:
  Version:      18.05.0-ce
  API version:  1.37 (minimum version 1.12)
  Go version:   go1.9.5
  Git commit:   f150324
  Built:        Wed May  9 22:20:37 2018
  OS/Arch:      linux/arm
  Experimental: false
If you would like to use Docker as a non-root user, you should now consider
adding your user to the "docker" group with something like:

  sudo usermod -aG docker your-user

Remember that you will have to log out and back in for this to take effect!

WARNING: Adding a user to the "docker" group will grant the ability to run
         containers which can be used to obtain root privileges on the
         docker host.
         Refer to https://docs.docker.com/engine/security/security/#docker-daemon-attack-surface
         for more information.
    </div>
  </div>
</div>


因为 Kubernetes 默认不支持 swap memory，所以在安装之前要禁用和删除 swapfile
```
sudo dphys-swapfile swapoff && \
  sudo dphys-swapfile uninstall && \
  sudo update-rc.d dphys-swapfile remove
```
This should now show no entries:
`sudo swapon --summary`


```
$ sudo kubeadm init --token-ttl=0


[init] This might take a minute or longer if the control plane images have to be pulled.

Unfortunately, an error has occurred:
        timed out waiting for the condition

This error is likely caused by:
        - The kubelet is not running
        - The kubelet is unhealthy due to a misconfiguration of the node in some way (required cgroups disabled)
        - Either there is no internet connection, or imagePullPolicy is set to "Never",
          so the kubelet cannot pull or find the following control plane images:
                - k8s.gcr.io/kube-apiserver-arm:v1.10.4
                - k8s.gcr.io/kube-controller-manager-arm:v1.10.4
                - k8s.gcr.io/kube-scheduler-arm:v1.10.4
                - k8s.gcr.io/etcd-arm:3.1.12 (only if no external etcd endpoints are configured)

If you are on a systemd-powered system, you can try to troubleshoot the error with the following commands:
        - 'systemctl status kubelet'
        - 'journalctl -xeu kubelet'
couldn't initialize a Kubernetes cluster
```

可以看到这里遇到了一些问题，Docker 显然没有走我配置系统环境变量的代理。
那么就需要单独配置 docker 代理，不同版本的 Linux 平台使用不同的方式管理 Docker 就有不同的配置方式

对于 Control Docker with systemd 的方式

https://docs.docker.com/config/daemon/systemd/#httphttps-proxy

```
$ sudo mkdir -p /etc/systemd/system/docker.service.d
$ sudo cat <<EOF >/etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://192.168.1.6:1080/" "NO_PROXY=localhost,127.0.0.1"
EOF
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

安装过最新的 kubelet 工具会遇到错误，解决办法就时降级 kubelet 到 `1.10.2-00` 版本
`sudo apt-get install kubelet=1.10.2-00 -y --allow-downgrades`
https://github.com/kubernetes/kubernetes/issues/64234

如果使用 v1.10.4 版本 Docker 镜像的仓库地址变了，改成了 `k8s.gcr.io` 原来的是 `gcr.io/google_containers`

```
root@raspberrypi:~# docker images
REPOSITORY                                             TAG                 IMAGE ID            CREATED             SIZE
k8s.gcr.io/kube-scheduler-arm                          v1.10.4             b3ad5420efae        9 days ago          43.6MB
k8s.gcr.io/kube-controller-manager-arm                 v1.10.4             78bb214362bf        9 days ago          129MB
k8s.gcr.io/kube-apiserver-arm                          v1.10.4             ed4553b39798        9 days ago          206MB
k8s.gcr.io/etcd-arm                                    3.1.12              88c32b5960ff        3 months ago        178MB
k8s.gcr.io/pause-arm                                   3.1                 e11a8cbeda86        5 months ago        374kB
```
我只进行到了下载了这 5 个镜像这一步。


再次降级到 1.9.6 似乎就可以继续进行了（或者我代理网络好点了）

```
sudo apt-get install kubelet=1.9.6-00 kubeadm=1.9.6-00 -y --allow-downgrades
```

`kubeadm 1.9.6` 使用的 Docker 镜像版本如下
```
gcr.io/google_containers/kube-proxy-arm                v1.9.8              d78f11ff4746        3 weeks ago         97.8MB
gcr.io/google_containers/kube-apiserver-arm            v1.9.8              2bbdbfd54424        3 weeks ago         194MB
gcr.io/google_containers/kube-controller-manager-arm   v1.9.8              0fa1d05b0709        3 weeks ago         121MB
gcr.io/google_containers/kube-scheduler-arm            v1.9.8              36edf271415a        3 weeks ago         54.3MB
gcr.io/google_containers/etcd-arm                      3.1.11              a5f8f54094ff        6 months ago        189MB
gcr.io/google_containers/pause-arm                     3.0                 b51c23e6a2ab        2 years ago         506kB
```
Kubernetes 首先使用 `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`, `pause` setup 起来基础的 cluster，
然后再由 cluster 自己去 setup 剩余的工作如 `kube-proxy`。


I have the same issue on Raspberry Pi 3, HypriotOS. Downgrading to 1.9.7-00 also worked for me.


For people in China who behind THE GREAT FIREWALL

https://github.com/anjia0532/gcr.io_mirror
https://anjia0532.github.io/2017/11/15/gcr-io-image-mirror/


Setup networking
Install Weave network driver

```
$ kubectl apply -f \
 "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

查看 Pod 部署情况
```
root@raspberrypi:~# kubectl get pods --namespace=kube-system
NAME                                  READY     STATUS         RESTARTS   AGE
etcd-raspberrypi                      1/1       Running        0          35m
kube-apiserver-raspberrypi            1/1       Running        0          35m
kube-controller-manager-raspberrypi   1/1       Running        0          34m
kube-dns-7b6ff86f69-jw8vn             0/3       Pending        0          35m
kube-proxy-8vwcl                      1/1       Running        0          35m
kube-scheduler-raspberrypi            1/1       Running        0          35m
weave-net-v9g62                       0/2       ErrImagePull   0          38s
```

当 Pods 遇到问题时可以用下面查看某个 Pod 里面的 events logs 看原因
```
kubectl describe pods kube-dns-7b6ff86f69-jw8vn -n kube-system
kubectl -n kube-system describe pods weave-net-v9g62
kube-dns-7b6ff86f69-jw8vn
```

如果需要重新启动 Pods 则可以重新部署一下
```
kubectl replace --force -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

```
kubectl delete pods wso2am-default-813fy
kubectl create -f <yml_file_describing_pod>
```
部署 weave 错误时 Docker pull image 的时候有问题，下面的问题
Error response from daemon: Get https://registry-1.docker.io/v2/: proxyconnect tcp: dial tcp 192.168.1.6:1080: getsockopt: no route to host

尝试去掉 Docker Engine 代理倒是可以 pull 了。可能是我代理类型的原因（我用的shadowsocks）。但总得来说连接 Docker registry 不需要代理，连接 gcr.io 必须要代理。这就麻烦了。但最终是用代理都有问题，代理有问题了，Docker 不能用了，说重新安装 Docker 可以解决，但我也没尝试重新安装，最终我选择的是从 Docker 官方库下载[别人弄的 gcr.io google_containers 的拷贝](https://github.com/anjia0532/gcr.io_mirror)，然后重新打成原标签。
例如，如果需要下载 `gcr.io/google_containers/k8s-dns-dnsmasq-nanny-arm:1.14.7`
则手工执行 `docker pull anjia0532/google-containers.k8s-dns-dnsmasq-nanny-arm:1.14.7`
然后重新给个原来的名字 Tag `docker image tag anjia0532/google-containers.k8s-dns-dnsmasq-nanny-arm:1.14.7 gcr.io/google_containers/k8s-dns-dnsmasq-nanny-arm:1.14.7`




docker pull weaveworks/weave-kube:2.3.0
docker pull gcr.io/google_containers/k8s-dns-dnsmasq-nanny-arm:1.14.7

docker pull anjia0532/google-containers.k8s-dns-dnsmasq-nanny-arm:1.14.7

需要手工 pull 的 gcr 镜像：
gcr.io/google_containers/k8s-dns-dnsmasq-nanny-arm:1.14.7
gcr.io/google_containers/k8s-dns-sidecar-arm:1.14.7
gcr.io/google_containers/k8s-dns-kube-dns-arm:1.14.7

之前的镜像你可能也需要手工 pull 我的是因为之前 shadowsocks vpn 代理可以，但现在不行了。
gcr.io/google_containers/kube-apiserver-arm

```
docker pull anjia0532/google-containers.k8s-dns-sidecar-arm:1.14.7
docker image tag anjia0532/google-containers.k8s-dns-sidecar-arm:1.14.7 gcr.io/google_containers/k8s-dns-sidecar-arm:1.14.7
docker pull anjia0532/google-containers.k8s-dns-kube-dns-arm:1.14.7
docker image tag anjia0532/google-containers.k8s-dns-kube-dns-arm:1.14.7 gcr.io/google_containers/k8s-dns-kube-dns-arm:1.14.7
```

```
root@raspberrypi:~# docker images
REPOSITORY                                              TAG                 IMAGE ID            CREATED             SIZE
k8s.gcr.io/kube-controller-manager-arm                  v1.10.4             78bb214362bf        10 days ago         129MB
k8s.gcr.io/kube-apiserver-arm                           v1.10.4             ed4553b39798        10 days ago         206MB
k8s.gcr.io/kube-scheduler-arm                           v1.10.4             b3ad5420efae        10 days ago         43.6MB
gcr.io/google_containers/kube-proxy-arm                 v1.9.8              d78f11ff4746        3 weeks ago         97.8MB
gcr.io/google_containers/kube-controller-manager-arm    v1.9.8              0fa1d05b0709        3 weeks ago         121MB
gcr.io/google_containers/kube-apiserver-arm             v1.9.8              2bbdbfd54424        3 weeks ago         194MB
gcr.io/google_containers/kube-scheduler-arm             v1.9.8              36edf271415a        3 weeks ago         54.3MB
weaveworks/weave-npc                                    2.3.0               e214242c20cf        2 months ago        44.5MB
weaveworks/weave-kube                                   2.3.0               10ead2ac9c17        2 months ago        88.8MB
k8s.gcr.io/etcd-arm                                     3.1.12              88c32b5960ff        3 months ago        178MB
k8s.gcr.io/pause-arm                                    3.1                 e11a8cbeda86        5 months ago        374kB
gcr.io/google_containers/etcd-arm                       3.1.11              a5f8f54094ff        6 months ago        189MB
anjia0532/google-containers.k8s-dns-dnsmasq-nanny-arm   1.14.7              76c015d7978c        7 months ago        37.5MB
gcr.io/google_containers/k8s-dns-dnsmasq-nanny-arm      1.14.7              76c015d7978c        7 months ago        37.5MB
gcr.io/google_containers/pause-arm                      3.0                 b51c23e6a2ab        2 years ago         506kB
```


https://rak8s.io/

```
root@kubemaster:~# docker version
Client:
 Version:       17.12.1-ce
 API version:   1.35
 Go version:    go1.10.1
 Git commit:    7390fc6
 Built: Wed Apr 18 01:23:11 2018
 OS/Arch:       linux/amd64

Server:
 Engine:
  Version:      17.12.1-ce
  API version:  1.35 (minimum version 1.12)
  Go version:   go1.10.1
  Git commit:   7390fc6
  Built:        Wed Feb 28 17:46:05 2018
  OS/Arch:      linux/amd64
  Experimental: false
```

```
cd /usr/local
sudo curl -o lantern.deb  https://raw.githubusercontent.com/getlantern/lantern-binaries/master/lantern-installer-64-bit.deb
```

export http_proxy=http://192.168.1.6:1080
root@raspberrypi:~# export https_proxy=http://192.168.1.6:1080
root@raspberrypi:~# export no_proxy=192.168.1.16,localhost,127.0.0.1

https://github.com/kubernetes/kubeadm/issues/684



## Kubeadm join

https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join/

```
root@raspberrypi:~# kubectl cluster-info
Kubernetes master is running at https://192.168.1.16:6443
KubeDNS is running at https://192.168.1.16:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

root@raspberrypi:~# kubeadm token list
TOKEN                     TTL         EXPIRES   USAGES                   DESCRIPTION                                                EXTRA GROUPS
dc8b91.eacc7d2b3679748e   <forever>   <never>   authentication,signing   The default bootstrap token generated by 'kubeadm init'.   system:bootstrappers:kubeadm:default-node-token
```
Join the worker nodes
```
kubeadm join --token dc8b91.eacc7d2b3679748e --discovery-token-unsafe-skip-ca-verification 192.168.1.16:6443`
```

```
root@raspberrypi:~# kubectl get nodes
root@raspberrypi:~# kubectl get pods -n kube-system
root@raspberrypi:~# kubectl -n kube-system describe pods kube-proxy-nb22l
...
Events:
  Type     Reason                 Age                 From                Message
  ----     ------                 ----                ----                -------
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "lib-modules"
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "xtables-lock"
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "kube-proxy"
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "kube-proxy-token-r6sgq"
  Normal   BackOff                47m (x4 over 48m)   kubelet, kubenode1  Back-off pulling image "gcr.io/google_containers/kube-proxy-arm:v1.9.8"
  Normal   Pulling                46m (x4 over 49m)   kubelet, kubenode1  pulling image "gcr.io/google_containers/kube-proxy-arm:v1.9.8"
  Warning  Failed                 46m (x4 over 48m)   kubelet, kubenode1  Failed to pull image "gcr.io/google_containers/kube-proxy-arm:v1.9.8": rpc error: code = Unknown desc = Error response from daemon: Get https://gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
  Warning  Failed                 46m (x4 over 48m)   kubelet, kubenode1  Error: ErrImagePull
  Warning  Failed                 44m (x14 over 48m)  kubelet, kubenode1  Error: ImagePullBackOff
```

```
docker pull anjia0532/google-containers.kube-proxy-arm:v1.9.8
docker image tag anjia0532/google-containers.kube-proxy-arm:v1.9.8 gcr.io/google_containers/kube-proxy-arm:v1.9.8

```

https://kubecloud.io/setup-a-kubernetes-1-9-0-raspberry-pi-cluster-on-raspbian-using-kubeadm-f8b3b85bc2d1

下一步

https://kubecloud.io/kubernetes-dashboard-on-arm-with-rbac-61309310a640

https://kubecloud.io/setting-up-kubernetes-visualization-of-a-cluster-96826433fc64

https://kubecloud.io/setting-up-a-highly-available-kubernetes-cluster-with-private-networking-on-aws-using-kops-65f7a94782ef
