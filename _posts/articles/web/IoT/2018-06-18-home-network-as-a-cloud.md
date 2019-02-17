---
layout: post
theme: UbuntuMono
title: "Home Network as a Cloud"
excerpt: "Learn how to publish your home network as a cloud provider."
modified: 2018-06-18T11:51:25-04:00
categories: articles
tags: [Raspberry PI, Cloud]
image:
  vendor: twitter
  feature: /media/DfLk8bbV4AA1bcs.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1005117395684519937
comments: true
share: true
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs

---

* TOC
{:toc}

家庭网络怎么做云服务，实际上就是如何将内网服务暴露到公网环境，这里的内网环境的路由一般是指家庭的拨号上网方式，其公网 IP 会不断变换，所以主要解决的就是动态 DNS 或者叫内网穿透。

## DDNS

动态 DNS 的原理就是客户主机不断发送自己的 IP 信息给具有 DNS 功能的服务器，

需要路由器设置端口转发？

## 上报自己的信息代码示例

原理就是循环间隔向服务器发送请求上报自己的 IP 信息

https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

[forever js](https://github.com/foreverjs/forever) is a simple CLI tool for ensuring that a given script runs continuously.

https://www.digitalocean.com/community/tutorials/how-to-create-temporary-and-permanent-redirects-with-apache-and-nginx

pubic server
```javascript
const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  fs.writeFile('ips.txt', ip, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

http client in home network
```javascript
const http = require('http');

setInterval(() => {
  http.get('http://<pubic_id>:3000', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(new Date());
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}, 10*60*1000);
```


https://cloudplatform.googleblog.com/2018/06/Now-you-can-deploy-your-Node-js-app-to-App-Engine-standard-environment.html?m=1

https://cloud.google.com/appengine/docs/standard/nodejs/quickstart

## DDNS 产品

### Docker DDNS

后来仔细找了一下就发现了 [docker-ddns: Dynamic DNS with Docker, Go and Bind9](https://github.com/dprandzioch/docker-ddns) 这个实现此功能，就不需要自己再繁琐地写代码了（除非我想练习）。

#### Run Docker-DNS container

下面在你的 VPS 服务器上运行下面的 Docker 容器
```
docker run -it -d \
    -p 8080:8080 \
    -p 53:53 \
    -p 53:53/udp \
    -e SHARED_SECRET=your-secret \
    -e ZONE=tiven.wang \
    -e RECORD_TTL=3600 \
    --name=ddns \
    davd/docker-ddns:latest
```

这样有可能因为 53 端口已经被占用而启动失败（通过命令 `sudo lsof -Pnl +M -i4 | grep 53` 可以查看端口号被谁占用着），使用命令 `sudo systemctl status systemd-resolved.service` 查看服务 systemd-resolved 的运行状态，如果在运行可以通过以下方式关闭它
编辑文件 `/etc/systemd/resolved.conf` 添加配置 `DNSStubListener=no` 然后重启服务 `sudo systemctl restart systemd-resolved.service`

#### 配置域名解析

为你的 VPS 分配一个域名，如 `ddns.tiven.wang`（这是一条 A 记录域名指向你的 VPS 固定 IP）。然后把你要动态解析的域名设置为 NS 记录并指向前面设置的 VPS 域名（如我的是 ddns.tiven.wang）。

#### 测试动态解析

使用 GET 请求地址 http://ddns.tiven.wang:8080/update?secret=your-secret&domain=home&addr=30.190.219.20 便可设置你的域名（如我的 home.tiven.wang）指向某个 IP。


### NOIP

or https://www.noip.com/

or https://hub.docker.com/r/dragoncube/google-domains-ddns/

https://domains.google/#/

or https://www.duckdns.org/

or https://github.com/oznu/docker-cloudflare-ddns

cloudflare dns servers:
gabe.ns.cloudflare.com
tricia.ns.cloudflare.com

DDNS 并不合适，有的需要费用，noip 的 DNS 可能被墙内污染了。

### ngrok

https://ngrok.com/

## VPS+VPN+IPFORWARD

如果你已经有现有的域名和 VPS 可以选择如下方式。

https://www.digitalocean.com/community/tutorials/how-to-forward-ports-through-a-linux-gateway-with-iptables

我想还可以用 WireGuard 加密协议和 TunSafe 客户端（因为 TunSafe 客户端会自动重连，并且走的是 UDP 协议效率很高）实现双向内网穿透的相互访问。

用户用 (VPS 公网 IP) + (端口号) 访问 VPS 服务器，VPS 服务器做 Iptables 转发给 WireGuard 代表的内网地址。不过麻烦的是，iptables 转发规则需要手动维护。有没有脚本给做自动维护，再加个 Web 界面就可以了？

设置 VPS 服务器的防火墙转发规则
```
sudo iptables -A FORWARD -i ens4 -o wg0 -p tcp --syn --dport 8123 -m conntrack --ctstate NEW -j ACCEPT
sudo iptables -A FORWARD -i ens4 -o wg0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A FORWARD -i wg0 -o ens4 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -t nat -A PREROUTING -i ens4 -p tcp --dport 80 -j DNAT --to-destination 10.0.0.2:8123
sudo iptables -t nat -A POSTROUTING -o wg0 -p tcp --dport 8123 -d 10.0.0.2 -j SNAT --to-source 10.0.0.1
```

Open Windows 10 firewall port:
```
netsh advfirewall firewall add rule name="Open Port 8123 for HASS" dir=in action=allow protocol=TCP localport=8123
```

如果 Windows 还要转发给另外的主机系统，可以用 Windows 的端口转发规则
```
netsh interface portproxy add v4tov4 listenport=8123 listenaddress=10.0.0.2 connectport=8123 connectaddress=192.168.3.249
```

要删除的话用命令 `netsh advfirewall firewall delete rule name="Open port 8123 for HASS"`

### nginx

反向代理

```
docker run --name my-nginx -v %cd%/nginx.conf:/etc/nginx/nginx.conf:ro -d nginx
```
