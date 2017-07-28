---
layout: post
title: Try Cloud Foundry 7 - Spring Boot
excerpt: "Spring Boot - Takes an opinionated view of building production-ready Spring applications. Spring Boot favors convention over configuration and is designed to get you up and running as quickly as possible."
modified: 2017-07-25T17:00:00-00:00
categories: articles
tags: [Spring Boot, Cloud Foundry]
image:
  feature: http://www.nationalgeographic.com/content/dam/photography/photos/000/637/63787.ngsversion.1467253446748.adapt.1190.1.jpg
comments: true
share: true
references:
  - title: "Spring Boot Reference Guide"
    url: "http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/"
  - title: "Spring Boot Maven plugin"
    url: "https://docs.spring.io/spring-boot/docs/current/reference/html/build-tool-plugins-maven-plugin.html"

---

> A dead tree towers over the jungle canopy in the rain forest of the Mosquito Coast, [Honduras](https://en.wikipedia.org/wiki/Honduras).

<style>
@import url('https://fonts.googleapis.com/css?family=Special+Elite');
.demo-blog .blog__post blockquote {
  font-family: 'Special Elite', cursive;
}
</style>

* TOC
{:toc}

> 下載本篇完整代碼 [Github](https://github.com/tiven-wang/try-cf/tree/spring-boot)

## Setup

### Install Spring CLI

依照文檔 [Installing the Spring Boot CLI](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-installing-the-cli) 步驟安裝Sprring CLI 工具：

* 下載解壓 *spring-boot-cli-1.5.4.RELEASE-bin.zip*
* 創建環境變量 **SPRING_HOME**
* 添加 **SPRING_HOME**/bin 到 **path** 環境變量中

執行命令 `spring version` 查看是否成功安裝。

## Building Project

我們這裡不是用Spring CLI生成項目代碼，而是一步步手動添加各個組件，以期讀者對項目結構有深入理解。

`mkdir try-cf-spring-boot`
`cd try-cf-spring-boot`

創建文件 *pom.xml*:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>wang.tiven</groupId>
    <artifactId>try-cf</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <!-- to jar when packaging-->
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.4.RELEASE</version>
    </parent>

    <!-- Additional lines to be added here... -->

</project>
```

使用 `mvn dependency:tree` 下載依賴並查看項目依賴結構，目前只有一個 `wang.tiven:try-cf:jar:0.0.1-SNAPSHOT` 。

我們要開發 web application 所以添加 `spring-boot-starter-web` module

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

重新運行 `mvn dependency:tree` 下載相關依賴。

創建代碼

```java
package wang.tiven.trycf.web;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@RestController
@EnableAutoConfiguration
public class HomeController {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(HomeController.class, args);
    }

}
```

運行命令 `mvn spring-boot:run` 成功啟動 Tomcat 後查看 url *http://localhost:8080/* 便可得到 *Hello World!*

## Deploy to Cloud Foundry

### Package

想要打包成可執行的jar或war文件需要添加插件`spring-boot-maven-plugin`

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>1.5.4.RELEASE</version>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

然後執行 `mvn clean package` 可以得到可執行的jar， 可以測試jar可執行性 `java -jar target/try-cf-spring-boot-0.0.1-SNAPSHOT.jar`

### Push to Pivotal Web Services

創建 Cloud Foundry 配置文件 **manifest.yml**

```yaml
---
applications:
- name: try-cf-spring-boot
  buildpack: java_buildpack
  instances: 1
  memory: 200M
  host: try-cf-spring-boot
  path: target/try-cf-spring-boot-0.0.1-SNAPSHOT.jar
```

**path** 變量指定 artifact 的位置

`cf api https://api.run.pivotal.io`

`cf login`

`cf push`

成功後可以得到可訪問鏈接 *http://try-cf-spring-boot.cfapps.io*

## More

更改 [Spring Boot][Spring Boot] 的啟動入口， 其中 `@SpringBootApplication` 為一方便性的註解，它包含了

* `@Configuration` 標註此class在應用上下文 application context 中為一定義bean的class。
* `@EnableAutoConfiguration` tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.
* 如果 Spring Boot 發現 **spring-webmvc** on the classpath， 則自動添加 `@EnableWebMvc`， 你也可以手動添加 `@EnableWebMvc`
* `@ComponentScan` 則說明自動查找其他components, configurations, and services

```java
@SpringBootApplication
public class HeroApplication {

  public static void main(String[] args) throws Exception {
    SpringApplication.run(HeroApplication.class, args);
  }

}
```

[Spring Boot]:http://projects.spring.io/spring-boot/
