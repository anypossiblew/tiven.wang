---
layout: post
title: Spring Boot - Caching
excerpt: "The Spring Framework provides support for transparently adding caching to an application. At its core, the abstraction applies caching to methods, reducing thus the number of executions based on the information available in the cache. The caching logic is applied transparently, without any interference to the invoker."
modified: 2017-12-07T17:00:00-00:00
categories: articles
tags: [Redis, Hibernate, Spring Boot]
image:
  vendor: nationalgeographic
  feature: /content/dam/photography/PROOF/2017/November/animals-from-above-yourshot/01-animals-from-above-prod-yourshot-230366-11044091.adapt.1190.1.jpg
  credit: Phillip Chang
  creditlink: http://yourshot.nationalgeographic.com/profile/230366/
comments: true
share: true
references:
  - id: 1
    title: "Spring Boot features - Caching"
    url: "https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-caching.html"
  - title: "Caching Data with Spring"
    url: "https://spring.io/guides/gs/caching/"
  - title: "Accessing Data with JPA"
    url: "https://spring.io/guides/gs/accessing-data-jpa/"

---

* TOC
{:toc}

参考文章[https://spring.io/guides/gs/caching/](https://spring.io/guides/gs/caching/)步骤运行起一个基本的 Spring Boot Cache 程序。

## Run on Docker

使用 Maven 打包应用：

`mvn package`

在 Docker 容器里运行此 Spring Boot 应用程序：

`docker run --rm -p 8080:8080 -v <your-project-root>/gs-caching/complete/target:/app java:8 java -D"java.security.egd"=file:/dev/./urandom -jar /app/gs-caching-0.1.0.jar`

## With Hibernate

Spring Boot Cache 的基本应用我们了解，接下来看看它如何与具体的 ORM 框架结合使用。这里使用 [Spring Boot JPA][boot-features-jpa-and-spring-data] 默认的 [Hibernate][Hibernate] 框架和常用的数据库 [Postgresql][Postgresql] 。

### Local Postgres
首先使用 [Docker][Docker] 工具创建一个本地的 [Postgres][docker-postgres] 数据库，如下面这句命令（默认创建用户名为 __postgres__ 或者使用环境变量 `POSTGRES_USER` 指定用户名）

```
docker run --name try-spring-boot-psql \
    -p 5432:5432 \
    -e POSTGRES_DB=tsb \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -d postgres
```

还是使用 Docker 容器来检查我们创建的数据库，可以看到 Database `tsb` 已被创建

```
$ docker run -it --rm --link try-spring-boot-psql:postgres postgres psql -h postgres -U postgres
Password for user postgres:
psql (9.6.3)
Type "help" for help.

postgres=# \l
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 tsb       | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
```

### Spring JPA
想要 Spring Boot 具有连接和访问数据库的能力，需要添加 JPA 和 Spring Data。和具体某个数据库的驱动程序。如下

```xml
<dependencies>
	...
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-data-jpa</artifactId>
	</dependency>
	<dependency>
		<groupId>org.postgresql</groupId>
		<artifactId>postgresql</artifactId>
	</dependency>
</dependencies>
```

要访问数据库势必要有些连接信息，如下配置在 `application.yml` 文件中数据源信息

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tsb
    username: postgres
    password: mysecretpassword
  jpa:
    generate-ddl: true
```

其他的涉及 JPA 的代码修改这里不展开，请参考 Spring Boot 相关文档。其中 `BookRepository` 如下

```java
public interface BookRepository extends CrudRepository<Book, Long> {

  @Cacheable("books")
  Book getByIsbn(String isbn);
}
```

`CommandLineRunner` 需要修改，增加创建数据的代码。为了防止残留数据影响下次运行，代码最后清空表数据。

```java
public void run(String... args) throws Exception {
  logger.info(".... Saving books");
  logger.info("isbn-1234 -->" + bookRepository.save(new Book("isbn-1234", "isbn 1234")));
  logger.info("isbn-4567 -->" + bookRepository.save(new Book("isbn-4567", "isbn 4567")));

  logger.info(".... Fetching books");
  logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
  logger.info("isbn-4567 -->" + bookRepository.getByIsbn("isbn-4567"));
  logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
  logger.info("isbn-4567 -->" + bookRepository.getByIsbn("isbn-4567"));
  logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
  logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));

  logger.info(".... Cleaning books");
  bookRepository.deleteAll();
}
```

为了显示程序是否访问了数据库还是从缓存里读取的数据，可以打开显示 SQL 的配置 `show-sql: true`

```yaml
spring:
  ...
  jpa:
    ...
    show-sql: true
