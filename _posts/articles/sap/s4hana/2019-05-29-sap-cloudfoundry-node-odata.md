---
layout: post
theme: UbuntuMono
star: true
series: 
  url: sap-cloudfoundry-node
  title: SAP Cloud Foundry Node.js
title: "OData Service in Node.js Application"
excerpt: "How to develop OData Service with TypeScript in Node.js Application."
modified: 2019-05-30T11:51:25-04:00
categories: articles
tags: [OData, SAP Cloud SDK, S/4HANA Cloud, S/4HANA, SAP]
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

本系列文章我们将介绍如何为 SAP S4HANA Cloud 系统开发扩展程序 （Extension App）。在做 SAP （以及 Microsoft, Salesforce 等 ERP）产品时少不了面对 OData Service，那么对于 Node.js 程序怎么样开发 OData 服务呐？本文（项目源代码可下载自 [GitLab sourcecode](https://gitlab.com/i.tiven.wang/s4hana-cloud-sdk-demo/tree/odata)）将介绍使用 [odata-v4-server](https://www.npmjs.com/package/odata-v4-server) 这个组件来开发 OData 服务。

## Step 1. Setup OData v4 Server Module

在 *app* 文件夹内安装 [odata-v4-server](https://www.npmjs.com/package/odata-v4-server) dependencies ：

`npm install odata-v4-server --save`

因为 *odata-v4-server* 会使用到 decorator 语法，所以我们需要更新 TypeScript 配置文件 *tsconfig.json* 去支持此语法

```json
{
  "compilerOptions": {
      ...
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true
  },
  ...
}
```

Node.js 10 已经 Native 支持大部分 ES6 标准语法了，所以我们把编译 target 改成 es6

```json
"compilerOptions": {
  /* Basic Options */
  "target": "es6"
}
```

后面会遇到编译错误:

```
node_modules/odata-v4-server/build/lib/processor.d.ts:21:22 - error TS2415: Class 'ODataProcessor' incorrectly extends base class 'Transform'.
  Property '_flush' is protected in type 'ODataProcessor' but public in type 'Transform'.

21 export declare class ODataProcessor extends Transform {
                        ~~~~~~~~~~~~~~
```

这个的意思是 `ODataProcessor` 类的 `_flush` 不该声明为 **protected** 而应该是父类 `Transform` 里的此方法的 **public** ，不能比父类访问范围小。似乎暂时联系不上此包作者，所以暂时可以用脚本修改这个代码，或者 fork 出来修改项目。脚本修改，在 *package.json* 里加入

```json
 "scripts": {
    "postinstall": "sh scripts/postinstall.sh",
    ...
  },
```

新建脚本文件 *scripts/postinstall.sh* 内容为

```sh
set -e
set -x

sed -i.bak 's/protected _flush/public _flush/' node_modules/odata-v4-server/build/lib/processor.d.ts
```

## Step 2. Coding OData

### Data Interfaces

新建文件 *src/BusinessPartner.ts*

```typescript
export interface BusinessPartner {
    _id?: number;
    firstName?: string;
    lastName?: string;
    fullName?: string;
}

const businessPartners = [
    {
        _id: 1,
        firstName: "Tiven",
        lastName: "Wang",
        fullName: "Tiven Wang"
    },
    {
        _id: 2,
        firstName: "Elon",
        lastName: "Musk",
        fullName: "Elon Musk"
    }
] as BusinessPartner[];

var lastId = 2;

export const findBusinessPartners = () =>
    new Promise<BusinessPartner[]>(resolve => {
        resolve(businessPartners);
    });

export const findOneBusinessPartner = (id: number) =>
    new Promise<BusinessPartner>((resolve, reject) => {
        const bp = businessPartners.find(element => element._id === id);
        if (bp === undefined) {
            reject();
        }
        resolve(bp);
    });

export const insertBusinessPartner = ({ firstName = '', lastName = '' }: BusinessPartner) =>
    new Promise<BusinessPartner>(resolve => {
        lastId += 1;
        const bp = {
            _id: lastId,
            firstName,
            lastName,
            fullName: firstName + " " + lastName
        };
        businessPartners.push(bp);
        resolve(bp);
    });

export const updateBusinessPartner = (id: number, { firstName, lastName }: BusinessPartner) =>
    new Promise((resolve, reject) => {
        const index = businessPartners.findIndex(element => element._id === id);
        if (index === -1) {
            reject();
            return;
        }
        const prevBP = businessPartners[index];
        const bp = {
            _id: prevBP._id,
            firstName: firstName !== undefined ? firstName : prevBP.firstName,
            lastName: lastName !== undefined ? lastName : prevBP.lastName,
            fullName: firstName + " " + lastName,
        };
        businessPartners[index] = bp;
        resolve();
    });

export const deleteBusinessPartner = (id: number) =>
    new Promise((resolve, reject) => {
        const index = businessPartners.findIndex(element => element._id === id);
        if (index === -1) {
            reject();
            return;
        }
        businessPartners.splice(index, 1);
        resolve();
    });
```

这个代码实现了一个实体 `BusinessPartner` 和其相应的 CRUD 操作函数，为了简单起见没有使用数据库持久化存储数据，而是直接使用了个数组，后续我们会介绍使用数据库服务做持久化等操作。

因为真实使用数据库时 CRUD 一般会是异步操作，所以这里我们使用 Promises 来模拟异步功能。

### OData Service Implementation

#### Models

创建 OData 的 Models ，文件为 *src/MyODataServer/models/BusinessPartner.ts*

```typescript
import { Edm } from 'odata-v4-server';
import { BusinessPartner as IBP } from '../../BusinessPartner'

export default class BusinessPartner implements IBP {
  
  @Edm.Key
  @Edm.Int32
  public _id?: number;

  @Edm.String
  public firstName?: string;

  @Edm.String
  public lastName?: string;

  @Edm.String
  public fullName?: string;
}
```

此类就代表了 OData 里的 **Entity** `BusinessPartner`

#### Controller

创建 Controller 文件 *src/MyODataServer/controllers/BusinessPartnersController.ts*

```typescript
import { odata, ODataController } from 'odata-v4-server';
import { deleteBusinessPartner, findOneBusinessPartner, findBusinessPartners, insertBusinessPartner, updateBusinessPartner } from '../../BusinessPartner';
import BusinessPartner from '../models/BusinessPartner';

@odata.type(BusinessPartner)
export default class BusinessPartnersController extends ODataController {

  @odata.GET
  public async find(): Promise<BusinessPartner[]> {
    const bps = await findBusinessPartners();
    return bps;
  }

  @odata.GET
  public async findOne(@odata.key id: number): Promise<BusinessPartner> {
    const bps = await findOneBusinessPartner(id);
    return bps;
  }

  @odata.POST
  public async insert(@odata.body body: any): Promise<BusinessPartner> {
    // BUG: CANNOT BE EMPTY OBJECT
    const bps = await insertBusinessPartner(body);
    return bps;
  }

  @odata.PATCH
  public async update(@odata.key id: number, @odata.body body: any) {
    // BUG: CANNOT BE EMPTY OBJECT
    await updateBusinessPartner(id, body);
  }

  @odata.DELETE
  public async remove(@odata.key id: number) {
    await deleteBusinessPartner(id);
  }
}
```

此 Controller 继承了 `ODataController` 实现了基本的 HTTP Operators，调用了模拟访问数据库读写数据的操作

#### Module Export

最后定义一个文件夹或者叫 Module 的默认输出，文件为 *src/MyODataServer/index.ts*

```typescript
import { odata, ODataServer } from 'odata-v4-server';
import BusinessPartnersController from './controllers/BusinessPartnerController';

@odata.namespace('My')
@odata.controller(BusinessPartnersController, true)
export default class MyODataServer extends ODataServer {}
```

## Step 3. Routing

最后把我们的 OData Server 添加到 Express 路由里发布出去

```typescript
...

import MyODataServer from './MyODataServer';

...

app.use('/odata', MyODataServer.create());

app.listen(appEnv.port || port, appEnv.bind, () => {
  console.log("Express server listening on port " + appEnv.url);
});

export default app;
```

## Step 4. Testing

运行命令启动应用 `npm run start:local`, 然后访问链接 *<your-host>/odata/$metadata* 便是我们开发的 OData Service。

## Wrap Up

对于这种个人开发的程序包使用起来感受确实不好。建议如果是 SAP 产品开发要用 OData 服务还是考虑使用 [SAP Cloud Foundry XSA](http://tiven.wang/articles/sap-cloudfoundry-xsa-getting-started/) 去开发。