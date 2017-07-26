---
layout: post
title: Microservices - Documenting Restful API
excerpt: "Documenting Restful API"
modified: 2017-07-10T11:51:25-04:00
categories: articles
tags: [OpenAPI, Swagger, Microservices]
author: tiven_wang
image:
  feature: https://drscdn.500px.org/photo/112198071/q%3D80_m%3D2000_k%3D1/v2?webp=true&sig=61e24e8f804079377957abae0c6470b843f14d95ab5da7dedd3a8a70c36531b1
  credit: 500px
  creditlink: https://500px.com/photo/112198071
comments: true
share: true
references:
  - title: "Setting Up Swagger 2 with a Spring REST API"
    url: "http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api"
---

<style>
@import url('https://fonts.googleapis.com/css?family=Dosis:400,500');
.mdl-card__supporting-text.blog__post-body {
  font-family: 'Dosis', sans-serif;
}
</style>

> Thailand Buffalo Racing Festival，中文稱為『泰國水牛節』，是泰國歷史非常悠久的活動慶典。每年約於十月份(農曆的九月十四)，在泰國的春武里府(Chonburi Province) 來舉辦。 泰國水牛節，據說在距今一百年多前，就出現在泰國中南半島。在農業時代，水牛是泰國農民耕作和運輸的主要工具。為了感激水牛的辛勤工作，農民為水牛們舉辦了一個活動，讓水牛可以充分休息一天。活動演變至今，慢慢發展成水牛競賽。活動內容包含了水牛賽跑比賽，看看誰能在水牛的背上待最久，另外還有選美比賽，優勝者可以得到水牛小姐封號(Miss Buffalo)。

* TOC
{:toc}


[OpenAPI][OpenAPI]

**Spring REST Docs**

我們使用 [Springfox][Springfox] 在 Spring MVC 框架上實現 [Swagger][Swagger] API文檔說明。

## Setup

### Dependency

添加 Springfox 的 Maven 依賴：

```xml
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger2</artifactId>
  <version>2.6.1</version>
</dependency>
```

### Swagger Configuration

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {

  @Bean
  public Docket api() {
      return new Docket(DocumentationType.SWAGGER_2)  
        .select()                                  
        .apis(RequestHandlerSelectors.any())
        .paths(PathSelectors.any())                          
        .build();
  }
}
```

訪問鏈接可查看 json格式的 API 信息：*/v2/api-docs*

## Swagger UI

下載 Swagger UI 項目代碼，拷貝 dist 目錄下的文件到 server 靜態頁面目錄如 *src/main/webapp/swagger-ui/*。

`git clone https://github.com/swagger-api/swagger-ui.git`

修改 index.html 文件中的 API url：

```javascript
// Build a system
const ui = SwaggerUIBundle({
  url: "/v2/api-docs",
  ...
});
```

訪問 `<server>/swagger-ui/index.html` 可看到 API 的文檔界面。

## API Information

## Annotations




[Swagger]:https://swagger.io/
[OpenAPI]:https://www.openapis.org/
[Springfox]:https://github.com/springfox/springfox
[OpenAPI-Specification]:https://github.com/OAI/OpenAPI-Specification
