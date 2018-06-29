---
layout: post
theme: UbuntuMono
title: "BOSH - Installation on Google Cloud Platform"
excerpt: "Installing BOSH on Google Cloud Platform"
modified: 2018-06-28T11:51:25-04:00
categories: articles
tags: [BOSH, Cloud Foundry, Cloud]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1394.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/ad-dahirah-qatar-1394
comments: true
share: true
references:
  - id: 1
    title: "Deploy BOSH on Google Cloud Platform"
    url: https://github.com/cloudfoundry-incubator/bosh-google-cpi-release/tree/master/docs/bosh
  - id: 2
    title: "Deploying BOSH on GCP"
    url: https://docs.cloudfoundry.org/deploying/cf-deployment/gcp.html
  - id: 3
    title: "Cloud Foundry BOSH Installation on Google Cloud Platform"
    url: https://bosh.io/docs/init-google/
  - id: 4
    title: "Bootstrap BOSH 2.0 on Google"
    url: https://starkandwayne.com/blog/p/8fc7f130-2b89-4f91-807f-8840a046bc78/
---


* TOC
{:toc}

### BOSH CLI
首先你需要一个 BOSH CLI 工具才能创建和操作 BOSH Platform

https://bosh.io/docs/bosh-lite/

Ubuntu on Windows
```
tiven@PVGN50938586A:~$ curl -o ./Downloads/bosh-cli-3.0.1-linux-amd64 https://s3.amazonaws.com/bosh-cli-artifacts/bosh-c
li-3.0.1-linux-amd64
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 26.3M  100 26.3M    0     0  44774      0  0:10:17  0:10:17 --:--:-- 86886
tiven@PVGN50938586A:~$ chmod +x ~/Downloads/bosh-cli-*
tiven@PVGN50938586A:~$ sudo mv ~/Downloads/bosh-cli-* /usr/local/bin/bosh
tiven@PVGN50938586A:~$ bosh -v
version 3.0.1-712bfd7-2018-03-13T23:26:43Z

Succeeded
```

### gcloud cli

安装 gCloud CLI
```
# Create environment variable for correct distribution
export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"

# Add the Cloud SDK distribution URI as a package source
echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Import the Google Cloud Platform public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

# Update the package list and install the Cloud SDK
sudo apt-get update && sudo apt-get install google-cloud-sdk
```

https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu

初始化 gCloud CLI
```
$ gcloud init
# ...
Your project default Compute Engine zone has been set to [us-west1-a].
You can change it by running [gcloud config set compute/zone NAME].

Your project default Compute Engine region has been set to [us-west1].
You can change it by running [gcloud config set compute/region NAME].

Created a default .boto configuration file at [/home/tiven/.boto]. See this file and
[https://cloud.google.com/storage/docs/gsutil/commands/config] for more
information about configuring Google Cloud Storage.
Your Google Cloud SDK is configured and ready to use!

* Commands that require authentication will use anypossible.w@gmail.com by default
* Commands will reference project `try-cloud-foundry` by default
* Compute Engine commands will use region `us-west1` by default
* Compute Engine commands will use zone `us-west1-a` by default

Run `gcloud help config` to learn how to change individual settings

This gcloud configuration is called [default]. You can create additional configurations if you work with multiple accounts and/or projects.
Run `gcloud topic configurations` to learn more.

Some things to try next:

* Run `gcloud --help` to see the Cloud Platform services you can interact with. And run `gcloud help COMMAND` to get help on any gcloud command.
* Run `gcloud topic -h` to learn about advanced features of the SDK like arg files and output formatting
```
### IAM Service Account



```
docker run --name my-bosh-cli -it -v ${$pwd}:/usr/local/vbox -w /usr/local/vbox  bosh/cli2
```

```
bosh create-env ./bosh-deployment/bosh.yml \
  --state ./state.json \
  -o ./bosh-deployment/virtualbox/cpi.yml \
  -o ./bosh-deployment/virtualbox/outbound-network.yml \
  -o ./bosh-deployment/bosh-lite.yml \
  -o ./bosh-deployment/bosh-lite-runc.yml \
  -o ./bosh-deployment/uaa.yml \
  -o ./bosh-deployment/credhub.yml \
  -o ./bosh-deployment/jumpbox-user.yml \
  --vars-store ./creds.yml \
  -v director_name=bosh-lite \
  -v internal_ip=192.168.50.6 \
  -v internal_gw=192.168.50.1 \
  -v internal_cidr=192.168.50.0/24 \
  -v outbound_network_name=NatNetwork
```


[terraform]:https://www.terraform.io/
