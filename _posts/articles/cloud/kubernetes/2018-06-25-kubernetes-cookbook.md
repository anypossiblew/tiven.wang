---
layout: post
theme: UbuntuMono
series:
  url: kubernetes
  title: Kubernetes
title: "Kubernetes - Cookbook"
excerpt: "Kubernetes Cookbook."
modified: 2018-06-25T11:51:25-04:00
categories: articles
tags: [Kubernetes, Cookbook, Cloud]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1739.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/acampo-united-states-1739
comments: true
share: true
---

* TOC
{:toc}

### Kubernetes master node ip changed
当 Kubernetes master 节点主机 IP 改变了，或者有多个网络适配器就是说有多个 IP 地址而 Kubeadm init 时只为其中一个生成了证书，那么我们要为新的或另外的 IP 生成证书。

按正规做法，你应该在 kubeadm init 之前为 master 主机设置个静态 IP 地址，避免以后各种麻烦，因为我们所有操作都是通过 master 主机进行的，所以如果它的 IP 地址变了，很多东西就无法验证。例如 kubectl 使用的地址和证书就会无法校验通过。

我尝试通过修改 *~/.kube/config* 配置中的地址改为 *127.0.0.1* 就会报如下错误，显然原来的证书并没有信任这个地址
```
root@kubemaster:~# kubectl get nodes
Unable to connect to the server: x509: certificate is valid for 10.96.0.1, 10.59.161.75, not 127.0.0.1
```

[kubeadm alpha][kubeadm-alpha]
* `kubeadm alpha phase certs` 生成证书
* `kubeadm alpha phase kubeconfig` 生成配置文件
```
rm /etc/kubernetes/pki/apiserver.*
kubeadm alpha phase certs all --apiserver-advertise-address=0.0.0.0 --apiserver-cert-extra-sans=172.23.102.110
docker rm -f `docker ps -q -f 'name=k8s*kube-apiserver*'`
systemctl restart kubelet
rm /etc/kubernetes/admin.conf
kubeadm alpha phase kubeconfig admin
```

#### References
* [https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-alpha](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-alpha)
* [https://stackoverflow.com/questions/46360361/invalid-x509-certificate-for-kubernetes-master](https://stackoverflow.com/questions/46360361/invalid-x509-certificate-for-kubernetes-master)

### Using kubeadm with multiple network interfaces
#### Problem
I'm testing a Kubernetes cluster with VirtualBox and Vagrant. Every VM has an NATed interface (eth0) and a Host-Only interface (eth1). I wanted to make the first node try to join the master using the Host-Only IP address VMs contact each other using the Host-Only interfaces.
#### Solution
When running [`kubeadm init`][kubeadm-init], you must make sure you specify an internal IP for the API server’s bind address, like so:
```
kubeadm init --apiserver-advertise-address=192.168.99.100
```
And set parameter `--node-ip` for kubelet service in config file */etc/systemd/system/kubelet.service.d/10-kubeadm.conf* equal IP address of the node. If set, kubelet will use this IP address for the node.
```
sudo nano /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

[Service]
# ...
Environment="KUBELET_NETWORK_ARGS=--network-plugin=cni --cni-conf-dir=/etc/cni/net.d --cni-bin-dir=/opt/cni/bin --node-ip=192.168.99.100"
# ...
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_SYSTEM_PODS_ARGS $KUBELET_NETWORK_ARGS $KUBELET_DNS_ARGS $KUBELET_AUTHZ_ARGS $KUBELET_CADVISOR_ARGS $KUBELET_CERTIFICATE_ARGS $KUBELET_EXTRA_ARGS
```

重启 kubelet 服务
```
sudo systemctl daemon-reload
sudo systemctl restart kubelet.service
```

#### Discussion


#### References
* [https://github.com/kubernetes/kubernetes/issues/33618](https://github.com/kubernetes/kubernetes/issues/33618)
* [kubernetes.io/using-internal-ips-in-your-cluster](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init/#using-internal-ips-in-your-cluster)


## Pod templates

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # This is the pod template
    spec:
      containers:
      - name: hello
        image: busybox
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # The pod template ends here
```

## ReplicaSet templates

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # modify replicas according to your case
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
```

## ReplicationController templates

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

## Deployment templates

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

## Job templates

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

[kubeadm-alpha]:https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-alpha
[kubeadm-init]:https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init/
