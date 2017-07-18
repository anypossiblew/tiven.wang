---
layout: post
title: Persistence Service for Java Maven Project on HCP
excerpt: "The Java Persistence API (JPA) is a Java specification for accessing, persisting, and managing data between Java objects / classes and a relational database. JPA was defined as part of the EJB 3.0 specification as a replacement for the EJB 2 CMP Entity Beans specification. In this topic I will show you how to create persistence service for Java project on HCP using Java Persistence API (JPA) and it's implementation EclipseLink"
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [JPA, HCP, Maven, Java, HANA]
image:
  feature: /images/cloud/masthead-incubators.jpg
comments: true
share: true
---

* TOC
{:toc}

> The project codes for this article can be downloaded from [Github][github-project].

The Java Persistence API ([JPA][Java-EE-6-Tutorial-Persistence]) provides Java developers with an object/relational mapping facility for managing relational data in Java applications.

[EclipseLink][EclipseLink] is comprehensive open-source Java persistence solution addressing relational, XML, and database web services.
HCP advise to use the [EclipseLink][EclipseLink] to present JPA implementation.

> Note that EclipseLink versions as of 2.5 contain the SAP HANA database platform.

## Dependencies

```xml
<!-- Required for compilation and required at runtime (additional web application libraries) -->
<dependency>
  <groupId>com.sap.security.core.server</groupId>
  <artifactId>csi</artifactId>
  <version>1.0.1</version>
  <scope>system</scope>
  <systemPath>${basedir}/src/main/webapp/WEB-INF/lib/com.sap.security.core.server.csi_1.0.1.jar</systemPath>
</dependency>
<dependency>
  <groupId>org.eclipse.persistence</groupId>
  <artifactId>javax.persistence</artifactId>
  <version>2.1.0</version>
</dependency>
<dependency>
  <groupId>org.eclipse.persistence</groupId>
  <artifactId>eclipselink</artifactId>
  <version>2.5.1</version>
</dependency>
```

## Create JPA Entity

```java
package com.sap.c4c.wechat.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;

@Entity
@NamedQuery(name = "AllCustomers", query = "select c from Customer c")
public class Customer {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    public Long id;
    public String firstName;
    public String lastName;

    public Customer() {}

    public Customer(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return String.format(
                "Customer[id=%d, firstName='%s', lastName='%s']",
                id, firstName, lastName);
    }

}
```

## JPA Configurations

### Persistence Unit

Create the persistence unit configuration file **_persistence.xml_** in position **_src/main/resources/META-INF/persistence.xml_**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.0" xmlns="http://java.sun.com/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd">
    <persistence-unit name="persistence-with-jpa" transaction-type="RESOURCE_LOCAL">
        <provider>org.eclipse.persistence.jpa.PersistenceProvider</provider>
        <class>com.sap.c4c.wechat.model.Customer</class>
        <properties>
            <property name="eclipselink.ddl-generation" value="create-tables" />
            <property name="eclipselink.logging.level" value="SEVERE" />
        </properties>
    </persistence-unit>
</persistence>
```

### JNDI Lookup Data Source

Add the data source for JNDI lookup in web file **src/main/webapp/WEB-INF/_web.xml_**

```xml
<!-- Declare the JNDI lookup of the default data source -->
<resource-ref>
    <res-ref-name>jdbc/DefaultDB</res-ref-name>
    <res-type>javax.sql.DataSource</res-type>
</resource-ref>
```

## Use in Servlet

Override the *init* method in http servlet class to create an entity manager factory for creating entity manager.

```java
private DataSource ds;
private EntityManagerFactory emf;

