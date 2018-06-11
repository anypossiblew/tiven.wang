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
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs

---

* TOC
{:toc}

在上一篇 [Kubernetes - Create cluster using kubeadm]() 我们使用工具 Kubeadm 创建了一个包含了一个 master 和一个 node 的 Kubernetes cluster。
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
然后就可以用 localhost 访问 Kubernetes cluster 的 API Server 的接口了 *http://localhost:8001/api/v1*

## Dashboard
通过代理访问 API *http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/*
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
可以看到服务 "kubernetes-dashboard" 还没有安装，所以接下来我们要为 Kubernetes cluster 安装一个 Dashboard UI

https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/

在 Kubernetes master 主机上安装 Dashboard service
```
root@kubemaster:~# kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
secret "kubernetes-dashboard-certs" created
serviceaccount "kubernetes-dashboard" created
role.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
rolebinding.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
deployment.apps "kubernetes-dashboard" created
service "kubernetes-dashboard" created
```

```
root@kubemaster:~# kubectl get pods --all-namespaces
NAMESPACE     NAME                                    READY     STATUS             RESTARTS   AGE
kube-system   kube-apiserver-kubemaster               0/1       Pending            0          1s
kube-system   kube-dns-86f4d74b45-bdd2g               3/3       Running            0          14h
kube-system   kube-proxy-8swcv                        1/1       Running            0          14h
kube-system   kubernetes-dashboard-7d5dcdb6d9-jbz8z   0/1       ImagePullBackOff   0          36s
kube-system   weave-net-7t6lt                         2/2       Running            4          13h
```

等 kubernetes-dashboard 这个 pod `Running` 起来，再次在物理本机访问 *http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/*
如果正常情况则会出现 Kubernetes Dashboard UI 登录页面。
有两种登录方式可选，Kubeconfig 和 Token。
选择 Kubeconfig 方式，输入之前 Copy 出来的 admin.conf 配置文件

参考 https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/

https://kubernetes.io/docs/reference/access-authn-authz/authentication/


```
PS C:\Users\anypo> kubectl --kubeconfig ./admin.conf get serviceaccounts
NAME      SECRETS   AGE
default   1         15h
PS C:\Users\anypo> kubectl --kubeconfig ./admin.conf get serviceaccounts default -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2018-06-08T14:38:07Z
  name: default
  namespace: default
  resourceVersion: "304"
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 8f488b5a-6b29-11e8-8a5e-00155d026a08
secrets:
- name: default-token-qg7kp
```
```
root@kubemaster:~# kubectl get secret default-token-qg7kp -o yaml
apiVersion: v1
data:
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRFNE1EWXdPREUwTXpZek9Gb1hEVEk0TURZd05URTBNell6T0Zvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS3l1CnV3WDMybXlMWWdZS25Kd25nakxWSVllTEwwNFlxc3hYbTFpM3g4VFBiVk45eVovdW16SWpHc0hsSHQwc2xJNWIKVzlxZXprQVJkelJWMXFHNWFCcWMySnlKU1cycGZ2R0ZLVGJhNmhPWElzMlVnYzF2cUYzcG1YVkFIbEJMbUNzUApNV0ljUENKUG1uWUl0TFZqSnBweUtPZUE4QS90SzJidVZUSGRibVdUMEllMlgwQ0h4N1BZWDl6emUrTkZ3RnZaCkkrek1ZV3cvQmhUZERZWVZ1N2F5TkQxdm9uNkN5YTBFdE9kZmxmazRwWEsxQVpacnJpTFA1VU1DRFdKK2l3eXYKZTJyZ28vdlVDU253a2I0aHhGZGtjTVhSV2trb2FWYkxWb2MxVG5lQ0ljWW5DMUNXSEpIaDJ6UitwZWt2VFpxZApWZTg3UWhHSCtuRHBZSVhtbGxFQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFHTmk1eGs4WWVxRFRURldKSzhCa2dDNnEvb1gKV0QvdTdrTUZZUGtlV2QvNnppRDk4VXZlTS9CanJubnFuTHpwV0kvbkp0bUVQL3libTVReU9neDEyTVNjcHJ6OAovRmFHVUZZLy90OEtFczVQSmNJa2JwV1MveTh0Sk54S2ZQL3BsK1d0V0hXQUJMQW5ScklFMnR1am5rM1FaZUVKCnUxMUk4NEk0TXVlS2hLekVueGVveWVWcXdtOXdPMDhlSU0yWXUxRllrRVBaMENrZ2psZGQrYllmc3g3K3RYRlAKRlBxNmxydFNWWWpWWmdlaXE2T1NTTk9xTW1hSXRSajBnRUx5S0VoQitBczB5WTBQU1dKMVF2czR4eWswdENRVwpVdGNLVlFkNmgxeW1oT0NMekNOM0d1a0NiWXpSbnNLOWlqSVRDYkNDekh3bUpheW41NXNNNjJOTklLWT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
  namespace: ZGVmYXVsdA==
  token: ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklpSjkuZXlKcGMzTWlPaUpyZFdKbGNtNWxkR1Z6TDNObGNuWnBZMlZoWTJOdmRXNTBJaXdpYTNWaVpYSnVaWFJsY3k1cGJ5OXpaWEoyYVdObFlXTmpiM1Z1ZEM5dVlXMWxjM0JoWTJVaU9pSmtaV1poZFd4MElpd2lhM1ZpWlhKdVpYUmxjeTVwYnk5elpYSjJhV05sWVdOamIzVnVkQzl6WldOeVpYUXVibUZ0WlNJNkltUmxabUYxYkhRdGRHOXJaVzR0Y1djM2EzQWlMQ0pyZFdKbGNtNWxkR1Z6TG1sdkwzTmxjblpwWTJWaFkyTnZkVzUwTDNObGNuWnBZMlV0WVdOamIzVnVkQzV1WVcxbElqb2laR1ZtWVhWc2RDSXNJbXQxWW1WeWJtVjBaWE11YVc4dmMyVnlkbWxqWldGalkyOTFiblF2YzJWeWRtbGpaUzFoWTJOdmRXNTBMblZwWkNJNklqaG1ORGc0WWpWaExUWmlNamt0TVRGbE9DMDRZVFZsTFRBd01UVTFaREF5Tm1Fd09DSXNJbk4xWWlJNkluTjVjM1JsYlRwelpYSjJhV05sWVdOamIzVnVkRHBrWldaaGRXeDBPbVJsWm1GMWJIUWlmUS5NOEZyLUxtWnBmeWFmeXoxVTBoWVNGSUp5UFQyN3VlTV9ZdTYxdXpDS0FLcnhTMkhzakpnbTFsc1FUODVBc2lCNnh5V1kwZ0VBYllBMEM0WEEyVDZCbHhOWVB3MjBuTlZlTDY0UTZlS1B5LWcxTHRFdXdxUmthdHA5anpvbjdkcWc3VGlqYjFhclNRVWN4VmNCNGxUdmNIdkxuX1ZOWHhfZUF5ajQ1Q084WG4yQUt0TDBGZHVUSllxelJnV2pMWHlaZzh0NE9zZWR0TEJ0TjFWR01RY1BlMkU5b3hjSGRueWdCdTl1OU9iZW05czZ6eDNDbkNibTBDcWNzOXFxWW5ETzNHTWpldHEtWXZoNENXaWtnUXZIOEFuZ0RKeXVWQWc3RzR5UDVfSWNFZXRJT1NMLW5xS1p3Wm9zZjI2R2hPd2prbDh4R3dEUmFCMVZiTzdCZlpOcWc=
kind: Secret
metadata:
  annotations:
    kubernetes.io/service-account.name: default
    kubernetes.io/service-account.uid: 8f488b5a-6b29-11e8-8a5e-00155d026a08
  creationTimestamp: 2018-06-08T14:38:08Z
  name: default-token-qg7kp
  namespace: default
  resourceVersion: "301"
  selfLink: /api/v1/namespaces/default/secrets/default-token-qg7kp
  uid: 8f9bb724-6b29-11e8-8a5e-00155d026a08
type: kubernetes.io/service-account-token
```

跳过登录页面的话，虽然可以进入管理页面，但都没权限查看，会出现下面这种错误
```
nodes is forbidden: User "system:serviceaccount:kube-system:kubernetes-dashboard" cannot list nodes at the cluster scope
```


https://kubernetes-incubator.github.io/kube-aws/advanced-topics/kubernetes-dashboard.html


[buildroot]:https://buildroot.org/
