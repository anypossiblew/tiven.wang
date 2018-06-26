---
layout: post
theme: UbuntuMono
title: "Kubernetes - Cookbook"
excerpt: "Kubernetes Cookbook."
modified: 2018-06-25T11:51:25-04:00
categories: articles
tags: [Kubernetes, Cloud]
image:
  vendor: nationalgeographic
  feature: /content/dam/travel/rights-exempt/2018-travel-photographer-of-the-year/2018-tpc-animals/malabar-pied-hornbills.ngsversion.1526674260421.adapt.885.1.jpg
  credit: NATIONAL GEOGRAPHIC TRAVEL
  creditlink: https://www.nationalgeographic.com/travel/features/photography/wildlife-landscapes-worth-trip/
comments: true
share: true
showYourTerms: true
references:
  - title: "Interactive Tutorial - Scaling Your App"
    url: https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/scale-interactive/
---

<style>
.showyourterms.kubemaster .type:before {
  content: "root@kubemaster:~# "
}
.showyourterms.kubenode1 .type:before {
  content: "root@kubenode1:~# "
}
.showyourterms.kube-tiven .type:before {
  content: "PS C:\\dev\\kube-tiven> "
}
.showyourterms.tiven .type:before {
  content: "PS C:\\User\\tiven> "
}
</style>

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

https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-alpha

https://stackoverflow.com/questions/46360361/invalid-x509-certificate-for-kubernetes-master

### Using kubeadm with multiple network interfaces
#### Problem
I'm testing a Kubernetes cluster with VirtualBox and Vagrant. Every VM has an NATed interface (eth0) and a Host-Only interface (eth1). I wanted to make the first node try to join the master using the Host-Only IP address VMs contact each other using the Host-Only interfaces.
#### Solution
When running `kubeadm init`, you must make sure you specify an internal IP for the API server’s bind address, like so:
```
kubeadm init --apiserver-advertise-address=192.168.99.101
```
#### Discussion
但跑起来后 Kubernetes 里面仍然有些地方会使用默认的 network interface，所以仍然有需要配置的地方？针对 VirtualBox 虚拟机这种情况，我只是把要用的 Host-Only interface 改成了默认的 Adapter 就行了（在 Settings - Network 里把 Host-Only Adapter 设置在 Adapter 1 上，把 Nat 设置在 Adapter 2 上）。

#### References
* https://github.com/kubernetes/kubernetes/issues/33618
* https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-init/#using-internal-ips-in-your-cluster


[kubeadm-alpha]:https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-alpha
