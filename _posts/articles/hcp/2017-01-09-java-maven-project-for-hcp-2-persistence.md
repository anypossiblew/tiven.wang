---
layout: post
modified: 2017-01-09T17:00:00-00:00
categories: articles
tags: [Maven, Java, HCP, HANA]
image:
  feature: cloud/masthead-incubators.jpg
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

`neo open-db-tunnel -h <host> -u <user> -a <account> --id <schema ID>`


[github-project]:https://github.com/anypossiblew/hcp-java-wechat/tree/persistence

[Java-EE-6-Tutorial-Persistence]:https://docs.oracle.com/javaee/6/tutorial/doc/bnbpy.html
[EclipseLink]:http://www.eclipse.org/eclipselink/
