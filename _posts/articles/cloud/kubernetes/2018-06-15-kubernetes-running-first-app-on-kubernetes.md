---
layout: post
theme: UbuntuMono
title: "Kubernetes - Running First App on Kubernetes"
excerpt: "Learn how to develop and deploy your first application on Kubernetes cluster."
modified: 2018-06-15T11:51:25-04:00
categories: articles
tags: [Kubernetes, Cloud]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6531.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/mary-turkmenistan-6531
comments: true
share: true
showYourTerms: true
references:
  - id: 1
    title: "Use a Service to Access an Application in a Cluster"
    url: https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/
  - title: "Interactive Tutorial - Scaling Your App"
    url: https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/scale-interactive/
---

<style>
.showyourterms.kube-tiven .type:before {
  content: "PS C:\\dev\\kube-tiven> "
}
.showyourterms.tiven .type:before {
  content: "PS C:\\User\\tiven> "
}
</style>

* TOC
{:toc}

在之前的两篇 ["Kubernetes - Create cluster using kubeadm"](/articles/kubernetes-create-cluster-using-kubeadm/) 介绍了如何在虚拟机上使用 kubeadm 工具创建一个 Kubernetes 集群和 ["Kubernetes - Kubectl and Dashboard"](/articles/kubernetes-kubectl-and-dashboard/) 如何使用工具 kubectl 访问 Kubernetes 服务、如何安装部署 Kubernetes Dashboard 应用服务。这样就有了我们自己的开发环境，接下来就是要介绍如何在这个 Kubernetes cluster 上开发和部署应用程序。

## Application to Docker Image
关于如何编写应用程序我们不做详细介绍，只是一笔带过。使用什么语言编写的应用也不重要，所以你可以选择自己熟悉和喜欢的语言。
本篇我们选择使用 [Node.js][nodejs] 来编写一个简单的 Web Application。

### Create Node.js Application
创建一个 Node.js 项目叫 *kube-tiven*，然后编写主 JavaScript 程序 *app.js* 如下

*app.js*
```javascript
const http = require('http');
const os = require('os');

console.log("Kube-tiven server starting...");

var handler = function(req, resp) {
  console.log("Received request from " + req.connection.remoteAddress);
  resp.writeHead(200);
  resp.end("You've hit " + os.hostname() + "\n");
};
var www = http.createServer(handler);
www.listen(8080);
```

为了保证下一步顺利进行，我们进行本地测试。运行 Node.js 程序并发送请求给端口号 8080，结果如下便是正确
<div class='showyourterms kube-tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>node app.js</div>
    <div class='lines' data-delay='400'>
Kube-tiven server starting...
Received request from ::ffff:127.0.0.1
    </div>
  </div>
</div>
👌
### Build Docker Image
创建好应用程序，接下来就是把他打包成一个 Docker 镜像文件方便到处（到处代表任意地随便地，你不需要关心太多就可以方便地拿去用）部署。创建 Docker 镜像构建文件

*Dockerfile*
```
FROM node:8
ADD app.js /app.js
ENTRYPOINT ["node", "app.js"]
```
然后把应用程序构建成自己的 Docker 镜像
<div class='showyourterms kube-tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>docker build -t kube-tiven .</div>
    <div class='lines' data-delay='400'>
Sending build context to Docker daemon  4.096kB
Step 1/3 : FROM node:8
8: Pulling from library/node
3d77ce4481b1: Pull complete
7d2f32934963: Pull complete
0c5cf711b890: Pull complete
9593dc852d6b: Pull complete
4b16c2786be5: Pull complete
5fcdaabfa451: Pull complete
5c8b2b2e4dd1: Pull complete
bf1ffaa6c385: Pull complete
Digest: sha256:37c74cbf7e5e7f4d5393c76fdf33d825ac4b978b566a401eb3709a2f8be75b6f
Status: Downloaded newer image for node:8
 ---> f46f0c9a300b
Step 2/3 : ADD app.js /app.js
 ---> ce5396c6ab4d
Step 3/3 : ENTRYPOINT ["node", "app.js"]
 ---> Running in f600844bfc8b
Removing intermediate container f600844bfc8b
 ---> e4d3f46026b6
Successfully built e4d3f46026b6
Successfully tagged kube-tiven:latest
SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.
    </div>
    <div class='type green' data-action='command' data-delay='400'>docker images</div>
    <div class='lines' data-delay='400'>
