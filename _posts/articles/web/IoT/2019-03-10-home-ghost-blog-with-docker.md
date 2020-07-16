---
layout: post
theme: UbuntuMono
title: "Home ghost blog with docker"
excerpt: "How to run your ghost blog with docker in home network"
modified: 2019-03-11T14:02:25-04:00
categories: articles
tags: [ghost, Smart Home]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1986.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/privolzhsky-district-astrakhan-oblast-russia-1986
comments: true
share: true
---

* TOC
{:toc}

https://blog.alexellis.io/your-ghost-blog/

其实如果你的网站只是静态页面，不如使用 Jekyll + Github pages 组合。细节可以参考这篇文章[Why I moved from Ghost to Jekyll and Github?](https://medium.com/@hamxiaoz/why-i-moved-from-ghost-to-jekyll-and-github-dad59515bee0)

[ghost][ghost] 需要部署在你自己的服务器上，可以有自己的数据库，所以可以有后台交互操作。对于我来说是因为我有家庭 NAS 服务器，所以我考虑在上面部署一个 ghost 服务，然后就可以为我的网站开发一些复杂点的功能。

## Setup ghost with Docker

创建一个最简单的 [ghost][ghost] 博客，可以直接运行一个 Docker 容器。

`docker run -d --name some-ghost -p 80:2368 ghost`

Ghost 容器默认使用内置的 SQLite 一种小型的嵌入式数据库。为了数据的安全性建议为 Ghost 提供另外单独的数据库。

## Add Database with Docker Compose

如果我们要为 Ghost 添加一个 Mysql 数据库的话，那么就要再创建一个 Mysql 的 Docker 容器，这样 Docker 容器就会越来越多。所以就可以使用 Docker compose 这个工具，[docker-compose](https://docs.docker.com/compose/) is a tool for defining containers and running them. It’s a great choice when you have multiple interdependent containers but you don’t need a full-blown container cluster like [Kubernetes](https://kubernetes.io/).

下面就是一个 Docker compose 配置文件，里面配置有 Ghost 服务和 Mysql 服务。

```yaml
version: '3.1'

volumes:
  db:

services:

  ghost:
    image: ghost:1-alpine
    restart: always
    ports:
      - 80:2368
    environment:
      # see https://docs.ghost.org/docs/config#section-running-ghost-with-config-env-variables
      database__client: mysql
      database__connection__host: db
      database__connection__user: root
      database__connection__password: example
      database__connection__database: ghost

  db:
    image: mysql:5.7
    restart: always
    volumes:
      - db:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
```

使用命令 `docker-compose up` 就可以运行起来两个容器了。

至此，一个简单完整的 Ghost 博客网站就搭建好了。接下来我们要怎么样这个网站就行完善呐？设想你的家庭 NAS 系统不止有博客网站还有家庭智能系统（如 Hassio），那么要想用同一个端口号（80 或者 443）访问两个网站，就需要一个前置反向代理器。接下来我们为 Ghost 添加一个 Nginx 服务。

## Nginx

[Nginx][Nginx] 可以作为一个负载均衡器和反向代理。在 Docker Compose 配置文件中增加一个 Nginx 服务，这里将其暴露端口号 80，而 Ghost 服务则暴露在另一个端口号或者不暴露在本机（因为 Nginx 容器可以通过 ghost 的 hostname 访问到它）。

```yaml
version: '3.1'

...

services:

  ghost:
    image: ghost
    restart: always
    ports:
      - 2368:2368
    ...

  db:
    ...

  nginx:
    image: nginx
    restart: unless-stopped
    volumes:
      - ./data/nginx:/etc/nginx/conf.d
    ports:
      - "80:80"
```

除了 Docker 容器的配置，还需要为 Ghost 服务创建一个 Nginx 配置文件。在 `docker-compose.yml` 所在目录下创建 `data/nginx` 目录，它是作为 Nginx 的配置文件目录被挂载到 Nginx 容器里，在此目录下创建配置文件 `app.conf`

```conf
server {
    listen 80;

    location / {
        proxy_pass http://ghost:2368;
    }
}
```

这里就配置了 Nginx 监听的端口号 80 和地址映射 `/` 会转到地址 `http://ghost:2368`. 这里 `ghost` 是 Ghost 容器的 hostname 用它可以访问到 ghost 服务。

## Enable HTTPS

[Nginx][Nginx] 还可以提供 HTTPS 功能，参考 [Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)

修改 docker-compose 配置文件，添加 certbot 服务并修改 nginx 服务的配置

```yml
version: '3.1'

...

services:

  ghost:
    ...

  db:
    ...

  nginx:
    image: nginx
    restart: unless-stopped
    volumes:
      - ./data/nginx:/etc/nginx/conf.d
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    ports:
      - "80:80"
      - "443:443"
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"
  certbot:
    image: certbot/certbot
    restart: unless-stopped
    volumes:
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

`data/nginx/app.conf`

```conf
server {
    listen 80;
    server_name localhost;
    server_name "blog.tiven.wang";
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name localhost;
    server_name "blog.tiven.wang";
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/blog.tiven.wang/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blog.tiven.wang/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass  http://ghost:2368;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
    }
}
```

### 请求证书

失败信息

```text
### Requesting Let's Encrypt certificate for blog.tiven.wang ...
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator webroot, Installer None
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for tiven.wang
Using the webroot path /var/www/certbot for all unmatched domains.
Waiting for verification...
Cleaning up challenges
Failed authorization procedure. tiven.wang (http-01): urn:ietf:params:acme:error:unauthorized :: The client lacks sufficient authorization :: Invalid response from http://tiven.wang/.well-known/acme-challenge/b3hT-6GerlwAKCrYsg2Kmb_bDEWLibSK42evo5LpXqE [192.30.252.154]: "<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\">\n    <meta http-equiv=\"Co"

IMPORTANT NOTES:
 - The following errors were reported by the server:

   Domain: tiven.wang
   Type:   unauthorized
   Detail: Invalid response from
   http://tiven.wang/.well-known/acme-challenge/b3hT-6GerlwAKCrYsg2Kmb_bDEWLibSK42evo5LpXqE
   [192.30.252.154]: "<!DOCTYPE html>\n<html>\n  <head>\n    <meta
   http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\">\n
   <meta http-equiv=\"Co"

   To fix these errors, please make sure that your domain name was
   entered correctly and the DNS A/AAAA record(s) for that domain
   contain(s) the right IP address.
```

成功信息

```text
### Requesting Let's Encrypt certificate for blog.tiven.wang ...
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator webroot, Installer None
Obtaining a new certificate

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/blog.tiven.wang/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/blog.tiven.wang/privkey.pem
   Your cert will expire on 2019-06-12. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

## Setup Admin Account

https://localhost/admin

[ghost]:https://hub.docker.com/_/ghost
[Nginx]:https://hub.docker.com/_/nginx