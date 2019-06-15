---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: "BOSH: Installation"
excerpt: "How to install BOSH Lite on AWS"
modified: 2018-05-14T11:51:25-04:00
categories: articles
tags: [BOSH, Architecture, Cloud Foundry]
image:
  vendor: twitter
  feature: /media/DdFCbbtWsAAOVUN.jpg:large
  credit: 500px
  creditlink: https://twitter.com/500px/status/995650034648731648
comments: true
share: true
references:
  - id: 1
    title: "Install BOSH CLI on Amazon Web Services"
    url: https://bosh.io/docs/init-aws/
  - id: 2
    title: "Bootstrap BOSH 2.0 on AWS"
    url: https://starkandwayne.com/blog/bootstrap-bosh-2-0-on-aws/
  - id: 3
    title: "Deploying BOSH Lite v2 on AWS"
    url: http://operator-workshop.cloudfoundry.org/labs/deploy-bosh/
  - id: 4
    title: "Cloud Foundry - Training & Tutorials"
    url: https://www.cloudfoundry.org/trainings
---

* TOC
{:toc}

BOSH is PCF’s infrastructure management component.

BOSH is an open source tool for release engineering, deployment, lifecycle management, and monitoring of distributed systems.

![Image: Cloud Foundry BOSH CF Architecture](/images/cloud/cf/cloudfoundry-bosh-cloudfoundry-architecture.png "Cloud Foundry BOSH CF Architecture")
{: .middle.center}

## Install BOSH CLI

