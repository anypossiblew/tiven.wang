---
layout: post
theme: UbuntuMono
star: true
series: 
  url: sap-cloudfoundry-node
  title: SAP Cloud Foundry Node.js
title: "HANA DB Service"
excerpt: "How to develop HANA DB Artifacts with TypeScript in Node.js Application."
modified: 2019-05-30T11:51:25-04:00
categories: articles
tags: [HANA, SAP Cloud SDK, S/4HANA Cloud, S/4HANA, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5508.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/dronten-netherlands-5508
comments: true
share: true
---

* TOC
{:toc}

本系列文章我们将介绍如何为 SAP S4HANA Cloud 系统开发扩展程序 （Extension App）。本文（项目源代码可下载自 [GitLab sourcecode](https://gitlab.com/i.tiven.wang/s4hana-cloud-sdk-demo/tree/hana)）将介绍如何使用 Cloud Foundry 的 Node.js Application 访问和操作 HANA Database on Cloud。

## Step 1. Setup DB Application

为了创建 HANA 数据库对象，我们需要新建一个 Node.js Application。

1. 在项目根目录下新建文件夹 *db*，并用命令 `npm init -y` 初始化为 npm 项目；
2. 安装组件 *@sap/hdi-deploy* 命令为 `npm i @sap/hdi-deploy`。
> 其实我在本机也没能安装成功此依赖包，并且我也暂时不需要在本地运行此程序，只是为了部署到云 HANA Service 上去，所以我就直接在 *package.json* 配置里加上了依赖
>
```json
"dependencies": {
    "@sap/hdi-deploy": "latest"
}
```
3. 在 *package.json* 配置里添加 Node.js 启动命令，这里是配置了组件 HDI Deployer
```json
"scripts": {
    "start": "node node_modules/@sap/hdi-deploy/deploy.js"
}
```
  更多介绍关于 [HDI Deployer](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/d5bf65e64c85400a8efe7fa824301d4b.html)

至此我们的应用程序 Setup 完成了，可以作为程序用了，接下来我们就要创建 HANA DB Artifacts 内容了。

## Step 2. Setup HDI Container

[Set up the environment required for the deployment](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/1ca64155ec5a465294e0d8b10383cea8.html) to the SAP HANA Deployment Infrastructure (HDI) of an XS advanced application's database artifacts.

在 SAP HDI 里 XS advanced applications 的 design-time artifact 类型是通过 artifact 的文件名后缀（如 `.hdbtable`）区分的。这些类型必须关联相应的 build 插件去做 build 和 deployment 的操作，而这种绑定是通过配置文件 `.hdiconfig` 说明的，所以此配置文件也要一起部署到 HDI container.

在 Cloud Foundry 环境里，service broker 是用来为部署的应用程序创建相应的 HDI Container 的。一个 HDI Container 是一组 schema 和一组 users 的集合，他保证了 database artifacts 的隔离性。从应用程序角度来看，他只是一个  technical user 和一个 schema 。为了向后兼容性，还可以为部署的数据库对象们分配一个 run-time name space，需要定义在 `.hdinamespace` 文件中，也要一起部署到 HDI Container。

### Create HDI container

* 查看 SAP Trial CF 账号里的 HDI service，使用命令 `cf marketplace`

  ```sh
  $ cf marketplace
  Getting services from marketplace in org P..trial_trial / space dev as i.tiven.wang@gmail.com...

  service                         plans                                                                          description
          broker
  ...
  hanatrial                       hdi-shared                                                                     Manage Schemas and HDI Containers on a shared SAP HANA database
          hana-broker-trial
  ...
  TIP: Use 'cf marketplace -s SERVICE' to view descriptions of individual plans of a given service.

  $ cf marketplace -s hanatrial
  service plan   description                        free or paid
  hdi-shared     HDI container on a HANA database   free
  ```

* 创建一个 hanatrial 服务的 hdi-shared 计划的实例
```sh
$ cf create-service hana hdi-shared <myHDIcontainer>
```

* 绑定到应用程序: 用命令行 `cf bind-service <myApplication> <myHDIcontainer>` 或者配置在 *manifest.yml* 文件中

* 为 DB artifacts 绑定 build 插件，默认 DB artifacts 不会绑定到特定某个版本的插件上，所以需要在各应用程序 design time 指定。配置文件 *.hdiconfig* （放在应用 artifacts 的目录下 *db/src/.hdiconfig*）内容如下（完整内容在我的项目源代码中可以找到）
```json
{
  "plugin_version": "2.0.2.0",
  "file_suffixes" : {
    "hdbtable" : {
        "plugin_name" : "com.sap.hana.di.table"},
    "hdbview" : {
        "plugin_name" : "com.sap.hana.di.view"},
    "hdbprocedure" : {
        "plugin_name" : "com.sap.hana.di.procedure"},
    "<hdb_file_suffix_#>" : {
        "plugin_name"   : "<plugin_NAME>",
        "plugin_version": "<local_plugin_VERSION>"}
    }
}
```

* (Optional) 如果需要配置 namespace 可以创建配置文件 *db/src/.hdinamespace* 内容如下
```json
{
    "name"      : "com.sap.hana.example",
    "subfolder" : "<[append | ignore]>"
}
```

## Step 3. Create HANA CDS

[Creating the Data Persistence Artifacts in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/3df01d6380904dfb9d15215fe183e82f.html)

创建 HANA CDS Artifact 文件 *db/src/SALESORDER.hdbcds*

```yaml
entity SALESORDER {
    key ID: Integer64; // corresponds to long type in Java
        LEGACYSALESDOCUMENT: String(255) not null;
        SALESDOCUMENTTYPE: String(255) not null;
        SALESORDERDATE: LocalDate;
        NETVALUE: Decimal(9,2);
        DOCUMENTCURRENCY: String(255);
        SALESORGANIZATION: String(255);
        SHIPTOPARTY: String(255);
        SOLDTOPARTY: String(255);
} technical configuration {
    column store;
}
```

> For XS advanced applications, the CDS document does not require a `namespace` declaration, and some of the `@<Annotations>` (for example, `@Schema` or `@Catalog`) are either not required or are no longer supported. Instead, most of the features covered by the `@<Annotations>` in XS classic can now be defined in the technical configuration section of the entity definition or in the view definition.
{: .Quotes}

> From *SAP HANA 2.0 SPS 01*, it is possible to define multiple top-level artifacts (for example, `contexts`, `entities`, etc.) in a single CDS document. For this reason, you can choose any name for the CDS source file; there is no longer any requirement for the name of the CDS source file to be the same as the name of the top-level artifact.
{: .Notes}

XSA CDS 支持和不支持哪些 Annotations 可以在链接 [CDS Documents in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/c8b9e8fc5a0e4c66bdeb755d2ee6705e.html) 找到。

## Step 4. Deploy

最后我们部署到 SAP Cloud Foundry Platform，如果顺利最后会停在 *Waiting for app to start...*，因为部署是一次性过程，所以部署成功后此 Application 会中断并且不会等到成功信息，不要感觉诧异。

```sh
$ cf push
Waiting for app to start...
```

### Check in Data Explorer

可以在 SAP Cloud Web IDE 的 Data Explorer 插件里查看创建的表 *SALESORDER*。关于 Data Explorer 插件可以参考 [SAP Cloud Foundry XSA - Getting Started # Check in Data Explorer](/articles/sap-cloudfoundry-xsa-getting-started/#check-in-data-explorer)

## Next Steps