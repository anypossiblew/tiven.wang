---
layout: post
theme: UbuntuMono
title: "Scala: Setup Dev Project"
excerpt: ""
modified: 2018-05-04T11:51:25-04:00
categories: articles
tags: [Scala, Java]
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

## Setup
### Install sbt

1. 确保电脑上安装有 Java 8 JDK (also known as 1.8)
  你可以在命令行运行 `javac -version` 来检查
2. 安装 [sbt][scala-sbt]
  * [Mac](http://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
  * [Windows](http://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
  * [Linux](http://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)

### Scala REPL

运行 `sbt console` 进入 Scala 交互命令控制台模式，便可执行 Scala 脚本了。

```
scala> 8*5+2
res0: Int = 42
```
`res0` 是保存程序结果的变量名，`Int` 是该变量的类型，等号后面则是结果变量的值，该变量可继续被用在后续的脚本中。
按 tab 键有代码补全提示功能，如执行 `res0.toString` 输出了字符串变量。
```
scala> res0.toS
toShort   toString

scala> res0.toString
res2: String = 42
```

输入 `:help` 查看 Scala REPL 的命令列表。

### Create the project

如果不想从零开始创建项目文件，那么可以从一个 template 创建项目。运行命令

`sbt new scala/hello-world.g8`

则会下载 https://github.com/scala/hello-world.g8 项目代码作为模板来创建一个新项目。可以在 *build.sbt* 文件中修改项目名称，组织和版本号等属性

```
name := "my-world"
organization := "wang.tiven.scala"
version := "1.0"
```

### Running the project

在项目根目录下运行命令 `sbt` 会下载依赖包并打开 sbt 控制台。然后在 sbt 控制台里运行 `~run` 则会编译运行代码。`~` 代表程序会监视代码改修并重新运行。

### Adding a dependency

在 *build.sbt* 添加

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.0"
```

`libraryDependencies` 是 dependencies 集合，通过 `+=` 添加更多 dependency

可以通过 [Scaladex](https://index.scala-lang.org/) 查找所有的已发布的代码库。

## IDE

### Intellij IDEA

下载并安装 Intellij IDEA，安装 Scala plugin 或者在安装初始化 Intellij IDEA 时选择下载 Scala 语言支持插件。

查看更多 Intellij IDEA 对 Scala 的支持 [Discover Intellij IDEA for Scala](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html)


https://marketplace.visualstudio.com/items?itemName=dragos.scala-lsp






[scala-lang]:https://www.scala-lang.org/
[scala-sbt]:https://www.scala-sbt.org/index.html
