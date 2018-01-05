---
layout: post
title: Apache Camel - Transforming Data
excerpt: "Camel 是企业系统之间的数据交换中心，面对繁杂的多种多样的数据类型自然会有一套数据转换的能力。Camel 支持不同的数据转换方式，它提供了很多现成的组件对常见数据类型进行转换"
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

Camel 对数据格式和数据类型的转换有几种方式：

* Data formats - XML, JSON ...
* Expression - Languages
* Java - Processor, Bean, Content Enricher
* Templates - XSLT,  Apache Velocity ...

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
[Expressions][camel-expression] and [Predicates][camel-predicate] (expressions that evaluate to true or false) can then be used to create the various [Enterprise Integration Patterns][camel-eips] in the DSL or Xml Configuration like the Recipient List.

To support dynamic rules Camel supports pluggable [Expression][Expression] strategies using a variety of different [Languages][camel-languages].

表达式 Expression 是使用不同的语言 [Languages][camel-languages] 书写，常用的语言例如：Simple Language, XPath, Scripting Languages, Constant 等等。

例如 [Simple Language][camel-simple] 书写的表达式： `Hello ${body}` ，也可以用作断言如 `${body} == 'Camel'`, `${header.zip} between '30000..39999'` 。

通常表达式会作为获取 Message Body Header Properties 值的方式，断言会作为 Route 判断的依据。

### Transform
Transform 是 Camel route DSL 中的一个方法，它接受一个 Expression 作为参数，执行表达式的结果作为转换后的 Message Body 。Transform 可以用在 Java DSL 和 XML DSL 中，例如在 Java DSL 中使用 Transform 与 Simple language：

```java
from("direct:start")
  .transform().simple("Hello ${body}!")
    .to("mock:result");
```

如果是使用 JavaScript 语言的表达式:

```java
from("direct:start")
  .transform().javaScript("'Hello ' + request.body + '!'")
    .to("mock:result");
```

## Java
如果 Camel 提供的 Data formats 和 Expression 不能满足你所需要的逻辑书写的话，你可以还需要写一些 Java 逻辑。
可以编写 Java 逻辑的方式有几种：

* Processor
* Beans
* Content Enricher

### Processor
The Camel `Processor` is an interface defined in `org.apache.camel.Processor` with a
single method:
`public void process(Exchange exchange) throws Exception;`

它可以任意处理传入的 Exchange 对象。

```java
from("direct:start")
 .process(new Processor() {
  public void process(Exchange exchange) throws Exception {
    exchange.getIn().setBody("Hello " + exchange.getIn().getBody() + "!");
  }
 })
 .to("mock:result");
```

### Beans
Camel 使用了类似于 Spring Framework POJO 的轻量级 Bean 管理容器。Camel 的 Bean 管理注册表（registry）是一个 Service Provider Interface (SPI)，它实现了接口 `org.apache.camel.spi.Registry`。常见的实现有：

* __SimpleRegistry__ - A simple implementation to be used when unit testing or running Camel in the Google App engine, where only a limited number of JDK classes are available.
* __JndiRegistry__ - An implementation that uses an existing Java Naming and Directory Interface (JNDI) registry to look up beans.
* __ApplicationContextRegistry__ - An implementation that works with Spring to look up beans in the Spring ApplicationContext. This implementation is automatically used when you’re using Camel in a Spring environment.
* __OsgiServiceRegistry__ - An implementation capable of looking up beans in the OSGi service reference registry. This implementation is automatically used when using Camel in an OSGi environment.

在 Java DSL 中使用 Bean，指定 Bean 的标识和想要调用的方法名称：

```java
public void configure() throws Exception {
  from("direct:hello").beanRef("helloBean", "hello");
}
```

也可以只指定 Bean 的 Class，Camel 会在 startup 时初始化 Bean，并在调用时根据 Message Body data type 去匹配方法的参数类型并决定实际调用哪个方法：

```java
public void configure() throws Exception {
  from("direct:hello").bean(HelloBean.class);
}
```

Camel 调用 Bean 时还支持很多 Camel annotations

```java
public String orderStatus(@Body Integer orderId, @Headers Map headers) {
  Integer customerId = (Integer) headers.get("customerId");
  String customerType = (String) headers.get("customerType");
  ...
}
```

和 Camel language annotations

