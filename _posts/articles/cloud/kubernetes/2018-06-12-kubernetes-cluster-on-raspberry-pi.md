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
.showyourterms.raspbpi-master .type:before {
  content: "root@pi-master:~ $ "
}
</style>

![Gif: raspberry pi](/images/devops/infrastructure/raspberrypi/raspberry-pi.gif)
{: .middle.center}
<br/>

* TOC
{:toc}

> 为了避免混乱，以下命令均是在 root 用户下运行

为此主机配置个固定 IP，避免 Kubernetes cluster master 主机的地址都会变化，那就不好了。

首先就安装 Docker，This installs 17.12 or newer.

> 这一步网络好的情况下可以连接，网络不好的情况下则需要设置代理服务器

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

确认 Docker 安装成功
```
root@:raspberrypi~# docker --version
Docker version 18.05.0-ce, build f150324
```
👌

### Disable Swap Memory
因为 Kubernetes 默认不支持 swap memory，所以在安装之前要禁用和删除 swapfile
```
dphys-swapfile swapoff && \
  dphys-swapfile uninstall && \
  update-rc.d dphys-swapfile remove
```
运行下面命令确保没有 swap 存在了<br/>
`swapon --summary`
👌

### Add Cgroup Memory
添加下面内容到文件 */boot/cmdline.txt* 那行的结尾，不要创建新行
```
cgroup_enable=cpuset cgroup_enable=memory
```
不要忘记 `reboot` 重启树莓派。

### Add repo lists & install kubeadm
添加 kubernetes 的 repository 地址到系统配置文件，然后安装 kubeadm 工具
```
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
$ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | tee /etc/apt/sources.list.d/kubernetes.list
$ apt-get update -q
$ apt-get install -qy kubeadm
```

> 对于中国大陆用户来说这一步应该需要设置系统代理，因为他需要连接 google 网络

👌

## Create cluster
Docker 和 kubeadm 工具安装好后就来创建 Kubernetes cluster 吧。

### Kubeadm init
使用工具 kubeadm 初始化 Kubernetes cluster 的 master 节点
```
root@raspberrypi:~# kubeadm init --token-ttl=0
[init] Using Kubernetes version: v1.10.5
[init] Using Authorization modes: [Node RBAC]
[preflight] Running pre-flight checks.
        [WARNING SystemVerification]: docker version is greater than the most recently validated version. Docker version: 18.05.0-ce. Max validated version: 17.03
        [WARNING FileExisting-crictl]: crictl not found in system path
Suggestion: go get github.com/kubernetes-incubator/cri-tools/cmd/crictl
[certificates] Generated ca certificate and key.
[certificates] Generated apiserver certificate and key.
[certificates] apiserver serving cert is signed for DNS names [raspberrypi kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.2.100]
[certificates] Generated apiserver-kubelet-client certificate and key.
[certificates] Generated sa key and public key.
[certificates] Generated front-proxy-ca certificate and key.
[certificates] Generated front-proxy-client certificate and key.
[certificates] Generated etcd/ca certificate and key.
[certificates] Generated etcd/server certificate and key.
[certificates] etcd/server serving cert is signed for DNS names [localhost] and IPs [127.0.0.1]
[certificates] Generated etcd/peer certificate and key.
[certificates] etcd/peer serving cert is signed for DNS names [raspberrypi] and IPs [192.168.2.100]
[certificates] Generated etcd/healthcheck-client certificate and key.
[certificates] Generated apiserver-etcd-client certificate and key.
[certificates] Valid certificates and keys now exist in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/admin.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/controller-manager.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/scheduler.conf"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/manifests/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/manifests/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/manifests/kube-scheduler.yaml"
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/manifests/etcd.yaml"
[init] Waiting for the kubelet to boot up the control plane as Static Pods from directory "/etc/kubernetes/manifests".
[init] This might take a minute or longer if the control plane images have to be pulled.

# 一段时间后
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

可以看到这里遇到了一些问题，这里主要问题是 Docker images 没能下载下来，显然 Docker 没有走我配置系统环境变量的代理。
那么就需要单独配置 docker 代理，不同版本的 Linux 平台使用不同的方式管理 Docker 就有不同的配置方式

> 这里有个教训 ，在运行 kubeadm init 时不要设置系统代理环境变量，要不然 kubeadm 会把代理环境变量带到每个 kube 组件，这会导致 kubenernetes 组件内的通讯也会走代理服务。所以实际上只在下载 kubeadm 等工具时设置上代理，然后到 kubeadm init 这一步时要去掉代理环境变量。
{: .Warning}

### Docker proxy
对于 [Control Docker with systemd 的方式配置代理](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)

```
$ mkdir -p /etc/systemd/system/docker.service.d
$ cat <<EOF >/etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:8118/" "NO_PROXY=localhost,127.0.0.1"
EOF
$ systemctl daemon-reload
# 确认 http_proxy 环境配置成功
$ systemctl show --property=Environment docker
$ systemctl restart docker
```

> 确认环境配置成功这一步最好是做，确保你认为配置了但是没有配置成功（例如你没有看见在配置那行开始有个符号 “#”）

### Kubeadm reinit
重新运行初始化，之前要使用 `kubeadm reset` 重置环境
```
$ kubeadm reset
$ kubeadm init --token-ttl=0

