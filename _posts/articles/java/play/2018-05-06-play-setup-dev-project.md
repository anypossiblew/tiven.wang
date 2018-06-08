---
layout: post
theme: UbuntuMono
title: "Play Framework - Setup Dev Project"
excerpt: "Setup a Play project"
modified: 2018-05-04T11:51:25-04:00
categories: articles
tags: [Play, Reactive, Scala, Java]
image:
  vendor: twitter
  feature: /media/Da_wGJhW4AIaSxO.jpg:large
  credit: National Geographic
  creditlink: https://twitter.com/NatGeoPhotos/status/986270834439393280
comments: true
share: true
---

* TOC
{:toc}

本系列我们打算开发一个可以从 Twitter 上拉取数据流并展现在前端的应用，我们选择 Scala 语言版本的 Play Framework (playVersion = "2.6.13")进行学习，前提是安装了 JDK 8 及以上版本 和 sbt （参考 [Scala: Setup Dev Project](/articles/scala-setup-dev-project/)）

对于初学者来说，通过学习现成完整项目代码进行入门是非常合适的。下载 [Play Starter Projects](https://www.playframework.com/download) 源代码包或者克隆一份 starter 项目代码

`git clone https://github.com/playframework/play-scala-starter-example.git`

，你还可以从 https://developer.lightbend.com/start/ 选择更多关于 Play Framework 的样例代码。下载后进入项目文件夹运行命令 `sbt run` 下载依赖包并编译运行，成功后访问 http://127.0.0.1:9000

## App Configuration

请到 https://apps.twitter.com 网站自行创建 App , 把 App 信息配置在 *conf/[application.conf][playframework-ConfigFile]* 文件里。

```
## My Twitter App Info
twitter.consumerKey="<your consumer key>"
twitter.consumerSecret="<your consumer secret>"
twitter.accessToken="<your access token>"
twitter.accessTokenSecret="your access token secret"
```

然后修改 `HomeController` 类，增加一个 `tweets` 方法，在此方法里读取配置文件里的 twitter 信息，然后返回成功与否。
这里使用到了 Scala 支持的 [JSR 330][jsr330] 标准的[依赖注入][ScalaDependencyInjection]，在类名称后面添加 `@Inject` 注解，并把需要注入的类对象加载类参数里例如 `configuration: Configuration`。

```scala
package controllers

import javax.inject._
import play.api.Configuration
import play.api.mvc._
import play.api.libs.oauth._

import scala.concurrent.{ExecutionContext, Future, Promise}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(configuration: Configuration, cc: ControllerComponents) (implicit assetsFinder: AssetsFinder)
  extends AbstractController(cc) {

  def tweets = Action.async {
    val credentials: Option[(ConsumerKey, RequestToken)] = for {
      consumerKey <- configuration.getOptional[String]("twitter.consumerKey")
      consumerSecret <- configuration.getOptional[String]("twitter.consumerSecret")
      accessToken <- configuration.getOptional[String]("twitter.accessToken")
      accessTokenSecret <- configuration.getOptional[String]("twitter.accessTokenSecret")
    } yield (
      ConsumerKey(consumerKey, consumerSecret),
      RequestToken(accessToken, accessTokenSecret)
    )

    credentials.map { case (consumerKey, requestToken) =>
      Future.successful {
        Ok
      }
    } getOrElse {
      Future.successful(InternalServerError("Twitter credentials missing"))
    }
  }
}
```

接下来需要把此 controller 方法和 http 请求路径关联起来，需要在 *conf/routes* 文件中添加这样一条记录，代表路径 `/tweets` 上的 `GET` 请求转给方法 `controllers.HomeController.tweets`
```
GET     /tweets                     controllers.HomeController.tweets
```

重新运行后便可以访问链接 *http://127.0.0.1:9000/tweets* 会得到 Code 为 `200` 的返回。

关于这里诸如 Action.async, [Option][scala/Option], Future, [for][for-comprehensions] 等技术点我们以后会做详细介绍。

接下来用读取到的 twitter 信息去查询推特上的信息，Play Framework 提供了 [WS library][ScalaWS] 进行 http 调用。
首先需要添加 WS library 的依赖在 *build.sbt* 里
```
//...
libraryDependencies += ws
```
然后修改我们的 Controller 代码，再添加一个依赖注入 `wsc: WSClient`，它是方便为门进行 http 调用的客户端类。

```scala
package controllers

import javax.inject._
import play.api.Configuration
import play.api.mvc._
import play.api.libs.oauth._
import play.api.libs.ws._

import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(configuration: Configuration, cc: ControllerComponents, wsc: WSClient) (implicit assetsFinder: AssetsFinder)
  extends AbstractController(cc) {

  def tweets = Action.async {
    credentials.map { case (consumerKey, requestToken) =>
      wsc
        .url("https://api.twitter.com/1.1/search/tweets.json")
        .sign(OAuthCalculator(consumerKey, requestToken))
        .withQueryStringParameters("q" -> "Trump")
        .get()
        .map { response =>
          Ok(response.body)
        }
      } getOrElse {
        Future.successful(InternalServerError("Twitter credentials missing"))
      }
  }

  def credentials: Option[(ConsumerKey, RequestToken)] = for {
    consumerKey <- configuration.getOptional[String]("twitter.consumerKey")
    consumerSecret <- configuration.getOptional[String]("twitter.consumerSecret")
    accessToken <- configuration.getOptional[String]("twitter.accessToken")
    accessTokenSecret <- configuration.getOptional[String]("twitter.accessTokenSecret")
  } yield (
    ConsumerKey(consumerKey, consumerSecret),
    RequestToken(accessToken, accessTokenSecret)
  )

}
```
把 credentials 变量抽取成了一个方法。关于 WS Client 的详细用户这里不做解释，以后找专题详细分析。

访问链接 *http://127.0.0.1:9000/tweets* 可以看到从 twitter 上查询到的推特。

至此我们创建了 Cloud 上 Web Application 开发需要用到的大部分开发，除了还差一个持久化，其他的都是些细枝末节。所以现在看 Play Framework for Scala 开发 Web Application 是相当简洁干练。

## Deploy

* play.http.secret.key 需要修改此 key，可以使用 `sbt playGenerateSecret` 生成一个新的
* play.filters.hosts 添加需要支持的 host，也可以简单地设置支持全部 `allowed = ["."]`

https://stackoverflow.com/questions/45070168/host-not-allowed-error-when-deploying-a-play-framework-application-to-amazon-a

### CloudFoundry

如何部署 Play 项目到 CloudFoundry 平台可以参考文章 [Scala - Deploy to CloudFoundry](/articles/scala-deploy-to-cloudfoundry/)




[playframework-ConfigFile]:https://www.playframework.com/documentation/2.6.x/ConfigFile
[ScalaDependencyInjection]:https://www.playframework.com/documentation/2.6.x/ScalaDependencyInjection
[jsr330]:https://jcp.org/en/jsr/detail?id=330
[ScalaWS]:https://www.playframework.com/documentation/2.6.x/ScalaWS

[for-comprehensions]:https://docs.scala-lang.org/tour/for-comprehensions.html
[scala/Option]:https://www.scala-lang.org/api/2.12.x/scala/Option.html