REPOSITORY                                               TAG                 IMAGE ID            CREATED             SIZE
kube-tiven                                               latest              e4d3f46026b6        About an hour ago   673MB
node                                                     8                   f46f0c9a300b        2 days ago          673MB
    </div>
  </div>
</div>


构建 Docker 镜像的过程如下图

![Image: Docker build container image](/images/cloud/kubernetes/docker-build-container-image.png)

把我们当创建的镜像创建为一个容器，检验一下我们的 Docker image 是否正确，发送请求到 8080 端口看到返回说明运行正确
<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>docker run --rm -d --name kube-tiven-container -p 8080:8080 kube-tiven</div>
    <div class='lines' data-delay='400'>
3d539e4cfe7a80ed84b5ed113b299e664f282a5f562ecf49c3b8c2d94887cabf
    </div>
    <div class='type green' data-action='command' data-delay='400'>docker ps</div>
    <div class='lines' data-delay='400'>
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                     NAMES
3d539e4cfe7a        kube-tiven          "node app.js"            6 seconds ago       Up 4 seconds        0.0.0.0:8080->8080/tcp              kube-tiven-container
    </div>
    <div class='type green' data-action='command' data-delay='400'>curl http://127.0.0.1:8080</div>
    <div class='lines' data-delay='400'>
You've hit 3d539e4cfe7a
    </div>
    <div class='type green' data-action='command' data-delay='400'>docker stop kube-tiven-container</div>
    <div class='lines' data-delay='400'>
kube-tiven-container
    </div>
  </div>
</div>
👌


### Publish your Docker Image
因为 Kubernetes 默认是从 Docker hub 网站上下载 Docker 容器镜像的，所以我们在部署应用程序之前要把应用程序的 Docker 容器镜像发布到 Docker hub 网站。

<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>docker login</div>
    <div class='lines' data-delay='400'>
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username (tiven):
Password:
Login Succeeded
    </div>
    <div class='type green' data-action='command' data-delay='400'>docker push tiven/kube-tiven</div>
    <div class='lines' data-delay='400'>
The push refers to repository [docker.io/tiven/kube-tiven]
An image does not exist locally with the tag: tiven/kube-tiven
    </div>
  </div>
</div>

当我们 push 以 `tiven/kube-tiven` 这个名称的镜像时会提示不存在，因为 Docker 要求以 `<UserId>/<ImageName>` 格式发布镜像，而我们之前是直接标记为 `kube-tiven` 的镜像，所以我们需要为镜像换个标记名称

<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>docker tag kube-tiven tiven/kube-tiven</div>
    <div class='type green' data-action='command' data-delay='400'>docker push tiven/kube-tiven</div>
    <div class='lines' data-delay='400'>
The push refers to repository [docker.io/tiven/kube-tiven]
319207a9ff81: Pushed
6677c761b19b: Pushed
f98f4c9fe5a0: Pushed
0b3c2dee153a: Pushed
9ba7f6deb379: Pushed
f3693db46abb: Pushed
bb6d734b467e: Pushed
5f349fdc9028: Pushed
2c833f307fd8: Pushed
latest: digest: sha256:9b8b9367e71860bddda06e9c04139783d44cbf941dce49c96d96b2f37f27f6fd size: 2214
    </div>
  </div>
</div>
👌


## Deploying Our Application
部署 Kubernetes 应用程序有多种方式，可以直接用 kubectl 命令行或者文件，还可以使用 Dashboard 界面部署。
接下来我们使用命令行部署简单的应用程序，当后面了解的概念多了，再考虑使用配置简单部署更复杂的应用。
部署过程如下图所示

![Image: Kubectl create/rub application](/images/cloud/kubernetes/Kubectl-create-application.png)

简单起见，这里使用 [`kubectl run`][docker-cli-to-kubectl] 运行一个容器，就像运行 Docker 命令 `docker run` 一样
<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubectl run kube-tiven --image=tiven/kube-tiven --port=8080 --generator=run/v1</div>
    <div class='lines' data-delay='400'>
replicationcontroller "kube-tiven" created
    </div>
    <div class='type green' data-action='command' data-delay='400'>kubectl get pods</div>
    <div class='lines' data-delay='400'>
NAME               READY     STATUS              RESTARTS   AGE
kube-tiven-qblvj   0/1       ContainerCreating   0          4m
    </div>
  </div>
</div>