/** {@inheritDoc} */
@SuppressWarnings({ "rawtypes", "unchecked" })
@Override
public void init() throws ServletException {
  Connection connection = null;
  try {
    InitialContext ctx = new InitialContext();
    ds = (DataSource) ctx.lookup("java:comp/env/jdbc/DefaultDB");

    Map properties = new HashMap();
    properties.put(PersistenceUnitProperties.NON_JTA_DATASOURCE, ds);
    emf = Persistence.createEntityManagerFactory("persistence-with-jpa", properties);
  } catch (NamingException e) {
    throw new ServletException(e);
  }
}
```

For get method in servlet class


```java
EntityManager em = emf.createEntityManager();
```

```java
em.getTransaction().begin();
em.persist(customer);
em.getTransaction().commit();
```

```java
/** {@inheritDoc} */
@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
  try {
    // Extract name of person to be added from request
    String firstName = request.getParameter("FirstName");
    String lastName = request.getParameter("LastName");

    // ADD PERSON IF NAME IS NOT NULL/EMPTY
    EntityManager em = emf.createEntityManager();
    try {
      if (firstName != null && lastName != null && !firstName.trim().isEmpty()
          && !lastName.trim().isEmpty()) {
        Customer customer = new Customer(firstName, lastName);
        em.getTransaction().begin();
        em.persist(customer);
        em.getTransaction().commit();
      }
    } finally {
      em.close();
    }
  } catch (Exception e) {
    response.getWriter().println("Persistence operation failed with reason: " + e.getMessage());
  }
}
```

## Test Locally


### Open DB Tunnel

[SAP HANA Cloud Platform Console Client][HCP-Console-Client] enables development, deployment and configuration of an application outside the Eclipse IDE as well as continuous integration and automation tasks. The tool is part of the [SDK][HCP-SDK]. You can find it in the tools folder of your SDK location.

So you can use a database tunnel to connect to a remote database instance through a secure connection. To open a tunnel, use the `open-db-tunnel` command in [console client][HCP-Console-Client] in [HCP SDK][HCP-SDK].

For example :

```
set HTTP_PROXY_HOST=proxy
set HTTP_PROXY_PORT=8080
set HTTPS_PROXY_HOST=proxy
set HTTPS_PROXY_PORT=8080
set HTTP_NON_PROXY_HOSTS="localhost"
neo open-db-tunnel -h int.sap.hana.ondemand.com -u cxxxxxx -a ixxxxxxsapdev --id hcpwechat
```

> If you have to configure proxy settings, specify them using the environment variables.

If the tunnel is opened successfully, the remote database instance can be used as a local database connection.

### Local Context Resource

The [Context][Context] element represents a web application, which is run within a particular virtual host. Each web application is based on a [Web Application Archive (WAR)][WAR] file, or a corresponding directory containing the corresponding unpacked contents, as described in the [Servlet Specification][Servlet-Specification-3.0] (version 2.2 or later).

You can declare the characteristics of the resource to be returned for [JNDI][JNDI] lookups of `<resource-ref>` and `<resource-env-ref>` elements in the web application deployment descriptor.

You can define the context file at *src/test/resources/context.xml* as

```xml
<Context >
  <Resource name="jdbc/DefaultDB"
        global="jdbc/DefaultDB"
        auth="Container"
        type="javax.sql.DataSource"
        driverClassName="com.sap.db.jdbc.Driver"
        url="jdbc:sap://localhost:30015/"
        username="<db_user>"
        password="<password>"

        maxActive="100"
        maxIdle="20"
        minIdle="5"
        maxWait="10000"/>
</Context>
```

### Maven Configurations and Tomcat7 Plugin

In order to define *com.sap.db.jdbc.Driver* as the driver class name, you need add the SAP HANA jdbc Java package as a dependency in *pom.xml*:

```xml
<dependency>
  <groupId>com.sap.db.jdbc</groupId>
  <artifactId>ngdbc</artifactId>
  <version>1.96.0</version>
  <scope>system</scope>
  <systemPath>${sap.cloud.sdk.path}/repository/.archive/lib/ngdbc.jar</systemPath>
</dependency>
```

You also need to add the *context.xml* file in maven tomcat7 plugin configuration:

```xml
<plugin>
  <groupId>org.apache.tomcat.maven</groupId>
  <artifactId>tomcat7-maven-plugin</artifactId>
  <version>2.0</version>
  <configuration>
    <contextFile>${project.basedir}/src/test/resources/context.xml</contextFile>
  </configuration>
</plugin>
```

### Run Locally

Execute mvn tomcat plugin goal `mvn tomcat7:run` then access the web application through *http://localhost:8080/wechat/message*


[github-project]:https://github.com/anypossiblew/hcp-java-wechat/tree/persistence

[Java-EE-6-Tutorial-Persistence]:https://docs.oracle.com/javaee/6/tutorial/doc/bnbpy.html
[EclipseLink]:http://www.eclipse.org/eclipselink/

[HCP-Console-Client]:https://help.hana.ondemand.com/help/frameset.htm?76132306711e1014839a8273b0e91070.html
[HCP-SDK]:https://help.hana.ondemand.com/help/frameset.htm?e7f54c25bb571014baee8ae351acd8d5.html
[HCP-Opening-DB-Tunnel]:https://help.hana.ondemand.com/help/frameset.htm?6930850a8f9a40489c01ed1aa381946d.html

[JNDI]:https://en.wikipedia.org/wiki/Java_Naming_and_Directory_Interface
[Context]:https://tomcat.apache.org/tomcat-7.0-doc/config/context.html
[WAR]:https://en.wikipedia.org/wiki/WAR_(file_format)
[Servlet-Specification-3.0]:http://download.oracle.com/otn-pub/jcp/servlet-3.0-fr-eval-oth-JSpec/servlet-3_0-final-spec.pdf
