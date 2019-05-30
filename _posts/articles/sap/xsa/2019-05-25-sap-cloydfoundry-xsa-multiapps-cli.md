---
layout: post
theme: UbuntuMono
series:
  url: cloudfoundry-xsa
  title: SAP Cloud Foundry XSA
title: "MultiApps"
excerpt: "The Multi-Target Application Model"
modified: 2019-05-24T11:51:25-04:00
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

> A multi-target application (MTA) comprises multiple pieces of software called “modules” which all share a common lifecycle for development and deployment. An MTA is described in two descriptor files: the design-time descriptor and the deployment descriptor:
>
* **Development** descriptor `mta.yaml`
* **Deployment** descriptor `mtad.yaml`
>
> Multi-target applications collect multiple modules and resource references in a single, deployable archive.

## Where is Properties of Cloud Foundry Manifest

## CF MultiApps Plugin

https://github.com/cloudfoundry-incubator/multiapps-cli-plugin

https://www.sap.com/documents/2016/06/e2f618e4-757c-0010-82c7-eda71af511fa.html

```powershell
$ cf install-plugin multiapps
Searching CF-Community for plugin multiapps...
Plugin multiapps 2.1.1 found in: CF-Community
Attention: Plugins are binaries written by potentially untrusted authors.
Install and use plugins at your own risk.
Do you want to install the plugin multiapps? [yN]: y
Starting download of plugin binary from repository CF-Community...
 14.41 MiB / 14.41 MiB [=======================================================================================================================================================================] 100.00% 6s
Installing plugin multiapps...
OK

Plugin multiapps 2.1.1 successfully installed.
```

## Next Steps

[SAP Cloud Foundry XSA - Create Dimension Graphical Calculation View](/articles/sap-cloydfoundry-xsa-dimension-calculation-view/)