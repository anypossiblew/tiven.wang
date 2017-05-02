---
layout: post
title: Cloud Training 1 - Create Maven Project and Deploy to Tomcat
excerpt: ""
modified: 2017-04-24T17:00:00-00:00
categories: articles
tags: [Servlet, Maven, Tomcat]
image:
  feature: web/masthead-web.jpg
comments: true
share: true
---

# Installation
## JDK8
[http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

`JAVA_HOME`
`PATH`

### Check Java
`java -version`

## Tomcat8
[http://tomcat.apache.org/download-80.cgi](http://tomcat.apache.org/download-80.cgi)

`CATALINA_HOME`

### Startup Tomcat
`%TOMCAT HOME%\bin\startup.bat`

*http://127.0.0.1:8080/*

*http://127.0.0.1:8080/examples*

## Maven3
[https://maven.apache.org/download.cgi?Preferred=http%3A%2F%2Fmirrors.tuna.tsinghua.edu.cn%2Fapache%2F](https://maven.apache.org/download.cgi?Preferred=http%3A%2F%2Fmirrors.tuna.tsinghua.edu.cn%2Fapache%2F)

`PATH`

### Check Maven
`mvn -v`


# Create Project

1 Generate Project by Maven

```sql
mvn archetype:generate -DgroupId=com.tiven -DartifactId=myapp -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
```

2 Build and Package

`mvn package`

3 Deploy to Tomcat Container

Deploy war into tomcat `apache-tomcat-8.5.14\webapps`

4 Check your Web Application - jsp

*http://127.0.0.1:8080/WebApp/*


# Create a Servlet

1 Create HelloCloud class

```java
package com.tiven;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class HelloCloud extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException, ServletException
    {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Hello Cloud!</title>");
        out.println("</head>");
        out.println("<body>");
        out.println("<h1>Hello Cloud!</h1>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

2 Add servlet configures in web.xml

```xml
<servlet>
    <servlet-name>HelloCloud</servlet-name>
    <servlet-class>com.tiven.HelloCloud</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>HelloCloud</servlet-name>
    <url-pattern>/servlets/HelloCloud</url-pattern>
</servlet-mapping>
```

3 Add Servlet Dependencies in pom.xml

```xml
<dependencies>
  ...

  <dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
    <version>2.5</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
```

4 Re Build and Package

`mvn clean packge`

5 Check the Servlet

*http://127.0.0.1:8080/WebApp/servlets/HelloCloud*

# Eclipse IDE Support

`mvn eclipse:eclipse -Dwtpversion=2.0`

import into eclipse

add tomcat7 plugin in pom.xml

```xml
<plugins>
  <plugin>
    <groupId>org.apache.tomcat.maven</groupId>
    <artifactId>tomcat7-maven-plugin</artifactId>
    <version>2.0</version>
  </plugin>
</plugins>
```

`mvn tomcat7:run`

# Debug in Eclipse IDE
`mvndebug tomcat7:run`

Run **Remote Java Application** in **Debug Configurations** at local port *8000*

debug in servlet

download source codes for maven dependencies:

`mvn dependency:sources`
`mvn dependency:resolve -Dclassifier=javadoc`

or Configure them in eclipse
