---
layout: post
theme: UbuntuMono
series: 
  url: s4hana-cloud
  title: S/4HANA Cloud
title: "Form Templates"
excerpt: "Custom form templates in S/4HANA Cloud"
modified: 2018-11-09T11:51:25-04:00
categories: articles
tags: [S/4HANA Cloud, S/4HANA, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1134.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/general-roca-argentina-1134
comments: true
share: true
---

* TOC
{:toc}

* 先安装 Notes
    notes：[2228611](http://service.sap.com/sap/support/notes/2228611) Output Management in SAP S/4HANA

https://help.sap.com/doc/saphelp_nw751abap/7.51.0/en-US/1d/77c396e7fc43bc94c46947305f5f71/frameset.htm

[adobe livecycle designer](https://www.adobe.com/products/livecycle/tools/designer.html)

FDP_* odata 

*.xdp

在 S/4HANA Cloud App: Install Additional Software 可以下载 Adobe® LiveCycle® Designer。或者在 Adobe 官方网站下载试用版的 Adobe® LiveCycle® Designer ES4。


1. Open liveCycle designer from path: C:\Program Files\Adobe\LiveCycleDesigner<9.0.1>\Designer.exe.

2. Drag and drop the XDP file on the designer window.

3. Open xmlData tab of the form. and copy it.

4. Now areate a form in your SAP using T-code SFP and paste this xml in the newly created form in the xml data tab.

5. Open body page, you will get this XDP in your system.


1. At the registration prompt enter any name and organization you prefer.
2. Enter Serial Number: 1139-1008-3619-7621-6208-3424


Adobe Experience Manager (AEM) forms allows you to integrate easy-to-use enterprise forms and documents into your web and mobile experiences. It extends engaging web and mobile experiences to enterprise forms and documents, allowing organizations to complete complex digital interactions while improving user experiences and extending business reach.

## OData

Extensibility / Custom Business Objects

## 下载现有 Forms

/sap/opu/odata/sap/APS_OM_FORM_TMPL_SRV/FormTemplateDownloadSet(Name='SDBIL_CI_PROF_SRV_DE',Language='ZH',MasterName='SOMU_FORM_MASTER_A4')/$value


FDP_V3_BD_PROF_SERV_SRV


YY1_SDBIL_CI_PROF

https://www.youtube.com/watch?v=hgYuUmYELTM

## Output Management

S/4HANA 引入了新的 Output Management ， Output control serves as an interface between
the business applications and the SAP NetWeaver technologies. 


As an administrator, you define when and how to issue an output in the **Output Parameter Determination** app. With this app, you set output rules for the object type __Outbound Delivery__.

* Output Parameter Determination

[SAP S/4HANA Cloud 1811 - Output Control](https://help.sap.com/viewer/1161ad331e8f47478ba3537caf0af7f3/1811.500/en-US/a233560191284a96be1566bb736f5b28.html)


BRFplus

form template determination

## 实现步骤

从 Output Management / Maintain Form Templates 应用里下载现有的(预定义) Form Template，然后在 Adobe Form Designer 工具里做修改，然后再上传为 Custom Templates。

在 Implementation Cockpit / Manage Your Solution 应用里先进入 Configure Your Solution，搜索 _output_ 然后点开 `Output Control` 这行。在这里你可以定义 form templates, email templates 和 output channels 相关的设置。

Output Control 这个配置里总共 4 步配置：
* Define Rules for Determination of Master Form Template
* Assign Form Templates
* Assign Email Templates
* Assign Output Channels

![Image: Output Control Configuration Steps](/images/s4hana/extensibility/s4hana-cloud-output-control-configuration-steps.png)

选择 Assign Form Templates 点击 Configure 按钮，打开了一个 Customizing activity 的 [WebGUI]() ，新增一条记录，输入你的 Application Object Type，Output Type 和自定义的 Form Template ID。

最后到 Output Management / Output Parameter Determination 应用里选择你的 Rule 和  Determination Step：**Form Template**，然后就可以在下方列表里为 Output Type 选择相应的 Form Template 了。

![Image: Output Parameter Determination](/images/s4hana/extensibility/s4hana-cloud-output-parameter-determination.png)
