---
layout: post
title: Try Cloud Foundry 6 - Multi Tenancy
excerpt: "Cloud Foundry: Support Multi Tenancy using Identity Zone Management APIs of UAA"
modified: 2017-05-26T17:00:00-00:00
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

There are mainly three ways on how to provide data isolation:

* Shared schema on shared database: Tables contain a tenant discriminator column (e.g. TENANT). This appproach provides by definition the lowest isolation level: there is no authorization check at database level, restore can affect other tenants and it seems to be the least scalable approach (not appropriate for big data volumes).
* Separate schema on shared database: Having an "tenant"-specific schema provides additional capabilities: option to secure data by tenant specific authorization checks on database level (HANA using db-access token), option to enhance schema by customer-specific additional columns / tables, and eventually the option to provide customer dedicated backup and restore service. If implemented properly this approch seems to be an economic approach.
* Separate schema on separate database: Offers best "bad neighborhood protection" in terms of data and failure isolation as there is no resource sharing. As the maintenance and resource costs are much higher this seems to be a premium approach for larger customers willing to pay for it.

## Mongodb Multi-tenancy

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
2. 所有租户同一 Schema(即Database)，每个租户一个 Collection
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

// TODO


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

## Postgres Multi-tenancy

首先创建一个Postgres数据库的CloudFoundry应用程序，完整代码[Github](https://github.com/tiven-wang/try-cf/tree/postgres/)

### Spring Routing DataSource

在单个DataSource对象里根据tenant路由不同子DataSource的Connection。

添加依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

```java
public class MultiTenantRoutingDataSource extends AbstractRoutingDataSource {

  public MultiTenantRoutingDataSource(Map<String, DataSource> dataSources) {
    this.setTargetDataSources((Map) dataSources);
  }

  @Override
  protected Object determineCurrentLookupKey() {
    return "my_elephantsql";
  }

}
```

Routing DataSource 完整代码 [Github](https://github.com/tiven-wang/try-cf/tree/multi-tenant-routing-datasource)


### Hibernate Multi-tenancy

Hibernate 可以自定义设置策略`hibernate.multiTenancy`为`SCHEMA`或者`DATABASE`


#### Postgres Database Level



http://tech.asimio.net/2017/01/17/Multitenant-applications-using-Spring-Boot-JPA-Hibernate-and-Postgres.html

https://docs.jboss.org/hibernate/core/4.2/devguide/en-US/html/ch16.html#d5e4755

https://github.com/benjaminrclark/cate


Database level 完整代码[Github](https://github.com/tiven-wang/try-cf/tree/postgres-db-level/)

#### Postgres Schema Level

Schema level 完整代码[Github](https://github.com/tiven-wang/try-cf/tree/multi-tenant-schema)

## Tenant Provider with UAA


[stackoverflow - Making spring-data-mongodb multi-tenant
](https://stackoverflow.com/questions/16325606/making-spring-data-mongodb-multi-tenant)

[stackoverflow - What is the recommended approach towards multi-tenant databases in MongoDB?
](https://stackoverflow.com/questions/2748825/what-is-the-recommended-approach-towards-multi-tenant-databases-in-mongodb)

## UAA Support Multi Tenancy

### Identity Zones

The UAA supports multi tenancy. This is referred to as identity zones. An identity zones is accessed through a unique subdomain. If the standard UAA responds to https://uaa.10.244.0.34.xip.io a zone on this UAA would be accessed through https://testzone1.uaa.10.244.0.34.xip.io?

https://medium.com/@alexantaniuk/guide-to-multi-tenancy-with-spring-boot-and-mongodb-78ea5ef89466

https://docs.microsoft.com/en-us/azure/sql-database/sql-database-design-patterns-multi-tenancy-saas-applications

https://msdn.microsoft.com/en-us/library/hh534480.aspx

http://tech.asimio.net/2017/01/17/Multitenant-applications-using-Spring-Boot-JPA-Hibernate-and-Postgres.html

https://stackoverflow.com/questions/26176439/how-to-use-spring-abstractroutingdatasource-with-dynamic-datasources

https://spring.io/blog/2007/01/23/dynamic-datasource-routing/

https://howtodoinjava.com/spring/spring-orm/spring-3-2-5-abstractroutingdatasource-example/

http://roufid.com/spring-boot-multiple-databases-configuration/

https://github.com/benjaminrclark/cate

[SCIM]:http://www.simplecloud.info/