# 接着之前的日志，以上都一样
[init] This might take a minute or longer if the control plane images have to be pulled.
[apiclient] All control plane components are healthy after 59.514974 seconds
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[markmaster] Will mark node raspberrypi as master by adding a label and a taint
[markmaster] Master raspberrypi tainted and labelled with key/value: node-role.kubernetes.io/master=""
[bootstraptoken] Using token: mdt1jg.312ebga0sydo2ab0
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join 192.168.2.100:6443 --token mdt1jg.312ebga0sydo2ab0 --discovery-token-ca-cert-hash sha256:865e742c53da18a663ecbf98a02e1a060b040ccb0530470c285ae6c36a201c30

```
👌 问题解决，成功创建。


接下来依照日志的说明把 kubectl 工具配置好（运行给的三行命令即可），后面再安装个集群用的网络组件，把最后的 kubeadm join 命令记下来后面加进来 worker node 要用。

### Initial Status

```
root@raspberrypi:~# kubectl get nodes
NAME          STATUS     ROLES     AGE       VERSION
raspberrypi   NotReady   master    6m        v1.10.5
```
可以看到 master 节点状态为 `NotReady` 说明我们还有一些工作要做。在来看一下 Kubernetes 组件情况

```
root@raspberrypi:~# kubectl get pods --all-namespaces -o wide
NAMESPACE     NAME                                  READY     STATUS    RESTARTS   AGE       IP              NODE
kube-system   etcd-raspberrypi                      1/1       Running   0          7m        192.168.2.100   raspberrypi
kube-system   kube-apiserver-raspberrypi            1/1       Running   0          7m        192.168.2.100   raspberrypi
kube-system   kube-controller-manager-raspberrypi   1/1       Running   0          7m        192.168.2.100   raspberrypi
kube-system   kube-dns-686d6fb9c-t5wcm              0/3       Pending   0          7m        <none>          <none>
kube-system   kube-proxy-665dg                      1/1       Running   0          7m        192.168.2.100   raspberrypi
kube-system   kube-scheduler-raspberrypi            1/1       Running   0          7m        192.168.2.100   raspberrypi
```

可以看到几个组件已经在运行了，但有一个 *kube-dns* 的三个实例处在 `Pending` 状态，他在等待网络扩展组件的就绪。

Kubernetes 首先使用 `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `kube-proxy`, `etcd`, `kube-dns` setup 起来基础的 cluster，
然后再由 cluster 自己去 setup 剩余的工作如 `kube-proxy`。

> 对于下载 Docker images 问题我使用过下面解决方法，但 Kubenetes 更新很快，下面的复制镜像显然跟不上节奏<br/>
For people in China who behind THE GREAT FIREWALL<br/>
https://github.com/anjia0532/gcr.io_mirror<br/>
https://anjia0532.github.io/2017/11/15/gcr-io-image-mirror/

至此 Kubernetes 集群 master 节点已经初始化完成，但要想让其工作还需要一个步骤，安装网络扩展组件。

### Setup networking

选择一个网络扩展组件安装到 Kubernetes 集群，Install Weave network driver

```
$ kubectl apply -f \
 "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```
