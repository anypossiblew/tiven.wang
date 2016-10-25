---
layout: post
title: How to develop an Fiori application using Odata Service on the HCP
excerpt: "SAP HANA Cloud Platform 提供了本地开发的能力，使你可以在本地创建开发UI5应用程序并使用HCP上的OData service和xsjs服务，并运行在HANA Cloud上。"
modified: 2016-10-12T16:00:00-00:00
categories: articles
tags: [HCP, UI5, OData, HANA, Cloud]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:

---

* TOC
{:toc}

前面我们创建了xs application和OData service，本篇我们接着介绍SAP Fiori application的开发，并在Fiori app中调用使用OData service用来展示和管理数据。本篇所用项目完整代码可以在[Github][2]下载

SAP提供了在线开发工具webide供用户开发自定义的UI5和Fiori应用程序。

## Prerequisites

* 能够访问HCP的服务webide： https://webide-*&lt;AccountName&gt;*.dispatcher.hanatrial.ondemand.com/index.html

* 上一篇创建的OData service： _/digital-account/services/DigAccMessage.xsodata_

## Create Fiori App

SAP产品的强大之处就在于产品开发的规范性，即使是初学者所开发的程序和资深程序员开发的从形式上并不会有太大差别。这种规范性首先就体现在UI5 application的创建上。只要拥有一个OData service就可以不用写一行代码而创建一个完整的应用程序，就如同Web UI界的[yeoman][4]一样方便。

webide提供了几种初始化创建Project的方式

* __Manunal Create__ 最原始的手动一个个文件创建，如果你喜欢

* __Project from Template__ 根据提供的一些模板创建，本篇使用这种方式

* __Project from Sample Application__ 相当于Clone一份Sample程序，这里的Sample并不多所以并不常用

* __Quick Start with Layout Editor__ 初始化一个完整结构内容空的Project，并打开Layout Editor来编辑View

因为我们想要的应用程序是用来查看Message List，所以我们选择Template里的**_SAP Fiori Worklist Application_**用来创建项目。

### Download OData Service's Metadata

从Template创建Application需要使用OData service Metadata信息，所以首先要下载我们之前创建的OData Metadata。
在浏览器中访问链接 _/digital-account/services/DigAccMessage.xsodata/$metadata_ ，另存为本地文件待用。下面是Metadata文件内容的部分片段

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<edmx:Edmx Version="1.0"
    xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">
    <edmx:DataServices
        xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="2.0">
        <Schema Namespace="digital-account.services"
            xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"
            xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"
            xmlns="http://schemas.microsoft.com/ado/2008/09/edm">
            ...
            <EntityType Name="MessageType">
                <Key>
                    <PropertyRef Name="id" />
                </Key>
                <Property Name="id" Type="Edm.Int32" Nullable="false" />
                <Property Name="createdTime" Type="Edm.DateTime" />
                <Property Name="content" Type="Edm.String" MaxLength="5000" />
                <NavigationProperty Name="events" Relationship="digital-account.services.Message_EventsType" FromRole="MessagePrincipal" ToRole="EventDependent" />
            </EntityType>
            ...
            <Association Name="Message_EventsType">
                <End Type="digital-account.services.MessageType" Role="MessagePrincipal" Multiplicity="1"/>
                <End Type="digital-account.services.EventType" Role="EventDependent" Multiplicity="*"/>
                <ReferentialConstraint>
                    <Principal Role="MessagePrincipal">
                        <PropertyRef Name="id"/>
                    </Principal>
                    <Dependent Role="EventDependent">
                        <PropertyRef Name="message"/>
                    </Dependent>
                </ReferentialConstraint>
            </Association>
            <EntityContainer Name="DigAccMessage" m:IsDefaultEntityContainer="true">
                ...
                <EntitySet Name="Message" EntityType="digital-account.services.MessageType" />
                <EntitySet Name="Event" EntityType="digital-account.services.EventType" />
                <AssociationSet Name="Message_Events" Association="digital-account.services.Message_EventsType">
                    <End Role="MessagePrincipal" EntitySet="Message"/>
                    <End Role="EventDependent" EntitySet="Event"/>
                </AssociationSet>
            </EntityContainer>
        </Schema>
    </edmx:DataServices>
