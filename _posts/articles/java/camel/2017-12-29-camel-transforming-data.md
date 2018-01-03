---
layout: post
title: Apache Camel - Transforming Data
excerpt: "."
modified: 2017-12-29T17:00:00-00:00
categories: articles
tags: [Json, XML, Camel, EIP]
image:
  vendor: twitter
  feature: /media/DN9GHB5WAAAZIsL.jpg:large
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

集成工具是属于构造企业服务总线 [ESB][ESB] 的基础，势必会处理不同组件不同格式的消息，那么数据转换也就是继承工具包括 Camel 的关键特性。

数据转换（Data Transformation）可以分为两种类型：

* 数据格式转换 Data format transformation - 消息体的数据格式从一种转换成另外一种，例如CSV格式转换成XML格式
* 数据类型转换 Data type transformation - 消息体的数据类型从一种转换成另外一种，例如 java.lang.String 转换成 javax.jms.TextMessage

## Data formats
[Data formats][camel-data-format] 在 Camel 里以可插拔的转换器形式存在。每个 data format 实现了接口 [`org.apache.camel.spi.DataFormat`][DataFormat] 并包含两个方法：

* `marshal` - 把一个 Message 编译成常见的数据格式，例如编译java对象成 XML, CSV, Json 等
* `unmarshal` - 反编译，把常见数据格式转换成 Message

Data formats 可以用在 Java DSL 和 XML DSL 中：

* 用在 Java DSL 中

```java
from("file://rider/csvfiles")
 .unmarshal().csv()
 .split(body()).to("activemq:queue.csv.record");
```

* 用在 XML DSL 中

```xml
<route>
 <from uri="file://rider/csvfiles"/>
 <unmarshal><csv/></unmarshal>
 <split>
   <simple>body</simple>
   <to uri="activemq:queue.csv.record"/>
 </split>
</route>
```

Camel 支持的 Data formats 完整列表参见 [Apache Camel > Documentation > Architecture > Data formats][camel-data-format].

### XML Json
企业集成开发中常用的两种数据格式 XML 和 Json，经常需要相互转换。[`camel-xmljson`][camel-xmljson]组件是用来做 XML 和 Json 之间转换的。

* marshalling => converting from XML to JSON
* un-marshaling => converting from JSON to XML.

添加此组件依赖包:

```xml
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-xmljson</artifactId>
  <version>x.x.x</version>
  <!-- Use the same version as camel-core, but remember that this component is only available from Camel 2.10 -->
</dependency>

<!-- And also XOM must be included. XOM cannot be included by default due to an incompatible
license with ASF; so add this manually -->
<dependency>
  <groupId>xom</groupId>
  <artifactId>xom</artifactId>
  <version>1.2.5</version>
</dependency>
```

在 Java DSL 中使用此 Data format:

```java
// From XML to JSON - inline dataformat
from("direct:marshalInline")
  .marshal().xmljson()
  .to("mock:jsonInline");

// From JSON to XML - inline dataformat
from("direct:unmarshalInline")
  .unmarshal().xmljson()
  .to("mock:xmlInline");
```

更多设置参见[Apache Camel > Documentation > Architecture > Data Format > XmlJson][camel-xmljson]

## Expression

http://camel.apache.org/languages.html

Spring Expression Language (SpEL)

### Transform


## Java
### Processor

### Beans
### Content Enricher
#### Pollenrich

#### Enrich

## Templates
### XSLT
### Velocity
### FreeMarker




Transformer

Component JacksonXML

camel-xmljson

[XQuery][camel-example-spring-xquery]

Message Translator

XSLT

Content Enricher


```xml
<dependency>
  <groupId>org.apache.camel</groupId>
  <artifactId>camel-jacksonxml</artifactId>
</dependency>
```

https://github.com/apache/camel/blob/master/components/camel-jacksonxml/src/main/docs/jacksonxml-dataformat.adoc

[camel-example-spring-xquery]:https://github.com/apache/camel/tree/master/examples/camel-example-spring-xquery

Apache Camel Transforming Message using Simple Expression:
http://www.javarticles.com/2015/06/apache-camel-transforming-using-simple-expression.html


[ESB]:https://en.wikipedia.org/wiki/Enterprise_service_bus
[camel-data-format]:http://camel.apache.org/data-format.html
[camel-xmljson]:http://camel.apache.org/xmljson.html

[DataFormat]:https://camel.apache.org/maven/camel-2.15.0/camel-core/apidocs/org/apache/camel/spi/DataFormat.html
