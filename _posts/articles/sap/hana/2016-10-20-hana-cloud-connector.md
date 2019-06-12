---
layout: post
theme: UbuntuMono
star: true
title: SAP Cloud Connector
excerpt: "SAP Cloud Platform, cloud connector is a simple on-premises integration agent that allows highly secure and reliable connectivity between your cloud applications and on-premises systems."
modified: 2019-06-12T17:00:00-00:00
categories: articles
tags: [SAPCC, SCP, Cloud, XS, HTTP]
image:
  feature: /images/cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP HCP - Establish On-Premises Connectivity with SAP HANA Cloud Platform, cloud connector"
    url: "https://hcp.sap.com/capabilities/integration/hana-cloud-connector.html"
  - title: "SAP HANA Cloud Documentation - SAP HANA Cloud Connector"
    url: "https://help.hana.ondemand.com/help/frameset.htm?e6c7616abb5710148cfcf3e75d96d596.html"
---

* TOC
{:toc}

## Series

1. [How to develop an XS application on the SAP HANA Cloud Platform](/articles/how-to-develop-xs-application-on-hcp/)
2. [How to develop an XS Odata Service by CDS on the HCP](/articles/how-to-develop-xs-odata-by-cds-on-hcp/)
3. [How to Create a Fiori app Using OData service on the HCP](/articles/how-to-develop-ui5-app-using-odata-on-hcp/)
4. [How to Config Fiori App in Fiori Launchpad](/articles/how-to-config-fiori-app-in-launchpad/)
5. [How to use HTTP Destination in HANA and HANA Cloud](/articles/how-to-use-http-dest-in-hana-and-hcp/)
6. HANA Cloud Connector
{: .entry-series}

## SAP HANA Cloud Connector

### Simply and Securely Connect Cloud and On-Premises Systems

![Cloud Connector Arc](/images/cloud/hcp/hana-cloud-connector-arc.png)
{: .pull-right}

SAP HANA Cloud Platform, cloud connector is a simple on-premises integration agent that allows highly secure and reliable connectivity between your cloud applications and on-premises systems.

SAP HANA Cloud Platform, cloud connector supports multiple protocols, fine grained audit logging and access control mechanisms, forwarding of the cloud user identity, and other services.

SAP HANA Cloud Platform, cloud connector also consists of a destination service which eases the configuration and usage of remote services in cloud applications.

### Securely Access On-Premises Systems Without Changing the Corporate Firewall

![Cloud Connector Arc](/images/cloud/hcp/hana-cloud-connector-arc2.png)
{: .pull-left}

Enjoy easier and faster deployment of hybrid solutions compared to traditional reverse proxy approaches.

SAP HANA Cloud Platform, cloud connector doesn’t require changes in the existing corporate firewall configuration to allow access to on-premises systems from your HCP applications because it initiates encrypted connections to cloud applications from inside the on-premise network to the cloud.

SAP HANA Cloud Platform, cloud connector provides a set of capabilities to secure access to on-premise systems, like fine-grained access control lists of both allowed cloud and on-premises resources, trust relation with on-premises systems based on X.509 certificates, and fine-grained audit logging for traceability.

[Help OnDemand: SAP HANA Cloud Platform, cloud connector](https://help.hana.ondemand.com/help/frameset.htm?e6c7616abb5710148cfcf3e75d96d596.html)

## Install

[Installing the Cloud Connector](https://help.hana.ondemand.com/help/frameset.htm?57ae3d62f63440f7952e57bfcef948d3.html)

### Step 1. Download

Select the Cloud Connector package for Windows or Windows (Portable) in [SAP Development Tools # Cloud Connector](https://tools.hana.ondemand.com/#cloud) to download.

Extract the package then double click the `go.bat` file to start Cloud Connector in desktop.

You can access the url *https://localhost:8443* to launch SAP Cloud Connector web ui. Default user is **Administrator** / **manage** .

### Step 2. Add Cloud Connector Subaccount

Once open the web ui or click the button **+ Add Account** in the **Connector** page to add an sap cloud subaccount

![SAPCC Add Account](/images/cloud/sapcc/1.define-subacc.png)

You can set the **HTTPS Proxy** if your desktop which is running the SAPCC behind a proxy of your company.

You can check the connection after created the account.

Reference: [SAP HANA Cloud Connector Configuration](https://help.hana.ondemand.com/help/frameset.htm?db9170a7d97610148537d5a84bf79ba2.html)

### Step 3. Cloud To On-Premise

#### Add Mapping Virtual To Internal System

Select your account, in **Cloud To On-Premise** page add the access control, create a **Mapping Virtual To Internal System**.

input your OData services host information (e.g. *dev.mydomain.cn:8000*) , you can choose a different name for virtual host and port, the virtual host and port will be used in cloud destination

![SAPCC Add mapping](/images/cloud/sapcc/2.add-mapping-to-internal.png)

#### Add Resources of Virtual Host

Add resources for virtual system, you can config the resource path individual or a root path for all resources, set the checkbox *Path and all sub-paths*.

![SAPCC Add resource](/images/cloud/sapcc/3.add-resource.png)

### Step 4. Check SAPCC in SAP Cloud Cockpit

You can check the SAPCC connector that has been created in pre-steps on your SAP Cloud Platform Cockpit(Neo) -> Connectivity -> Cloud Connectors

![SAPCC check](/images/cloud/sapcc/4.check-cc-in-cloud.png)

## WebIDE Destination

How to create a destination of on-premise abap system for SAP WebIDE on cloud?

### Step 1. Create destination for ABAP System in Cloud Cockpit

Add a new destination in SAP Cloud Platform Cockpit (Neo) -> Connectivity -> Destinations

URL is `http://<virtual-host>:<virtual-port>` don't contain subpath. The Basic Authentication User is your ABAP System user.

![SAPCC destination webide](/images/cloud/sapcc/5.create-destination-webide.png)

About details of the parameters you can check them on [SAP Web IDE Full-Stack - Connect to ABAP Systems](https://help.sap.com/viewer/825270ffffe74d9f988a0f0066ad59f0/CF/en-US/5c3debce758a470e8342161457fd6f70.html)

```text
WebIDEUsage: odata_abap,odata_gen,ui5_execute_abap,dev_abap,bsp_execute_abap,plugin_repository
```

### Step 2. Use the destination in WebIDE

You can use the destination in your SAP full WebIDE

* Pull project from SAPUI5 ABAP Repository

![SAPCC destination webide](/images/cloud/sapcc/6.webide-pull-bsp.png)

* New Fiori App from OData Service Catalog

![SAPCC destination webide](/images/cloud/sapcc/6.webide-odata.png)

## XSA Destination

[Using HCC Virtual Host in XS Destinations for On-Demand to On-Premise Connectivity](https://help.hana.ondemand.com/help/frameset.htm?0022f78f5d4d4e858c909b2d06286343.html)

// TODO

[1]:https://account.hanatrial.ondemand.com/cockpit