</edmx:Edmx>
```

### Create Project from Template

通过Project from Template方式创建Project有以下步骤

1. 选择模板，
	这里需要注意Available Versions选择适合你运行环境的版本，这里HCP MDC版本为1.28，查看链接 **_/sap/ui5/1/sdk/_**
	<figure class="center">
		<img src="/images/cloud/webide/create-app-from-template.jpg" alt="Select Template">
		<figcaption>Select Template</figcaption>
	</figure>

2. 输入Project Name **_Digital-Account-Manager_**

3. 设置Data Connection指定Odata Metadata信息源，这里我们选择通过File System创建，选择前面保存下的OData Metadata文件
	<figure class="center">
		<img src="/images/cloud/webide/create-app-from-odata-metadata.jpg" alt="Template Data Connection">
		<figcaption>Template Data Connection</figcaption>
	</figure>

4. 自定义应用程序设置和数据绑定，因为我们要查看的是Message的列表所以这里Object Collection选择Message
	<figure class="center">
		<img src="/images/cloud/webide/create-app-template-customization.jpg" alt="Template Customization">
		<figcaption>Template Customization</figcaption>
	</figure>

### Run Project

创建完成后就可以运行项目查看效果了。选择`Run -> Run with MockServer`打开应用程序后便可以看到效果，由于使用的是Mock Server而其并没有Mock Data，这里显示的数据是随机生成的。

可以看到除了`Run with MockServer`还有`Run Unit Tests` `Run Opa Tests` `Run All Tests` `Run with Server`等。虽然框架都有了，但内容是非常简陋的，所以之后需要修改代码逻辑以适应需求。

#### Add Test Mock Data (Optional)

如果你想要利用实际的数据校验应用的效果，那么可以利用前一篇创建的Message数据来测试。

访问链接 _/digital-account/services/DigAccMessage.xsodata/Message?$format=json_ ， 并只copy节点results的数据。
在项目目录 _webapp/localService/_ 下创建文件夹*__mockdata__*，并新建文件*__Message.json__*，粘贴results的数据。

> 文件名和OData Metadata里的EntitySet名称保持一致。为了方便后面开发还可以创建*__Event.json__*并保存Event数据。

重新Run with MockServer则会看到Mockdata里的实际数据。

## Deploy to HCP MDC

创建好Project后我们想看到其在实际环境中的效果，那么需要部署到HANA服务器上去。因为我们不是在真正的HANA Cloud Platform上开发的Fiori，而只是其上的一个独立的HANA Multitenant Database Container，所以现在不能通过webide直接deploy到HCP上去，
那么我们只能通过文件手工上传的方式传输到HANA Respository。

首选Export项目代码，然后在HANA Web-based Development Workbench Editor **_/sap/hana/ide/editor/_** 里digital-account下创建一个sub-package **_ui_** ， 并使用`Import -> Archive`方式导入项目代码。

### Change the Paths

下图为导入的Fiori Project在package下的结构，如果想Run起来的话还需要修改几出配置。

<figure class="center">
	<img src="/images/cloud/hcp/project-ui-structure.jpg" alt="Fiori Project Structure">
	<figcaption>Fiori Project Structure</figcaption>
</figure>

* _OData Service url_ 修改如上图标出的serviceUrl，改成我们的OData路径 **_/digital-account/services/DigAccMessage.xsodata/_**

* _Resources path_ HANA服务器上的UI5 Resources路径与HCP上不同，如果我们要运行test文件夹下的页面，那么必须修改所涉及的UI5 Resources路径。
这里路径为*/sap/ui5/1/*，所以结果例如*/sap/ui5/1/resources/sap-ui-core.js*

### Run the App

打开页面*/digital-account/ui/webapp/test/test.html*可以看到Testing Overview页面，点击链接*/test/testFLP.html*便可以看到Fiori应用实际运行效果。

## Modify Object View

从模板自动生成的项目代码只是worklist，点开每个object的detail页面需要做修改添加更多内容。我们想在detail页面添加一个展示Events的Table，那么只需一小段代码。把下面这段xml代码添加到文件**_Object.view.xml_**里的**_content_**节点下，并添加相关i18n描述，即可得到Event Table页面，就是这么方便

```xml
<Table
	id="itemsList"
	width="auto"
	items="{events}"
	noDataText="{i18n>tableNoDataText}"
	busy="{objectView>/busy}"
	busyIndicatorDelay="{objectView>/delay}"
	class="sapUiResponsiveMargin">
	<columns>
		<Column>
			<Text text="{i18n>objectItemTableIDColumn}"/>
		</Column>
		<Column
			minScreenWidth="Tablet"
			demandPopin="true"
			hAlign="Right">
			<Text text="{i18n>objectItemTableUnitNumberColumn}"/>
		</Column>
	</columns>
	<items>
		<ColumnListItem>
			<cells>
				<ObjectIdentifier
					title="{eventType}"
					text="{id}"/>
				<ObjectNumber
					number="{
						path: 'message',
						formatter: '.formatter.currencyValue'
					}"/>
			</cells>
		</ColumnListItem>
	</items>
</Table>
```

### Update to HANA Respository

把修改过的代码更新的HCP MDC的HANA Respository上去，就可以得到我们想要的效果了。

## Next Steps

本篇我们介绍了如何在hcp webide里创建Fiori应用，并部署到HCP MDC HANA Respository上去运行。接下来我们介绍如何将Fiori App配置到Fiori Launchpad上去

* [How to Config Fiori App in Fiori Launchpad][6]


[1]:https://account.hanatrial.ondemand.com/cockpit
[2]:https://github.com/anypossiblew/hcp-digital-account/tree/fiori-app
[3]:/articles/how-to-develop-xs-application-on-hcp/
[4]:http://yeoman.io/
[5]:http://help.sap.com/hana/SAP_HANA_Developer_Guide_for_SAP_HANA_Web_Workbench_en.pdf
[6]:/articles/how-to-config-fiori-app-in-launchpad/