```

运行程序 `mvn spring-boot:run` 可以在后台看到打印信息如下

```
2017-12-11 17:56:28.236  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Saving books
Hibernate: select nextval ('hibernate_sequence')
Hibernate: insert into book (isbn, title, id) values (?, ?, ?)
2017-12-11 17:56:28.331  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
Hibernate: select nextval ('hibernate_sequence')
Hibernate: insert into book (isbn, title, id) values (?, ?, ?)
2017-12-11 17:56:28.431  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-11 17:56:28.491  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Fetching books
Hibernate: select book0_.id as id1_0_, book0_.isbn as isbn2_0_, book0_.title as title3_0_ from book book0_ where book0_.isbn=?
2017-12-11 17:56:28.799  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
Hibernate: select book0_.id as id1_0_, book0_.isbn as isbn2_0_, book0_.title as title3_0_ from book book0_ where book0_.isbn=?
2017-12-11 17:56:28.807  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-11 17:56:28.826  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-11 17:56:28.828  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-11 17:56:28.829  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-11 17:56:28.830  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-11 17:56:28.833  INFO 22868 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Cleaning books
Hibernate: select book0_.id as id1_0_, book0_.isbn as isbn2_0_, book0_.title as title3_0_ from book book0_
Hibernate: delete from book where id=?
Hibernate: delete from book where id=?
```

可以看到在第一次读取数据的时候产生了 SQL 语句，也就是进行了数据库访问，但在之后就没有产生，也即它是从缓存里读取的数据。

### Spring Cache

不难发现这里有个可以改进的地方，在创建数据后可以不需要再次去数据库里面查询，而是直接从缓存里面。
这就需要另外一个 Spring Cache 注解 [`@CachePut(cacheNames = "books", key = "#p0.isbn")`][CachePut] ，其中指定缓存的名称和 Key 关键字段。

```java
public interface BookRepository extends CrudRepository<Book, Long> {

  @Cacheable("books")
  Book getByIsbn(String isbn);

  @CachePut(cacheNames = "books", key = "#p0.isbn")
  Book save(Book isbn);
}
```

然后从下面运行日志可以看出，当查询数据时并没有产生 SQL ，而是从缓存中读取的:

```
2017-12-13 15:08:27.112  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Saving books
Hibernate: select nextval ('hibernate_sequence')
Hibernate: insert into book (isbn, title, id) values (?, ?, ?)
2017-12-13 15:08:27.250  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
Hibernate: select nextval ('hibernate_sequence')
Hibernate: insert into book (isbn, title, id) values (?, ?, ?)
2017-12-13 15:08:27.261  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-13 15:08:27.262  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Fetching books
2017-12-13 15:08:27.267  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-13 15:08:27.271  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-13 15:08:27.278  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-13 15:08:27.280  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-13 15:08:27.285  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-13 15:08:27.286  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-13 15:08:27.288  INFO 25900 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Cleaning books
Hibernate: select book0_.id as id1_0_, book0_.isbn as isbn2_0_, book0_.title as title3_0_ from book book0_
Hibernate: delete from book where id=?
Hibernate: delete from book where id=?
```

到此步骤的完整代码 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/caching/spring-cache)

### Cache Coherence in Distributed Systems
[缓存一致性（Cache Coherence）][Cache_coherence]问题存在于分布式应用程序系统中。
基于本机内存的缓存机制在分布式系统中都存在数据一致性问题，同时也有很多成熟的理论和解决方案，这里对此不展开讨论。

![File:Cache_Coherency_Generic](https://en.wikipedia.org/wiki/Cache_coherence#/media/File:Cache_Coherency_Generic.png)

[分布式服务化系统一致性的“最佳实干”](http://www.jianshu.com/p/1156151e20c8)

## Caching Frameworks

[Memcached vs. Redis?](https://stackoverflow.com/questions/10558465/memcached-vs-redis)

### Redis

添加依赖包

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

运行一个 Docker [Redis][docker-redis] 实例：
`docker run --name try-spring-boot-redis -p 6379:6379 -d redis`

配置 [Redis][redis] 连接信息

```yaml
spring:
  ...
  redis:
    host: localhost
    port: 6379
    pool:
      max-idle: 8
      min-idle: 0
      max-active: 8
      max-wait: 1
