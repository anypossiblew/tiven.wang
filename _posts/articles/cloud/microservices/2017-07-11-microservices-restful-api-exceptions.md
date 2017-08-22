---
layout: post
title: Microservices - Restful API Exceptions Handler
excerpt: "Restful API Exceptions Handler"
modified: 2017-07-11T11:51:25-04:00
categories: articles
tags: [Exceptions, Restful, Microservices]
image:
  vendor: nationalgeographic
  feature: /content/dam/photography/photos/000/637/63787.ngsversion.1467253446748.adapt.1190.1.jpg
comments: true
share: true
references:
  - title: "Spring.io blog - Exception Handling in Spring MVC"
    url: "https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc"
---

<style>
@import url('https://fonts.googleapis.com/css?family=Dosis:400,500');
.mdl-card__supporting-text.blog__post-body {
  font-family: 'Dosis', sans-serif;
}
</style>

* TOC
{:toc}


## Controller Advice

`@ControllerAdvice`

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<?> resourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
	ErrorDetail errorDetail = new ErrorDetail();
	errorDetail.setTimeStamp(new Date().getTime());
	errorDetail.setStatus(HttpStatus.NOT_FOUND.value());
	errorDetail.setTitle("Resource Not Found");
	errorDetail.setDetail(ex.getMessage());
	errorDetail.setDeveloperMessage(ex.getClass().getName());

	return new ResponseEntity<>(errorDetail, null, HttpStatus.NOT_FOUND);
}
```

## Handle Error in Client
