---
layout: post
title: Microservices - Restful API HATEOAS
excerpt: "HATEOAS (Hypermedia as the Engine of Application State) is a constraint of the REST application architecture. A hypermedia-driven site provides information to navigate the site's REST interfaces dynamically by including hypermedia links with the responses. This capability differs from that of SOA-based systems and WSDL-driven interfaces."
modified: 2017-07-28T11:51:25-04:00
categories: articles
tags: [HATEOAS, Restful, Microservices]
image:
  vendor: 500px
  feature: /photo/221202183/q%3D80_m%3D2000/v2?user_id=15281525&webp=true&sig=d846d6dd286097443ef7ba53d6a163116274e569a12fc45ef9c060951a3da4fc
  credit: 500px
  creditlink: https://500px.com/photo/221202183
comments: true
share: true
references:
  - title: "Spring.io guides - Building a Hypermedia-Driven RESTful Web Service"
    url: "https://spring.io/guides/gs/rest-hateoas/"
  - title: "Spring Data extensions - Web support"
    url: "https://docs.spring.io/spring-data/data-commons/docs/current/reference/html/#core.extensions"
  - title: "How to correctly use PagedResourcesAssembler from Spring Data?"
    url: "https://stackoverflow.com/questions/21346387/how-to-correctly-use-pagedresourcesassembler-from-spring-data"

---

<style>
@import url('https://fonts.googleapis.com/css?family=Dosis:400,500');
.mdl-card__supporting-text.blog__post-body {
  font-family: 'Dosis', sans-serif;
}
</style>

> [Leopard](https://en.wikipedia.org/wiki/Leopard)

* TOC
{:toc}

了解更多關於[HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)的知識請閱讀 [Understanding HATEOAS](https://spring.io/understanding/HATEOAS)

> 下載本文完整項目代碼 [Github](https://github.com/tiven-wang/try-cf/tree/spring-hateoas)
{: .Tips}

## Setup Dependencies

添加 [Spring HATEOAS][spring-hateoas] 的組件：

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-hateoas</artifactId>
</dependency>
```

## Spring Data Commons
[Spring Data][spring-data] 的 `@EnableSpringDataWebSupport` 或者 `SpringDataWebConfiguration` 會自動發現 Spring HATEOAS 並初始化正確的配置。

[Spring Data][spring-data] 提供了一個 `ResourceAssembler` 接口的實現 `PagedResourcesAssembler`，它負責組裝出來 Spring HATEOAS 的 `PagedResources`。

```java
@RequestMapping("")
PagedResources<Resource<Hero>> getAll(Pageable pageable, PagedResourcesAssembler<Hero> assembler) {
    return assembler.toResource(heroRepository.findAll(pageable));
}
```

訪問鏈接 *http://127.0.0.1:8090/hero?page=1&size=2* 可得到如下格式的結果，可以看到它為結果增加了`_links`屬性

```json
{
    "_embedded": {
        "heroList": [
            {
                "id": "27692676658554722713037360999",
                "name": "tiven3"
            },
            {
                "id": "27692676713894954934166015848",
                "name": "tiven4"
            }
        ]
    },
    "_links": {
        "first": {
            "href": "http://127.0.0.1:8090/hero?page=0&size=2"
        },
        "prev": {
            "href": "http://127.0.0.1:8090/hero?page=0&size=2"
        },
        "self": {
            "href": "http://127.0.0.1:8090/hero?page=1&size=2"
        },
        "next": {
            "href": "http://127.0.0.1:8090/hero?page=2&size=2"
        },
        "last": {
            "href": "http://127.0.0.1:8090/hero?page=2&size=2"
        }
    },
    "page": {
        "size": 2,
        "totalElements": 5,
        "totalPages": 3,
        "number": 1
    }
}
```

## More HATEOAS

如何對每個 *entity* 定義其 navigations `_links` ? 需要對每個entity實現其單獨的`ResourceAssembler`

首先定義 Entity Hero 對應的 Resource `HeroResource`

```java
public class HeroResource extends ResourceSupport {

	private String name;

  ...
}
```

接著定義我們的 `HeroAssembler` 如下

```java
public class HeroAssembler extends ResourceAssemblerSupport<Hero, HeroResource> {

	public HeroAssembler(Class<HeroController> controllerClass, Class<HeroResource> resourceType) {
		super(controllerClass, resourceType);
	}

	@Override
	public HeroResource toResource(Hero entity) {
		HeroResource resource = createResourceWithId(entity.getId(), entity);
		BeanUtils.copyProperties(entity, resource);
		return resource;
	}
}
```

接下來就可以為每個 entity 產生對應的 resource 了：

```java
@RequestMapping("/{id}")
HeroResource get(@PathVariable("id") Hero hero) {
    return new HeroAssembler(HeroController.class, HeroResource.class).toResource(hero);
}

@RequestMapping("")
PagedResources<HeroResource> getAll(Pageable pageable, PagedResourcesAssembler<Hero> assembler) {
    return assembler.toResource(heroRepository.findAll(pageable), new HeroAssembler(HeroController.class, HeroResource.class));
}
```

訪問鏈接 *http://127.0.0.1:8090/hero/27692676658554722713037360999* 可以得到想要的效果了

```json
{
    "name": "tiven",
    "_links": {
        "self": {
            "href": "http://127.0.0.1:8090/hero/27692676658554722713037360999"
        }
    }
}
```

## Spring Data Rest

如果你使用了 `spring-boot-starter-data-rest` 添加 `spring-data-rest` 依賴的話，它會自動增加對 HATEOAS 的支持。
訪問鏈接 *http://127.0.0.1:8090/heros* 自動帶有 navigations 的效果。


[spring-hateoas]:http://projects.spring.io/spring-hateoas/
[spring-data]:http://projects.spring.io/spring-data/
