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


[kubeadm-alpha]:https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-alpha
