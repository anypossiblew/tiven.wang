---
layout: post
title: HANA Cloud Integration
excerpt: " SAP HANA Cloud Integration easily exchange data in real-time with SAP HANA Cloud Platform, integration services. Integrate processes and data between cloud apps, 3rd party applications and on-premises solutions with this open, flexible, on-demand integration system running as a core service on SAP HANA Cloud Platform."
modified: 2016-10-31T17:00:00-00:00
categories: articles
tags: [HCP, HANA, Cloud, Integration, HCI]
image:
  feature: /images/cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP Blog - Step by Step Guide to Setup HCI-DS Agent On Premise"
    url: "https://blogs.sap.com/2015/12/11/step-by-step-guide-to-setup-hci-ds-agent/"
  - title: "Youtube - SAP HANA Cloud Integration for Data Services"
    url: "https://www.youtube.com/playlist?list=PLkzo92owKnVyHVtrzyF4KSQomTuKRg0q_"
  - title: "SAP Blog - HCI: Integrate On Premise ERP with HCI IDoc Adapter using HANA Cloud Connector & Client Authentication"
    url: "https://blogs.sap.com/2016/03/30/hci-integrate-on-premise-erp-with-hci-idoc-adapter-using-hana-cloud-connector-client-authentication/"
  - title: "HCP Documents - SAP HANA Cloud Integration for Processes"
    url: "https://proddps.hana.ondemand.com/dps/d/preview/88a767b35adb4dc887ee1d545d301140/1/en-US/f830932fddf6453ebe1fd0c666592017.html"
  - title: "open.sap.com - Application Integration Made Simple with SAP HANA Cloud Integration"
    url: "https://open.sap.com/courses/hci1/overview"
---

* TOC
{:toc}

## Backgrounds
### BPMN
A standard [Business Process Model and Notation (BPMN)](http://www.bpmn.org/) will provide businesses with the capability of understanding their internal business procedures in a graphical notation and will give organizations the ability to communicate these procedures in a standard manner. Furthermore, the graphical notation will facilitate the understanding of the performance collaborations and business transactions between the organizations. This will ensure that businesses will understand themselves and participants in their business and will enable organizations to adjust to new internal and B2B business circumstances quickly.

[BPMN Tutorial: Get started with Process Modeling using BPMN](https://camunda.com/bpmn/)

#### Catify BPMN Engine

> The catify bpmn engine is based on Akka (http://akka.io/) and Neo4j (http://neo4j.com/) and is fully compatible to BPMN 2.0. It can handle millions of long running processes out of the box. Though not yet feature complete, it is easy to extend via different service provider interfaces.
>
> You can easily integrate the engine into your infrastructure. Via the Integration SPI you can access it by the integration framework of your choice. Out of the box it comes with Apache Camel (http://camel.apache.org/) and therefore all of its strenghts.


#### List of BPMN 2.0 engines

[List of BPMN 2.0 engines](https://en.wikipedia.org/wiki/List_of_BPMN_2.0_engines)

### Apache Camel
[Apache Camel][Apache-Camel] ™ is a versatile open-source integration framework based on known [Enterprise Integration Patterns][Enterprise-Integration-Patterns].

### Enterprise Integration Patterns
[Camel][Apache-Camel] supports most of the [Enterprise Integration Patterns][Enterprise-Integration-Patterns] from the excellent book by [Gregor Hohpe and Bobby Woolf][amazon-Enterprise-Integration-Patterns].

### Download HCI-DS Agent

[Data Services Agent][1]

## Camel’s Message Model

### Message
![Image Camel Message](/images/cloud/hcp/hci/camel-message.jpg)
{: .pull-right}

Fundamental entity **containing the data** being carried and routed in Camel

* Messages have a body (a payload), headers, and optional attachments
* Messages are uniquely identified with an identifier of type `java.lang.String`
* Headers
  * Headers are values associated with the message Sender identifier, hints about content encoding, authentication information,…
  * Headers are name-value-pairs Name is a unique, case-insensitive string Value is of type `java.lang.Object`
* Attachments
  * Optional – typically used for Web service and e-mail components
* Body
  * Type: `java.lang.Object` -> any kind of content is allowed

### Exchange
![Image Camel Message](/images/cloud/hcp/hci/camel-exchange.jpg)
{: .pull-right}

The **message’s container** during routing

* Provides support for various interaction types between systems, known as Message Exchange Patterns (MEP)
  * InOnly: a one-way message (e.g. JMS messaging)
  * InOut: a request-response message (e.g. HTTP-based transports)
* Exchange ID: a unique ID that identifies the exchange
* MEP
  * InOnly: exchange contains an “in message” only
  * InOut: exchange contains an “in message” and an “out message” containing the reply message for the caller
* Exception: If an error occurs during runtime, the Exception field will be filled
* Properties: Similar to message headers, but they last for the duration of the entire exchange; they contain global-level information; you can store and retrieve properties at any point during the lifetime of an exchange

### Goals
Store data in the message header and in the properties of the exchange. Retrieve data from header and properties to build the reply message





[Apache-Camel]:http://camel.apache.org/
[Enterprise-Integration-Patterns]:http://camel.apache.org/enterprise-integration-patterns.html
[amazon-Enterprise-Integration-Patterns]:http://www.amazon.com/exec/obidos/search-handle-url/105-9796798-8100401?%5Fencoding=UTF8&search-type=ss&index=books&field-author=Gregor%20Hohpe

[1]:https://launchpad.support.sap.com
