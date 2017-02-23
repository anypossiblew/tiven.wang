---
layout: post
title: HANA Multiple Languages and Translation
excerpt: "SAP HANA platform及相关的产品如SAPUI5、ABAP有多种开发对象Object的多语言Multiple Languages及翻译Translation问题，本文介绍HANA涉及到的多语言功能和翻译工具，及SAPUI5和ABAP的多语言的使用，并且介绍实际场景中需要注意的一些问题。最后特别说明对中文不同标识的处理方式。"
modified: 2016-12-06T17:52:25-04:00
categories: articles
tags: [Languages, Translation, HANA, ABAP, CDS, UI5]
image:
  feature: hana/masthead-languages.jpg
comments: true
share: true
references:
  - title: "IETF BCP47"
    url: "https://tools.ietf.org/html/bcp47"
  - title: "Wikipedia - IETF language tag"
    url: "https://en.wikipedia.org/wiki/IETF_language_tag"
  - title: "Maintaining Translation Text Strings"
    url: "https://help.sap.com/saphelp_hanaplatform/helpdata/en/25/302d6a87c141b7afe11a12094dc0c9/content.htm?frameset=/en/5e/593196ba9f49dea67fa63b475c941e/frameset.htm&current_toc=/en/00/0ca1e3486640ef8b884cdf1a050fbb/plain.htm"
  - title: "Identifying the Language Code / Locale"
    url: "https://sapui5.hana.ondemand.com/1.28.36/docs/guide/91f21f176f4d1014b6dd926db0e91070.html"
  - title: "BCP 47 Validator"
    url: "http://schneegans.de/lv/"
  - title: "W3C - Web application APIs"
    url: "http://w3c.github.io/html/webappapis.html#dom-navigator-languages"  
  - title: "Hana Repository Translation Tool"
    url: "https://archive.sap.com/discussions/thread/3729454"
---

* TOC
{:toc}

SAP HANA platform及相关的产品如`SAPUI5`、`ABAP`有多种开发对象Object的多语言Multiple Languages及翻译Translation问题，本文介绍HANA涉及到的多语言功能和翻译工具，及SAPUI5和ABAP的多语言的使用，并且介绍实际场景中需要注意的一些问题。最后特别说明对中文不同标识的处理方式。

## HANA Multiple Languages
HANA多语言情景有Modeler Object Labels与Text Bundles file for SAPUI5 Applications及通用的Resource Bundles。

