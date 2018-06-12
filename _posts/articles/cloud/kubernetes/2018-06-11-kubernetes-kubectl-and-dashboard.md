---
layout: post
theme: UbuntuMono
title: "Kubernetes - Kubectl and Dashboard"
excerpt: "Learn how to operate cluster outside master system, and how to deploy Dashboard for Kubernetes on Kubernetes cluster."
modified: 2018-06-11T11:51:25-04:00
categories: articles
tags: [Kubeadm, Kubernetes, Cloud]
image:
  vendor: twitter
  feature: /media/DfGbYtqX0AEP6EY.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1004755042925273088
comments: true
share: true
showYourTerms: true
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs

---

<style>
.showyourterms.kubemaster .type:before {
  content: "root@kubemaster:~# "
}
.showyourterms.kubenode1 .type:before {
  content: "root@kubenode1:~# "
}
</style>

* TOC
{:toc}

在上一篇 [Kubernetes - Create cluster using kubeadm](/articles/kubernetes-create-cluster-using-kubeadm/) 我们使用工具 Kubeadm 创建了一个包含了一个 master 和一个 node 的 Kubernetes cluster。
本篇我们接着来接着认识一下这个 cluster 的基本概念和操作，包括如何从 cluster master 系统外操作 cluster （使用 kubectl 工具）和部署第一个服务 Kubernetes Dashboard 。

## Kubectl from Laptop

Powershell 终端上安全拷贝 admin.conf 到物理本机，然后就可以在此电脑上访问 Kubernetes master 节点的集群了
```
scp root@<master ip>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

master ip 是你的 master 节点主机的 IP 地址，root 是指使用系统的 root 用户远程登录并做拷贝，你也可以使用非 root 用户，这样更安全一些，但你可能需要授权 *admin.conf* 文件权限给你的用户。

如果使用 root 用户，到目前为止你应该没有开启 root 登录功能。为 Ubuntu root 用户设置密码，即开启 root 用户登录系统能力

`$ sudo passwd root`

还需要修改配置 *sshd_config* 允许root登录，添加或修改为此行配置 `PermitRootLogin yes`，然后重启服务：

```
$ vi /etc/ssh/sshd_config
PermitRootLogin yes （默认为 #PermitRootLogin prohibit-password）
：wq

