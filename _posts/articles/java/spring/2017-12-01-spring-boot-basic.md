---
layout: post
title: Spring Boot - Basic
excerpt: "The Spring Boot Framework."
modified: 2017-12-01T17:00:00-00:00
categories: articles
tags: [Spring Boot]
image:
  vendor: yourshot.nationalgeographic
  feature: /u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDNebW9pJwPsKbRAU7WLPPNLE3KVWfmBfzfpV6yZn-R6tU9bgNzVvFSBLzuGKfuj9Ee-kjyzTD-j-wTCVkbusX3PKJL4RyKPgUqlxcSTYgJaorduD98L0sUzQhYRjDe6x1VR23afCuReacCL3b8GR6l3KXh1VIZ2n7vhzaRPAB4_CTgiVQ/
  credit: Tan Diep Bao
  creditlink: http://yourshot.nationalgeographic.com/profile/1400105/
comments: true
share: true

---

* TOC
{:toc}

## Auto Configuration Report
运行Spring Boot时添加参数 Debug 可以输出自动配置的报表

`mvn spring-boot:run -Ddebug`

输出

```
=========================
AUTO-CONFIGURATION REPORT
=========================


Positive matches:
-----------------

   ConfigServiceBootstrapConfiguration#configServicePropertySource matched:
      - @ConditionalOnProperty (spring.cloud.config.enabled) matched (OnPropertyCondition)

   ConfigurationPropertiesRebinderAutoConfiguration matched:
      - @ConditionalOnBean (types: org.springframework.boot.context.properties.ConfigurationPropertiesBindingPostProcessor; SearchStrategy: all) found bean 'org.springframework.boot.context.properties.ConfigurationPropertiesBindingPostProcessor' (OnBeanCondition)

   ConfigurationPropertiesRebinderAutoConfiguration#configurationPropertiesBeans matched:
      - @ConditionalOnMissingBean (types: org.springframework.cloud.context.properties.ConfigurationPropertiesBeans; SearchStrategy: current) did not find any beans (OnBeanCondition)

   ConfigurationPropertiesRebinderAutoConfiguration#configurationPropertiesRebinder matched:
      - @ConditionalOnMissingBean (types: org.springframework.cloud.context.properties.ConfigurationPropertiesRebinder; SearchStrategy: current) did not find any beans (OnBeanCondition)

   EncryptionBootstrapConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.security.crypto.encrypt.TextEncryptor' (OnClassCondition)

   EncryptionBootstrapConfiguration.RsaEncryptionConfiguration matched:
      - @ConditionalOnClass found required class 'org.springframework.security.rsa.crypto.RsaSecretEncryptor' (OnClassCondition)
      - Keystore found in Environment (EncryptionBootstrapConfiguration.KeyCondition)

   EncryptionBootstrapConfiguration.RsaEncryptionConfiguration#textEncryptor matched:
      - @ConditionalOnMissingBean (types: org.springframework.security.crypto.encrypt.TextEncryptor; SearchStrategy: all) did not find any beans (OnBeanCondition)

   PropertyPlaceholderAutoConfiguration#propertySourcesPlaceholderConfigurer matched:
      - @ConditionalOnMissingBean (types: org.springframework.context.support.PropertySourcesPlaceholderConfigurer; SearchStrategy: current) did not find any beans (OnBeanCondition)


Negative matches:
-----------------

   ConfigClientOAuth2BootstrapConfiguration:
      Did not match:
         - @ConditionalOnProperty (spring.cloud.config.client.oauth2.clientId) did not find property 'spring.cloud.config.client.oauth2.clientId' (OnPropertyCondition)
      Matched:
         - @ConditionalOnClass found required classes 'org.springframework.cloud.config.client.ConfigServicePropertySourceLocator', 'org.springframework.security.oauth2.client.OAuth2RestTemplate' (OnClassCondition)

   ConfigServiceBootstrapConfiguration.RetryConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'org.aspectj.lang.annotation.Aspect' (OnClassCondition)

   DiscoveryClientConfigServiceBootstrapConfiguration:
      Did not match:
         - @ConditionalOnProperty (spring.cloud.config.discovery.enabled) did not find property 'spring.cloud.config.discovery.enabled' (OnPropertyCondition)

   EncryptionBootstrapConfiguration.VanillaEncryptionConfiguration:
      Did not match:
         - @ConditionalOnMissingClass found unwanted class 'org.springframework.security.rsa.crypto.RsaSecretEncryptor' (OnClassCondition)


Exclusions:
-----------

    None


Unconditional classes:
----------------------

    None
```

## Debug

https://docs.spring.io/autorepo/docs/spring-boot/1.1.9.RELEASE/maven-plugin/examples/run-debug.html

想要在 IDE 中 Debug Spring Boot 程序代码，可以

* 在 Spring Boot Maven 插件中添加 jvm 参数
```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <version>1.1.9.RELEASE</version>
  <configuration>
    <jvmArguments>
      -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005
    </jvmArguments>
  </configuration>
  ...
</plugin>
```

* 或者在命令行中添加参数
`mvn spring-boot:run -Drun.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"`

https://docs.spring.io/spring-boot/docs/1.5.9.RELEASE/maven-plugin/

## Questions
### Spring Boot - how to configure port

https://stackoverflow.com/questions/21083170/spring-boot-how-to-configure-port

### Tomcat vs. Jetty vs. Undertow: Comparison of Spring Boot Embedded Servlet Containers
https://examples.javacodegeeks.com/enterprise-java/spring/tomcat-vs-jetty-vs-undertow-comparison-of-spring-boot-embedded-servlet-containers/

http://www.jianshu.com/p/0eb011915839


[spring-boot]:https://projects.spring.io/spring-boot/
