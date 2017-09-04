---
layout: post
title: Reactive Design Patterns - Spring Boot Messaging
excerpt: ""
modified: 2017-08-31T17:00:00-00:00
categories: articles
tags: [Latency, Reactive]
image:
  vendor: unsplash
  feature: /photo-1502741338009-cac2772e18bc?dpr=1.5&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=
  credit: Joanna Kosinska
  creditlink: https://unsplash.com/@joannakosinska
comments: true
share: true
mathjax: true
references:
  - title: "Spring Boot features Messaging"
    url: "https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-messaging.html"
  - title: "Messaging with JMS"
    url: "https://spring.io/guides/gs/messaging-jms/"

---

* TOC
{:toc}

We use Spring Boot and Spring JMS to build the messaging application.

How to setup a Spring Boot application, please refer to [Spring Boot](/articles/try-cf-7-spring-boot/) on series [Try Cloud Foundry](/series/try-cloudfoundry/).

## Basic
### Dependencies

Add the dependencies:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
<dependency>
  <groupId>org.apache.activemq</groupId>
  <artifactId>activemq-broker</artifactId>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
</dependency>
```

You can see the dependency tree using `mvn dependency:tree`:

```
[INFO] wang.tiven.reactivex:messaging-jms:jar:0.1.0
[INFO] +- org.springframework.boot:spring-boot-starter-activemq:jar:1.5.6.RELEASE:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter:jar:1.5.6.RELEASE:compile
[INFO] |  |  +- org.springframework.boot:spring-boot:jar:1.5.6.RELEASE:compile
[INFO] |  |  +- org.springframework.boot:spring-boot-autoconfigure:jar:1.5.6.RELEASE:compile
[INFO] |  |  +- org.springframework.boot:spring-boot-starter-logging:jar:1.5.6.RELEASE:compile
[INFO] |  |  |  +- ch.qos.logback:logback-classic:jar:1.1.11:compile
[INFO] |  |  |  |  \- ch.qos.logback:logback-core:jar:1.1.11:compile
[INFO] |  |  |  +- org.slf4j:jcl-over-slf4j:jar:1.7.25:compile
[INFO] |  |  |  +- org.slf4j:jul-to-slf4j:jar:1.7.25:compile
[INFO] |  |  |  \- org.slf4j:log4j-over-slf4j:jar:1.7.25:compile
[INFO] |  |  +- org.springframework:spring-core:jar:4.3.10.RELEASE:compile
[INFO] |  |  \- org.yaml:snakeyaml:jar:1.17:runtime
[INFO] |  \- org.springframework:spring-jms:jar:4.3.10.RELEASE:compile
[INFO] |     +- org.springframework:spring-aop:jar:4.3.10.RELEASE:compile
[INFO] |     +- org.springframework:spring-beans:jar:4.3.10.RELEASE:compile
[INFO] |     +- org.springframework:spring-context:jar:4.3.10.RELEASE:compile
[INFO] |     |  \- org.springframework:spring-expression:jar:4.3.10.RELEASE:compile
[INFO] |     +- org.springframework:spring-messaging:jar:4.3.10.RELEASE:compile
[INFO] |     \- org.springframework:spring-tx:jar:4.3.10.RELEASE:compile
[INFO] +- org.apache.activemq:activemq-broker:jar:5.14.5:compile
[INFO] |  +- org.apache.activemq:activemq-client:jar:5.14.5:compile
[INFO] |  |  +- org.slf4j:slf4j-api:jar:1.7.25:compile
[INFO] |  |  +- org.apache.geronimo.specs:geronimo-jms_1.1_spec:jar:1.1.1:compile
[INFO] |  |  +- org.fusesource.hawtbuf:hawtbuf:jar:1.11:compile
[INFO] |  |  \- org.apache.geronimo.specs:geronimo-j2ee-management_1.1_spec:jar:1.0.1:compile
[INFO] |  \- org.apache.activemq:activemq-openwire-legacy:jar:5.14.5:compile
[INFO] \- com.fasterxml.jackson.core:jackson-databind:jar:2.8.9:compile
[INFO]    +- com.fasterxml.jackson.core:jackson-annotations:jar:2.8.0:compile
[INFO]    \- com.fasterxml.jackson.core:jackson-core:jar:2.8.9:compile
```

### Create a message receiver

Marked the class as a Spring `@Component`, and marked the method who will receive the message as a `@JmsListener`:

```java
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class Receiver {

    @JmsListener(destination = "mailbox", containerFactory = "myFactory")
    public void receiveMessage(Email email) {
        System.out.println("Received <" + email + ">");
    }

}
```

### Config JMS with Spring Boot

`@EnableJms` triggers the discovery of methods annotated with `@JmsListener`, creating the message listener container under the covers.

Use the Spring Boot default bean classes for JMS `JmsListenerContainerFactory` and `MessageConverter` configurations.

```java
@SpringBootApplication
@EnableJms
public class Application {

  @Bean
  public JmsListenerContainerFactory<?> myFactory(ConnectionFactory connectionFactory,
                                                  DefaultJmsListenerContainerFactoryConfigurer configurer) {
    DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
    // This provides all boot's default to this factory, including the message converter
    configurer.configure(factory, connectionFactory);
    // You could still override some of Boot's default if necessary.
    return factory;
  }

  @Bean // Serialize message content to json using TextMessage
  public MessageConverter jacksonJmsMessageConverter() {
    MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
    converter.setTargetType(MessageType.TEXT);
    converter.setTypeIdPropertyName("_type");
    return converter;
  }

  public static void main(String[] args) {
    // Launch the application
    ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

    JmsTemplate jmsTemplate = context.getBean(JmsTemplate.class);

    // Send a message with a POJO - the template reuse the message converter
    System.out.println("Sending an email message.");
    jmsTemplate.convertAndSend("mailbox", new Email("info@example.com", "Hello"));
  }
}
```

Startup the applicaiton by `mvn spring-boot:run` will see in console:

```
Sending an email message.
Received <Email{to=info@example.com, body=Hello}>
```

Get the whole project source codes from [Github](https://github.com/tiven-wang/reactive-design-patterns/tree/spring-jms-basic)

## Dynamic Queues