$ service ssh restart
```

## Proxying API Server to localhost

```
kubectl --kubeconfig ./admin.conf proxy
```
然后就可以用 localhost 访问 Kubernetes cluster 的 API Server 的接口了 [*http://localhost:8001/api/v1*](http://localhost:8001/api/v1)

## Dashboard
通过代理访问 API [*http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/*](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/)
可以得到如下结果
```json
{
  kind: "Status",
  apiVersion: "v1",
  metadata: { },
  status: "Failure",
  message: "services "kubernetes-dashboard" not found",
  reason: "NotFound",
  details: {
    name: "kubernetes-dashboard",
    kind: "services"
  },
  code: 404
}
```
可以看到服务 "kubernetes-dashboard" 还没有安装，所以接下来我们要依照 [kubernetes dashboard readme](https://github.com/kubernetes/dashboard) 为 Kubernetes cluster 安装一个 [Dashboard UI](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

### Install Dashboard
在 Kubernetes master 主机上(或者使用上节讲的 `kubectl` from Laptop)安装 Dashboard service (当前 Dashboard Version:
v1.8.3)
```
root@kubemaster:~# kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
secret "kubernetes-dashboard-certs" created
serviceaccount "kubernetes-dashboard" created
role.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
rolebinding.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
deployment.apps "kubernetes-dashboard" created
service "kubernetes-dashboard" created
```
查看 Kubernetes 集群里所有 pods 的状态
```
root@kubemaster:~# kubectl get pods --all-namespaces
NAMESPACE     NAME                                    READY     STATUS             RESTARTS   AGE
kube-system   kube-apiserver-kubemaster               0/1       Pending            0          1s
kube-system   kube-dns-86f4d74b45-bdd2g               3/3       Running            0          14h
kube-system   kube-proxy-8swcv                        1/1       Running            0          14h
kube-system   kubernetes-dashboard-7d5dcdb6d9-jbz8z   0/1       ImagePullBackOff   0          36s
kube-system   weave-net-7t6lt                         2/2       Running            4          13h
```

等 kubernetes-dashboard 这个 pod `Running` 起来后，再次在物理本机访问 *http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/*
如果正常情况则会出现 Kubernetes Dashboard UI 登录页面。

> Kubernetes Dashboard 自版本 v1.7 权限控制便有所升级

有两种登录方式可选 [Kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 和 [Token](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)，两种方式的配置对于到目前步骤为止我们的知识水平来说过于复杂，所以我们选择跳过。跳过的意思是 Kubernetes Dashboard service 会使用默认的账号（kubernetes-dashboard）访问 Kubernetes cluster APIs。
跳过登录页面的话，虽然可以进入管理页面，但都没权限查看，会出现类似下面这种错误
```
nodes is forbidden: User "system:serviceaccount:kube-system:kubernetes-dashboard" cannot list nodes at the cluster scope
```
这说明默认账号 ·kube-system:kubernetes-dashboard· 没有权限访问 cluster APIs。接下来我们就按照 [Kuernetes Dashboard/Access control/Admin privileges](https://github.com/kubernetes/dashboard/wiki/Access-control#official-release) 说明为账号分配管理员权限。
执行命令 `kubectl create -f dashboard-admin.yaml` 其中文件 *dashboard-admin.yaml* 内容为
```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kubernetes-dashboard
  labels:
    k8s-app: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard
  namespace: kube-system
```
ClusterRoleBinding 创建成功后刷新 Dashboard 页面就可以看到最终效果了。

Authentication and Authorization 的概念会放在后面介绍，这里我们只简单介绍一下，Kubernetes 有两种账号类型 Service Account 和 User Account，Service Account 是用于系统进程的账号类型而 User Account 则是为人类用户使用的账号类型。在 Kubernetes Dashboard 安装过程中会创建一些 Service Account 并指定一个默认账号给它使用即 （kube-system:kubernetes-dashboard），但现在安全升级了，初始化只分配最小范围的权限给他。所以你想要使用默认账号查看 Dashboard 则需要分配 Admin Cluster Role 给他。

下面是查看 Service Account 和其相应的 Secret 的过程

<div class='showyourterms light kubemaster' data-title="Kubemaster">
  <div class='type' data-action='command' data-delay='400'>kubectl get serviceaccounts --all-namespaces</div>
  <div class='lines grey' data-delay='400'>
default       default                              1         23h
kube-public   default                              1         23h
kube-system   attachdetach-controller              1         23h
kube-system   bootstrap-signer                     1         23h
kube-system   certificate-controller               1         23h
kube-system   clusterrole-aggregation-controller   1         23h
kube-system   cronjob-controller                   1         23h
kube-system   daemon-set-controller                1         23h
kube-system   default                              1         23h
kube-system   deployment-controller                1         23h
kube-system   disruption-controller                1         23h
kube-system   endpoint-controller                  1         23h
kube-system   generic-garbage-collector            1         23h
kube-system   horizontal-pod-autoscaler            1         23h
kube-system   job-controller                       1         23h
kube-system   kube-dns                             1         23h
kube-system   kube-proxy                           1         23h
kube-system   kubernetes-dashboard                 1         20h
  </div>
  <div class='type' data-action='command' data-delay='400'>kubectl get serviceaccounts kubernetes-dashboard -n kube-system -o yaml</div>
  <div class='lines grey' data-delay='400'>
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2018-06-11T09:55:25Z
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
  resourceVersion: "13020"
  selfLink: /api/v1/namespaces/kube-system/serviceaccounts/kubernetes-dashboard
  uid: 9070a7cd-6d5d-11e8-a8b9-00155d4b0181
secrets:
- name: kubernetes-dashboard-token-qtlh8
  </div>
</div>

```
root@kubemaster:~# kubectl get serviceaccounts --all-namespaces //查看所有的 Service Accounts
default       default                              1         23h
kube-public   default                              1         23h
kube-system   attachdetach-controller              1         23h
kube-system   bootstrap-signer                     1         23h
kube-system   certificate-controller               1         23h
kube-system   clusterrole-aggregation-controller   1         23h
kube-system   cronjob-controller                   1         23h
kube-system   daemon-set-controller                1         23h
kube-system   default                              1         23h
kube-system   deployment-controller                1         23h
kube-system   disruption-controller                1         23h
kube-system   endpoint-controller                  1         23h
kube-system   generic-garbage-collector            1         23h
kube-system   horizontal-pod-autoscaler            1         23h
kube-system   job-controller                       1         23h
kube-system   kube-dns                             1         23h
kube-system   kube-proxy                           1         23h
kube-system   kubernetes-dashboard                 1         20h
//...
root@kubemaster:~# kubectl get serviceaccounts kubernetes-dashboard -n kube-system -o yaml //查看某一个 Service Account 详情
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2018-06-11T09:55:25Z
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
  resourceVersion: "13020"
  selfLink: /api/v1/namespaces/kube-system/serviceaccounts/kubernetes-dashboard
  uid: 9070a7cd-6d5d-11e8-a8b9-00155d4b0181
