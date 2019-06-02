---
layout: post
theme: UbuntuMono
series:
  url: sap-cloudfoundry-xsa
  title: SAP Cloud Foundry XSA
title: "Create Cube Graphical Calculation View"
excerpt: "Create a graphical calculation view with a cube data type."
modified: 2019-05-28T11:51:25-04:00
categories: articles
tags: [XSA, Cloud Foundry, HANA, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5620.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/barcelona-spain-5620
comments: true
share: true
---

* TOC
{:toc}

Create a graphical calculation view with a cube data type.

## Step 1. New Cube Calculation View

Create a new calculation view in your *models* folder. Call it *PURCHASE_ORDERS*, choose **CUBE** as a data category and mark the flag for **With Star Join**

![](/images/cloud/hana/calcview/cube-new.png)
{: .center.middle}

## Step 2. Join PO Header and Items

添加一个 Join 节点，并为他添加数据源 *PO.Header* and *PO.Item*，用 *PURCHASEORDERID* 连接这两个数据源，并把连接属性 cardinality 改为 **1..n**

![](/images/cloud/hana/calcview/cube-inner-join.png)

然后再 Mapping 页把这些字段添加到输出列表: *PURCHASEORDERID*, *HISTORY.CHANGEDAT*, *PRODUCT.PRODUCTID*, *CURRENCY*, *GROSSAMOUNT*.

![](/images/cloud/hana/calcview/cube-mapping-out.png)

最后重命名此节点为 *PO*

## Step 3. Join Purchase Orders with Products Dimension

下面重点来了，把用于分析的业务数据 Purchase Orders 与维度数据 Products （Dimension View）关联起来，Connect the output of the join *PO* to the **Star Join**. Use the `+` sign to search and select *PRODUCTS* view.

![](/images/cloud/hana/calcview/cube-join-star.gif)


## Step 8. Commit Code

最后别忘了提交代码，养成良好的习惯。

## Next Steps