等一会再次查看 Pods 运行情况
```
root@raspberrypi:~# kubectl get pods --all-namespaces -o wide
NAMESPACE     NAME                                  READY     STATUS    RESTARTS   AGE       IP              NODE
kube-system   etcd-raspberrypi                      1/1       Running   0          17m       192.168.2.100   raspberrypi
kube-system   kube-apiserver-raspberrypi            1/1       Running   0          17m       192.168.2.100   raspberrypi
kube-system   kube-controller-manager-raspberrypi   1/1       Running   0          17m       192.168.2.100   raspberrypi
kube-system   kube-dns-686d6fb9c-t5wcm              3/3       Running   0          17m       10.32.0.2       raspberrypi
kube-system   kube-proxy-665dg                      1/1       Running   0          17m       192.168.2.100   raspberrypi
kube-system   kube-scheduler-raspberrypi            1/1       Running   0          17m       192.168.2.100   raspberrypi
kube-system   weave-net-7css2                       2/2       Running   0          2m        192.168.2.100   raspberrypi
```
在此查看 Nodes 状态
```
root@raspberrypi:~# kubectl get nodes
NAME          STATUS    ROLES     AGE       VERSION
raspberrypi   Ready     master    22m       v1.10.5
```
👌

### Troubleshoot pods
当 Pods 遇到问题时可以用下面查看某个 Pod 里面的 events log 看原因
```
root@raspberrypi:~# kubectl -n kube-system describe pods kube-proxy-665dg
...
Events:
  Type     Reason                 Age                 From                Message
  ----     ------                 ----                ----                -------
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "lib-modules"
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "xtables-lock"
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "kube-proxy"
  Normal   SuccessfulMountVolume  49m                 kubelet, kubenode1  MountVolume.SetUp succeeded for volume "kube-proxy-token-r6sgq"
  Normal   BackOff                47m (x4 over 48m)   kubelet, kubenode1  Back-off pulling image "gcr.io/google_containers/kube-proxy-arm:v1.10.5"
  Normal   Pulling                46m (x4 over 49m)   kubelet, kubenode1  pulling image "gcr.io/google_containers/kube-proxy-arm:v1.10.5"
  Warning  Failed                 46m (x4 over 48m)   kubelet, kubenode1  Failed to pull image "gcr.io/google_containers/kube-proxy-arm:v1.10.5": rpc error: code = Unknown desc = Error response from daemon: Get https://gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
  Warning  Failed                 46m (x4 over 48m)   kubelet, kubenode1  Error: ErrImagePull
  Warning  Failed                 44m (x14 over 48m)  kubelet, kubenode1  Error: ImagePullBackOff
```