1. [Modeler Object Labels](#modeler-object-labels)
2. [Text Bundles](#text-bundles)
3. [Resource Bundles](#resource-bundles)

### Modeler Object Labels
SAP HANA Modeler对象的Labels有翻译功能，有两种翻译的方式：

* HANA Studio里
* [Online Translation Tool](#online-translation-tool)

### Text Bundles
Text bundles文件是HANA专门存储可翻译文本的数据库文件类型，其文件扩展名为<FileName>.hdbtextbundle。相对于其他平台使用添加不同国家标识后缀的properties文件作为不同语言的文本文件，HANA Text bundles文件即翻译是存储在HANA数据库中，HANA根据应用程序的语言设置来自动选择相应的语言文本。Text bundles文件翻译使用Repository Translation Tool (rtt)。

在UI5中加载bundle文件的代码如:

```javascript
// require the jQuery.sap.resources module     
 jQuery.sap.require("jquery.sap.resources");   
// load the resource bundle
var oBundle = jQuery.sap.resources({
  // specify url of the .hdbtextbundle
  url : "i18n/messagebundle.hdbtextbundle"
});
```

### Resource Bundles
UI5还可以使用Resource Bundles方式翻译文本，即使用添加不同国家标识后缀的properties文件作为不同语言的文本文件。

```javascript
<FileName>.properties // 包含原始关键字和文本
<FileName>_en.properties // 包含英语文本
<FileName>_en_US.properties // 包含美国英语文本
<FileName>_en_UK.properties // 包含英国英语文本
```

## Translation Tool
HANA中的翻译工作有多种方式：

### HANA Studio

//TODO

### Online Translation Tool

Open the Online Translation Tool in HANA Cockpit. Select the delivery unit and package which includes the artifacts that need to be translated. Then you can add the text's target language text.

> The privileges required to use the SAP HANA Online Translation Tool (OTT) are granted in the role *sap.hana.xs.ott.roles::translator* .

> the path of online translation tool is `/sap/hana/xs/translationTool/`

### Repository Translation Tool

The [Repository Translation Tool (RTT)][1] is a Java-based command line tool shipped with the SAP HANA client that enables you to transport language files in a standard format between the SAP HANA repository and a file system or between the SAP HANA repository and a dedicated SAP translation system.

// TODO

### Translation tools in ABAP

[Setting Up and Coordinating Translation (BC-DOC-TTL)][5]

[Language Support with SAP HANA Transport for ABAP][3]

[SAP HANA Transport for ABAP (HTA)][2] supports synchronizations of texts from SAP HANA to ABAP in the original language of the SAP HANA package. The synchronized texts can be translated using the standard ABAP translation tool (transaction *SE63*) and then transported.

Open the transaction SE63, select the `Short Texts` button, search the object type ID *HOTS* in the Object Type Selection popup, then select the HANA Object Name which you need to translate then select the source and target language settings, then edit.

// TODO how to transport back translated languages to HANA ?

### SAP Translation Hub

[SAP HANA Cloud Documentation - SAP Translation Hub (Beta)][4]

// TODO

## Language codes

### Browser
大部分浏览器的语言编码所使用的标准是BCP-47，如`de`， `en-US`， `zh-Hans-CN`。


### HANA Platform
HANA平台使用的语言编码标准和JAVA [Locale](http://docs.oracle.com/javase/7/docs/api/java/util/Locale.html) class使用的标准一样，是ISO 639 alpha-2 or alpha-3的小写字母语言编码加上ISO 3166 alpha-2的国家编码，用下划线分开，还可以再加第三个变量标识。
如`de`，`en_US`，`zh_TW_Traditional`。

> 从JDK 1.7开始也支持`BCP-47`标准了。

#### HANA Session Locale
使用下面的SQL可以查看当前会话的语言代码：

```sql
select
  session_context('LOCALE_SAP'), -- SAP Language code in HANA Session
  session_context('LOCALE')      -- HANA Language code in HANA Session
from dummy;
```

#### Change HANA Session Locale
Right-clicking onto the system/logon-entry in the 'Navigator' -> [Properties] -> [Database User Logon] -> [Additional Properties].
![Change HANA Studio Locale](/images/hana/studio-locale.png "Change HANA Studio Locale")

### ABAP-based
为了兼容性，ABAP-based SAP application servers使用的是`SAP专有Language codes`（参见SAP系统表`T002`），其**基本**符合`ISO 639 alpha-2 language code`。如果SAPUI5应用程序连接ABAP-based SAP应用服务器，默认URL参数**sap-language**的值为`SAP专有Language codes`，会被自动转成`BCP-47 language tag`，如

| SAP Language Code | BCP47 Language Tag | Description      |
| ----------------- |:------------------:|:---------------- |
| ZH                | zh-Hans            | `ZH` is the SAP language code for Simplified Chinese. The most generic representation in BCP47 is `zh-Hans`. `zh-CN` (Chinese, China) is another representation, but SAPUI5 decided to use `zh-Hans`.|
| ZF                | zh-Hant            | `ZF` is the SAP language code for Simplified Chinese. The most generic representation in BCP47 is `zh-Hant`. `zh-TW` (Chinese, Taiwan) is another representation, but SAPUI5 decided to use `zh-Hant`. |
| 1Q                | en-US-x-saptrc     | `1Q` is a technical SAP language code used in support scenarios, for example for translation issues. When you select this language code, the technical keys are display instead of the actual data. As no ISO639 code for this exists, the information has been added as a BCP47 private extension to the `en-US` language tag: "trc" stands for "trace" or "traceability". |
| 2Q                | en-US-x-sappsd     | `2Q` is also used as a technical SAP language code in support scenarios and displays a pseudo translation ("psd" in the private extensions name). |
{: .table}

详情参考[{{ page.references[3].title }}]({{ page.references[3].url }})

## HANA Languages in Use

### System View for HANA Object Label
HANA数据库对象的标签存在系统view `_SYS_REPO.ACTIVE_OBJECT_TEXT_CONTENT` 中，通过此View可以查询不同对象的不同语言的标签。

```sql
select
  *
from _SYS_REPO.ACTIVE_OBJECT_TEXT_CONTENT
where package_id = '<package id>'
and object_name = '<object name>'
and lang = 'zh';
```

Select the labels of fields in HANA view from system view `bimc_dimension_view` in schema `_SYS_BI`, the language indicated by session context variable `LOCALE`. Check it by executing

`select session_context('LOCALE') from dummy;`

> If you want to change the language environment setting of HANA studio, please reference [change the session locale in HANA studio](#change-hana-session-locale)

```sql
mdx select
     dimension_type,
     cube_name,
     is_private_attribute,
     catalog_name,
     dimension_unique_name,
     dimension_catalog_name,
     column_name,
     dimension_caption,
     column_caption
from bimc_dimension_view
where ( catalog_name = '<package id>'
     and ( cube_name = '<object name>'
           or ( cube_name = '$ATTRIBUTE'
                and dimension_unique_name = '[<object name>]' ) ) )
order by catalog_name,
     dimension_unique_name
;
```

### Automatic decide Language code in HANA
在HANA中如何根据会话Session自动选择语言，有三种情况：

#### HANA View Filter
在HANA Modeler View中可以在语言列上使用 input parameter : `filter="$$language$$"`

#### HANA View Text Join
在HANA View中使用`Text Join`类型来关联join语言类数据表，然后可以选择决定语言的field

#### HANA CDS or SQL
在HANA CDS或者SQL中则可以使用

```sql
where
  <LANG column> =
  (LOWER(SUBSTRING( (SELECT SESSION_CONTEXT('LOCALE') FROM "DUMMY") ) )
```

### ABAP on HANA
通常ABAP中的语言是登录GUI时给定的，存储在系统变量`SY-LANGU`中，但有时需要在ABAP程序中指定语言，可以使用ABAP语句`set locale language <language code>.`指定。这样在ABAP中使用sql查询HANA DB时会话就是相应的语言代码了。

例如：ABAP中指定 `set locale language '1'.` ，ABAP调用HANA时结果 `SELECT SESSION_CONTEXT('LOCALE') FROM "DUMMY"` 为'zh'。

### SAPUI5
对于SAPUI5 app来说，如何判断当前语言及应该加载哪个语言版本的Resource Bundle有一系列判定条件(序号越大的优先级越高)：

1. Hard-coded UI5 default locale ('en')
2. 有的可能配置了浏览器语言(window.navigator.browserLanguage)，对于Internet Explorer这个是操作系统的语言
3. 有的可能配置了用户语言(window.navigator.userLanguage)，对于Internet Explorer这个是地区语言
4. 浏览器通用语言配置(window.navigator.language)
5. Android手机浏览器(window.navigator.userAgent)
6. 新的标准([window.navigator.languages]({{ page.references[5].url }}))，这是数组取第一个
7. 配置在the application coding (jsdoc:symbols/sap.ui.core.Configuration)
8. 配置URL parameters (?sap-language=zh)

> 可以通过Configuration API获取当前语言<br/>
> *var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();*

> 对于Chrome浏览器变量`window.navigator.language`与`window.navigator.languages`的设置是在
> Settings -> Show advanced settings -> Languages -> Languages and input settings<br/>
> 被设为Displayed的语言代码即是**window.navigator.language**<br/>
> 添加在这里的Languages从上至下按顺序即是**window.navigator.languages**

#### UI5 with ABAP

Cookie `sap-usercontext=sap-language=EN`

//TODO

## 中文

由于 ABAP Language 只有 `ZH` 与 `ZF` 两种中文语言，所以在映射到 HANA 的时候 ZH 只能映射到 `zh` 或者 `zh_CN`, 并不能区分开。
所以 HANA 也在修复这个Bug，在不久未来的某个版本 HANA 会增加根据[ABAP Locale Language 和 Country][abap-set-locale]两个属性决定映射的语言环境。


## 总结

&lt;&lt;未完&gt;&gt;

[1]:http://help.sap.com/saphelp_hanaplatform/helpdata/en/af/a4db3987da44e8b2e9cda823e0c126/content.htm
[2]:https://help.sap.com/saphelp_nw74/helpdata/en/ff/7652bd542849b18b218efe8d2f2373/content.htm
[3]:https://help.sap.com/saphelp_nw74/helpdata/en/41/9d211e7e884fc58e524724e58b17b5/content.htm
[4]:https://help.hana.ondemand.com/help/frameset.htm?1b15cf69580449c0bd8525696c97b90d.html
[5]:https://help.sap.com/saphelp_nw74/helpdata/en/47/0520b4d7b830c1e10000000a11466f/content.htm

[abap-set-locale]:http://help.sap.com/saphelp_ehs27b/helpdata/en/34/8e73186df74873e10000009b38f9b8/content.htm
