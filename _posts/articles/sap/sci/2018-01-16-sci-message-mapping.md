---
layout: post
title: SAP Cloud Platform Integration - Message Mapping
excerpt: "SAP Cloud Platform Integration provides message mapping, where you can map fields between two messages  . Message mapping is one of the widely used message transformation steps in an integration flow."
modified: 2018-01-16T17:00:00-00:00
categories: articles
tags: [SCI, iPaaS, EIP, SCP]
image:
  vendor: twitter
  feature: /media/DRrKrhbX0AATJbd.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px
comments: true
share: true
references:
  - id: 1
    title: "SAP Log - Message Mapping Simulation in SAP Cloud Platform Integration"
    url: "https://blogs.sap.com/2017/05/26/message-mapping-simulation-in-sap-cloud-platform-integration/"
---

* TOC
{:toc}

SAP Cloud Integration 的 Message Mapping 工具是对 Message Body 数据转换 Data Transformation 的一种方式。它使用 XSD 文件对转换前和转换后的数据格式进行预定义，允许用户在转换前后字段之间进行映射，支持一对一，一对多，多对一的映射方式。一对一的方式自然是最简单的，不需要额外逻辑。但一对多和多对一需要用户设置自定义函数进行映射逻辑处理。阅读 [Custom function with multiple output in Message Mapping](https://blogs.sap.com/2017/09/25/custom-function-with-multiple-output-in-message-mapping/)

## Data Format
转换后的数据格式要求如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<Campaigns>
  <Campaign>
    <CampaignId>123</CampaignId>
    <ExtCampaignId>456</ExtCampaignId>
    <Success>
      <AdServingSpendAmount>1</AdServingSpendAmount>
      <AdServingSpendAmtCrcyISOCode>str1234</AdServingSpendAmtCrcyISOCode>
      <Advertiser>1</Advertiser>
      <CampaignID>1</CampaignID>
      <CountryFreeText>str1234</CountryFreeText>
      <DeviceFreeText>str1234</DeviceFreeText>
      <ExternalCampaignID>1</ExternalCampaignID>
      <NumberOfClicks>1</NumberOfClicks>
      <NumberOfImpressions>1</NumberOfImpressions>
      <RegionFreeText>str1234</RegionFreeText>
      <SuccessDataDate>2018-01-18T12:12:12</SuccessDataDate>
    </Success>
  </Campaign>
</Campaigns>
```

其对应的 XSD, 可以使用在线工具生成 [XSD Generator](https://www.freeformatter.com/xsd-generator.html)

```xml
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="Campaigns">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Campaign" maxOccurs="unbounded" minOccurs="0">
          <xs:complexType>
            <xs:sequence>
              <xs:element type="xs:int" name="CampaignId"/>
              <xs:element type="xs:int" name="ExtCampaignId"/>
              <xs:element name="Success" maxOccurs="unbounded" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element type="xs:byte" name="AdServingSpendAmount"/>
                    <xs:element type="xs:string" name="AdServingSpendAmtCrcyISOCode"/>
                    <xs:element type="xs:byte" name="Advertiser"/>
                    <xs:element type="xs:byte" name="CampaignID"/>
                    <xs:element type="xs:string" name="CountryFreeText"/>
                    <xs:element type="xs:string" name="DeviceFreeText"/>
                    <xs:element type="xs:byte" name="ExternalCampaignID"/>
                    <xs:element type="xs:byte" name="NumberOfClicks"/>
                    <xs:element type="xs:byte" name="NumberOfImpressions"/>
                    <xs:element type="xs:string" name="RegionFreeText"/>
                    <xs:element type="xs:dateTime" name="SuccessDataDate"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

转换前的数据如下：

```xml
<body>
  <data>
    <id>74524861</id>
    <kpis>1150</kpis>
    <kpis>7</kpis>
    <kpis>53.94</kpis>
    <name>bj-国际01</name>
    <name>通用词-北京</name>
    <date>2017-11-01</date>
    <device>1</device>
  </data>
</body>
```

其对应的 XSD 如下：

```xml
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="body">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="data" maxOccurs="unbounded" minOccurs="0">
          <xs:complexType>
            <xs:sequence>
              <xs:element type="xs:int" name="id"/>
              <xs:element type="xs:float" name="kpis" maxOccurs="unbounded" minOccurs="0"/>
              <xs:element type="xs:string" name="name" maxOccurs="unbounded" minOccurs="0"/>
              <xs:element type="xs:date" name="date"/>
              <xs:element type="xs:byte" name="device"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

## Mapping Functions

SAP Cloud Integration Platform 提供了一些基本的数据转换函数可以使用在一对一的映射上。例如 Arithmetic 算术类的，Boolean 类的，Date 日期类的，Statistic 统计类的等等。你也可以在目标数据结构上 disable 掉不需要的字段，还可以为字段设置固定值。

我们重点介绍一些如何使用脚本文件为映射创建自定义函数。

### Custom Function
先来看一下自定义函数 Overview

![Image: SAP Cloud Integration - Message Mapping](/images/cloud/hcp/hci/sci-message-mapping.png)
{: .center}

点击Functions里创建按钮新建一个脚本文件，并创建函数 `customKpis`

```java
import com.sap.it.api.mapping.*;

/*Add MappingContext parameter to read or set headers and properties
def String customFunc1(String P1,String P2,MappingContext context) {
         String value1 = context.getHeader(P1);
         String value2 = context.getProperty(P2);
         return value1+value2;
}

Add Output parameter to assign the output value.
def void custFunc2(String P1,String P2, Output output, MappingContext context) {
        String value1 = context.getHeader(P1);
        String value2 = context.getProperty(P2);
        output.addValue(value1);
        output.addValue(value2);
}*/

def void customKpis(String[] kpis, Output numberOfClicks, Output numberOfImpressions, MappingContext context){
    numberOfClicks.addValue(kpis[0]);
    numberOfImpressions.addValue(kpis[1]);
}
```

在此自定义函数的参数里你可以定义不同类型不同数量的输入和输出参数，这些参数会出现在图形界面里供字段映射使用。接着就可以把此函数添加到指定的映射上，并且添加更多的输入和输出参数进来，然后与函数的参数连接起来。

我们例子中的 `kpis` 这个 node 是一个 `0..*` 的节点，它会在 `data` 节点下出现多次，所以它对应到的参数会是一个数据类型，对于数据类型我们只能根据顺序判断它所对应的字段。

### Many to One
上面我们讲到的设计到一对一和一对多的映射，那么对于多对一的映射有一些特殊设置。

例如我们需要将路径 `/body/data/id` 指向的值连接起来放在目标结构的 CampaignId 里，这里就涉及一个问题，路径 `/body/data` 映射的目标路径是 `/Campaigns/Campaign/Success`， 而现在要将 `/body/data/id` 映射到 `/Campaigns/Campaign/CampaignId` 上，`/body/data/id` 的取值要跨 `/body/data` List 。这里就需要将 `/body/data/id` 的属性里的 Context 设置为 `body` 而不是原来的 `data`。

## Simulation

当你设计好 Message Mapping 后可以使用 Simulation 功能来测试一下，通过上传测试数据文件并点击 Test 进行测试并查看生成出来的数据结果。[[ 1 ](#reference-1)]