`--image=tiven/kube-tiven` 参数是指定我们刚才发布的应用程序 Docker 镜像，`--port=8080` 参数告诉 Kubernetes 我们的应用程序进程是运行在 8080 端口上的，`--generator=run/v1` 参数则是说明要创建的是 [*ReplicationController*][replicationcontroller] 而不是默认的 [*Deployment*][deployment]，至于他们之间的区别后面再介绍。然后我们查看了所有的 pods 可以看到一个叫 `kube-tiven-qblvj` 的状态为 `ContainerCreating`，因为他的 Docker Container 还在创建中，过一会再查看就会是 `Running` 状态了。

这里我们是查看 Pods ，而不是类似 `kubectl get containers` 这样的命令，因为 Kubernetes 资源类型里没有 Container 这种类型。Kubernetes 不直接管理和操作容器，而是以 [Pod][pods] 概念组织和管理容器的，Pod 可以简单理解为容器组。至于为什么容器需要打包成组存在，后面再介绍。我们还可以查看这个 Pod 详细信息

<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubectl describe pod kube-tiven-qblvj</div>
    <div class='lines' data-delay='400'>
Name:           kube-tiven-qblvj
Namespace:      default
Node:           kubenode2/192.168.99.102
Start Time:     Fri, 15 Jun 2018 17:07:59 +0800
Labels:         run=kube-tiven
Annotations:    &lt;none&gt;
Status:         Running
IP:             10.36.0.2
Controlled By:  ReplicationController/kube-tiven
Containers:
  kube-tiven:
    Container ID:   docker://21cf8316d51fb87f95104d424400a3008f7ce500effe79782d7e3aa2508a4b85
    Image:          tiven/kube-tiven
    Image ID:       docker-pullable://tiven/kube-tiven@sha256:9b8b9367e71860bddda06e9c04139783d44cbf941dce49c96d96b2f37f27f6fd
    Port:           8080/TCP
    State:          Running
      Started:      Fri, 15 Jun 2018 17:16:26 +0800
    Ready:          True
    Restart Count:  0
    Environment:    &lt;none&gt;
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-x9vsv (ro)
Conditions:
  Type           Status
  Initialized    True
  Ready          True
  PodScheduled   True
Volumes:
  default-token-x9vsv:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-x9vsv
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  &lt;none&gt;
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason                 Age   From                Message
  ----    ------                 ----  ----                -------
  Normal  Scheduled              23m   default-scheduler   Successfully assigned kube-tiven-qblvj to kubenode1
  Normal  SuccessfulMountVolume  23m   kubelet, kubenode1  MountVolume.SetUp succeeded for volume "default-token-x9vsv"
  Normal  Pulling                23m   kubelet, kubenode1  pulling image "tiven/kube-tiven"
  Normal  Pulled                 15m   kubelet, kubenode1  Successfully pulled image "tiven/kube-tiven"
  Normal  Created                15m   kubelet, kubenode1  Created container
  Normal  Started                15m   kubelet, kubenode1  Started container
    </div>
  </div>
</div>

可以看到此 Pod 是部署 `kubenode2/192.168.99.102` 主机上的，命名空间（Namespace）是 `default` 因为我们暂时没有为开发程序另外创建命名空间。还有他的 IP (10.36.0.2)，Kubernetes 里的 IP 太复杂了，我们后面会针对网络做详细分析。Pod 还有个 Containers 节点，一个 Pod 可以包含多个 Containers。

## Accessing Application
要想访问我们的应用程序，需要把它暴露成一个 [Service][kubernetes/service]。使用 [`kubectl expose`][kubectl/expose] 命令创建一个 Service 类型设置为 `NodePort` 意思是使用 Worker Node 上的端口转发来访问应用程序，因为我们是在虚拟机群上创建的 Kubernetes 集群，对于我们的本机来说集群的 Public IP 就是虚拟机节点的 IP。如果你的 Kubernetes cluster 是部署在像 GCP 这样的云服务器上的话，还可以选择使用 `LoadBalancer` 类型，他会为你创建一个具有公网 IP 的服务，也就是 IaaS 里的 LoadBalancer。

<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>
kubectl expose rc kube-tiven --type=NodePort  --name tiven-service
    </div>
    <div class='lines' data-delay='400'>
service "tiven-service" exposed
    </div>
  </div>
</div>

查看我们创建的 Service
<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>
kubectl get svc
    </div>
    <div class='lines' data-delay='400'>
NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)          AGE
kubernetes      ClusterIP   10.96.0.1     &lt;none&gt;        443/TCP          22h
tiven-service   NodePort    10.96.2.195   &lt;none&gt;        8080:31177/TCP   7s
    </div>
    <div class='type green' data-action='command' data-delay='400'>
kubectl describe services tiven-service
    </div>
    <div class='lines' data-delay='400'>
Name:                     tiven-service
Namespace:                default
Labels:                   run=kube-tiven
Annotations:              &lt;none&gt;
Selector:                 run=kube-tiven
Type:                     NodePort
IP:                       10.96.2.195
Port:                     &lt;unset&gt;  8080/TCP
TargetPort:               8080/TCP
NodePort:                 &lt;unset&gt;  31177/TCP
Endpoints:                10.36.0.2:8080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   &lt;none&gt;
    </div>
  </div>
</div>

从上面可以看到 Service 的 NodePort 属性为 31177/TCP 说明服务分配了 Worker Node 主机 31177 端口号给了我们的应用程序容器作端口号转发。那么我们要访问应用程序还需要知道其所在 Worker Node 主机的 IP 地址。你可以在 Dashboard 界面上查看到，也可以使用命令行查看，如下
<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>
kubectl get pods -o wide
    </div>
    <div class='lines' data-delay='400'>
NAME               READY     STATUS    RESTARTS   AGE       IP          NODE
kube-tiven-qt56j   1/1       Running   0          1h        10.36.0.2   kubenode2
    </div>
    <div class='type green' data-action='command' data-delay='400'>
kubectl describe node kubenode2
    </div>
    <div class='lines' data-delay='400'>
Name:               kubenode2
# ...
Addresses:
  InternalIP:  <span class="highlight">192.168.99.102</span>
  Hostname:    kubenode2
# ...
    </div>
  </div>
</div>

至此我们拿到了应用程序所在主机的 IP 地址（192.168.99.102）和 Service 暴露的转发端口号（31177），那么就可以来访问了
<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>
curl http://192.168.99.102:31177/
    </div>
    <div class='lines' data-delay='400'>
StatusCode        : 200
StatusDescription : OK
Content           : {89, 111, 117, 39...}
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Transfer-Encoding: chunked
                    Date: Thu, 28 Jun 2018 06:34:48 GMT

                    You've hit kube-tiven-qt56j

Headers           : {[Connection, keep-alive], [Transfer-Encoding, chunked], [Date, Thu, 28 Jun 2018 06:34:48 GMT]}
RawContentLength  : 28
    </div>
    <div class='type green' data-action='command' data-delay='400'>
kubectl logs kube-tiven-qt56j
    </div>
    <div class='lines' data-delay='400'>
Kube-tiven server starting...
Received request from ::ffff:10.36.0.0
    </div>
  </div>
</div>

参考[[1.]](#reference-1)

## Scaling Application

<div class='showyourterms tiven' data-title="Powershell on Laptop">
  <div class='showyourterms-container'>
    <div class='type green' data-action='command' data-delay='400'>kubectl get rc</div>
    <div class='lines' data-delay='400'>
NAME         DESIRED   CURRENT   READY     AGE
kube-tiven   1         1         1         3d
    </div>
    <div class='type green' data-action='command' data-delay='400'>kubectl scale rc kube-tiven --replicas=3</div>
    <div class='lines' data-delay='400'>
replicationcontroller "kube-tiven" scaled
    </div>
    <div class='type green' data-action='command' data-delay='400'>kubectl get rc</div>
    <div class='lines' data-delay='400'>
NAME         DESIRED   CURRENT   READY     AGE
kube-tiven   3         3         3         3d
    </div>
    <div class='type green' data-action='command' data-delay='400'>kubectl get pods</div>
    <div class='lines' data-delay='400'>
NAME               READY     STATUS    RESTARTS   AGE
kube-tiven-fncg9   1/1       Running   0          2m
kube-tiven-qblvj   1/1       Running   1          3d
kube-tiven-qwgq4   1/1       Running   0          2m
    </div>
  </div>
</div>




[pods]:https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/
[replicationcontroller]:https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/
[deployment]:https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[nodejs]:https://nodejs.org/en/
[docker-cli-to-kubectl]:https://kubernetes.io/docs/reference/kubectl/docker-cli-to-kubectl/
[kubernetes/service]:https://kubernetes.io/docs/concepts/services-networking/service/
[kubectl/expose]:https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#expose
