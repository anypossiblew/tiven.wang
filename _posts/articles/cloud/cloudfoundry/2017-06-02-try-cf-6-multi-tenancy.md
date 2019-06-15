---
layout: post
theme: UbuntuMono
series:
  url: try-cloudfoundry
  title: Try Cloud Foundry
title: Multi Tenancy
excerpt: "Multitenancy is an approach in which an instance of an application is used by different customers and thus dropping software development and deployment costs when compared to a single-tenant solution where multiple parts would need to be touched in order to provision new clients or update existing tenants. Cloud Foundry supports Multi Tenancy using Identity Zone Management APIs of UAA"
modified: 2017-09-19T17:00:00-00:00
categories: articles
tags: [Multi Tenancy, Cloud Foundry, Pivotal]
image:
  vendor: twitter
  feature: /media/DHcViYAUQAYO3gq.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos
comments: true
share: true
references:
  - title: "Cloud Foundry - The User Account and Authentication Service (UAA)"
    url: "https://docs.cloudfoundry.org/api/uaa/index.html"
---

* TOC
{:toc}

[Try CloudFoundry Series](/series/try-cloudfoundry/)

## Multi Tenancy

Multi Tenancy涉及到数据库、应用服务、认证授权服务等都要支持。

Multitenancy is an approach in which an instance of an application is used by different customers and thus dropping software development and deployment costs when compared to a single-tenant solution where multiple parts would need to be touched in order to provision new clients or update existing tenants.

There are multiple well known strategies to implement this architecture, ranging from highly isolated (like single-tenant) to everything shared.