[BOSH Command Line Interface (CLI)](https://bosh.io/docs/cli-v2/) 是执行 BOSH 指令的客户端命令行工具，我们需要安装它来操作 BOSH 的服务端服务。
按照文档 [Install](http://bosh.io/docs/cli-v2/#install) 来安装 BOSH CLI 。

下载安装包进行安装，然后检查 BOSH CLI 版本来确保安装正确

```
$ bosh -v
version 3.0.1-712bfd7-2018-03-13T23:26:43Z

Succeeded
```

### BOSH CLI on Windows
BOSH CLI 暂不完全支持 Windows 系统，如果你是在 Windows 系统上开发，可以选择使用 Docker VM 运行 BOSH 命令行工具，如下

```
$ cd ~/bosh/workspace
$ git clone https://github.com/cloudfoundry/bosh-deployment.git
$ docker run --name my-bosh-cli -it -v ~/bosh/workspace:/usr/local/workspace -w /usr/local/workspace/bosh-deployment bosh/cli2

root@2840e0a0fb42:/usr/local/workspace/bosh-deployment# bosh -v
version 3.0.1-712bfd7-2018-03-13T23:26:43Z

Succeeded
```

#### Ubuntu on Windows
最新的 Windows 版本支持运行各种 Linux 系统例如 Ubuntu，那么我们可以在此 Ubuntu 环境中使用 BOSH CLI 工具了。



## Install BOSH

BOSH Director 是指 BOSH 服务端的管理器，负责管理 BOSH 内的虚拟机 VMs 。 现在是做练习，所以使用简化版的 BOSH 软件 - BOSH Lite v2 。我们使用 AWS 环境来做练习。

### AWS Setup
注册 AWS 账号，填写支付方式信息，可以选择 free 账号类型，然后登录控制台。

从 `AWS Console` 界面打开 `VPC Dashboard`，新建 VPC 。

> Amazon VPC (VPN Connection) enables you to use your own isolated resources within the AWS cloud, and then connect those resources directly to your own datacenter using industry-standard encrypted IPsec VPN connections.

1. 打开 `Your VPCs` 界面，点击 `Create VPC` 按钮新建一个 VPC：<br>
  Name tag: `bosh`<br>
  IPv4 CIDR block\*: `10.0.0.0/16`<br>
  IPv6 CIDR block\*: `Amazon provided IPv6 CIDR block`<br>
  Tenancy: `Default`<br>
  ![Images: AWS VPC Create step 1](/images/cloud/cf/bosh/aws-vpc-create1.png)
2. 在 VPCs 列表中选中刚建的 VPC `bosh` , 点击 `Actions`-\>`Edit DNS Hostnames`
  ![Images: AWS VPC Create step 2](/images/cloud/cf/bosh/aws-vpc-create2.png)
3. 打开 `Subnets` 界面，点击 `Create Subnet` 按钮新建一个 Subnet:<br>
  Name tag: `public`<br>
  VPC: 选择刚建的 `bosh`<br>
  Availability Zone: 选择一个或者让系统自动分配<br>
  IPv4 CIDR block: `10.0.0.0/24`<br>
  创建完成后记下 `Subnet ID` 和 `Availability zone` 的值后面会用到<br>
  ![Images: AWS VPC Create step 3](/images/cloud/cf/bosh/aws-vpc-create3.png)
4. 打开 `Internet Gateways` 界面，新建一个 internet gateway 并把它 attach 到刚建的 VPC 上。
5. 打开 `Elastic IPs` 界面，点击 `Allocate new address` 按钮，在弹出对话框点击 `Allocate` 后创建成功记下 `Elastic IP` 的值，后面要用到。
6. 打开 `AWS Console` 然后选择 `EC2` 打开 `EC2 Dashboard` 界面，点击 `SECURITY -> Key Pairs` 打开界面，然后点击 `Create Ket Pair` 按钮新建一个 Key Pair <br>
  Key pair name: `bosh`<br>
  新建完成后系统会自动下载一个文件 `bosh.pem` ，保存好。
7. 打开 `NETWORK & SECURITY -> Scurity Group` 界面，点击 `Create Security Group` 按钮新建一个<br>
  Security group name: `bosh`<br>
  Description: `BOSH deployed VMs`<br>
  VPC: 选择刚建的 VPC `bosh`<br>
  完成后编辑刚建的 Security Group 在 `Inbound` 部分添加 Rule

  Type | Port Range | Source
  ---- | ---------- | ------
  SSH | 22 | my IP
  Custom TCP Rule | 6868 | my IP
  Custom TCP Rule | 25555 | my IP
  All Traffic | All | *id of your security group*

  ![Images: AWS VPC Create step 6](/images/cloud/cf/bosh/aws-vpc-create6.png)

### Deploying the Director
下载部署 BOSH Director 的模板项目

`git clone https://github.com/cloudfoundry/bosh-deployment.git`

#### Docker CLI2

`docker run --name my-bosh-cli -it -v %cd%:/usr/local/bosh-deployment -w /usr/local/bosh-deployment bosh/cli2`

如果你的电脑网络需要使用到 Proxy 则可以加入参数（像国内用户访问 *s3.amazonaws.com* 速度慢这样的问题）：
```
docker run --name my-bosh-cli -it \
  -e "http_proxy=http://proxy.com:8080" \
  -e "https_proxy=http://proxy.com:8080" \
  -v %cd%:/usr/local/bosh-deployment \
  -w /usr/local/bosh-deployment \
  bosh/cli2
```

以下命令都是基于 work folder `/usr/local/bosh-deployment` 运行的。

#### Create Environment
`bosh create-env` 命令创建或者更新一个 BOSH 环境即 BOSH 服务平台。*bosh.yml* 是主配置文件，可以使用 `-o` 参数代表的 [Operations file][cli-ops-files] 覆盖他前面的配置。还可以使用 `-v` 参数指定配置中变量的值。

根据你要部署的目标 IaaS 平台的不同，可以选择不同平台的配置文件，例如我们选择 *aws/cpi.yml* 覆盖默认的 [CPI (Cloud Provider Interface)][bosh-cpi] 配置。

*bosh-lite.yml* 定义了 BOSH Lite 版本，*bosh-lite-runc.yml* 则是为 BOSH Lite 指定用 [Garden-runC][garden-runc] 做容器管理。

剩下了就是指定平台具体的参数信息。

```
# cd bosh-deployment
# bosh create-env bosh.yml \
    --state=state.json \
    --vars-store=creds.yml \
    -o aws/cpi.yml \
    -o bosh-lite.yml \
    -o bosh-lite-runc.yml \
    -o jumpbox-user.yml \
    -o external-ip-with-registry-not-recommended.yml \
    -v director_name=$DIRECTOR_NAME \
    -v internal_cidr=$INTERNAL_CIDR \
    -v internal_gw=$INTERNAL_GW \
    -v internal_ip=$INTERNAL_IP \
    -v access_key_id=$AWS_ACCESS_KEY_ID \
    -v secret_access_key=$AWS_SECRET_ACCESS_KEY \
    -v region=$AWS_DEFAULT_REGION \
    -v az=$AZ \
    -v default_key_name=$DEFAULT_KEY_NAME \
    -v default_security_groups=[bosh] \
    --var-file private_key=<path/to/private/key> \
    -v subnet_id=$SUBNET_ID \
    -v external_ip=$EXTERNAL_IP
```

例如本文的技术参数如下
```
bosh create-env bosh.yml
    --state=state.json
    --vars-store=creds.yml
    -o aws/cpi.yml
    -o bosh-lite.yml
    -o bosh-lite-runc.yml
    -o jumpbox-user.yml
    -o external-ip-with-registry-not-recommended.yml
    -v director_name=bosh-1
    -v internal_cidr=10.0.0.0/24
    -v internal_gw=10.0.0.1
    -v internal_ip=10.0.0.6
    -v access_key_id=AKIAIJGGGCZSU5Q2GZKA
    -v secret_access_key=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
    -v region=us-east-2
    -v az=us-east-2a
    -v default_key_name=bosh
    -v default_security_groups=[bosh]
    --var-file private_key=bosh.pem
    -v subnet_id=subnet-07a46ed04003eb6f2
    -v external_ip=18.188.115.138
```

如果 Compile 过程中出现这样的错误，需要安装相应组件
error:
automake-1.14: command not found

solution:
`apt-get install automake-1.14`

> 类似地我还遇到了需要安装的 `apt-get install bison`, 在安装过程中经常需要重试，所以这样的操作最好写入到 *Dockerfile* 创建一个自己的 Docker Image 。


Output:
```
root@9e6cf27cdd90:/usr/local/bosh-deployment# bosh create-env bosh.yml --state=state.json --vars-store=creds.yml -o aws/cpi.yml -o bosh-lite.yml -o bosh-lite-runc.yml -o jumpbox-user.yml -o external-ip-with-registry-not-recommended.yml -v director_name=bosh-1 -v internal_cidr=10.0.0.0/24 -v internal_gw=10.0.0.1 -v internal_ip=10.0.0.6 -v access_key_id=AKIAIJGGGCZSU5Q2GZKA -v secret_access_key=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 -v region=us-east-2 -v az=us-east-2a -v default_key_name=bosh -v default_security_groups=[bosh] --var-file private_key=bosh.pem -v subnet_id=subnet-07a46ed04003eb6f2 -v external_ip=18.188.115.138
Deployment manifest: '/usr/local/bosh-deployment/bosh.yml'
Deployment state: 'state.json'

Started validating
  Downloading release 'bosh'... Skipped [Found in local cache] (00:00:00)
  Validating release 'bosh'... Finished (00:00:03)
  Downloading release 'bosh-aws-cpi'... Finished (00:08:11)
  Validating release 'bosh-aws-cpi'... Finished (00:00:01)
  Downloading release 'bosh-warden-cpi'... Finished (00:06:36)
  Validating release 'bosh-warden-cpi'... Finished (00:00:03)
  Downloading release 'os-conf'... Finished (00:00:18)
  Validating release 'os-conf'... Finished (00:00:00)
  Downloading release 'garden-runc'... Finished (00:10:22)
  Validating release 'garden-runc'... Finished (00:00:04)
  Validating cpi release... Finished (00:00:00)
  Validating deployment manifest... Finished (00:00:00)
  Downloading stemcell... Finished (00:00:03)
  Validating stemcell... Finished (00:00:00)
Finished validating (00:25:48)

Started installing CPI
  Compiling package 'ruby-2.4-r3/8471dec5da9ecc321686b8990a5ad2cc84529254'...
```

Compiling package 需要一段时间。

> 编译过程中如果遇到 `tar ruby...` 命令失败，有一个原因可能是你使用了共享文件夹来作为 *.bosh* 目录

```
Started installing CPI
  Compiling package 'ruby-2.4-r3/8471dec5da9ecc321686b8990a5ad2cc84529254'... Finished (00:02:05)
  Compiling package 'bosh_aws_cpi/a67efa0a30b5df5bf8c88d7bcfe880f8cab0dc34'... Finished (00:00:02)
  Installing packages... Finished (00:00:00)
  Rendering job templates... Finished (00:00:00)
  Installing job 'aws_cpi'... Finished (00:00:00)
Finished installing CPI (00:02:09)

Starting registry... Finished (00:00:00)
Uploading stemcell 'bosh-aws-xen-hvm-ubuntu-trusty-go_agent/3541.10'... Finished (00:00:07)

Started deploying
  Creating VM for instance 'bosh/0' from stemcell 'ami-57ebda32 light'... Failed (00:03:16)
Failed deploying (00:03:16)
// 有错误发生
Stopping registry... Finished (00:00:00)
Cleaning up rendered CPI jobs... Finished (00:00:00)
```

如果出现这样的错误，说明你的 AWS 服务可能没有设置好
```
Starting SSH tunnel:
          Failed to connect to remote server:
            dial tcp 18.188.115.138:22: getsockopt: connection refused
```
可以尝试使用工具直接去连接你的 AWS 服务，参考以下链接：

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html

连接时可能会出现的问题：

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/TroubleshootingInstancesConnecting.html#TroubleshootingInstancesConnectionTimeout

例如：
* Security groups 里的 Inbound rule 要适当放开限制，能让你的电脑连接上
* 需要在 Route Table 里添加记录 `0.0.0.0/0 -> your internet gateway`


安装成功的输出结果如下
```
Started installing CPI
  Compiling package 'ruby-2.4-r3/8471dec5da9ecc321686b8990a5ad2cc84529254'... Finished (00:00:00)
  Compiling package 'bosh_aws_cpi/a67efa0a30b5df5bf8c88d7bcfe880f8cab0dc34'... Finished (00:00:00)
  Installing packages... Finished (00:00:00)
  Rendering job templates... Finished (00:00:00)
  Installing job 'aws_cpi'... Finished (00:00:00)
Finished installing CPI (00:00:00)

Starting registry... Finished (00:00:00)
Uploading stemcell 'bosh-aws-xen-hvm-ubuntu-trusty-go_agent/3541.10'... Skipped [Stemcell already uploaded] (00:00:00)

Started deploying
  Waiting for the agent on VM 'i-0ceba89986919895f'... Failed (00:00:12)
  Deleting VM 'i-0ceba89986919895f'... Finished (00:00:49) // 因为是遇到错误后重复执行，所以会删除重来
  Creating VM for instance 'bosh/0' from stemcell 'ami-57ebda32 light'... Finished (00:00:40)
  Waiting for the agent on VM 'i-02230157d07eaa796' to be ready... Finished (00:00:32)
  Creating disk... Finished (00:00:15)
  Attaching disk 'vol-0868564d622c1eeab' to VM 'i-02230157d07eaa796'... Finished (00:00:29)
  Rendering job templates... Finished (00:00:04)
  Compiling package 'golang/d0d1b2a5863243f82a949288cef9a3d5fc9d000e9be2904aea6d04650a0149b0'... Skipped [Package already compiled] (00:06:18)
  Compiling package 'apparmor/3789c10fa8ef4349f58badae51723eec7855d59b9bb6c1bb7ee21a264fae1dbb'... Skipped [Package already compiled] (00:00:09)
  Compiling package 'libseccomp/0594acc533fd2801a347d6b725d0db9f3591c583d06f1e53201e701b12e09824'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'golang-1.10-linux/48c842421b6f05acf88dc6ec17f7574dade28a86'...
 Skipped [Package already compiled] (00:43:36)
  Compiling package 'ruby-2.4-r3/8471dec5da9ecc321686b8990a5ad2cc84529254'... Finished (00:02:15)
  Compiling package 'ruby-2.4-r3/8471dec5da9ecc321686b8990a5ad2cc84529254'... Skipped [Package already compiled] (00:00:03)
  Compiling package 'mysql/b7e73acc0bfe05f1c6cbfd97bf92d39b0d3155d5'... Skipped [Package already compiled] (00:00:04)
  Compiling package 'libpq/3afb51e921e950abb31e5d039d2144591a41482d'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'guardian/d6db6a35ccdab8f813b3aabde4bc09400aef1a994879a65e8d67299ab720b87e'... Skipped [Package already compiled] (00:00:14)
  Compiling package 'verify_multidigest/8fc5d654cebad7725c34bb08b3f60b912db7094a'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'runc/0de96bc356b3bb61592a2a4bddcfe1123086b589708e0b2b8f609e1b10066e90'... Skipped [Package already compiled] (00:00:19)
  Compiling package 'iptables/85ef0fef60ac079fb75b36d0693cce704a662b23b0727c824f15d58713476f13'... Skipped [Package already compiled] (00:00:03)
  Compiling package 'warden_cpi/5a07ecf85c489cd4c32ae26d3092513027e14b86'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'nginx/3518a530de39c41ec65abf1194c27aadae23b711'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'busybox/eab1896633e23c0eea7e07b91b27c2c090d16efd7fe07de1adbd8e5a1b16578e'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'davcli/2672d0a96a775f5252fef6ac7bbab3928aa41599'... Skipped [Package already compiled] (00:00:10)
  Compiling package 'bosh-gcscli/fce60f2d82653ea7e08c768f077c9c4a738d0c39'... Skipped [Package already compiled] (00:00:03)
  Compiling package 'bosh_aws_cpi/a67efa0a30b5df5bf8c88d7bcfe880f8cab0dc34'... Finished (00:00:06)
  Compiling package 'health_monitor/a0b5a680f1cbfda4a17b2fedff93cc9b9d9d959c'... Skipped [Package already compiled] (00:00:30)
  Compiling package 's3cli/b6e38c619dd5575e16ea9fcabc4b7c500effdd26'... Skipped [Package already compiled] (00:00:03)
  Compiling package 'tar/1de08f190630baf01c0741c86773a02f7c88c2786db1f219152e46e8853f1ccc'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'director/0d042598ac5a6964d7de6b19b38a0d625386a8d6'... Skipped [Package already compiled] (00:00:27)
  Compiling package 'postgres-9.4/52b3a31d7b0282d342aa7a0d62d8b419358c6b6b'... Skipped [Package already compiled] (00:00:05)
  Compiling package 'gonats/73ec55f11c24dd7c02288cdffa24446023678cc2'... Skipped [Package already compiled] (00:00:02)
  Compiling package 'garden-idmapper/557e57eeae91fc614b4d4e2ccf2440a93e725ed0b6a895a35fe8d94d2c764fa2'... Skipped [Package already compiled] (00:00:03)
  Compiling package 'registry/e0462a5453f9d3ce862a89dd4bf882bb72820451'... Skipped [Package already compiled] (00:00:16)
  Updating instance 'bosh/0'... Finished (00:00:28)
  Waiting for instance 'bosh/0' to be running... Finished (00:00:12)
  Running the post-start scripts 'bosh/0'... Finished (00:00:02)
Finished deploying (00:59:19)

Stopping registry... Finished (00:00:00)
Cleaning up rendered CPI jobs... Finished (00:00:00)

Succeeded
```

配置 BOSH 环境

```
export BOSH_ENVIRONMENT=$EXTERNAL_IP
export BOSH_CA_CERT="$(bosh int creds.yml --path /director_ssl/ca)"
export BOSH_CLIENT=admin
export BOSH_CLIENT_SECRET="$(bosh int creds.yml --path /admin_password)"
export BOSH_GW_HOST=$BOSH_ENVIRONMENT
export BOSH_GW_USER=vcap
export BOSH_GW_PRIVATE_KEY=<path/to/private/key>
```

输出以下环境变量
```
export BOSH_ENVIRONMENT=18.188.115.138
export BOSH_CA_CERT="$(bosh int creds.yml --path /director_ssl/ca)"
export BOSH_CLIENT=admin
export BOSH_CLIENT_SECRET="$(bosh int creds.yml --path /admin_password)"
export BOSH_GW_HOST=$BOSH_ENVIRONMENT
export BOSH_GW_USER=vcap
export BOSH_GW_PRIVATE_KEY=./bosh.pem
```

执行命令 `bosh env` 出现以下类似结果则可以继续往下安装 CloudFoundry 了。
```
Using environment '18.188.115.138' as client 'admin'

Name      bosh-1
UUID      a367a981-1842-4a84-ad7c-3faf14e96457
Version   265.2.0 (00000000)
CPI       warden_cpi
Features  compiled_package_cache: disabled
          config_server: disabled
          dns: disabled
          snapshots: disabled
User      admin

Succeeded
```

至此，BOSH Lite 版本的 System 安装在 AWS 上的任务便完成了，接下来便是在 BOSH 容器管理系统上安装 CloudFoundry 云系统。

## Scaling Out





[cli-ops-files]:https://bosh.io/docs/cli-ops-files/
[bosh-cpi]:https://bosh.io/docs/terminology/#cpi
[garden-runc]:https://github.com/cloudfoundry/garden-runc-release