secrets:
- name: kubernetes-dashboard-token-qtlh8
root@kubemaster:~# kubectl get secret kubernetes-dashboard-token-qtlh8 -n kube-system -o yaml //查看 Service Account 对应的 Secret 信息
apiVersion: v1
data:
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRFNE1EWXhNVEEyTkRjeU0xb1hEVEk0TURZd09EQTJORGN5TTFvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTFV3CllWMHlSY1VVK3Q3UlU5VlQ4c3hIUWUrZHowWUtreExOMlR6ZHNXbXVsS2Z1RzdNTGZiYk1ldzZqYmQ0K3VSNVAKMW9sYmsxLzgrSVRjM2UycGpyRWIzUUFrMlpKNFpqM3hhQ2pYMkRZYlhqK1I2WnM3NVRUOEVOT3VUc0xERm1EWAppL00wWkQvdWxMam5sK01sdElxNHpjblNvQ0RNQlFGc0l0QmYyQkJoY29weE5kMUpsVzR4aXl4M1BNcTdDeVNCCmNrVzBHK0JiR09xbDBtVlBuZDd5M0JFcnpvd1Z0UkhOUVQ0T2FTYjFNU0RQTmVsa1YzLzlXSnFiWWVRSkloYnQKN2lkMkVXd1ZHRWFjMkRDTk5kYzgvaWhaM0RHL3pVejQyRFYzQVBEU28wUEFSMG54NG1LRHdVa0Vqc01lUjhMRAphUkh5RCtQK0FQVEwyanZPcURrQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFGV0dKM2hKZmtUdVlVMlcwUDg4Uk1CYURaYlUKU0VJeVhwQk9KbmZQSTZJNGZxVXAxeWJGRTRuNEhYaXRhajM0bDM4UGVCNWM2cnh6eUNVTnVIcVFsMkk4aE5XSQpkZEFvSENtb3JqZzFFMG9LVkUzZ1QzL2FOQVdzUmxuMC9SeUExOU1vRG0xSVFFZXhMM3BqUTZSRzk0SmZhZDhzCjNXN2cxVldmYjRjU2J5UkNxSWNXcldCYmZzTjhzY0RTV3l2VmQxQUN1RnhIcHFyM1VBbmZ6SzlWVFlmdHpPQmgKcm4vME84aGJWMWVqTFNxNXFldWhPUjFITkFQVlNJa3ZIelV6RVlJSHNyUzl1SW1Ca1VYNm53VDF4UnJZOUFVdwpDaS9TWFJxNGJmcHZya1VPUkQ2ZnQ3UmFNQUZYMkVqN1JBclpON0lyUGFEemszY09rcFBTZW0wVHlmZz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
  namespace: a3ViZS1zeXN0ZW0=
  token: ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklpSjkuZXlKcGMzTWlPaUpyZFdKbGNtNWxkR1Z6TDNObGNuWnBZMlZoWTJOdmRXNTBJaXdpYTNWaVpYSnVaWFJsY3k1cGJ5OXpaWEoyYVdObFlXTmpiM1Z1ZEM5dVlXMWxjM0JoWTJVaU9pSnJkV0psTFhONWMzUmxiU0lzSW10MVltVnlibVYwWlhNdWFXOHZjMlZ5ZG1salpXRmpZMjkxYm5RdmMyVmpjbVYwTG01aGJXVWlPaUpyZFdKbGNtNWxkR1Z6TFdSaGMyaGliMkZ5WkMxMGIydGxiaTF4ZEd4b09DSXNJbXQxWW1WeWJtVjBaWE11YVc4dmMyVnlkbWxqWldGalkyOTFiblF2YzJWeWRtbGpaUzFoWTJOdmRXNTBMbTVoYldVaU9pSnJkV0psY201bGRHVnpMV1JoYzJoaWIyRnlaQ0lzSW10MVltVnlibVYwWlhNdWFXOHZjMlZ5ZG1salpXRmpZMjkxYm5RdmMyVnlkbWxqWlMxaFkyTnZkVzUwTG5WcFpDSTZJamt3TnpCaE4yTmtMVFprTldRdE1URmxPQzFoT0dJNUxUQXdNVFUxWkRSaU1ERTRNU0lzSW5OMVlpSTZJbk41YzNSbGJUcHpaWEoyYVdObFlXTmpiM1Z1ZERwcmRXSmxMWE41YzNSbGJUcHJkV0psY201bGRHVnpMV1JoYzJoaWIyRnlaQ0o5Lnhla191VE41VWJkWVhOQzZha3NUYmFMeTJGN2sxd1dhMGZzRHl0U182STUwckZxTWZ6ck9pdUcyRDR2NzRMVXF6Z3hzZHZaa2JHV0F0aE1RUGdJY0pNaHM2ZVRqbkxsM043c2prVVhzMXRsTG5RaWpQWDhUcHE0RVR4UXpOTGdNdDJxLXdlRzU1aDdseEhBd01nSVhVTkVkay1KbWJuanlseGRLemx0T1VxUTg4X0pLQzJrWVRIcEUyMWxlSDFUNGhGR05abldjQnJocVA3czdSdmVEZnBua3FzbHFGT2xGR1BEdTBMZEFsb2F3Tm5DV1ZsRTBRS3NseUNrNzRzWklqeHM5MXZFMXFUUnROQldvXzlMbEtZS01tcVZwV3pqMVZjSG5ObmNUVmlnOXJ3OVpDZzl3c21Kc2JaOVNrSzNmZWlYSXlRYXNPbmJsd3E1aTJxWHlkQQ==
kind: Secret
metadata:
  annotations:
    kubernetes.io/service-account.name: kubernetes-dashboard
    kubernetes.io/service-account.uid: 9070a7cd-6d5d-11e8-a8b9-00155d4b0181
  creationTimestamp: 2018-06-11T09:55:25Z
  name: kubernetes-dashboard-token-qtlh8
  namespace: kube-system
  resourceVersion: "13018"
  selfLink: /api/v1/namespaces/kube-system/secrets/kubernetes-dashboard-token-qtlh8
  uid: 907905ea-6d5d-11e8-a8b9-00155d4b0181
type: kubernetes.io/service-account-token
```
当拿到 Token 时你便可以使用各种方式访问 Kubernetes cluster APIs 了。

### Kubernetes Dashboard
安装好了 Dashboard 我们就来试用一下他吧。


[buildroot]:https://buildroot.org/
