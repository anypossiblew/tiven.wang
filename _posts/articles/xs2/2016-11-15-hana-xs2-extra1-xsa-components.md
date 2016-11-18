---
layout: post
title: HANA XS2 On-Premise extra 1 - XS Advanced Model Components
excerpt: "HANA XS2 On-Premise extra 1 - How to maintain and manage the various components of the SAP HANA XS Advanced Model (XS advanced) run-time environment."
modified: 2016-11-15T17:00:00-00:00
categories: articles
tags: [XS2, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
references:
  - title: "SAP Help - Maintaining the SAP HANA XS Advanced Model Run Time"
    url: "http://help.sap.com/saphelp_hanaplatform/helpdata/en/6d/dec3d5f3494e28a5aff6ee60e3554e/frameset.htm"
  - title: "SAP Help - Installing and Updating Products and Software Components in SAP HANA XS Advanced Model"
    url: "http://help.sap.com/saphelp_hanaplatform/helpdata/en/a9/c21ff1c919441d9fdd6e7d90f63159/frameset.htm"

---

* TOC
{:toc}

How to maintain and manage the various components of the SAP HANA XS Advanced Model (XS advanced) run-time environment.

## Product Installer

login with **_XSA\_AMDIN_** and deploy product-installer

`xs deploy <xsa_root>\installdata\apps\product-installer\product-installer.mtar`

If occur an error in installing, you can undeploy a multi-target app using

List all multi-target apps
`xs mtas`

Undeploy a multi-target app
`xs undeploy <multi-target app id>`

## XSA Admin Tools

`xs install <xsa_root>\installdata\apps\admin\admin.zip`

## DevX Installation

This page describes the required steps to install /deploy/ redeploy DevX over XSA

### HRTT

First, need download and install **_hrtt_** from *<repository>/com/sap/xsa/hrtt/sap-xsac-hrtt/*

* Login to XS by running: `xs-admin-login`

> According to the XSA version you have installed you might be prompted for the xs admin user password.

* Download HRTT: According to the version you need, download the relevant sap-xsac-hrtt\<version\>.zip file from nexus:  *http://nexus.wdf.sap.corp:8081/nexus/content/repositories/build.milestones/com/sap/xsa/hrtt/sap-xsac-hrtt*
For example run: `wget http://nexus.wdf.sap.corp:8081/nexus/content/repositories/build.snapshots/com/sap/xsa/hrtt/sap-xsac-hrtt/<version>/sap-xsac-hrtt-<version>.zip --no-proxy`

* Install HRTT by running: `xs install <sap-xsac-hrtt-zip> -o ALLOW_SC_SAME_VERSION`

>  the -o flag is relevant from SP12 onwards only.

> If you don't have product installer, you can use `xs deploy <sap-xsac-hrtt>.mtar`, the .mtar file is a [MTA archive = *.mtar file][1]

### DI and WEBIDE

Download and install devx from here *<repository>/com/sap/devx/sap-xsac-devx/*

`xs install sap-xsac-devx-4.0.8.zip -e sap-xsac-devx-4.0.8.mtaext`

## UAA Command Line Interface

*http://docs.cloudfoundry.org/adminguide/uaa-user-management.html*

`gem install cf-uaac --source http://rubygems.org`

`uaac target http://localhost:8080/uaa-security`

[1]:http://help.sap.com/saphelp_hanaplatform/helpdata/en/a9/c21ff1c919441d9fdd6e7d90f63159/frameset.htm
[2]:http://help.sap.com/saphelp_hanaplatform/helpdata/en/6d/dec3d5f3494e28a5aff6ee60e3554e/frameset.htm
