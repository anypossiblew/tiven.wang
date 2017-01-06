---
layout: post
title: Setup Maven Java Project for HANA Cloud Platform
excerpt: "Setup Maven Java Project for HANA Cloud Platform"
modified: 2017-01-06T17:00:00-00:00
categories: articles
tags: [Maven, Java, HCP]
image:
  feature: cloud/masthead-incubators.jpg
comments: true
share: true
---

* TOC
{:toc}

## Development Environment

* JDK 1.7
* Eclipse with Maven plugins

## Maven Project Initialization

```
mvn -B archetype:generate \
  -DarchetypeGroupId=org.apache.maven.archetypes \
  -DgroupId=com.mycompany.app \
  -DartifactId=my-app
```

`mvn -B archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DgroupId=com.sap.c4c -DartifactId=wechat`

`mvn compile`

## Add Servlet

In order to run in web application server, the project need add Java Web API dependencies.

### Add Web API Dependencies

```xml
<dependencies>
  <!-- The SAP HANA Cloud Platform Java Web Tomcat 7 API -->
  <dependency>
      <groupId>com.sap.cloud</groupId>
      <artifactId>neo-java-web-api</artifactId>
      <version>2.65.5</version>
      <scope>provided</scope>
  </dependency>
  ...
</dependencies>
```

### Create Servlet

```java
package com.sap.c4c.wechat.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementing simplest possible hello world application for SAP HANA Cloud Platform.
 */
public class MessageServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /** {@inheritDoc} */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.getWriter().println("<p>Hello World!</p>");
    }
}
```

### Add Web Content

Add the Web Content files in folder **WebContent/**

The servlet configurations in file **_WEB-INF/web.xml_**

```xml
<!-- Main sample servlet mapped to / so that the integration test harness can detect readiness (generic for all samples) -->
<servlet>
    <servlet-name>MessageServlet</servlet-name>
    <servlet-class>com.sap.c4c.wechat.web.MessageServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>MessageServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

### Maven Build Plugins

Add the build plugins of maven in the project

```xml
<build>
  <plugins>
      <!-- Map the Eclipse file system layout to the Maven plug-ins -->
      <plugin>
          <artifactId>maven-war-plugin</artifactId>
          <version>2.1</version>
          <configuration>
              <warName>${project.artifactId}</warName>
              <warSourceDirectory>WebContent</warSourceDirectory>
              <archive>
                  <manifestFile>WebContent/META-INF/MANIFEST.MF</manifestFile>
              </archive>
          </configuration>
      </plugin>

      <!-- Set compiler to officially supported JDK version for the given SAP HANA Cloud Platform SDK -->
      <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>2.5.1</version>
          <configuration>
              <source>${sap.cloud.jdk.version}</source>
              <target>${sap.cloud.jdk.version}</target>
              <showDeprecation>true</showDeprecation>
              <showWarnings>true</showWarnings>
          </configuration>
      </plugin>
    </plugins>
</build>
```
