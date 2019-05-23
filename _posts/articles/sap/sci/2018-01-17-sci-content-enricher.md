---
layout: post
title: SAP Cloud Platform Integration - Content Enricher
excerpt: "How do we communicate with another system if the message originator does not have all the required data items available? Use a specialized transformer, a Content Enricher, to access an external data source in order to augment a message with missing information."
modified: 2018-01-17T17:00:00-00:00
categories: articles
tags: [SAP CPI, iPaaS, EIP, SAP Cloud]
image:
  vendor: twitter
  feature: /media/DTMCqPFVAAIOIHh.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px
comments: true
share: true
references:
  - id: 1
    title: "SAP Blogs - Content Enricher Pattern in Integration Flows"
    url: "https://blogs.sap.com/2015/01/16/blog-5-content-enricher-pattern-in-integration-flows/"
---

* TOC
{:toc}

[Content Enricher][DataEnricher] 模式是一种 Message Transformation 模式，它通过获取额外的资源来增强现有的 Message 。

![Image: DataEnricher](http://www.enterpriseintegrationpatterns.com/img/DataEnricher.gif)

现在的 SAP Cloud Integration 产品中的 Content Enricher 是在 External Call 目录里，它是这么说的：Mechanism to combine the incoming message with additional data retrieved from an external resource 。[ [1](#reference-1) ]

SCI Content Enricher 通过调用 External Resource (OData, SOAP ...) 获取额外的数据来增强现有的消息体，增强有：简单的 Combine 消息体和通过 XPath 把数据合并到消息体两种方式。

目前 SCI Content Enricher 功能有限，对 External Call 只支持 SuccessFactor, SOAP 和 OData 三种方式，而消息体和额外的数据只能是 XML 格式。假如你现有的 API 是 Restful 的并且返回的数据格式是 Json 格式的，那么 SCI Content Enricher 就无能为力了。

本篇介绍如何通过 __MultiCast__ + __Request-Reply__ + __Join__ + __Gather__ 来实现灵活的 Content Enricher 模式。

## The Message Body

The basic message body:

```xml
<body>
  <data>
    <budget>200</budget>
    <campaignId>74524852</campaignId>
    <campaignName>澳博客</campaignName>
    <negativeWords>
      <element>瓦岗诺娃</element>
      <element>亚马逊</element>
      <element>佛罗里达</element>
    </negativeWords>
  </data>
</body>
```

The response data of external resource:

```json
{
    "body": {
        "data": [
            {
                "campaignName": "澳洲-博客",
                "budget": 100,
                "campaignId": 74524852,
                "negativeWords": [
                    "瓦岗诺娃",
                    "亚马逊",
                    "佛罗里达"
                ]
            }
        ]
    }
}
```

可以看到我们的 External Resource 数据格式是 Json，而 Basic Message body 数据格式是 XML，这样就需要在增强之前把 Json 转成 XML 格式。

## Enricher Integration Flow

实现的集成流程图如下：

![Image: SAP Cloud Integration Content Enricher](/images/cloud/hcp/hci/sci-enricher.png)

原理是这样的，__MultiCast__ 将 Message 分成两个相同的 Messages，其中一个作为 Basic Message 直接传递到后续待 Enrich 的步骤 __Join__，另外一个作为一个事件 Event 触发了获取 External Resource 的步骤，然后最终也是传递到 Join 对 Basic Message 进行增强。__Gather__ 是对 Join 后的两个 Messages 进行 Combine 的步骤，支持按文本直接拼接或者简单合并两个 Message Body 或者按 XPath 合并两个 Message Body。

## Enriched Message

按简单方式直接 Combine 两个 Messages 结果如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<multimap:Messages xmlns:multimap="http://sap.com/xi/XI/SplitAndMerge">
  <multimap:Message1>
    <body>
      <data>
        <budget>200</budget>
        <campaignId>74524852</campaignId>
        <campaignName>澳博客</campaignName>
        <negativeWords>
          <element>瓦岗诺娃</element>
          <element>亚马逊</element>
          <element>佛罗里达</element>
        </negativeWords>
      </data>
    </body>
    <body>
      <data>
        <campaignName>澳洲-博客</campaignName>
        <budget>100</budget>
        <campaignId>74524852</campaignId>
        <negativeWords>瓦岗诺娃</negativeWords>
        <negativeWords>亚马逊</negativeWords>
        <negativeWords>佛罗里达</negativeWords>
      </data>
    </body>
  </multimap:Message1>
</multimap:Messages>
```

按 XPath 合并两个 Message Body 结果如下，把 External Resource Message Body 的节点 `/body/data` 合并到 Basic Message Body 的 `/body` 节点里。

Combine at XPath:
Combine from source (XPath):	`/body/data`
Combine at target (XPath): `/body`

```xml
<body>
  <data>
    <budget>200</budget>
    <campaignId>74524852</campaignId>
    <campaignName>澳博客</campaignName>
    <negativeWords>
      <element>瓦岗诺娃</element>
      <element>亚马逊</element>
      <element>佛罗里达</element>
    </negativeWords>
  </data>
  <data>
    <campaignName>澳洲-博客</campaignName>
    <budget>100</budget>
    <campaignId>74524852</campaignId>
    <negativeWords>瓦岗诺娃</negativeWords>
    <negativeWords>亚马逊</negativeWords>
    <negativeWords>佛罗里达</negativeWords>
  </data>
</body>
```

### The Log
顺便提一下输出 Message Body 到日志附件里的代码：

```javascript
importClass(com.sap.gateway.ip.core.customdev.util.Message);
importClass(java.util.HashMap);
function processData(message) {

  var payload = message.getBody(java.lang.String);

  // Logging
  var messageLog = messageLogFactory.getMessageLog(message)
  messageLog.addAttachmentAsString('message', payload, 'application/json');
  return message;
}
```

## Additional

这种方式还可以变形成其他形式，例如在 Branch 2 里添加逻辑处理 Basic Message ，或者把这种模式进行嵌套以做到对 Message 的多次 Enrich 。

变形1

![Image: SAP Cloud Integration Content Enricher a](/images/cloud/hcp/hci/sci-enricher-a.png)

变形2

![Image: SAP Cloud Integration Content Enricher b](/images/cloud/hcp/hci/sci-enricher-b.png)



[DataEnricher]:http://www.enterpriseintegrationpatterns.com/patterns/messaging/DataEnricher.html
