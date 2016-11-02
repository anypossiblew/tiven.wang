---
layout: post
title: HANA XS2 On-Premise part 2 - Getting Started
excerpt: "HANA XS2 On-Premise part 2 - Getting Started"
modified: 2016-11-01T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "SAP Blog - SAP HANA SPS 11: New Developer Features"
    url: "https://blogs.sap.com/2015/12/08/sap-hana-sps-11-new-developer-features/"
---

* TOC
{:toc}

## Authorization

XS2 使用的是 HANA DB 的用户授权管理，所以如果想要增加开发账号只需增加有一定用户参数的HANA DB User。

### Adding further users

除了安装XS2时自动创建的管理员帐号*XSA_ADMIN*，如需添加另外的用户：创建 HANA Users 并分配 XS roles 给他们（详细参见 [Login with HANA users][1] and [HANA SQL Guide][2]）。下面是使用[SAP HANA HDBSQL Command-Line][3]创建用户，你可以使用其他熟悉的方法创建HANA Users，只不过是要添加User parameters而已。

#### Adding 'admin' users
`$ /usr/sap/XSA/HDB00/exe/hdbsql -i 00 -n localhost:30015 -u SYSTEM -p Toor1234 "CREATE USER NEW_ADMIN PASSWORD \"Welcome1\" SET PARAMETER XS_RC_XS_CONTROLLER_ADMIN = 'XS_CONTROLLER_ADMIN'"`

因为SAP HANA不允许使用初始密码，所以还要更改一下密码

`$ /usr/sap/XSA/HDB00/exe/hdbsql -i 00 -n localhost:30015 -u NEW_ADMIN -p "Welcome1" ALTER USER NEW_ADMIN PASSWORD "Toor1234"`

#### Adding restricted users

`$ /usr/sap/XSA/HDB00/exe/hdbsql -i 00 -n localhost:30015 -u SYSTEM -p Toor1234 "CREATE USER NEW_USER PASSWORD \"Welcome1\" SET PARAMETER XS_RC_XS_CONTROLLER_USER = 'XS_CONTROLLER_USER'"`

`$ /usr/sap/XSA/HDB00/exe/hdbsql -i 00 -n localhost:30015 -u NEW_USER -p "Welcome1" ALTER USER NEW_USER PASSWORD "Toor1234"`

#### Assigning XSA roles

用 XS CLI 登录XS_ADMIN用户，然后给配角色给开发用户

`$ xs set-space-role NEW_USER myorg SAP SpaceDeveloper`

更多详细参见[XS2 Getting Started][4]

### XS2 Admin UI

Granting Controller roles can also be accomplished in the Admin UI ([Application Role Builder][5] and [Organization and Space Management][6])

### Login

登录并选择org and space，`<API_URL>`为`https://<your-hana-host>:3<instance-nr>30`

`$ xs login -a <API_URL>`

## XS2 CLI

### Navigate through orgs and spaces

查看现在的开发环境位置

`$ xs target`

查看当前用户可用的 orgs 和 spaces

```
$ xs orgs
$ xs spaces
```

更改当前使用的 orgs 和 spaces

`$ xs target -o <ORG> -s <SPACE>`

创建新的 orgs 和 spaces

```
$ xs create-org
$ xs create-space
```

### Deploy an Application

像CloudFoundry一样，部署应用用push

```
$ cd <APP_DIRECTORY>
$ xs push <app_name>
```

查看当前运行的应用程序

`$ xs apps`

### Stopping Applications

停止某个应用程序的所有实例

`$ xs stop <app_name>`

重新启动

`$ xs start <app_name>`

删除应用

`$ xs delete <app_name>`



[1]:/docs/xs2/xs2-Login-with-HANA-users.pdf
[2]:http://help.sap.com/saphelp_hanaplatform/helpdata/en/20/d5ddb075191014b594f7b11ff08ee2/content.htm
[3]:https://help.sap.com/saphelp_hanaplatform/helpdata/en/c2/2c67c3bb571014afebeb4a76c3d95d/content.htm
[4]:/docs/xs2/xs2-Getting-Started.pdf
[5]:/docs/xs2/xs2-Application-Role-Builder.pdf
[6]:/docs/xs2/xs2-Org-and-Space-Management.pdf
