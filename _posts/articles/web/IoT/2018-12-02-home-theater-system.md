---
layout: post
theme: UbuntuMono
title: "家庭影院系统（智能多媒体）"
excerpt: "本文介绍家庭影院所用到的技术标准和常见的设备，带你搭建自己的家庭影院系统。"
modified: 2018-12-02T11:51:25-04:00
categories: articles
tags: [Media]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/5611.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/qoqek-china-5611
comments: true
share: true
---

* TOC
{:toc}

本文介绍组件一个家庭影院所需要的技术知识。

## DLNA

[DLNA][DLNA] 是什么？DLNA 全称是 Digital Living Network Alliance ，是一种适用于各种设备上的**多媒体共享协议**。在同一 WIFI 网络环境下，使用 DLNA 直连可将图片、音乐、视频等投射到大屏显示器，例如将智能手机中视频，推送到智能电视中播放，从而增强观众的体验。

UPNP

<<智能家庭网络：技术、标准与应用实践>>

## Android 设备

http://www.mz6.net/news/pingce/6488.html

[kodi][kodi] 是一款支持Android手机与平板电脑的开源播放器，由XBMC基金会开发。支持3d、局域网、网络点播，可以运行在多种操作系统和硬件平台。拥有强大的解码能力，支持各种视频格式的推送和接收，强烈推荐。

## NAS 私有云存储



## 软路由

LEDE 软路由

Mesh 网络

Merlin 固件

## 技术概念

蓝牙能支持 5.1 声道传输吗

HDR 10 解码

[USB 变蓝牙](https://item.taobao.com/item.htm?spm=a1z10.1-c-s.w4004-18453116487.2.116b4f5bt7lcWj&id=573509376773)

http://bbs.xiaomi.cn/t-7914787-1-o0

https://exp.newsmth.net/topic/e8e459a490de6d36f99b149ba22d3e85

### 音频技术

在观看HDTV时想要获得和DVD一样的多声道影院效果，最好的方案肯定是将音频用 SPDIF（Sony-Philips Digital Interface Format，索尼-飞利浦数字界面格式）输出到功放，然后由功放来解码播放。从理论上来说，这样的效果肯定比从声卡上接出模拟信号到功放上的要好，事实也的确如此。

目前的HDTV影片中，音频部分基本上都是采用 AC3, DTS, AAC 这三种格式进行编码，这三种格式都可以提供多声道的影院效果。在开始搭建HTPC家庭影院之前，先简单了解一下什么是什么是 AC3, DTS 和 AAC ：

1. AC3, 全称为Audio Coding version 3，是Dolby实验室所发展的有损音频编码格式。AC3最被广泛应用于5.1声道，是Dolby Pro Logic的继承者，不同的地方在于AC3提供6个独立的声道而Pro Logic混合其环绕声道。AC3普及度很高，以384-448 kbps的码率应用于LaserDisc和DVD，也经常以640 kbps的码率广泛用在电影院。
2. DTS, 全称为Digital Theater Systems(数字影院系统)，是一种有损多声道家庭影院音频格式，但它用了很高的码率进行编码，通常为768-1536kbps，能够营造出比AC3更好的影院效果。

3. AAC, 全称为 Advanced Audio Coding (高级音频解码)，是一种由 MPEG-4 标准定义的有损音频压缩格式，由 Fraunhofer 发展，Dolby, Sony 和 AT&T 是主要的贡献者。在使用 MP4 作为各种内容的容器格式的新多媒体MPEG-4标准中，它是MPEG Layer III( MP3)的天然后继者。AAC 能够在一条音轨中包括48条全带宽（直到 96khz）音频声道，加上15条低频增强（LFE，限制到120Hz）声道，直到 15条数据流并且更多。

#### Dolby Atmos

杜比全景声（Dolby Atmos/X-DMAX）是由杜比实验室研发，于 2012 年 4 月 24 日发布的全新影院音频平台。它突破了传统意义上 5.1、7.1 声道的概念，能够结合影片内容，呈现出动态的声音效果；更真实的营造出由远及近的音效；配合顶棚加设音箱，实现声场包围，展现更多声音细节，提升观众的观影感受。


### TrueHD

### HDMI

HDMI 是音视频合一的单线数字接口。

HDMI 也支持非压缩的 8 声道数字音频发送（采样率192kHz，数据长度24bits/sample），以及任何压缩音频流如 Dolby Digital 或 DTS ，亦支持 SACD 所使用的 8 声道的 1bit DSD 信号。在 HDMI 1.3 规格中，又追加超高数据量的非压缩音频流如 Dolby TrueHD 与 DTS-HD 的支持。

### 电影文件名词解释

例如下面的电影名里的技术名词
```
1080p.3D.BluRay.BluRay.Half-OU.x264.TrueHD.7.1.Atmos-FGT
1080p.3D.BluRay.BluRay.Half-SBS.x264.DTS-HD.MA.7.1-FGT
2160p.BluRay.x265.10bit.SDR.DTS-HD.MA.TrueHD.7.1.Atmos-SWTYBLZ
2160p.BluRay.x265.10bit.HDR.DTS-HD.MA.TrueHD.7.1.Atmos-SWTYBLZ
2160p.BluRay.x264.8bit.SDR.DTS-HD.MA.TrueHD.7.1.Atmos-SWTYBLZ
2160p.BluRay.REMUX.HEVC.DTS-HD.MA.TrueHD.7.1.Atmos-FGT
2160p.BluRay.HEVC.TrueHD.7.1.Atmos-BHD
1080p.BluRay.x264.TrueHD.7.1.Atmos-SWTYBLZ
1080p.BluRay.REMUX.AVC.DTS-HD.MA.7.1-FGT
1080p.BluRay.AVC.DTS-HD.MA.7.1-FGT
```

[DTS](https://www.wikiwand.com/en/DTS_(sound_system)) [DTS-HD] [DTS++]

H265 解码

## 千兆网络
现代家庭影音系统完全有必要需要一个千兆网络，那么怎么为自己组建一个家庭千兆网络呐？

首先看我们需要光猫、路由器、交换机、网线等都必须达到千兆级。

### 路由器

我选择的是 [TP-LINK 双千兆路由器 TL-WDR8690](https://www.tp-link.com.cn/product_1340.html), 2020年2月价格￥299.00 。

[2020年初比较靠谱的路由器选购攻略以及型号推荐](https://www.bilibili.com/video/av81460027?t=656)

### 网线

首先需要注意的网线，因为对于新房子来说，开发商已经布置好了部分网线。所以在装修时需要考虑重新布设网线或者更换原来的网线。

http://baijiahao.baidu.com/s?id=1600766279209241336&wfr=spider&for=pc

秋叶原 6 类线

[京东优评 - 告诉你如何选网线，让你的网速飞起来](https://www.jd.com/phb/zhishi/e2d8c586cbe4a448.html)

[DLNA]:https://www.wikiwand.com/zh/%E6%95%B0%E5%AD%97%E7%94%9F%E6%B4%BB%E7%BD%91%E7%BB%9C%E8%81%94%E7%9B%9F
[kodi]:https://kodi.tv/

[Network-attached_storage]:https://en.wikipedia.org/wiki/Network-attached_storage