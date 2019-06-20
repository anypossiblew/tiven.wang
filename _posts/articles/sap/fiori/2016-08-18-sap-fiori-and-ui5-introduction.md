---
layout: post
theme: UbuntuMono
series: 
  url: fiori
  title: SAP Fiori
title: SAP Fiori and UI5 Introduction
excerpt: "SAP Fiori是为了给企业级应用带来更好的用户体验的一种设计语言。SAP Fiori通过基于用户角色和业务过程的设计原则简化了业务操作流程。SAP Fiori是一站式ERP解决方案向面向用户任务的轻量级程序转变的典范。为了加速全球数字经济的转型，SAP正在把这一设计语言应用到其领先的技术平台。本文介绍SAP Fiori的概念和设计原则，以及其与SAP UI5的关系，并对比其与市场上其他设计语言的异同比如Google的Material Design"
modified: 2016-08-19T17:51:25-04:00
categories: articles
tags: [SAP, Fiori, UI5]
image:
  feature: /images/fiori/mashheader-fiori.png
comments: true
share: true
references:
  - title: "SAP Technology Platform / SAP Fiori"
    url: "http://go.sap.com/sea/product/technology-platform/fiori.html"
  - title: "SAP Experience: Fiori Design Guidelines"
    url: "https://experience.sap.com/fiori-design/"
  - title: "SAP User Experience Community"
    url: "https://experience.sap.com/"

---

* TOC
{:toc}

SAP Fiori是为了给企业级应用带来更好的用户体验的一种设计语言。SAP Fiori通过基于用户角色和业务过程的设计原则简化了业务操作流程。SAP Fiori是一站式ERP解决方案向面向用户任务的轻量级程序转变的典范。为了加速全球数字经济的转型，SAP正在把这一设计语言应用到其领先的技术平台。

本文介绍SAP Fiori的概念和设计原则，以及其与SAPUI5的关系，并对比其与市场上其他设计语言的异同比如Google的[Material Design](https://material.google.com/)。

## background

## SAPUI5

### Components

#### Viewer

#### Controller

#### Databinding

### Conventions and Guidelines

[Development Conventions and Guidelines](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.8/en-US/753b32617807462d9af483a437874b36.html)

### Extending Apps

[Extending Apps](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.8/en-US/a264a9abf98d4caabbf9b027bc1005d8.html)

[View Extension](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.8/en-US/403c050da4ae4566b6aafec2bc590389.html)

[Controller Extension](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.8/en-US/407feaf830c94e4c9de48ce08adabd1c.html)

## Fiori

SAP Fiori has a simple user interface hierarchy, designed to make the user interaction easy and intuitive. In general, the SAP Fiori launchpad is the main entry point. All the apps available to a user are presented as tiles in the app finder, while the home page shows a personalized view of tiles the user has selected. The shell bar offers an enterprise search and other services, which are available across all apps.

### Floorplans

针对常见的工作场景，SAP Fiori 提供了相应的界面布局组件（Floorplans），来满足相应的需求减少开发工作量。如列表报表（List Report），分析列表报表（Analytical List Page），工作列表（Worklist），对象概览页（Overview Page），对象详情页（Object Page），向导（Wizard）等。基本能满足企业用户常见工作场景需求。

#### List Report Floorplan

With a [list report][list-report-floorplan], users can view and work with a large set of items. This floorplan offers powerful features for finding and acting on relevant items. It is often used as an entry point for navigating to the item details, which are usually shown on an [object page][object-page-floorplan].

![](https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2018/06/List_report_intro_new.jpg)

#### Analytical List Page Floorplan

The analytical list page (ALP) offers a unique way to analyze data step by step from different perspectives, to investigate a root cause through drilldown, and to act on transactional content. All this can be done seamlessly within one page. The purpose of the analytical list page is to identify interesting areas within datasets or significant single instances using data visualization and business intelligence.

Users need different visualizations for the entire dataset (for example, as a table or chart), but don’t need to work with both visualizations on the same page (for example, in a reporting scenario). In this case, a [list report][list-report-floorplan] might be sufficient.

![](https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2018/06/ALP_HybridView_VFB-1100x763.jpg)

#### Worklist Floorplan

A worklist displays a collection of items that a user needs to process. Working through the list usually involves reviewing details of the items and taking action. In most cases, the user has to either complete a work item or delegate it.

The focus of the worklist floorplan is on processing the items. This differs from the [list report][list-report-floorplan] floorplan, which focuses on finding and acting on relevant items from a large dataset.

![](https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2017/08/tabs_-_l-1100x742.png)

#### Overview Page Floorplan

> View, Filter, and Take Immediate Action

The overview page (OVP) is a data-driven SAP Fiori app type and floorplan that provides all the information a user needs in a single page, based on the user’s specific domain or role. It allows the user to focus on the most important tasks, and view, filter, and react to information quickly.

Each task or topic is represented by a card (or content container). The overview page acts as a UI framework for organizing multiple cards on a single page.

![](https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2017/11/ovp_intro_FCL_1.52-1100x619.png)

#### Object Page Floorplan

The object page floorplan allows the user to display, create, or edit an object. This is the recommended floorplan for representing both simple and complex objects in SAP Fiori. The object page floorplan comes with a flexible header, a choice of anchor or tab navigation, and a flexible, responsive layout. These features make it adaptable for a wide range of use cases.

![](https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2018/06/objectPageSizeL.png)

## SAP Fiori Server

[SAP Fiori Front-end Server](https://wiki.scn.sap.com/wiki/display/Fiori/SAP+Fiori+Front-end+Server)

[SAP Fiori: Setup and Configuration](https://help.sap.com/viewer/41806333969841ff93e4b365f4233ce6/FES5.0.00/en-US/270dd0bc79044592ab22545227f2435b.html)

As of SAP NetWeaver 7.40 the major components of SAP Gateway have been integrated into the SAP NetWeaver system as SAP Gateway Foundation (SAP_GWFND). SAP Gateway Foundation has since been an integral part of SAP NetWeaver.

## Performance

https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.8/en-US/408b40efed3c416681e1bd8cdd8910d4.html

## Angular

Following are the advantages/disadvantages of using angular framework:

* Using Angular, you can develop complex High interactive rich internet web application.
* Angular application can be easily integrated with third-party library like Kendo UI
* You can easily manage the state of the UI objects and control over it
* You can easily perform Unit Testing

Disadvantage:
* As far I know it is not possible to integrate an Angular application in SAP Fiori Launchpad

You can also refer to this link for more details about SAP UI5 vs Angular framework:

SAPUI5 Advantage:

      - Simple and easy MVC Framework

      - Fiori UX Paradigm that SAP suggest fits for all kind of SAP Projects

      - Development is simpler when we have usual rich internet web application

Demerits:

      - Hard to develop High interactive rich internet web application, because there is no dependency injection, Manage state

      - SAPUI5 can not talk to DOM objects virtually and manage its state as we do in Angular.

Angular Advantage:

Working on Angular is all together different experience, because it has got some unique features.

      - Complex High interactive rich internet web application can be developed very easily

      - Easy to integrate third party library like Kendo UI

      - Dependency Injection

      - Declarative UI

      - Managing the state of the UI objects and control over it

      - Easy to Unit test

Demerits:

      - We can not integrate Angular application in SAP Fiori Launchpad

## 总结

&lt;&lt;未完&gt;&gt;

[list-report-floorplan]:https://experience.sap.com/fiori-design-web/list-report-floorplan-sap-fiori-element/
[object-page-floorplan]:https://experience.sap.com/fiori-design-web/object-page/