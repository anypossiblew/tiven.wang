---
layout: post
theme: UbuntuMono
star: true
series: 
  url: sap-cloud-sdk
  title: SAP Cloud SDK
title: "Getting started"
excerpt: ""
modified: 2020-07-15T11:51:25-04:00
categories: articles
tags: [SAP Cloud SDK, SAP]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5666.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/sierra-county-united-states-5666
comments: true
share: true

---

[SAP Cloud SDK](https://sap.github.io/cloud-sdk/)

## SAP Cloud SDK
SAP Cloud SDK 在 SAP Tutorial 教程里已经使用 TypeScript 进行开发了， 我个人也是非常喜欢 TypeScript 强大的类型检查能力和 generic type 能力

要使用 SAP Cloud SDK 开发项目， 像大部分流行的 Js 框架一样首先需要安装命令行工具

`npm install -g @sap-cloud-sdk/cli`

然后再使用命令行工具初始化一个空项目结构

`sap-cloud-sdk init my-sdk-project`

一路 `y` 后等待初始化完成

然后进入项目目录下运行命令启动服务

`npm run start:dev`

访问地址 http://localhost:3000 得到 *Hello World!* 便代表成功了

## Add Business Partner Service

因为 SAP Cloud SDK for JavaScript 内置使用 nestjs 框架，所以项目中可以使用 nest cli 工具生成一些文件. 我们要添加一个 Business Partner 的 controller 就可以使用 nest cli 来生成， 命令如下

`nest g co business-partner`

它会在 src 目录下生成一个 business-partner 的目录， 里面包含一个 controller 文件和其相应的测试文件。 在此 controller 文件中添加一个 get 方法

```typescript
@Get()
getBusinessPartners() {
  return 'We will implement this in a minute.';
}
```

访问链接 *http://localhost:3000/business-partner* 便可以看到返回的消息， 接下来就是要在此方法中实现具体的业务逻辑

要想调用 S4HANA Cloud 相应的功能就需要先添加相应的模块 see [SAP Cloud SDK for JavaScript / TypeScript](https://help.sap.com/doc/9dbcab0600b346c2b359a8c8978a45ba/1.0/en-US/globals.html)

我们要安装 business partner 相关模块 `npm install @sap/cloud-sdk-vdm-business-partner-service`

在 controller 里添加函数

```typescript
function getAllBusinessPartners(): Promise<BusinessPartner[]> {
  return BusinessPartner.requestBuilder()
    .getAll()
    .execute({
      url: 'http://localhost:3000',
    });
}
```

并将 controller 的get 方法改造一下

```typescript
@Get()
getBusinessPartners() {
  return getAllBusinessPartners().catch(error => {
    throw new HttpException(
      `Failed to get business partners - ${error.message}`,
      500,
    );
  });
}
```

重新访问便可以得到一个错误, 就说明我们的程序没问题了, 只是缺少真实的 OData Service

```json
{
  "statusCode": 500,
  "message": "Failed to get business partners - get request to http://localhost:3000/sap/opu/odata/sap/API_BUSINESS_PARTNER failed! \n\"Not Found\""
}
```

## OData Mock Service

使用 [Extending SAP S/4HANA](https://sap.github.io/cloud-s4-sdk-book/pages/mock-odata.html) 中的代码创建一个 OData Mock Service.

下载代码

`git clone https://github.com/SAP/cloud-s4-sdk-book.git`

检出 branch

`git checkout mock-server`

安装依赖包, 如果中途遇到安装报错, 可以去掉一些 dev package 试试

`npm install`

运行程序, 如果需要可以修改默认端口号

`npm start`

重新访问 *http://localhost:3000/business-partner* 便可以拿到数据

## Manage destinations centrally

上面调用的 OData service 地址是写死在程序里, 正式环境不能这样, 可以配置在环境变量中.

在项目根目录下创建文件 *.env* 以下面格式填写相应的 OData Service 系统信息

```text
destinations=[{"name": "<DESTINATIONNAME>", "url": "<URL to your system>", "username": "<USERNAME>", "password": "<PASSWORD>"}]
```

安装 nestjs config 模块

`npm install @nestjs/config`

并加入到项目 module 中

```typescript
import { ConfigModule } from '@nestjs/config';
...

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, BusinessPartnerController],
  providers: [AppService],
})
export class AppModule {}
```

讲 controller 里的调用链接改为

```typescript
function getAllBusinessPartners(): Promise<BusinessPartner[]> {
  return BusinessPartner.requestBuilder()
    .getAll()
    .execute({
      destinationName: 'MockServer'
    });
}
```

重新执行, 结果应该是一样的.
