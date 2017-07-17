---
layout: post
title: Microservices - Restful API Exceptions Handler
excerpt: "Restful API Exceptions Handler"
modified: 2017-07-11T11:51:25-04:00
categories: articles
tags: [Exceptions, Microservices]
image:
  feature: http://yourshot.nationalgeographic.com/u/fQYSUbVfts-T7odkrFJckdiFeHvab0GWOfzhj7tYdC0uglagsDtpPUzKu2MvBBtJImfqzIi1sE7s7CIDaMLJVYkmaG-q9cHOmCh9OXedriWaO_QgZQxP5zMawBJfMyhOMaHXSIJq_wem-bQiXMLi-P18c_1fk7PtVkJFxnG71qT-s7lSuWFEFOL2BpdYtpnxIMhP5H_6eQK9QoTcicepOuiXCRjs/
  credit: national geographic
  creditlink: http://www.nationalgeographic.com/photography/photo-of-the-day/2017/01/fog-clouds-park/
comments: true
share: true
references:
  - title: "Spring.io blog - Exception Handling in Spring MVC"
    url: "https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc"
---

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
