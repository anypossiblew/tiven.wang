---
layout: post
title: Proxy config be used in develop tools
excerpt: "本文列出常用前端UI开发工具的proxy代理配置"
modified: 2016-10-21T17:00:00-00:00
categories: articles
tags: [PROXY, UI, TOOLS]
image:
  feature: web/masthead-web.jpg
comments: true
share: true
---

* TOC
{:toc}


### git proxy config

`git config http.proxy http://user:pwd@server.com:port`<br/>
`git config core.gitproxy '"proxy-command" for example.com'`

### npm proxy config

`npm config set proxy http://server:port`<br/>
`npm config set https-proxy http://server:port`

### bower proxy config
Edit your **_.bowerrc_** file ( should be next to your bower.json file ) and add the wanted proxy configuration

```
{
  "proxy":"http://<host>:<port>",
  "https-proxy":"http://<host>:<port>"
}
```

### gradle proxy config
in file **_gradle.properties_**

```
systemProp.https.proxyHost=server
systemProp.https.proxyPort=port
systemProp.http.proxyUser=username
systemProp.http.proxyPassword=xxx
```

### JVM Proxy

`java -Dhttp.proxyHost=proxy.com -Dhttp.proxyPort=8080
-Dhttp.nonProxyHosts="localhost|host.example.com"`

[Java Networking and Proxies](http://docs.oracle.com/javase/7/docs/technotes/guides/net/proxies.html)

### maven proxy config

In file **_${MAVEN_HOME}\conf\settings.xml_** \<proxies\>节点添加如下代理配置

```
<proxy>
  <id>optional_id</id>
  <active>true</active>
  <protocol>http</protocol>
  <host>server</host>
  <port>port</port>
  <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
</proxy>
```

### gradle user home

Gradle uses the directory **_.gradle_** in our home directory as the default Gradle user home directory. Here we can find for example the directory caches with downloaded dependencies. To change the Gradle user home directory we can set the environment variable **_GRADLE_USER_HOME_** and point it to another directory. The Gradle build script will look for this environment variable and then use the specified directory as the Gradle home directory.

```
-Dhttp.proxyHost=server
-Dhttp.proxyPort=port
```

* [http://www.licheedev.com/2015/06/22/gradle-proxy-for-as-1-3/](http://www.licheedev.com/2015/06/22/gradle-proxy-for-as-1-3/)
* [https://docs.gradle.org/current/userguide/build_environment.html](https://docs.gradle.org/current/userguide/build_environment.html)

### Npm的配置管理及设置代理

npm全称为Node Packaged Modules。 它是一个用于管理基于node.js编写的package的命令行工具。其本身就是基于node.js写的,这有点像gem与ruby的关系。
在我们的项目中，需要使用一些基于node.js的javascript库文件，就需要npm对这些依赖库进行方便的管理。由于我们的开发环境由于安全因素在访问一些网站时需要使用代理，其中就包括npm的repositories网站，所以就需要修改npm的配置来加入代理。
下面简要介绍下npm的配置以及如何设置代理。
npm获取配置有6种方式，优先级由高到底。

1. 命令行参数。 --proxy http://server:port即将proxy的值设为http://server:port。

2. 环境变量。 以npm_config_为前缀的环境变量将会被认为是npm的配置属性。如设置proxy可以加入这样的环境变量npm_config_proxy=http://server:port。

3. 用户配置文件。可以通过npm config get userconfig查看文件路径。如果是mac系统的话默认路径就是$HOME/.npmrc。

4. 全局配置文件。可以通过npm config get globalconfig查看文件路径。mac系统的默认路径是/usr/local/etc/npmrc。

5. 内置配置文件。安装npm的目录下的npmrc文件。

6. 默认配置。 npm本身有默认配置参数，如果以上5条都没设置，则npm会使用默认配置参数。


针对npm配置的命令行操作

```
npm config set <key> <value> [--global]
npm config get <key>
npm config delete <key>
npm config list
npm config edit
npm get <key>
npm set <key> <value> [--global]
```

在设置配置属性时属性值默认是被存储于用户配置文件中，如果加上`--global`， 则被存储在全局配置文件中。
如果要查看npm的所有配置属性（包括默认配置），可以使用`npm config ls -l`。
如果要查看npm的各种配置的含义，可以使用`npm help config`。
为npm设置代理

`$ npm config set proxy http://server:port`<br/>
`$ npm config set https-proxy http://server:port`

如果代理需要认证的话可以这样来设置。

`$ npm config set proxy http://username:password@server:port`<br/>
`$ npm config set https-proxy http://username:pawword@server:port`

如果代理不支持https的话需要修改npm存放package的网站地址。

`$ npm config set registry "http://registry.npmjs.org/"`


### typings proxy

You should be able to install it using `npm install -g typings` and use it by doing

`typings install --proxy <proxy_uri>`

or 创建文件`.typingsrc` Place token in your home directory (*C:\\Users\\yourUsername\\* on Windows) or your project directory.

```
{
  "rejectUnauthorized": false,
  "proxy": "http://server:port",
  "registryURL": "http://api.typings.org/",
  "defaultSource": "dt"
}
```

* [https://github.com/typings/core/blob/master/src/interfaces/rc.ts](https://github.com/typings/core/blob/master/src/interfaces/rc.ts)

### tsd proxy

Create a `.tsdrc` file and in JSON set a proxy

```
{
"proxy": "http://bluecoat-proxy:8080"
}
```


### gem proxy

`$ gem install --http-proxy http://server:port $gem_name`

### Cloud Foundry CLI
System variable `https_proxy` = `http://my.proxyserver.com:8080`

[Using the cf CLI with an HTTP Proxy Server][cf-CLI-proxy]

[cf-CLI-proxy]:https://docs.cloudfoundry.org/cf-cli/http-proxy.html