![Multi tenancy degrees](http://tech.asimio.net/images/multi-tenancy-degrees.png)

### Data Isolation

对于多租户(Multi Tenancy)进行数据隔离的方式主要有三种：

* __Table__ 级别：Tables contain a tenant discriminator column (e.g. TENANT). This appproach provides by definition the lowest isolation level: there is no authorization check at database level, restore can affect other tenants and it seems to be the least scalable approach (not appropriate for big data volumes).
* __Schema__ 级别：Having an "tenant"-specific schema provides additional capabilities: option to secure data by tenant specific authorization checks on database level (HANA using db-access token), option to enhance schema by customer-specific additional columns / tables, and eventually the option to provide customer dedicated backup and restore service. If implemented properly this approch seems to be an economic approach.
* __Database__ 级别：Offers best "bad neighborhood protection" in terms of data and failure isolation as there is no resource sharing. As the maintenance and resource costs are much higher this seems to be a premium approach for larger customers willing to pay for it.

## NoSQL Database Multi-tenancy

我们先来看一下比较简单一些的 NoSQL 数据库的 MultiTenant 实现方式。
使用MongoDB实现多租户(multi-tenant)应用程序时有三种方式：

1. 所有租户使用同一 Schema(即Database) 和同一 Collection，以租户字段(tenant-specific fields)相互区分，如下样例
  ```json
  {
      "_id": {
          "$oid": "59ba4772ad06e8001c1c8096"
      },
      "_class": "wang.tiven.trycf.model.Hero",
      "tenant": "5u8rmufu",
      "name": "tiven wang"
  }
  ```
2. 所有租户同一 Schema(即Database)，每个租户一个 Collection（前缀加名称）
```yaml
Schema: gm6kda63
  Tenant 1:
    Collection: 5u8rmufu_heros
  Tenant 2:
    Collection: mfhjmudi_heros
```
3. 每个租户一个 Schema(即Database)，如
```yaml
Tenant 1:
  - Schema: gm6kda63
    Collection: heros
Tenant 2:
  - Schema: jn8fkdm45
    Collection: heros
```

不同的人推荐不同的方式，他们都有各自的理由。

https://stackoverflow.com/questions/2748825/what-is-the-recommended-approach-towards-multi-tenant-databases-in-mongodb

### On Collection Level

我们看如何实现 Option 2：所有租户同一 Schema(即Database)，每个租户一个 Collection。

对于每一种方式来说都要实现一个 Tenant Provider 来决定当前用户(User)是属于哪个租户(Tenant)

```java
@Component("tenantProvider")
public class TenantProvider {
  public String getTenantId() {
    // … implement ThreadLocal lookup here
  }
}
```

然后在指定 Document name 时拼上 tenant

```java
@Document(collection = "#{tenantProvider.getTenantId()}_heros")
public class Hero {
  ...
}
```

查看完整代码[The collection level](https://github.com/tiven-wang/try-cf/tree/collection-level)

### On Database Level

每个租户一个 Database, 如果我们为此应用配置多个MongoDB Services的话

```yaml
---
applications:
- name: try-cf-multi-tenancy
  services:
    - try-cf-mongodb1
    - try-cf-mongodb2
```

`spring cloud connectors` 中的`MongoDbFactoryCreator`会为每一个`MongoServiceInfo`即 MongoDB Service 创建一个 `MongoDbFactory`, 所以在创建 `MongoTemplate` 时输入参数要设置为`array`或者`List`。
Override `MongoDataAutoConfiguration` 类里的配置 `MongoTemplate` 的方法，其他依赖于`MongoDbFactory`的方法也要Override成`List<MongoDbFactory>`参数的形式：

```java
@Bean
public MultiTenantMongoDbFactory multiTenantMongoDbFactory(List<MongoDbFactory> mongoDbFactories, TenantProvider tenantProvider) {
  return new MultiTenantMongoDbFactory(mongoDbFactories, tenantProvider);
}

@Bean
@ConditionalOnMissingBean
public MongoTemplate mongoTemplate(MultiTenantMongoDbFactory multiTenantMongoDbFactory,
    MongoConverter converter) throws UnknownHostException {
  return new MongoTemplate(multiTenantMongoDbFactory, converter);
}
```

其中自定义的`MultiTenantMongoDbFactory`如下

```java
/**
 * Multi-Tenant MongoDbFactory implementation
 *
 * @author Tiven Wang
 *
 */
public class MultiTenantMongoDbFactory implements MongoDbFactory {
  private Log logger = LogFactory.getLog(MultiTenantMongoDbFactory.class);

  private final HashMap<String, MongoDbFactory> mongoDbFactories = new HashMap<String, MongoDbFactory>();
  private final PersistenceExceptionTranslator exceptionTranslator;

  @Autowired
  private TenantProvider tenantProvider;

  public MultiTenantMongoDbFactory(List<MongoDbFactory> mongoDbFactories) {
    for(MongoDbFactory mongoDbFactory : mongoDbFactories) {
      logger.debug("Put the mongoDbFactory: " + mongoDbFactory.getDb().getName());
      this.addMongoDbFactory(mongoDbFactory.getDb().getName(), mongoDbFactory);
    }
    this.exceptionTranslator = new MongoExceptionTranslator();
  }

  @Override
  public DB getDb() throws DataAccessException {
    return mongoDbFactories.get(tenantProvider.getTenantId()).getDb();
  }

  @Override
  public DB getDb(String dbName) throws DataAccessException {
    return mongoDbFactories.get(tenantProvider.getTenantId()).getDb(dbName);
  }

  @Override
  public PersistenceExceptionTranslator getExceptionTranslator() {
    return this.exceptionTranslator;
  }

  /**
   * Add a MongoDbFactory for a tenant
   *
   * @param tenant
   * @param mongoDbFactory
   */
  public void addMongoDbFactory(String tenant, MongoDbFactory mongoDbFactory) {
  	this.mongoDbFactories.put(tenant, mongoDbFactory);
  }
}
```

Database level 完整代码 [Github](https://github.com/tiven-wang/try-cf/tree/db-level)

References:

https://medium.com/@alexantaniuk/guide-to-multi-tenancy-with-spring-boot-and-mongodb-78ea5ef89466

## Relational Database Multi-tenancy

上一章我们看到了针对 NoSQL 数据的 MultiTenant 程序比较简单。接下来我们再看一下对于传统的 Relational Database 如何编写 Java 语言的 MultiTenant 程序。

首先创建一个没有 MultiTenancy 功能的连接 Postgres 数据库的 Java 语言的 CloudFoundry 应用程序（如何编写我们不再赘述，之前文章多次讲到，有需要的读者可以翻阅），项目完整代码[Github](https://github.com/tiven-wang/try-cf/tree/postgres/)。

### Spring Routing DataSource

Java里的[DataSource][sqldatasources]对象是程序获取数据库连接的优选方式，它可以提供连接池(connection pooling)和分布式事务等能力。Java系统标准库只提供了DataSource interface，不同的数据库供应商或者第三方提供了各自的实现方式。其中 Spring 提供了一种可以自定义 Routing 的抽象实现 [AbstractRoutingDataSource][AbstractRoutingDataSource]，我们通过继承它实现自己的路由逻辑：通过程序运行上下文的Tenant去查找CloudFoundry平台配置的对应数据库的DataSource。

首先把类 [AbstractRoutingDataSource] 所在 package 添加到项目中来，添加 Spring Boot 依赖：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

然后实现自己的 DataSource 类：

```java
public class MultiTenantRoutingDataSource extends AbstractRoutingDataSource {

  @Autowired
  private TenantProvider tenantProvider;

  @Override
  protected Object determineCurrentLookupKey() {
    return tenantProvider.getTenantId();
  }
}
```

我们只需要自定的方法 determineCurrentLookupKey ，告诉它我们当前的 Tenant 标志，让它查找对应的 DataSource。这里我们直接使用 TenantProvider 类来获取当前的 Tenant Id。

那么它去哪里查找 DataSource 呐，看一下我们的 Spring Boot Configurations，里面定义了此 Bean，把 Spring 上下文中的 `Map<String, DataSource> dataSources` 注入此 DataSource。dataSources 是 [Spring Cloud Connectors][spring-cloud-connectors] 在检索 CloudFoundry 环境后提供的。关于 Spring Cloud Connectors 更详细的介绍参阅 [Try Cloud Foundry 8 - Spring Cloud Connector](/articles/try-cf-8-spring-cloud-connector/)

```java
@Bean
public MultiTenantRoutingDataSource cloudRoutingDataSource(Map<String, DataSource> dataSources) {
  MultiTenantRoutingDataSource dataSource = new MultiTenantRoutingDataSource();
  dataSource.setTargetDataSources((Map)dataSources);
  return dataSource;
}
```

DataSource 配置完成后，再把它注入到 `HibernateJpaAutoConfiguration` 中，通过重写它的构造方法：

```java
@Configuration
@EnableJpaRepositories(basePackages = "wang.tiven.trycf.repository")
@EntityScan(basePackages = "wang.tiven.trycf.model")
public class MultitenantHibernateJpaAutoConfiguration extends HibernateJpaAutoConfiguration {

  public MultitenantHibernateJpaAutoConfiguration(MultiTenantRoutingDataSource dataSource, JpaProperties jpaProperties,
      ObjectProvider<JtaTransactionManager> jtaTransactionManager,
      ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
    super(dataSource, jpaProperties, jtaTransactionManager, transactionManagerCustomizers);
  }
}
```

并且从 Spring Boot Configurations 里排除:

```yaml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
      - org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
```

MultiTenant Routing DataSource 完整代码 [Github](https://github.com/tiven-wang/try-cf/tree/multi-tenant-routing-datasource)

### Hibernate Multi-tenancy

如果你的 [ORM][orm] framework 用的是 [Hibernate][Hibernate]，那么还可以用 Hibernate 提供的 [MultiTenancy 方式][hibernate-Multi-tenancy]。

Hibernate 可以自定义设置策略`hibernate.multiTenancy`为`SCHEMA`或者`DATABASE`等，然后再提供两个你自定义逻辑的类配置（get tenant id then get connection by tenant id）：

* `hibernate.tenant_identifier_resolver` 解决获取当前 tenant 标识的逻辑
* `hibernate.multi_tenant_connection_provider` 提供如何获取不同 tenant 的不同 connection 的逻辑

#### Postgres Database Level

在数据库连接层隔离 Tenant 这样实现，为每个 Tenant 配置不同的 Database Services，通过 Tenant Id 查找不同 Tenant 对应的 Database Service 的 DataSource 对象。

解决获取 Tenant 的逻辑很简单，主要还是要看 `TenantProvider` 实现逻辑，后面会介绍。

```java
public class TenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {

  @Autowired
  private TenantProvider tenantProvider;

  @Override
  public String resolveCurrentTenantIdentifier() {
    return tenantProvider.getTenantId();
  }

  @Override
  public boolean validateExistingCurrentSessions() {
    return false;
  }
}
```

`MultiTenantConnectionProvider` 的实现也很简单，把 Spring 上下文(Application Context)中的 `Map<String, DataSource> dataSources` 注入此类，然后通过 Tenant Identifier 选择相应的 DataSources:

```java
public class CloudDataSourceMultiTenantConnectionProviderImpl extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl {
  private Log logger = LogFactory.getLog(CloudDataSourceMultiTenantConnectionProviderImpl.class);

  private static final long serialVersionUID = 6086628073272413281L;

  @Autowired
  private Map<String, DataSource> dataSources;

  @Override
  protected DataSource selectAnyDataSource() {
    return dataSources.values().iterator().next();
  }

  @Override
  protected DataSource selectDataSource(String tenantIdentifier) {
    return dataSources.get(tenantIdentifier);
  }

}
```

然后重新定义 `HibernateJpaAutoConfiguration` 的逻辑，重写方法 `customizeVendorProperties` 加入 hibernate multi-tenant 的配置：

```java
@Configuration
@EnableJpaRepositories(basePackages = "wang.tiven.trycf.repository")
@EntityScan(basePackages = "wang.tiven.trycf.model")
public class MultitenantHibernateJpaAutoConfiguration extends HibernateJpaAutoConfiguration {

  public MultitenantHibernateJpaAutoConfiguration(DataSource[] dataSource, JpaProperties jpaProperties,
      ObjectProvider<JtaTransactionManager> jtaTransactionManager,
      ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
    super(dataSource[0], jpaProperties, jtaTransactionManager, transactionManagerCustomizers);
  }

  @Override
  protected void customizeVendorProperties(Map<String, Object> vendorProperties) {
    super.customizeVendorProperties(vendorProperties);
    vendorProperties.put("hibernate.multiTenancy", "DATABASE");
    vendorProperties.put("hibernate.multi_tenant_connection_provider", multitenantConnectionProvider());
    vendorProperties.put("hibernate.tenant_identifier_resolver", multitenantIdentifierResolver());
  }

  @Bean
  public CurrentTenantIdentifierResolver multitenantIdentifierResolver() {
    return new TenantIdentifierResolverImpl();
  }

  @Bean
  public MultiTenantConnectionProvider multitenantConnectionProvider() {
    return new CloudDataSourceMultiTenantConnectionProviderImpl();
  }
}
```

Multi-Tenant Database level 完整代码[Github](https://github.com/tiven-wang/try-cf/tree/postgres-db-level/)

References:

http://tech.asimio.net/2017/01/17/Multitenant-applications-using-Spring-Boot-JPA-Hibernate-and-Postgres.html

https://docs.jboss.org/hibernate/core/4.2/devguide/en-US/html/ch16.html#d5e4755

https://github.com/benjaminrclark/cate


#### Postgres Schema Level

如果想要做到 Schema 级别的 Multi-Tenancy 的话，Hibernate 可以设置 `hibernate.multiTenancy` 为 "SCHEMA"，别且重新定义 `MultiTenantConnectionProvider`，在根据 Tenant identifier 获取 connection 方法 `getConnection` 里执行 Schema 的更改，例如对于Postgres的Schema设置执行命令 `SET search_path TO SchemaName`:

```java
public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider, Stoppable {

  @Autowired
  DataSource dataSource;

  @Override
  public Connection getAnyConnection() throws SQLException {
    return dataSource.getConnection();
  }

  @Override
  public void releaseAnyConnection(Connection connection) throws SQLException {
    connection.close();
  }

  @Override
  public Connection getConnection(String tenantIdentifier) throws SQLException {
    final Connection connection = getAnyConnection();
    try {
      connection.createStatement().execute("SET search_path TO " + tenantIdentifier + ";" );
    }
    catch ( SQLException e ) {
      throw new HibernateException(
          "Could not alter JDBC connection to specified schema [" +
            tenantIdentifier + "]",
          e
      );
    }
    return connection;
  }

  @Override
  public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
    try {
      connection.createStatement().execute( "SET search_path TO public;" );
    }
    catch ( SQLException e ) {
      // on error, throw an exception to make sure the connection is not returned to the pool.
      // your requirements may differ
      throw new HibernateException(
        "Could not alter JDBC connection to specified schema [" +
            tenantIdentifier + "]",
        e
      );
    }
    connection.close();
  }

}
```

Hibernate 的自动配置类改为：

```java
@Configuration
@EnableJpaRepositories(basePackages = "wang.tiven.trycf.repository")
@EntityScan(basePackages = "wang.tiven.trycf.model")
public class MultitenantHibernateJpaAutoConfiguration extends HibernateJpaAutoConfiguration {

  public MultitenantHibernateJpaAutoConfiguration(DataSource dataSource, JpaProperties jpaProperties,
      ObjectProvider<JtaTransactionManager> jtaTransactionManager,
      ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
    super(dataSource, jpaProperties, jtaTransactionManager, transactionManagerCustomizers);
  }

  @Override
  protected void customizeVendorProperties(Map<String, Object> vendorProperties) {
    super.customizeVendorProperties(vendorProperties);
    vendorProperties.put("hibernate.multiTenancy", "SCHEMA");
    vendorProperties.put("hibernate.multi_tenant_connection_provider", multitenantConnectionProvider());
    vendorProperties.put("hibernate.tenant_identifier_resolver", multitenantIdentifierResolver());
  }

  @Bean
  public CurrentTenantIdentifierResolver multitenantIdentifierResolver() {
    return new TenantIdentifierResolverImpl();
  }

  @Bean
  public MultiTenantConnectionProvider multitenantConnectionProvider() {
    return new MultiTenantConnectionProviderImpl();
  }
}
```


Schema level 完整代码[Github](https://github.com/tiven-wang/try-cf/tree/multi-tenant-schema)


https://stackoverflow.com/questions/28633759/hibernate-multi-tenancy-create-schema-during-runtime

http://jannatconsulting.com/blog/?p=41

### DDL Creation

Hibernate 的 DDL 自动创建表结构的工具并不支持 Multi-Tenant 方式。所以对于 Multi-Tenant 的应用程序，你需要手动执行数据库的初始化工作。

// TBD

http://webdev.jhuep.com/~jcs/ejava-javaee/coursedocs/content/html/jpa-entitymgrex-dbschemagen.html

https://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html

https://www.jp-digital.de/projects/hibernate5-ddl-maven-plugin.html

## Tenant Provider with UAA



## UAA Support Multi Tenancy

### Identity Zones

The UAA supports multi tenancy. This is referred to as identity zones. An identity zones is accessed through a unique subdomain. If the standard UAA responds to https://uaa.10.244.0.34.xip.io a zone on this UAA would be accessed through https://testzone1.uaa.10.244.0.34.xip.io?



https://docs.microsoft.com/en-us/azure/sql-database/sql-database-design-patterns-multi-tenancy-saas-applications

https://msdn.microsoft.com/en-us/library/hh534480.aspx

http://tech.asimio.net/2017/01/17/Multitenant-applications-using-Spring-Boot-JPA-Hibernate-and-Postgres.html

https://stackoverflow.com/questions/26176439/how-to-use-spring-abstractroutingdatasource-with-dynamic-datasources

https://spring.io/blog/2007/01/23/dynamic-datasource-routing/

https://howtodoinjava.com/spring/spring-orm/spring-3-2-5-abstractroutingdatasource-example/

http://roufid.com/spring-boot-multiple-databases-configuration/

https://github.com/benjaminrclark/cate

[SCIM]:http://www.simplecloud.info/
[sqldatasources]:https://docs.oracle.com/javase/tutorial/jdbc/basics/sqldatasources.html
[AbstractRoutingDataSource]:https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/jdbc/datasource/lookup/AbstractRoutingDataSource.html
[spring-cloud-connectors]:http://cloud.spring.io/spring-cloud-connectors/
[Hibernate]:http://hibernate.org/
[orm]:https://en.wikipedia.org/wiki/Object-relational_mapping
[hibernate-Multi-tenancy]:https://docs.jboss.org/hibernate/core/4.2/devguide/en-US/html/ch16.html
