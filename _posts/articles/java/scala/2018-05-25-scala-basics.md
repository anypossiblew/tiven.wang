---
layout: post
theme: UbuntuMono
title: "Scala - Basics"
excerpt: ""
modified: 2018-05-25T11:51:25-04:00
categories: articles
tags: [Scala, Java]
image:
  vendor: twitter
  feature: /media/DdeyWxAVAAAXcFG.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px/status/997461949398048768
comments: true
share: true
references:
  - title: "Scala Documentation - Basics"
    url: https://docs.scala-lang.org/tour/basics.html
---



* TOC
{:toc}

## Variables

* `var` 定义一个普通的变量，可以被修改值
* `val` 定义一个值，不能被修改
* `def` 定义一个函数(Function)/方法(Method)

```scala
scala> def hello = "Hello"
scala> def hello(name: String) = "Hello " + name
scala> def a = scala.util.Random.nextInt  // pseudo
                                          // var a = function() {
                                          //           return new scala.util.Random().nextInt();
                                          //         }
a: Int
scala> a
res36: Int = -584487013
scala> a
res37: Int = -256963406
```
value, variable 声明时必须初始化值, 初始化时从变量的值推断出变量的类型, 也可以显式声明变量的类型。

```scala
val greeting: String = null
val greeting: Any = "Hello"
```

https://stackoverflow.com/questions/4437373/use-of-def-val-and-var-in-scala

## Commonly Used Types
Scala 里不区分 primitive types 和 class types，像 int, char, long, byte 等这些 primitive types，Scala 会负责转换成他们对应的 class types 如 Int, Char, Long, Byte，这些 class types 应该是 Java 语言里的类，为了增强这些类的能力 Scala 又封装了一层如 `Int -> RichInt`, `Char -> RichChar`, `String -> StringOps` 等，这一层 Scala 仍然会自动转换。

例如下面我们可以理解成这样的过程 `1 -> String -> StringOps -> call toInt -> return Int`
```scala
scala> "1".toInt
res18: Int = 1
```

## Arithmetic Operators and Methods
Scala 的算术操作符和 Java 或 C++ 的效果是一样的，但实际上他们都是 Methods。
```scala
val answer = 8 * 5 + 2
```
这个表达式本质上是调用了 [`RichInt`][RichInt] class 的方法 `*` 和 `+`，它实质上是下面表达式 `8.*(5).+(2)` 的缩写，这就是函数式编程（Functional Programming Style）风格了。所以在 Scala 里你可以这样调用方法

```scala
a method b // equal a.method(b)
a.method   // equal a.method()
a method   // equal a.method()
```
如 `(1 to 5).map(2*)`

还可以 import 某个 package 下的方法，然后直接调用
```scala
import scala.math._ // shortly: import math._

sqrt(2) // Yields 1.4142135623730951
pow(2, 4) // Yields 16.0
min(3, Pi) // Yields 3.0
```

### The apply Method

```scala
val s = "Hello"
s(4) // Yields 'o'
```
`s` 是一个字符串不是一个函数怎么能被调用呐？其实 `()` 有另一种应用含义，当它不是被用在函数或方法上时，它会被认为是 `apply()` 函数调用，此例可写为 `s.apply(4)` 。

我们知道 Scala 里调用函数可以不用加 `()` ，那么对于这种 implicit parameters 调用再怎么加 `()` 调用呐？
```scala
"Bonjour".sorted(3)       // error: 这会被认为是传入参数地调用 sorted 方法
("Bonjour".sorted)(3)     // 应该这样
"Bonjour".sorted.apply(3) // 或这样
```

`apply` 其实是 [Singleton Object][singleton-objects] 的构造函数
```scala
BigInt("1234567890")
BigInt.apply("1234567890")
BigInt("1234567890") * BigInt("112358111321")
```
就像 JavaScript 里的 Function 可以被 `new` 也可以被 call。**类如函数**

https://blog.matthewrathbone.com/2017/03/06/scala-object-apply-functions.html

### Scala.js
Scala 怎么这样像 JavaScript 呐，也许是发明者吸取了 JavaScript 优点吧，让 Scala 更函数式编程。











[scala-lang]:https://www.scala-lang.org/
[scala-sbt]:https://www.scala-sbt.org/index.html
[scala-js]:http://www.scala-js.org/

[RichInt]:https://www.scala-lang.org/api/2.9.3/scala/runtime/RichInt.html

[singleton-objects]:https://docs.scala-lang.org/tour/singleton-objects.html