### Reinstall Pods
如果需要重新启动 Pods 则可以重新部署一下
```
kubectl replace --force -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

## Join Worker Nodes
把另外一个树莓派加入到 Kubernetes cluster 里来，首先按照以上过程从开始直到 `kubeadm init` 之前的步骤照做。

* 使用 `raspi-config` 工具修改系统默认的 hostname ，避免与其他节点的名称重复，因为 Kubernetes 会使用 hostname 区分节点。
* （可选）配置代理环境变量
* 安装 Docker
* 关闭 Swap Memory
* 添加 Cgroup Memory 并重启
* （可选）配置代理环境变量（因为上步已重启）
* 安装 Kubeadm
* （可选）去除代理环境变量
* （可选）配置 Docker 代理

还记得 kubeadm init 时记下来的 [kubeadm join][kubeadm-join] 命令吗，现在用它来把这个 Work node 主机加入到上面创建的 Kubernetes cluster master
```
kubeadm join --token dc8b91.eacc7d2b3679748e --discovery-token-unsafe-skip-ca-verification 192.168.1.16:6443
kubeadm join 192.168.2.100:6443 --token mdt1jg.312ebga0sydo2ab0 --discovery-token-ca-cert-hash sha256:865e742c53da18a663ecbf98a02e1a060b040ccb0530470c285ae6c36a201c30
```

如果不记得可以查询 token 和 Master API Server address
<div class='showyourterms raspbpi-master active' data-title="Raspberry Pi Master">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubectl cluster-info</div>
    <div class='lines' data-delay='1000'>
Kubernetes master is running at https://192.168.1.16:6443
KubeDNS is running at https://192.168.1.16:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    </div>
    <div class='type green' data-action='command' data-delay='400'>kubeadm token list</div>
    <div class='lines' data-delay='6000'>
TOKEN                     TTL         EXPIRES   USAGES                   DESCRIPTION                                                EXTRA GROUPS
dc8b91.eacc7d2b3679748e   &lt;forever&gt;   &lt;never&gt;   authentication,signing   The default bootstrap token generated by 'kubeadm init'.   system:bootstrappers:kubeadm:default-node-token
    </div>
  </div>
</div>

加入之后，在 Master node 上查看状态

```
root@raspberrypi:~# kubectl get nodes
NAME          STATUS     ROLES     AGE       VERSION
pi-node1      NotReady   <none>    6s        v1.10.5
raspberrypi   Ready      master    6h        v1.10.5
root@raspberrypi:~# kubectl get pods --all-namespaces -o wide
NAMESPACE     NAME                                  READY     STATUS              RESTARTS   AGE       IP              NODE
kube-system   etcd-raspberrypi                      1/1       Running             1          6h        192.168.2.101   raspberrypi
kube-system   kube-apiserver-raspberrypi            1/1       Running             9          6h        192.168.2.101   raspberrypi
kube-system   kube-controller-manager-raspberrypi   1/1       Running             1          6h        192.168.2.101   raspberrypi
kube-system   kube-dns-686d6fb9c-t5wcm              3/3       Running             3          6h        10.32.0.3       raspberrypi
kube-system   kube-proxy-665dg                      1/1       Running             1          6h        192.168.2.100   raspberrypi
kube-system   kube-proxy-rkqpq                      0/1       ContainerCreating   0          1m        192.168.2.142   pi-node1
kube-system   kube-scheduler-raspberrypi            1/1       Running             1          6h        192.168.2.101   raspberrypi
kube-system   weave-net-7css2                       2/2       Running             3          6h        192.168.2.100   raspberrypi
kube-system   weave-net-sj6b7                       0/2       ContainerCreating   0          1m        192.168.2.142   pi-node1
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
root@pi-node1:~# docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
k8s.gcr.io/kube-proxy-arm      v1.10.5             8fac2dc84e30        2 days ago          88.1MB
weaveworks/weave-npc           2.3.0               e214242c20cf        2 months ago        44.5MB
weaveworks/weave-kube          2.3.0               10ead2ac9c17        2 months ago        88.8MB
k8s.gcr.io/pause-arm           3.1                 e11a8cbeda86        6 months ago        374kB
```

## Dashboard

```
kubectl create -f  https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard-arm.yaml
```

怎么访问安装好的 Dashboard 呐？
`sudo kubectl port-forward kubernetes-dashboard-7fcc5cb979-lsw7f 8888:8443`


## Troubeshoot
`[ERROR SystemVerification]: missing cgroups: memory`
可能忘记添加 cgroup_enable=cpuset cgroup_enable=memory 到配置文件，具体查看上面步骤。

`[ERROR KubeletVersion]: couldn't get kubelet version: exit status 2`
kubelet 工具出现问题，可以运行 `kubelet --version` 查看报什么错误。

```
root@raspberrypi:~# kubectl -n kube-system logs weave-net-sj6b7 -c weave
standard_init_linux.go:190: exec user process caused "exec format error"
```
说明下载的 Docker 镜像并不适合此主机系统，可能不是 arm 版本的镜像。
关于 weave-net 这个镜像在 arm 系统上的运行问题可能还有些争议，参见 https://github.com/weaveworks/weave/issues/3276 ，虽然这个 close 了，但仍然有些人和我一样运行失败。

### Swap Momery
Kubernetes 不推荐开启 Swap，但 Raspberry Pi 的 1 G 内存实在不算大，所以不得已非得使用 Swap 的话可以使用下面方法
```
sudo nano /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

# 添加参数 --fail-swap-on=false

# 重启 kubelet 服务
$ sudo systemctl daemon-reload
$ sudo systemctl restart kubelet.service
$ kubeadm init --ignore-preflight-errors=Swap
```
在 Worker 主机上也进行上面设置才能开启 Swap 空间。

https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/

https://kubecloud.io/setup-a-kubernetes-1-9-0-raspberry-pi-cluster-on-raspbian-using-kubeadm-f8b3b85bc2d1

下一步

https://kubecloud.io/kubernetes-dashboard-on-arm-with-rbac-61309310a640

https://kubecloud.io/setting-up-kubernetes-visualization-of-a-cluster-96826433fc64

https://kubecloud.io/setting-up-a-highly-available-kubernetes-cluster-with-private-networking-on-aws-using-kops-65f7a94782ef

https://rak8s.io/

manifest-tool

[kubeadm-join]:https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join/
