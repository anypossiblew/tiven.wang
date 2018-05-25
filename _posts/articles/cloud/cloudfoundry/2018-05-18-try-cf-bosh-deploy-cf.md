---
layout: post
theme: UbuntuMono
title: "Try Cloud Foundry - BOSH: Deploying Cloud Foundry"
excerpt: "Deploying Cloud Foundry with BOSH Lite v2 on AWS"
modified: 2018-05-18T11:51:25-04:00
categories: articles
tags: [BOSH, AWS, Architecture, Cloud Foundry]
image:
  vendor: twitter
  feature: /media/DdKnbEOWAAEYmGK.jpg:large
  credit: Nat Geo Photography‏
  creditlink: https://twitter.com/NatGeoPhotos/status/996042553349885952
comments: true
share: true
references:
  - id: 1
    title: "Deploying Cloud Foundry with BOSH Lite v2"
    url: http://operator-workshop.cloudfoundry.org/labs/deploy-cf/
  - id: 2
    title: "Deploying Cloud Foundry"
    url: https://docs.cloudfoundry.org/deploying/cf-deployment/deploy-cf.html
---

* TOC
{:toc}

上一篇 [Try Cloud Foundry - BOSH: Installation](/articles/try-cf-bosh-installation/) 我们已经成功在 AWS 上安装了 BOSH Lite v2 的系统。

如果上一篇的 Docker Container 还合适则可以直接使用，否则依照下面步骤重新运行一个
```
cd ~/bosh/workspace
git clone https://github.com/cloudfoundry/bosh-deployment.git
git clone https://github.com/cloudfoundry/cf-deployment
cd cf-deployment
git checkout tags/v1.15.0
cd ..
docker run --name my-bosh-cf -it -v %cd%:/usr/local/workspace -w /usr/local/workspace bosh/cli2
```

