---
layout: post
title: Setup Java Maven Project for HANA Cloud Platform
excerpt: "SAP HANA Cloud Platform is an open platform-as-a-service that provides unique in-memory database and application services. It is the proven cloud platform that enables you to rapidly develop new applications or extend existing ones. Enabling anyone to extend SAP applications in minutes, all in the cloud."
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [HCP, Maven, Java]
image:
  feature: cloud/masthead-incubators.jpg
comments: true
share: true
---

* TOC
{:toc}

> The project codes for this article can be downloaded from [Github][github-project].

## Development Environment

* JDK 1.7
* Maven 3.+
* Eclipse with Maven plugins

http://download.eclipse.org/technology/m2e/releases/

## Maven Project Initialization

You will need somewhere for your project to reside, create a directory somewhere and start a shell in that directory. On your command line, execute the following Maven goal:

```
mvn -B archetype:generate \
  -DarchetypeGroupId=org.apache.maven.archetypes \
  -DgroupId=com.mycompany.app \
  -DartifactId=my-app
```

For our project using

`mvn -B archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DgroupId=com.sap.c4c -DartifactId=wechat`

`cd wechat`

Just execute the compile command to check the project

`mvn compile`

## Add Servlet

In order to run in web application server, the project need web servlet to process http request and add the Java Web API dependencies.

### Add Web API Dependencies

Add the Java Web API by the SAP Cloud Java Web API dependence.

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

Create a Java servlet class to print a simple words "Hello World!" for http response.

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

Add the Web Content files in folder **WebContent/** and the servlet configurations in file **_WEB-INF/web.xml_**

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

In order to package Java war artifact, you need add the maven war and compiler plugins to rewrite the default configurations.

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
              <source>1.7</source>
              <target>1.7</target>
              <showDeprecation>true</showDeprecation>
              <showWarnings>true</showWarnings>
          </configuration>
      </plugin>
    </plugins>
</build>
```

## Test Locally

### Tomcat Maven Plugin

The [Tomcat7 Maven Plugin][Tomcat7-Maven-Plugin] provides goals to manipulate WAR projects within the [Tomcat][tomcat] servlet container version 7.x.

```xml
<plugins>
  ...
  <plugin>
    <groupId>org.apache.tomcat.maven</groupId>
    <artifactId>tomcat7-maven-plugin</artifactId>
    <version>2.0</version>
    <configuration>
      ...
    </configuration>
  </plugin>
  ...
</plugins>
```

Run tomcat7 container using `mvn tomcat7:run` then access the project by *http://localhost:8080/wechat/*


## Build and Package

In maven command or the eclipse maven tools to execute the maven goal `mvn package` to build and package the project to Java war artifact.
Once completed the maven goal, you can find the war artifact in **/target/wechat.war**

## Deploy

### Deploy Manually

Upload or update the Java war artifact on HANA Cloud with the cockpit.

### Deploy from Eclipse

[Deploying on the Cloud from Eclipse IDE][Deploying-from-Eclipse-IDE]

### Deploy with Console Client

[Deploying on the Cloud with the Console Client][Deploying-with-Console-Client]


[github-project]:https://github.com/anypossiblew/hcp-java-wechat/tree/setup

[Tomcat7-Maven-Plugin]:http://tomcat.apache.org/maven-plugin-2.0/tomcat7-maven-plugin/
[tomcat]:http://tomcat.apache.org/

[Deploying-with-Console-Client]:https://help.hana.ondemand.com/help/frameset.htm?030863cd5d0d4dd3b742957970f8eec9.html
[Deploying-from-Eclipse-IDE]:https://help.hana.ondemand.com/help/frameset.htm?60ab35d9edde43a1b38cf48174a3dca2.html
