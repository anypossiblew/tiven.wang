---
layout: post
title: Apache Camel - Scripting
excerpt: "Camel supports a number of scripting languages which can be used to create an Expression or Predicate via the standard JSR 223 which is a standard part of Java 6."
modified: 2017-12-20T17:00:00-00:00
categories: articles
tags: [JavaScript, Camel, EIP]
image:
  vendor: twitter
  feature: /media/DMfT2TXX4AAFZJH.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px
comments: true
share: true
references:
  - title: "Camel examples: Spring Boot"
    url: "https://github.com/apache/camel/tree/master/examples/camel-example-spring-boot"

---

* TOC
{:toc}

[JSR 223][jsr223] lets you use the power and flexibility of scripting languages like Ruby, Groovy, and Python on the Java Platform.

[Camel][camel-scripting] supports a number of scripting languages which can be used to create an [Expression][camel-expression] or [Predicate][camel-predicate] via the standard [JSR 223][jsr223] which is a standard part of Java 6.


## Dependencies

使用脚本语言需要添加依赖包 `org.apache.camel:camel-script`

```xml
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-script</artifactId>
</dependency>
```

## Scripting

在 Camel 中使用脚本语言有两种情况，作为表达式或者作为脚本文件。两种脚本都可以使用为 `ScriptContext` 预设置的全局属性，下列

| Attribute | Type | Value |
| --------- | ---- | ----- |
|camelContext| org.apache.camel.CamelContext | The Camel Context. |
|context| org.apache.camel.CamelContext | The Camel Context (cannot be used in groovy).|
|exchange| org.apache.camel.Exchange | The current Exchange. |
|properties| org.apache.camel.builder.script.PropertiesFunction | Camel 2.9: Function with a resolve method to make it easier to use Camels Properties component from scripts. See further below for example. |
|request| org.apache.camel.Message | The IN message. |
|response| org.apache.camel.Message | **Deprecated**: The OUT message. The OUT message is null by default. Use the IN message instead.|

更详细的脚本引擎创建过程和属性设置参考代码类
`org.apache.camel.builder.script.ScriptBuilder`

### Expression
表达式是指在 Route 里用脚本语言书写一种结果为 true 或 false 的语句，来作为某种判断的依据，例如：

```java
from("direct:books")
  .choice()
      .when().javaScript("request.headers.get('user') == 'admin'")
      	.bean("bookRepository", "getByRole(\"admin\")")
  .otherwise()
  	.bean("bookRepository", "getByRole(\"visitor\")");
```

### Script File
如果想要使用脚本文件，可以使用这样的URI

`language://languageName:resource:scheme:[location][?options]`

```java
.otherwise()
  .to("language://javascript:resource:classpath:test-javascript.js?transform=false");
```

详细请参考 Camel [Language component](http://camel.apache.org/language.html)

#### Load Another Script File
有些情况下需要在主JavaScript文件中加载另外的JavaScript文件，这就可以使用 [Nashorn extensions](https://wiki.openjdk.java.net/display/Nashorn/Nashorn+extensions) 中的 `load` function:

```javascript
load("classpath:WechatClient.js");
```

#### importClass

在JavaScript脚本文件中引入Java类可以使用 [Nashorn extensions](https://wiki.openjdk.java.net/display/Nashorn/Nashorn+extensions) 中的 `Java.type` function，当然也可以直接使用Java类全名如`java.lang.System.out.println()`:

```javascript
var System = Java.type("java.lang.System");
System.out.println(request.getHeaders().toString());
```

如果使用了旧版的Rhino引擎中的`importClass`可以先加载 `nashorn:mozilla_compat.js`，然后才能使用

```javascript
load("nashorn:mozilla_compat.js");
importClass(java.lang.System);
System.out.println(request.getHeaders().toString());
```

如果并不确定的话可以捕获异常或者先进行判断

```javascript
// if you want the script run both on rhino and nashorn
try {
    load("nashorn:mozilla_compat.js");
} catch (e) {}

// Or you can check for importClass function and then load if missing ...
if (typeof importClass != "function") {
   load("nashorn:mozilla_compat.js");
}
```

jdk8 replaces Rhino based jsr-223 script engine with nashorn based jsr-223 script engine. You can check out the [Rhino Migration Guide](https://wiki.openjdk.java.net/display/Nashorn/Rhino+Migration+Guide)

## Groovy Script

### Groovy Json
http://groovy-lang.org/json.html

### Groovy XML
http://groovy-lang.org/processing-xml.html

本文完整代码 [Github](https://github.com/tiven-wang/EIP-Camel/tree/scripting)



[jsr223]:https://www.jcp.org/en/jsr/detail?id=223
[camel-expression]:http://camel.apache.org/expression.html
[camel-predicate]:http://camel.apache.org/predicate.html
[camel-scripting]:http://camel.apache.org/scripting-languages.html