```java
public Document handleIncomingOrder( @Body Document xml,
  @XPath("/order/@customerId") int customerId,
  @Bean(ref = "guid", method="generate") int orderId );
```


### Content Enricher
Content Enricher 模式是一种 Message Transformation 模式。

![Image: DataEnricher](http://www.enterpriseintegrationpatterns.com/img/DataEnricher.gif)

它分为 Poll enrich 和 Enrich 两种方式。

#### Pollenrich

```java
from("quartz://report?cron=0+0+6+*+*+?")
 .to("http://riders.com/orders/cmd=received")
 .process(new OrderToCSVProcessor())
 .pollEnrich("ftp://riders.com/orders/?username=rider&password=secret",
   new AggregationStrategy() {
    public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
      if (newExchange == null) {
        return oldExchange;
      }
      String http = oldExchange.getIn().getBody(String.class);
      String ftp = newExchange.getIn().getBody(String.class);
      String body = http + "\n" + ftp;
      oldExchange.getIn().setBody(body);
      return oldExchange;
    }
  })
  .to("file://riders/orders");
```

#### Enrich


## Templates
对于更高级的数据转换我们还可以使用 Template 技术，如 XSLT, Apache Velocity, FreeMarker 等。

### XSLT
> [XSLT][XSLT] (Extensible Stylesheet Language Transformations) ) is a language for transforming XML documents into other XML documents or other formats such as HTML for web pages, plain text or XSL Formatting Objects, which may subsequently be converted to other formats, such as PDF, PostScript and PNG.[2] XSLT 1.0 is widely supported in modern web browsers.

XSLT 是一个 Camel 组件，所以使用其 endpoint uri：

```java
from("file://rider/inbox")
 .to("xslt://camelinaction/transform.xsl")
 .to("activemq:queue:transformed")
```

### Velocity
> [Apache Velocity][Apache_Velocity] is a Java-based template engine that provides a template language to reference objects defined in Java code. It aims to ensure clean separation between the presentation tier and business tiers in a Web application (the model–view–controller design pattern).

## Camel Type Converters

Camel 有一套数据类型转换系统，当 Camel 遇到 From Type 和 To Type 不同时，会去 Type Converters 注册系统查找相应的 Converter ，如果存在相应的 Converter 则使用其转换数据类型，否则会报出异常。

自定义的 Converter 如下：

```java
@Converter
public final class PurchaseOrderConverter {

	@Converter
	public static PurchaseOrder toPurchaseOrder(byte[] data, Exchange exchange) {
		TypeConverter converter = exchange.getContext().getTypeConverter();
		String s = converter.convertTo(String.class, data);
		if (s == null || s.length() < 30) {
			throw new IllegalArgumentException("data is invalid");
		}
		s = s.replaceAll("##START##", "");
		s = s.replaceAll("##END##", "");
		String name = s.substring(0, 9).trim();
		String s2 = s.substring(10, 19).trim();
		BigDecimal price = new BigDecimal(s2);
		price.setScale(2);
		String s3 = s.substring(20).trim();
		Integer amount = converter.convertTo(Integer.class, s3);
		return new PurchaseOrder(name, price, amount);
	}
}
```

本文相关代码完整项目 [Github](https://github.com/tiven-wang/EIP-Camel/tree/transforming)



[camel-example-spring-xquery]:https://github.com/apache/camel/tree/master/examples/camel-example-spring-xquery

[ESB]:https://en.wikipedia.org/wiki/Enterprise_service_bus
[camel-data-format]:http://camel.apache.org/data-format.html
[camel-xmljson]:http://camel.apache.org/xmljson.html
[camel-expression]:http://camel.apache.org/expression.html
[camel-predicate]:http://camel.apache.org/predicate.html
[camel-eips]:http://camel.apache.org/enterprise-integration-patterns.html
[camel-languages]:http://camel.apache.org/languages.html
[camel-simple]:http://camel.apache.org/simple.html

[DataFormat]:https://camel.apache.org/maven/camel-2.15.0/camel-core/apidocs/org/apache/camel/spi/DataFormat.html
[Expression]:http://camel.apache.org/maven/current/camel-core/apidocs/org/apache/camel/Expression.html

[XSLT]:https://en.wikipedia.org/wiki/XSLT
[Apache_Velocity]:https://en.wikipedia.org/wiki/Apache_Velocity
