---
layout: post
title: Aliyun - API Signature
excerpt: "阿里云各个服务会对每个访问请求进行身份验证，所以无论使用 HTTP 还是 HTTPS 协议提交请求，都需要在请求中包含签名（Signature）信息。DirectMail 通过使用 Access Key ID 和 Access Key Secret 进行对称加密的方法来验证请求的发送者身份。Access Key ID 和 Access Key Secret 由阿里云官方颁发给访问者（可以通过阿里云官方网站申请和管理），其中 Access Key ID 用于标识访问者的身份；Access Key Secret 是用于加密签名字符串和服务器端验证签名字符串的密钥，必须严格保密，只有阿里云和用户知道。"
modified: 2017-09-08T11:51:25-04:00
categories: articles
tags: [Signature, SMS, Aliyun]
image:
  vendor: unsplash
  feature: /photo-1503301360699-4f60cf292ec8?dpr=1.5&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
  credit: Simon Matzinger
  creditlink: https://unsplash.com/@8moments
comments: true
share: true
references:
  - title: "Node.js v8.4.0 Documentation - Crypto"
    url: "https://nodejs.org/api/crypto.html"
  - title: "阿里云短信发送接口nodejs版本 aliyun-nodejs-sdk-smsV1"
    url: "http://ian.wang/296.htm"

---

* TOC
{:toc}

## Aliyun API Signature
[阿里云 开发API参考 签名机制](https://help.aliyun.com/document_detail/54229.html)

```javascript
const crypto = require('crypto');
```

1 使用请求参数构造规范化的请求字符串（Canonicalized Query String）

  a. 按照参数名称的字典顺序对请求中所有的请求参数（包括文档中描述的公共请求参数和给定的请求接口的自定义参数，但不能包括公共请求参数中提到 Signature 参数本身）进行排序。

  > 注：当使用 GET 方法提交请求时，这些参数就是请求 URI 中的参数部分（即 URI 中 “?” 之后由 “&” 连接的部分）。

  b. 对每个请求参数的名称和值进行编码。名称和值要使用 UTF-8 字符集进行 URL 编码，URL 编码的编码规则是：
  * 对于字符 A-Z、a-z、0-9 以及字符 “-”、“\_”、“.”、“~” 不编码;
  * 对于其他字符编码成 %XY 的格式，其中 XY 是字符对应 ASCII 码 的 16 进制表示。比如半角的双引号（”）对应的编码就是 %22；
  * 对于扩展的 UTF-8 字符，编码成 %XY%ZA… 的格式;
  * 需要说明的是半角的空格（ ）要被编码是 %20，而不是加号（+）。

  > 注：一般支持 URL 编码的库（比如 Java 中的 java.net.URLEncoder）都是按照 application/x-www-form-urlencoded 的 MIME 类型的规则进行编码的。实现时可以直接使用这类方式进行编码，把编码后的字符串中加号（+）替换成 %20、星号（\*）替换成 %2A、%7E 替换回波浪号（~），即可得到上述规则描述的编码字符串。

  c. 对编码后的参数名称和值使用半角的等号（=）进行连接。

  d. 再把半角的等号连接得到的字符串按参数名称的字典顺序依次使用 “&” 符号连接，即得到规范化请求字符串。

```javascript
signature: function(params, accessKeySecret) {
  var queryParams = [], canonicalizedQueryString;
  var oa = Object.keys(params).sort();
  for (var i = 0; i < oa.length; i++) {
      var key = oa[i];
      queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
  }
  canonicalizedQueryString = queryParams.join('&');
  ...
}
```

2 使用上一步构造的规范化字符串按照下面的规则构造用于计算签名的字符串:

```javascript
 StringToSign=
 HTTPMethod + “&” +
 percentEncode(“/”) + ”&” +
 percentEncode(CanonicalizedQueryString)
```

其中 HTTPMethod 是提交请求用的 HTTP 方法，比 GET、POST。<br>
percentEncode(“/”)是按照 1.b 中描述的 URL 编码规则对字符 “/” 进行编码得到的值，即 %2F。<br>
percentEncode (CanonicalizedQueryString) 是对第 1 步中构造的规范化请求字符串按 1.b 中描述的 URL 编码规则编码后得到的字符串。

```javascript
var stringToSign = 'POST' + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(canonicalizedQueryString);
accessKeySecret = accessKeySecret + '&';
```


3 按照 RFC2104 的定义，使用上面的用于签名的字符串计算签名 HMAC 值。注意：计算签名时使用的 Key 就是用户持有的 Access Key Secret 并加上一个 “&” 字符(ASCII:38)，使用的哈希算法是 SHA1。<br>
4 按照 Base64 编码规则把上面的 HMAC 值编码成字符串，即得到签名值（Signature）。

```javascript
return crypto.createHmac('sha1', accessKeySecret).update(new Buffer(stringToSign, 'utf-8')).digest('base64');
```

5 将得到的签名值作为 Signature 参数添加到请求参数中，即完成对请求签名的过程。注意：得到的签名值在作为最后的请求参数值提交给 SMS 服务器的时候，要和其他参数一样，按照 RFC3986 的规则进行 URL 编码）。

```javascript
var apiUrl = 'http://dysmsapi.aliyuncs.com/';
request.post({
    url: apiUrl,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: params
}, callback);
```

完整代码:
<script src="https://gist.github.com/anypossiblew/46c14aa9616b8f6adad1f6f6078333e1.js"></script>


## Aliyun MNS Signature

https://help.aliyun.com/document_detail/27487.html
