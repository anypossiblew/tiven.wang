---
layout: post
title: Maven Best Practices
excerpt: "Maven Best Practices"
modified: 2017-04-27T17:00:00-00:00
categories: articles
tags: [Best Practices, Maven, CI/CD]
image:
  feature: /images/hana/masthead-microservices.jpg
comments: true
share: true
references:
---

* TOC
{:toc}

## Basic Operations

## Best Practices
### Resolving conflicts using the dependency tree

A project's dependency tree can be expanded to display dependency conflicts. For example, to find out why Commons Collections 2.0 is being used by the Maven Dependency Plugin, we can execute the following in the project's directory:

`mvn dependency:tree -Dverbose -Dincludes=commons-collections`

The verbose flag instructs the dependency tree to display conflicting dependencies that were omitted from the resolved dependency tree. In this case, the goal outputs:

```
[INFO] [dependency:tree]
[INFO] org.apache.maven.plugins:maven-dependency-plugin:maven-plugin:2.0-alpha-5-SNAPSHOT
[INFO] +- org.apache.maven.reporting:maven-reporting-impl:jar:2.0.4:compile
[INFO] |  \- commons-validator:commons-validator:jar:1.2.0:compile
[INFO] |     \- commons-digester:commons-digester:jar:1.6:compile
[INFO] |        \- (commons-collections:commons-collections:jar:2.1:compile - omitted for conflict with 2.0)
[INFO] \- org.apache.maven.doxia:doxia-site-renderer:jar:1.0-alpha-8:compile
[INFO]    \- org.codehaus.plexus:plexus-velocity:jar:1.1.3:compile
[INFO]       \- commons-collections:commons-collections:jar:2.0:compile
```

Thus we can see that Commons Collections 2.0 was chosen over 2.1 since it is nearer, and by default Maven resolves version conflicts with a nearest-wins strategy.

More specifically, in verbose mode the dependency tree shows dependencies that were omitted for: being a duplicate of another; conflicting with another's version and/or scope; and introducing a cycle into the dependency tree.

### Run `mvn spring-boot:run` from parent module?

You can do it by adding following In parent pom:

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <configuration>
        <skip>true</skip>
      </configuration>
    </plugin>
  </plugins>
</build>
```

And in your In my-app (Spring Boot module) pom:

```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <configuration>
    <fork>true</fork>
    <skip>false</skip>
  </configuration>
  <executions>
    <execution>
      <goals>
        <goal>repackage</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

Now you can do execute in project root:

`mvn -pl my-app -am spring-boot:run`

refer: https://stackoverflow.com/questions/41092200/run-mvn-spring-bootrun-from-parent-module

### Install jar locally

```
mvn install:install-file -Dfile=<path-to-file> -DgroupId=<group-id> \
    -DartifactId=<artifact-id> -Dversion=<version> -Dpackaging=<packaging>
```

https://maven.apache.org/guides/mini/guide-3rd-party-jars-local.html
