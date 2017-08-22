---
layout: post
title: SAP Hybris Cloud for Customer
excerpt: "Engage your customers in more meaningful ways with SAP Hybris Cloud for Customer. This cloud CRM portfolio brings sales, customer service, and social CRM together – to help your team form powerful personal connections that drive customer engagement across all channels. Take advantage of rich predictive insight, flawless execution and contextual customer experience relevant to your industry. "
modified: 2017-07-24T17:00:00-00:00
categories: articles
tags: [C4C, Hybris, SAP]
image:
  vendor: 500px
  feature: /photo/221061839/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=cea61d6f5a9f4e63ff8218dc2ec0caa08e293b442461e33a480368ac6c2cacad
comments: true
share: true
references:
  - title: "Github - ZeroNet Decentralized websites using Bitcoin crypto and BitTorrent network"
    url: "https://github.com/HelloZeroNet/ZeroNet"

---

<style>
@import url('https://fonts.googleapis.com/css?family=Special+Elite');
.demo-blog .blog__post blockquote {
  font-family: 'Special Elite', cursive;
}
.mdl-card__supporting-text.blog__post-body {

}
</style>

> [Common Buzzard](https://en.wikipedia.org/wiki/Common_buzzard)

* TOC
{:toc}

## Webservice SOAP Faults

在調用 Webservice API 時如果出現以下錯誤：

```xml
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header/>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Server</faultcode>
      <faultstring xml:lang="en">Authorization role missing for service "ServiceInterface http://sap.com/xi/A1S/Global ManageContactIn <default> <default>", operation "Operation http://sap.com/xi/A1S/Global MaintainBundle" (UTC timestamp 20130320080942;
Transaction ID 00163E0290481EE2A4A6B0992E5E8C2D)</faultstring>
      <detail/>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
```

或者

```xml
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header/>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Server</faultcode>
      <faultstring xml:lang="en">Web service processing error; more details in the Web service error log on provider side (UTC timestamp 20130320080819; Transaction ID 00163E0290481EE2A4A6AA6271768C2A)</faultstring>
      <detail/>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
```

你可以在系統中查看詳細錯誤信息 **ADMINISTRATOR** -> **System Administration** -> **Web Service Message Monitoring**

## Webservice APIs

### Create Social Media User Profile

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">
   <soapenv:Header/>
   <soapenv:Body>
      <glob:SocialMediaUserProfileBundleMaintainRequest_sync>
        <SocialMediaUserProfile actionCode="01">
           <!--Optional:-->
           <SocialMediaUserCategoryCode>01</SocialMediaUserCategoryCode>
           <!--1 or more repetitions:-->
           <UserInformation actionCode="01">
              <SocialMediaUserAccountID>tiven0001</SocialMediaUserAccountID>
              <!--Optional:-->
              <GenderCode>1</GenderCode>
              <!--Optional:-->
              <SocialMediaChannelCode>906</SocialMediaChannelCode>
              <!--Optional:-->
              <FamilyName>wang</FamilyName>
              <!--Optional:-->
              <GivenName>tiven</GivenName>
              <!--Optional:-->
              <SocialMediaUserName>anypossible0001</SocialMediaUserName>
              <!--Optional:-->
              <ExternalPartyAccountID >wechat_openid</ExternalPartyAccountID>
           </UserInformation>
        </SocialMediaUserProfile>
      </glob:SocialMediaUserProfileBundleMaintainRequest_sync>
   </soapenv:Body>
</soapenv:Envelope>
```

Response :

```xml
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
   <soap-env:Header/>
   <soap-env:Body>
      <n0:SocialMediaUserProfileBundleMaintainConfirmation_sync xmlns:n0="http://sap.com/xi/SAPGlobal20/Global" xmlns:prx="urn:sap.com:proxy:LNW:/1SAI/TAE380CF5298475959BCE4F:804">
         <SocialMediaUserProfile>
            <ID>839</ID>
            <UUID>00163e28-f1ac-1ee7-9c8a-14f044444597</UUID>
            <ChangeStateID>20170724091536.8474230</ChangeStateID>
         </SocialMediaUserProfile>
      </n0:SocialMediaUserProfileBundleMaintainConfirmation_sync>
   </soap-env:Body>
</soap-env:Envelope>
```

> SocialMediaUserAccountID 為 UserInformation 的 key ， UUID 為 SocialMediaUserProfile 的 key。<br/>
> 當 SocialMediaUserProfile 的 actionCode = 02 為 update ， request UserInformation 要填寫完整的數據，即覆蓋系統已有的數據<br/>
> 當 SocialMediaUserProfile 的 actionCode = 04 為 save ， UserInformation 可以針對某一個進行操作， actionCode = 01 02 03 04