```

稍微修改一下代码，创建之前查询一下，当缓存中存在时不创建数据。

```java
logger.info(".... Saving books");
if(null == bookRepository.getByIsbn("isbn-1234")) {
  logger.info("isbn-1234 -->" + bookRepository.save(new Book("isbn-1234", "isbn 1234")));
}
if(null == bookRepository.getByIsbn("isbn-4567")) {
  logger.info("isbn-4567 -->" + bookRepository.save(new Book("isbn-4567", "isbn 4567")));
}
```

重新运行 `mvn spring-boot:run` 输出日志跟之前的并没有什么不同，缓存和数据库中不存在，然后就创建了两条数据。
再次运行 `mvn spring-boot:run` 应该有再次创建数据的 SQL，因为之前运行后都会清空数据。
但由于现在使用了 [Redis][redis] 作为独立于应用程序进程的后端服务，缓存并没有并清空，所以再次运行仍然能查询到缓存数据。

```
2017-12-14 10:43:57.087  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Saving books
2017-12-14 10:43:57.237  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Fetching books
2017-12-14 10:43:57.241  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-14 10:43:57.246  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-14 10:43:57.249  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-14 10:43:57.279  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-4567 -->Book{isbn='isbn-4567', title='isbn 4567'}
2017-12-14 10:43:57.288  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-14 10:43:57.294  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : isbn-1234 -->Book{isbn='isbn-1234', title='isbn 1234'}
2017-12-14 10:43:57.297  INFO 23852 --- [           main] w.t.springbootguides.caching.AppRunner   : .... Cleaning books
2017-12-14 10:43:57.353  INFO 23852 --- [           main] o.h.h.i.QueryTranslatorFactoryInitiator  : HHH000397: Using ASTQueryTranslatorFactory
Hibernate: select book0_.id as id1_0_, book0_.isbn as isbn2_0_, book0_.title as title3_0_ from book book0_
```

解决这个问题的办法，在 `deleteAll` 方法上加上清空缓存的操作

```java
@CacheEvict(cacheNames = "books", allEntries = true)
void deleteAll();
```

重新运行两次程序，便可以看到创建了数据，证明缓存已被清空。

完整代码 [Github](https://github.com/tiven-wang/spring-boot-guides/tree/caching/redis)

### Memcached

### EhCache

## JSR-107 Cache

[JCache][JCache] is the Java caching API. It was defined by [JSR107][JSR107]. It defines a standard Java Caching API for use by developers and a standard [SPI][SPI] ("Service Provider Interface") for use by implementers.



[boot-features-jpa-and-spring-data]:https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-sql.html#boot-features-jpa-and-spring-data
[Hibernate]:http://hibernate.org/
[Postgresql]:https://www.postgresql.org/
[Docker]:https://www.docker.com/
[docker-postgres]:https://hub.docker.com/_/postgres/
[docker-redis]:https://hub.docker.com/_/redis/
[redis]:https://redis.io/
[JSR107]:https://github.com/jsr107/jsr107spec
[JCache]:https://commons.apache.org/proper/commons-jcs/JCSandJCACHE.html
[SPI]:https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html

[CachePut]:https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/cache/annotation/CachePut.html

[Cache_coherence]:https://en.wikipedia.org/wiki/Cache_coherence
