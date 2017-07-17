---
layout: post
title: Microservices - Documenting Restful API
excerpt: "Documenting Restful API"
modified: 2017-07-10T11:51:25-04:00
categories: articles
tags: [OpenAPI, Swagger, Microservices]
author: tiven_wang
image:
  feature: /images/cloud/mashheader-cloud.jpg
comments: true
share: true
references:
  - title: "Setting Up Swagger 2 with a Spring REST API"
    url: "http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api"
---

* TOC
{:toc}


[OpenAPI][OpenAPI]



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
