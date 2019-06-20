---
layout: post
theme: UbuntuMono
series: 
  url: fiori
  title: SAP Fiori
title: "Fiori development CI/CD"
excerpt: "CI/CD for Fiori development "
modified: 2018-11-16T11:51:25-04:00
categories: articles
tags: [Fiori, Web IDE, CI/CD, SAP Cloud Platform, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2083.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/yellowstone-national-park-united-states-2083
comments: true
share: true
---

* TOC
{:toc}


* [CI / CD for SAPUI5 on ABAP with GitLab](https://blogs.sap.com/2018/08/01/ci-cd-for-sapui5-on-abap-with-gitlab/)

* [Continuous Integration (CI) Best Practices with SAP – CI/CD Practices](https://developers.sap.com/tutorials/ci-best-practices-ci-cd.html)

* [Continuous Integration (CI) Best Practices with SAP – Introduction and Navigator](https://developers.sap.com/tutorials/ci-best-practices-intro.html)

* [CI Best Practices Guide – SAPUI5/SAP Fiori on ABAP Front-End Server](https://developers.sap.com/tutorials/ci-best-practices-fiori-abap.html)

* [CI Best Practices Guide – SAPUI5/SAP Fiori on SAP Cloud Platform](https://developers.sap.com/tutorials/ci-best-practices-fiori-sapcp.html)

![](https://blogs.sap.com/wp-content/uploads/2018/07/image1.png)

ABAPGit

Jenkins
CircleCI
GitLab CI/CD

![forrester ci wave graphic](https://about.gitlab.com/images/home/forrester-ci-wave-graphic.svg)

## With Docker Container

Containerization is quickly becoming the most accepted method of packaging and deploying applications in cloud environments. The standardization it provides, along with its resource efficiency (when compared to full virtual machines) and flexibility, make it a great enabler of the modern DevOps mindset. Many interesting cloud native deployment, orchestration, and monitoring strategies become possible when your applications and microservices are fully containerized.


```
Git — 版本管理
GitHub — 程式碼託管、審查
CircleCI — 自動化建置、測試、部署
Docker — 可攜式、輕量級的執行環境(使用 Docker，統一開發者、測試人員、以及產品的執行環境。)
AWS Elastic Beanstalk — 雲端平台
Slack — 團隊溝通、日誌、通知
```

## Troublesome

WebIDE: deploy to **sapui5 abap repository**
> service cannot be reached

Solution: Transaction **SICF** -> F8 -> activate Service `/default_host/sap/bc/adt`