> 可以参考 [cf-deployment/deployment-guide.md](https://github.com/cloudfoundry/cf-deployment/blob/master/deployment-guide.md)

### Target your BOSH Director
首先需要确保 BOSH 环境设置正确
```
# cd /usr/local/workspace/bosh-deployment
$ export BOSH_ENVIRONMENT=18.188.115.138 \
export BOSH_CA_CERT="$(bosh int creds.yml --path /director_ssl/ca)" \
export BOSH_CLIENT=admin \
export BOSH_CLIENT_SECRET="$(bosh int creds.yml --path /admin_password)" \
export BOSH_GW_HOST=$BOSH_ENVIRONMENT \
export BOSH_GW_USER=vcap \
export BOSH_GW_PRIVATE_KEY=./bosh.pem
# bosh env
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

### Upload a cloud-config
进入 *workspace* 目录
`cd /usr/local/workspace`

因为部署 Cloud Foundry 会在 IaaS 上创建虚拟机，而不同 IaaS 平台的技术参数配置不同，所以在部署前需要设置 IaaS 平台相关的虚拟机技术参数，例如虚拟机类型，硬盘，网络等。我们这里是部署在 BOSH Lite 上，所以直接使用 cf-deployment 项目提供的配置文件 *iaas-support/bosh-lite/cloud-config.yml* 就好了。如果要使用其他的 IaaS 平台，则需要提供具体的参数配置。参考文档 [How to cloud config](https://github.com/cloudfoundry/cf-deployment/blob/master/texts/on-cloud-configs.md)

`bosh update-cloud-config ./cf-deployment/iaas-support/bosh-lite/cloud-config.yml`

### Upload Stemcell
要部署 Cloud Foundry 之前需要先上传 VM image，在 BOSH 里 VM image 叫做 [stemcells][bosh-stemcell]。对于不同的 IaaS, BOSH 提供了不同的 stemcells 可以在 http://bosh.io/stemcells 查找你需要的，他们不同的就两个变量 IaaS(`IAAS_INFO`) 和 Version(`STEMCELL_VERSION`), 例如 GCP 的 IaaS 为 `google-kvm`, 对于 AWS 来说 IaaS 则为 `aws-xen-hvm`，我们这里使用 BOSH Lite warden 作为 IaaS 所以为 `warden-boshlite`。 所以我们创建两个环境变量

```
# export STEMCELL_VERSION=$(bosh int ./cf-deployment/cf-deployment.yml --path '/stemcells/alias=default/version')
# echo $STEMCELL_VERSION
3541.4
# export IAAS_INFO=warden-boshlite
# bosh upload-stemcell "https://bosh.io/d/stemcells/bosh-${IAAS_INFO}-ubuntu-trusty-go_agent?v=${STEMCELL_VERSION}"
Using environment '18.188.115.138' as client 'admin'

Task 1

Task 1 | 08:13:45 | Update stemcell: Downloading remote stemcell (00:00:10)
Task 1 | 08:13:55 | Update stemcell: Extracting stemcell archive (00:00:03)
Task 1 | 08:13:58 | Update stemcell: Verifying stemcell manifest (00:00:00)
Task 1 | 08:13:58 | Update stemcell: Checking if this stemcell already exists (00:00:00)
Task 1 | 08:13:58 | Update stemcell: Uploading stemcell bosh-warden-boshlite-ubuntu-trusty-go_agent/3541.4 to the cloud (00:00:10)
Task 1 | 08:14:08 | Update stemcell: Save stemcell bosh-warden-boshlite-ubuntu-trusty-go_agent/3541.4 (f7bbd517-e4da-49fa-68ee-86958e0676f9) (00:00:00)

Task 1 Started  Fri May 18 08:13:45 UTC 2018
Task 1 Finished Fri May 18 08:14:08 UTC 2018
Task 1 Duration 00:00:23
Task 1 done

Succeeded
# bosh stemcells
Using environment '18.188.115.138' as client 'admin'

Name                                         Version  OS             CPI  CID
bosh-warden-boshlite-ubuntu-trusty-go_agent  3541.4   ubuntu-trusty  -    f7bbd517-e4da-49fa-68ee-86958e0676f9

(*) Currently deployed

1 stemcells

Succeeded
```

准备工作做好，一切就绪，准备部署 Cloud Foundry 到 BOSH Lite on AWS 系统了。

## Deploy CF

参数 `--vars-store deployment-vars.yml` 是存储在部署过程中生成的一些重要变量信息，如管理员的密码，各种 private key，各种 secret。

> https://sslip.io/ 是一个域名服务网站，它可以把带有 IP 地址的域名解析为 IP 地址本身。你还可以选择使用 http://xip.io/

```
# export SYSTEM_DOMAIN=$BOSH_ENVIRONMENT.sslip.io
# bosh -d cf deploy ./cf-deployment/cf-deployment.yml \
  --vars-store deployment-vars.yml \
  -v system_domain=$SYSTEM_DOMAIN \
  -o ./cf-deployment/operations/bosh-lite.yml \
  -o ./cf-deployment/operations/use-compiled-releases.yml  
```

如果不出现错误，则会有很多个 Tasks 并发执行部署任务。部署过程会花一段时间(~20-30 minutes)

```
...
+ manifest_version: v1.15.0

+ name: cf

+ variables: []

Continue? [yN]: Y


Task 25

Task 25 | 08:21:37 | Preparing deployment: Preparing deployment (00:00:02)
Task 25 | 08:21:44 | Preparing package compilation: Finding packages to compile (00:00:00)
Task 25 | 08:21:44 | Creating missing vms: database/a6f1cd4a-35b9-4f1b-b945-651a50765913 (0)
Task 25 | 08:21:44 | Creating missing vms: nats/254d104d-e7eb-4fdf-8c50-ca23b2ce42fe (0)
Task 25 | 08:21:44 | Creating missing vms: uaa/12c72c06-d565-4365-b830-8301d06f8472 (0)
Task 25 | 08:21:44 | Creating missing vms: diego-api/afe36adf-ffeb-4725-950c-c158184ae4f1 (0)
Task 25 | 08:21:44 | Creating missing vms: adapter/b96c0327-4087-4f59-90e7-3901ca872572 (0)
Task 25 | 08:21:44 | Creating missing vms: api/2ce040d9-528d-4496-8e78-df3714b6f405 (0)
Task 25 | 08:21:44 | Creating missing vms: scheduler/30e9ddfc-7acf-429c-b61f-e58195d2b6ef (0)
Task 25 | 08:21:44 | Creating missing vms: router/d9e79486-608c-4ee2-ac04-21613de86467 (0)
Task 25 | 08:21:44 | Creating missing vms: cc-worker/5dc00248-bf31-4d88-91c3-e84f67ba9348 (0)
Task 25 | 08:21:44 | Creating missing vms: diego-cell/fc8cbfe6-b654-4aa7-8b30-eee3642dfe9e (0)
Task 25 | 08:21:44 | Creating missing vms: singleton-blobstore/b7f72f63-425d-40ec-bf66-2733cfc42bc6 (0)
Task 25 | 08:21:44 | Creating missing vms: tcp-router/d0ba5922-2ced-4074-ae52-9e1da18417cb (0)
Task 25 | 08:21:44 | Creating missing vms: consul/1eadd4b0-9531-47fe-a1c2-e7feca544e47 (0)
Task 25 | 08:21:44 | Creating missing vms: doppler/23af64fa-f2cb-4190-a1ac-780aaf2ada76 (0)
Task 25 | 08:21:44 | Creating missing vms: log-api/ef9f7a52-4c49-499a-afb3-de6a4d098213 (0)
Task 25 | 08:22:05 | Creating missing vms: nats/254d104d-e7eb-4fdf-8c50-ca23b2ce42fe (0) (00:00:21)
Task 25 | 08:22:12 | Creating missing vms: database/a6f1cd4a-35b9-4f1b-b945-651a50765913 (0) (00:00:28)
Task 25 | 08:22:12 | Creating missing vms: adapter/b96c0327-4087-4f59-90e7-3901ca872572 (0) (00:00:28)
Task 25 | 08:22:13 | Creating missing vms: uaa/12c72c06-d565-4365-b830-8301d06f8472 (0) (00:00:29)
Task 25 | 08:22:13 | Creating missing vms: scheduler/30e9ddfc-7acf-429c-b61f-e58195d2b6ef (0) (00:00:29)
Task 25 | 08:22:13 | Creating missing vms: cc-worker/5dc00248-bf31-4d88-91c3-e84f67ba9348 (0) (00:00:29)
Task 25 | 08:22:14 | Creating missing vms: consul/1eadd4b0-9531-47fe-a1c2-e7feca544e47 (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: doppler/23af64fa-f2cb-4190-a1ac-780aaf2ada76 (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: singleton-blobstore/b7f72f63-425d-40ec-bf66-2733cfc42bc6 (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: tcp-router/d0ba5922-2ced-4074-ae52-9e1da18417cb (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: log-api/ef9f7a52-4c49-499a-afb3-de6a4d098213 (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: router/d9e79486-608c-4ee2-ac04-21613de86467 (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: diego-api/afe36adf-ffeb-4725-950c-c158184ae4f1 (0) (00:00:30)
Task 25 | 08:22:14 | Creating missing vms: diego-cell/fc8cbfe6-b654-4aa7-8b30-eee3642dfe9e (0) (00:00:30)
Task 25 | 08:22:15 | Creating missing vms: api/2ce040d9-528d-4496-8e78-df3714b6f405 (0) (00:00:31)
Task 25 | 08:22:15 | Updating instance consul: consul/1eadd4b0-9531-47fe-a1c2-e7feca544e47 (0) (canary) (00:00:53)
Task 25 | 08:23:08 | Updating instance nats: nats/254d104d-e7eb-4fdf-8c50-ca23b2ce42fe (0) (canary)
Task 25 | 08:23:08 | Updating instance adapter: adapter/b96c0327-4087-4f59-90e7-3901ca872572 (0) (canary)
Task 25 | 08:23:57 | Updating instance nats: nats/254d104d-e7eb-4fdf-8c50-ca23b2ce42fe (0) (canary) (00:00:49)
Task 25 | 08:23:59 | Updating instance adapter: adapter/b96c0327-4087-4f59-90e7-3901ca872572 (0) (canary) (00:00:51)
Task 25 | 08:23:59 | Updating instance database: database/a6f1cd4a-35b9-4f1b-b945-651a50765913 (0) (canary) (00:02:13)
Task 25 | 08:26:12 | Updating instance diego-api: diego-api/afe36adf-ffeb-4725-950c-c158184ae4f1 (0) (canary) (00:00:55)
Task 25 | 08:27:07 | Updating instance uaa: uaa/12c72c06-d565-4365-b830-8301d06f8472 (0) (canary) (00:01:59)
Task 25 | 08:29:07 | Updating instance singleton-blobstore: singleton-blobstore/b7f72f63-425d-40ec-bf66-2733cfc42bc6 (0) (canary) (00:00:53)
Task 25 | 08:30:00 | Updating instance cc-worker: cc-worker/5dc00248-bf31-4d88-91c3-e84f67ba9348 (0) (canary)
Task 25 | 08:30:00 | Updating instance api: api/2ce040d9-528d-4496-8e78-df3714b6f405 (0) (canary)
Task 25 | 08:31:17 | Updating instance cc-worker: cc-worker/5dc00248-bf31-4d88-91c3-e84f67ba9348 (0) (canary) (00:01:17)
Task 25 | 08:31:57 | Updating instance api: api/2ce040d9-528d-4496-8e78-df3714b6f405 (0) (canary) (00:01:57)
Task 25 | 08:31:57 | Updating instance router: router/d9e79486-608c-4ee2-ac04-21613de86467 (0) (canary) (00:01:12)
Task 25 | 08:33:09 | Updating instance tcp-router: tcp-router/d0ba5922-2ced-4074-ae52-9e1da18417cb (0) (canary) (00:00:51)
Task 25 | 08:34:00 | Updating instance scheduler: scheduler/30e9ddfc-7acf-429c-b61f-e58195d2b6ef (0) (canary) (00:01:03)
Task 25 | 08:35:03 | Updating instance doppler: doppler/23af64fa-f2cb-4190-a1ac-780aaf2ada76 (0) (canary)
Task 25 | 08:35:03 | Updating instance diego-cell: diego-cell/fc8cbfe6-b654-4aa7-8b30-eee3642dfe9e (0) (canary)
Task 25 | 08:35:54 | Updating instance doppler: doppler/23af64fa-f2cb-4190-a1ac-780aaf2ada76 (0) (canary) (00:00:51)
Task 25 | 08:37:03 | Updating instance diego-cell: diego-cell/fc8cbfe6-b654-4aa7-8b30-eee3642dfe9e (0) (canary) (00:02:00)
Task 25 | 08:37:03 | Updating instance log-api: log-api/ef9f7a52-4c49-499a-afb3-de6a4d098213 (0) (canary) (00:00:51)

Task 25 Started  Fri May 18 08:21:37 UTC 2018
Task 25 Finished Fri May 18 08:37:54 UTC 2018
Task 25 Duration 00:16:17
Task 25 done

Succeeded
```

如果部署出现问题，你可以查看虚拟机状态 `bosh vms --details`，如果觉得虚拟机不正确可以删除部署重新来 `bosh delete-deployment`。或者使用检查工具修正一些问题 `bosh cloudcheck`。再不行就从部署 BOSH Lite 开始重新来过。

## Check Deployments

查看我们在 BOSH 上的部署
```
# bosh deployments
Using environment '18.188.115.138' as client 'admin'

Name  Release(s)                   Stemcell(s)                                         Team(s)  Cloud Config
cf    binary-buildpack/1.0.16      bosh-warden-boshlite-ubuntu-trusty-go_agent/3541.4  -        latest
      capi/1.49.0
      cf-mysql/36.10.0
      cf-networking/1.10.0
      cf-smoke-tests/40
      cf-syslog-drain/5.1
      cflinuxfs2/1.187.0
      consul/191
      diego/1.35.0
      dotnet-core-buildpack/2.0.1
      garden-runc/1.11.1
      go-buildpack/1.8.18
      java-buildpack/4.8
      loggregator/101.6
      nats/22
      nodejs-buildpack/1.6.16
      php-buildpack/4.3.48
      python-buildpack/1.6.8
      routing/0.172.0
      ruby-buildpack/1.7.11
      staticfile-buildpack/1.4.21
      statsd-injector/1.2.0
      uaa/55

1 deployments

Succeeded
```
恭喜你已经成功部署了第一个 Cloud Foundry 实例。我们可以看到一个名为 cf 的部署，一堆 [Release][bosh-release] 和一个 [Stemcell][bosh-stemcell]。

> A [release][bosh-release] is a versioned collection of configuration properties, configuration templates, start up scripts, source code, binary artifacts, and anything else required to build and deploy software in a reproducible way.<br>
A release is the layer placed on top of a [stemcell][bosh-stemcell].  

查看 BOSH Lite 里运行的虚拟机
```
# bosh vms
Using environment '18.188.115.138' as client 'admin'

Task 26. Done

Deployment 'cf'

Instance                                                  Process State  AZ  IPs           VM CID                                VM Type        Active
adapter/b96c0327-4087-4f59-90e7-3901ca872572              running        z1  10.244.0.130  f7c0948b-c16a-4d65-6591-af17e6afa298  minimal        -
api/2ce040d9-528d-4496-8e78-df3714b6f405                  running        z1  10.244.0.135  d35a8ad3-7675-4452-76cf-2afaf724831f  small          -
cc-worker/5dc00248-bf31-4d88-91c3-e84f67ba9348            running        z1  10.244.0.136  4ef9924a-292f-4c5e-4311-654ca1d8611d  minimal        -
consul/1eadd4b0-9531-47fe-a1c2-e7feca544e47               running        z1  10.244.0.128  2b415c31-38aa-480b-7b4d-7b41e76a236e  minimal        -
database/a6f1cd4a-35b9-4f1b-b945-651a50765913             running        z1  10.244.0.131  d79c9819-6250-4084-7fcd-5ef27afbc247  small          -
diego-api/afe36adf-ffeb-4725-950c-c158184ae4f1            running        z1  10.244.0.132  f5c324b9-a1bd-4104-5ed4-2c0da86e41b8  small          -
diego-cell/fc8cbfe6-b654-4aa7-8b30-eee3642dfe9e           running        z1  10.244.0.140  c1441df7-06d9-45ee-61cf-434669a80742  small-highmem  -
doppler/23af64fa-f2cb-4190-a1ac-780aaf2ada76              running        z1  10.244.0.139  f8d43671-8f66-4fdf-44e3-9d188e99a892  minimal        -
log-api/ef9f7a52-4c49-499a-afb3-de6a4d098213              running        z1  10.244.0.141  6537c502-e95f-4631-42e1-f395edd4c1bd  minimal        -
nats/254d104d-e7eb-4fdf-8c50-ca23b2ce42fe                 running        z1  10.244.0.129  e9a3d21e-3994-4aea-4494-12e754a01234  minimal        -
router/d9e79486-608c-4ee2-ac04-21613de86467               running        z1  10.244.0.34   b5750612-9787-4d42-5e54-664a949f98aa  minimal        -
scheduler/30e9ddfc-7acf-429c-b61f-e58195d2b6ef            running        z1  10.244.0.138  7de03485-6e66-436e-55a9-338d37baf98c  minimal        -
singleton-blobstore/b7f72f63-425d-40ec-bf66-2733cfc42bc6  running        z1  10.244.0.134  1a59e335-e2b7-4847-7cb4-d95a88d5e4ac  small          -
tcp-router/d0ba5922-2ced-4074-ae52-9e1da18417cb           running        z1  10.244.0.137  950edb1e-a730-4d2c-4842-44742db18fe5  minimal        -
uaa/12c72c06-d565-4365-b830-8301d06f8472                  running        z1  10.244.0.133  fb2cc1d1-38e5-4d34-5596-eb6e8725223b  minimal        -

15 vms

Succeeded
```

上面的 15 个虚拟机简单来说可以对应下面这张 [Cloud Foundry architecture](https://docs.cloudfoundry.org/concepts/architecture/)图的 15 个 Components

![Image: CF Architecture Cloud Foundry Components](https://docs.pivotal.io/pivotalcf/2-1/concepts/images/cf_architecture_block.png)
{: .center}

还可以查看部署过的 manifest 信息
`bosh manifest -d <deployment-name>`

查看 Cloud Foundry 管理员 `admin` 的密码，记下来便于后面 Cloud Foundry CLI 用到

`bosh interpolate --path /cf_admin_password ./deployment-vars.yml`

## Interacting with BOSH clusters
`bosh instances` 和 `bosh vms` 都能查看运行的虚拟机实例

### Scaling Out BOSH

## Pivotal Cloud Foundry on AWS
除了部署原版开源的 Cloud Foundry 到 AWS 外，还可以部署 Pivotal 版的 Cloud Foundry 到 AWS 服务器上。

1. [Configure the Amazon Web Services (AWS) components](https://docs.pivotal.io/pivotalcf/2-1/customizing/pcf-aws-manual-config.html)
2. [Configuring BOSH Director on AWS Installed Manually](https://docs.pivotal.io/pivotalcf/2-1/customizing/pcf-aws-manual-om-config.html)
3. [Manually Configuring PAS for AWS](https://docs.pivotal.io/pivotalcf/2-1/customizing/pcf-aws-manual-er-config.html)

> 暂时没有亲手试验


[bosh-release]:https://bosh.io/docs/release/
[bosh-stemcell]:https://bosh.io/docs/stemcell/
