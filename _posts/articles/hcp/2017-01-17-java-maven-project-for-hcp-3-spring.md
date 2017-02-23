---
layout: post
title: Apply Spring Architecture to Java Project on HCP
excerpt: "The Spring Framework is an application framework and inversion of control container for the Java platform. The framework's core features can be used by any Java application, but there are extensions for building web applications on top of the Java EE platform. Although the framework does not impose any specific programming model, it has become popular in the Java community as an alternative to, replacement for, or even addition to the Enterprise JavaBeans (EJB) model. I will show you how to apply Spring Frameworks to Java project on HANA Cloud Platform."
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [Spring, Maven, Java, HCP, HANA]
image:
  feature: cloud/masthead-incubators.jpg
comments: true
share: true
---

* TOC
{:toc}

> The project codes for this article can be downloaded from [Github][github-project].

[Spring][spring.io] helps development teams everywhere build simple, portable, fast and flexible JVM-based systems and applications.
Spring has a lot of projects for whatever the infrastructure needs of your application may be, from configuration to security, web apps to big data, there is a Spring Project to help you build it. Start small and use just what you need.

We used Spring projects:

* **Spring Framework**: Core support for dependency injection, transaction management, web applications, data access, messaging, testing and more.

## Spring Framework

### Add Dependencies

```xml
<dependencies>
  ...
  <!-- Jackson -->
  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.8.5</version>
  </dependency>
  <!-- Spring frameworks -->
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aop</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-beans</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-orm</artifactId>
    <version>${org.springframework.version}</version>
  </dependency>
</dependencies>
```

### Spring MVC
The [Spring Web model-view-controller (MVC) framework][spring-docs-mvc] is designed around a `DispatcherServlet` that dispatches requests to handlers, with configurable handler mappings, view resolution, locale, time zone and theme resolution as well as support for uploading files.

Spring’s web MVC framework is, like many other web MVC frameworks, request-driven, designed around a central Servlet that dispatches requests to controllers and offers other functionality that facilitates the development of web applications. Spring’s `DispatcherServlet` however, does more than just that. It is completely integrated with the Spring IoC container and as such allows you to use every other feature that Spring has.

![MVC Context Hierarchy](/images/cloud/java/spring/mvc-context-hierarchy.png)

```xml
<servlet>
  <servlet-name>dispatcher</servlet-name>
  <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  <init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/spring-servlet.xml</param-value>
  </init-param>
  <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
  <servlet-name>dispatcher</servlet-name>
  <url-pattern>/</url-pattern>
</servlet-mapping>

<listener>
  <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

### Spring Servlet Configuration

spring-servlet.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
       http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd">

    <!-- Configures the @Controller programming model -->
    <mvc:annotation-driven/>

    <context:component-scan base-package="com.sap.c4c.wechat.web"/>

    <!-- View Resolver for JSPs -->
    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="requestContextAttribute" value="rc"/>
        <property name="prefix" value="/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

    <bean id="jacksonMessageConverter" class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter"></bean>
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
        <property name="messageConverters">
            <list>
                <ref bean="jacksonMessageConverter"/>
            </list>
        </property>
    </bean>
</beans>
```

### Spring Application Context Configuration

Spring application context configuration xml file,

applicationContext.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
                      http://www.springframework.org/schema/beans/spring-beans.xsd
                      http://www.springframework.org/schema/aop
                      http://www.springframework.org/schema/aop/spring-aop.xsd
                      http://www.springframework.org/schema/context
                      http://www.springframework.org/schema/context/spring-context-4.0.xsd
                      http://www.springframework.org/schema/tx
                      http://www.springframework.org/schema/tx/spring-tx-4.0.xsd">

  <!-- Enable Spring Annotation Configuration -->
  <context:annotation-config />

  <!-- Scan for all of Spring components such as Spring Service -->
  <context:component-scan base-package="com.sap.c4c.wechat.service"></context:component-scan>

  ...

</beans>
```

#### Spring JPA

The Spring JPA, available under the `org.springframework.orm.jpa` package, offers comprehensive support for the [Java Persistence API][JPA] in a similar manner to the integration with [Hibernate][Hibernate] or [JDO][JDO], while being aware of the underlying implementation in order to provide additional features.

[Spring ORM][spring-orm-jpa]: The Spring Framework supports integration with Hibernate, Java Persistence API (JPA) and Java Data Objects (JDO) for resource management, data access object (DAO) implementations, and transaction strategies.

```xml
<!-- Necessary to get the entity manager injected into the factory bean -->
<bean
  class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor" />

<!-- Define EclipseLink JPA Vendor Adapter -->
<bean id="jpaVendorAdapter"
  class="org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter">
  <property name="databasePlatform"
    value="org.eclipse.persistence.platform.database.HANAPlatform" />
  <property name="generateDdl" value="false" />
  <property name="showSql" value="true" />
</bean>

<!-- Entity Manager Factory -->
<bean id="entityManagerFactory"
  class="org.springframework.orm.jpa.LocalEntityManagerFactoryBean">
  <property name="persistenceUnitName" value="persistence-with-jpa"></property>
  <property name="jpaVendorAdapter" ref="jpaVendorAdapter" />
</bean>

<!-- Transaction Manager -->
<bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
  <property name="entityManagerFactory" ref="entityManagerFactory" />
</bean>

<!-- Detect @Transactional -->
<tx:annotation-driven transaction-manager="transactionManager" />
```

#### Persistence Unit

```xml
<persistence-unit name="persistence-with-jpa" transaction-type="RESOURCE_LOCAL">
  <provider>org.eclipse.persistence.jpa.PersistenceProvider</provider>
  <non-jta-data-source>java:comp/env/jdbc/DefaultDB</non-jta-data-source>
  ...
</persistence-unit>
```


## Spring Annotation Controller

```java
@Controller
@RequestMapping("/message")
public class MessageController {

  @Autowired
  private MessageService messageService;

  @RequestMapping(value = "", method = RequestMethod.GET)
  public @ResponseBody List<Message> get(HttpServletResponse response) {
    ...
  }

  @RequestMapping(value = "", method = RequestMethod.POST)
  public @ResponseBody void post(HttpServletRequest request) {
    ...
  }
}
```


## Spring Annotation Service

```java
package com.sap.c4c.wechat.service;

import java.util.List;

import com.sap.c4c.wechat.model.Message;

public interface MessageService {
  public List<Message> getAll();

  public void createMessage(Message message);
}
```

```java
package com.sap.c4c.wechat.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4c.wechat.model.Message;
import com.sap.c4c.wechat.service.MessageService;

@Component
public class MessageServiceImpl implements MessageService {

  @PersistenceContext
  private EntityManager em;

  public EntityManager getEm() {
    return em;
  }

  public void setEm(EntityManager em) {
    this.em = em;
  }

  @Transactional(readOnly=true)
  public List<Message> getAll() {
    @SuppressWarnings("unchecked")
    List<Message> resultList = em.createNamedQuery("AllMessages").getResultList();
    return resultList;
  }

  @Transactional
  public void createMessage(Message message) {
      em.persist(message);
  }
}
```

[github-project]:https://github.com/anypossiblew/hcp-java-wechat/tree/spring

[spring.io]:https://spring.io/
[spring-docs-mvc]:https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html
[JPA]:http://www.oracle.com/technetwork/articles/javaee/jpa-137156.html
[Hibernate]:http://hibernate.org/
[JDO]:https://db.apache.org/jdo/
[spring-orm-jpa]:http://docs.spring.io/spring/docs/current/spring-framework-reference/html/orm.html#orm-jpa
