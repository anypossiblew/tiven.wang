---
layout: post
title: Try Cloud Foundry 9 - Message Broker
excerpt: "A message broker is an architectural pattern for message validation, transformation and routing. It mediates communication amongst applications, minimizing the mutual awareness that applications should have of each other in order to be able to exchange messages, effectively implementing decoupling."
modified: 2017-07-31T17:00:00-00:00
categories: articles
tags: [RabbitMQ, Message Broker, Cloud Foundry]
image:
  feature: https://drscdn.500px.org/photo/221853391/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=4291e5de5da2b66f0caa296e54fa72a8503ec2244674448a4e0d17724638dfb6
  credit: Fabian Heilos
  creditlink: https://www.500px.com/heilosphotography
comments: true
share: true
references:
  - title: "spring.io/guides - Messaging with RabbitMQ"
    url: "https://spring.io/guides/gs/messaging-rabbitmq/"
  - title: "www.rabbitmq.com/tutorials - Introduction"
    url: "https://www.rabbitmq.com/tutorials/tutorial-one-spring-amqp.html"
  - title: "pivotal.io/blog - Messaging Patterns for Event-Driven Microservices"
    url: "https://content.pivotal.io/blog/messaging-patterns-for-event-driven-microservices"
  - title: "pivotal.io/blog - Understanding When to use RabbitMQ or Apache Kafka"
    url: "https://content.pivotal.io/blog/understanding-when-to-use-rabbitmq-or-apache-kafka"
  - title: "Eventual Consistency: Decoupling Microservices with Spring AMQP and RabbitMQ"
    url: "https://programmaticponderings.com/2017/05/15/eventual-consistency-decoupling-microservices-with-spring-amqp-and-rabbitmq/"

---

> [Deer](https://en.wikipedia.org/wiki/Deer)

* TOC
{:toc}

[Message brokers][Message_broker] are elements in telecommunication or computer networks where software applications communicate by exchanging formally-defined messages. Message brokers are a building block of message-oriented middleware.

> 下載本篇完整代碼 [Github](https://github.com/tiven-wang/try-cf/tree/message-broker)

## Setup
添加 [Spring AMQP][spring-amqp] 的 Spring Boot starter 組件

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

## Application Code

### Create a RabbitMQ message receiver

首先我們創建一個 `Receiver` 去接收壞蛋出現的事件, 並讓我們的大英雄去抓住他

```java
@Component
public class Receiver {

	public void catchVillains(String villain) {
		try {
			// Assume hero catches the villain in 5 seconds
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("Catched villain<" + villain + ">");
	}

}
```

### Register the listener and send a message

[RabbitMQ][RabbitMQ] 消息模型的核心概念是: 消息製造者不會直接發送消息給 [Queue][queue] , 而是發給一個 [Exchange][exchange] , Exchange 負責分發消息給一個或者多個 Queue , 所以消息製造者分本不知道消息發送給了哪個 Queue.

```java
@Configuration
public class MQConfig {

	final static String queueName = "villains-events";

	@Bean
	Queue queue() {
		return new Queue(queueName, false);
	}

	@Bean
	TopicExchange exchange() {
		return new TopicExchange("villains-events-exchange");
	}

	@Bean
	Binding binding(Queue queue, TopicExchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(queueName);
	}

	@Bean
	SimpleMessageListenerContainer container(ConnectionFactory connectionFactory,
			MessageListenerAdapter listenerAdapter) {
		SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
		container.setConcurrentConsumers(2);
		container.setConnectionFactory(connectionFactory);
		container.setQueueNames(queueName);
		container.setMessageListener(listenerAdapter);
		return container;
	}

	@Bean
	MessageListenerAdapter listenerAdapter(Receiver receiver) {
		return new MessageListenerAdapter(receiver, "catchVillains");
	}
}
```

* `container.setConcurrentConsumers(2);` 指定消息接收者同時可以處理2個消息

> Spring Boot automatically creates a connection factory and a `RabbitTemplate`, reducing the amount of code you have to write.

### Create a message sender

使用 `RabbitTemplate` 發送消息給隊列

```java
@Component
public class Sender {

	private final RabbitTemplate rabbitTemplate;

	public Sender(RabbitTemplate rabbitTemplate) {
		this.rabbitTemplate = rabbitTemplate;
	}

	public void send(String message) throws Exception {
		System.out.println("Sending villains events...");
		rabbitTemplate.convertAndSend(MQConfig.queueName, message);
	}
}
```

### Create villains Restful API

在controller裡增加大壞蛋叫囂的方法

```java
@Autowired
private Sender sender;

@RequestMapping(value="/villains", method=RequestMethod.POST)
String home(@RequestParam("message") String message) throws Exception {
  sender.send(message);
    return "Done!";
}
```

## Test

`docker run --rm --name my-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management`

打开浏览器并访问：[http://localhost:15672/](http://localhost:15672/)，并使用默认用户guest登录，密码也为guest。

執行命令
`mvn spring-boot:run`
運行應用程序。

壞蛋出現了：

**POST** to *http://localhost:8080/villains?message=I am here!*

你可以在後台看到

```
Sending villains events...
Catched villain<I am here!>
```

連續發送多個消息，可以驗證大英雄可以同時處理兩個大壞蛋。

## Deploy to CloudFoundry

部署到 [CloudFoundry][CloudFoundry] 之前我們需要創建一個 AMQP 服務，這裡我們使用 [Pivotal CloudFoundry][pivotal-console] Marketplace 裡提供的 CloudAMQP 服務

`cf create-service cloudamqp lemur try-cf-amqp`

創建成功後，把 CloudAMQP 服務名稱加入 manifest 文件中，全部信息如下

```yaml
---
applications:
- name: try-cf-message-broker
  buildpack: java_buildpack
  instances: 1
  memory: 200M
  host: try-cf-message-broker
  path: target/try-cf-0.0.1-SNAPSHOT.jar
  services:
  - try-cf-amqp
```

上傳

`cf push`

上傳成功之後訪問鏈接即可發送消息

*https://try-cf-message-broker.cfapps.io/villains?message=I am here!*

可以查看 CloudFoundry 的應用後台打印信息

`cf logs try-cf-message-broker`



[Message_broker]:https://en.wikipedia.org/wiki/Message_broker
[spring-amqp]:https://projects.spring.io/spring-amqp/
[RabbitMQ]:https://www.rabbitmq.com
[queue]:https://www.rabbitmq.com/amqp-0-9-1-quickref.html#class.queue
[exchange]:https://www.rabbitmq.com/amqp-0-9-1-quickref.html#class.exchange
[CloudFoundry]:https://www.cloudfoundry.org/
[pivotal-platform]:https://pivotal.io/platform
[pivotal-services]:https://pivotal.io/platform/services
[pivotal-console]:https://console.run.pivotal.io/
