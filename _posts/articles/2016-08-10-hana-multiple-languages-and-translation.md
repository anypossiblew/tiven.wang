---
layout: post
title: HANA Multiple Languages and Translation
excerpt: "SAP HANA platform有多种方式维护多种开发对象Object的多语言Multiple Languages即翻译Translation问题，本文介绍HANA多语言功能和翻译工具及在各种场景中的应用方式。"
modified: 2016-08-11T17:52:25-04:00
categories: articles
tags: [HANA, Languages, Translation, ABAP, CDS, UI5]
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
---

SAP HANA platform有多种方式维护多种开发对象Object的多语言Multiple Languages及翻译Translation问题，本文介绍HANA多语言功能和翻译工具及在各种场景中的应用方式。

## HANA Multiple Languages
HANA多语言有Modeler Object Labels与Text Bundles file for SAPUI5 Applications及通用的Resource Bundles。

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
//TODO

### Repository Translation Tool
//TODO 

## Language codes

### HANA Platform
HANA平台使用的语言编码标准和JAVA [Locale](http://docs.oracle.com/javase/7/docs/api/java/util/Locale.html) class使用的标准一样，都是与[BCP-47]({{ page.references[0].url }})标准通用的，大部分表现形式为 `<lang>_<country> (e.g. en_US)`。

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
![Change HANA Studio Locale](/images/hana/studio-locale.png)

### ABAP-based
为了兼容性，ABAP-based SAP application servers使用的是`SAP专有Language codes`（参见SAP系统表`T002`），其**基本**符合`ISO 639 alpha-2 language code`。如果SAPUI5应用程序连接ABAP-based SAP应用服务器，默认URL参数sap-language的值为`SAP专有Language codes`，会被自动转成`BCP-47 language tag`，如

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

### Automatic decide Language code in HANA
在HANA如何根据会话自动选择语言，有两种方式：

#### HANA View
在HANA Modeler View中可以在语言列上使用`filter="$$language$$"`。

#### HANA CDS or SQL
在HANA CDS或者SQL中则可以使用

```sql
where
  <LANG column> = 
  (LOWER(SUBSTRING( (SELECT SESSION_CONTEXT('LOCALE') FROM "DUMMY") ) )

```

### with ABAP
通常ABAP中的语言是登录GUI时给定的，存储在系统变量`SY-LANGU`中，但有时需要在ABAP程序中指定语言，可以使用ABAP语句`set locale language <language code>.`指定。这样在ABAP中使用sql查询HANA DB时会话就是相应的语言代码了。

>例如：ABAP中指定`set locale language '1'.`，ABAP调用HANA时结果`SELECT SESSION_CONTEXT('LOCALE') FROM "DUMMY"`为'zh'。


## 中文
//TODO

## 总结

&lt;&lt;未完&gt;&gt;
