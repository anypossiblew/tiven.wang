---
layout: post
theme: UbuntuMono
title: "Linux Cookbook"
excerpt: ""
modified: 2018-06-21T11:51:25-04:00
categories: articles
tags: [Linux]
image:
  vendor: twitter
  feature: /media/Dd5LgMEVwAENVEO.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/999319186018103296
comments: true
share: true
---

* TOC
{:toc}


### How to renew or release a Dynamic IP address in Linux
The DHCP client in Linux is called [dhclient][dhclient]. It requests dynamic IP addresses from the DHCP server, which "leases" addresses to clients for a set amount of time. dhclient can be invoked manually to "release" the client's currently assigned IP address, and get another address from the DHCP server.

`sudo dhclient -v`

`sudo dhclient wlan0`

`sudo dhclient -r wlan0`

https://www.computerhope.com/issues/ch001078.htm


[dhclient]:https://www.computerhope.com/unix/dhclient.htm
