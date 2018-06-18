---
layout: post
theme: UbuntuMono
title: "Home Network as a Cloud"
excerpt: "Learn how to publish your home network as a cloud provider."
modified: 2018-06-18T11:51:25-04:00
categories: articles
tags: [Raspberry PI, Cloud]
image:
  vendor: twitter
  feature: /media/DfGbYtqX0AEP6EY.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/1004755042925273088
comments: true
share: true
references:
  - title: "Kubernetes Documentation"
    url: https://kubernetes.io/docs

---

* TOC
{:toc}

https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

[forever js](https://github.com/foreverjs/forever) is a simple CLI tool for ensuring that a given script runs continuously.

https://www.digitalocean.com/community/tutorials/how-to-create-temporary-and-permanent-redirects-with-apache-and-nginx

pubic server
```javascript
const http = require('http');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  fs.writeFile('ips.txt', ip, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

http client in home network
```javascript
const http = require('http');

setInterval(() => {
  http.get('http://<pubic_id>:3000', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(new Date());
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}, 10*60*1000);
```


https://cloudplatform.googleblog.com/2018/06/Now-you-can-deploy-your-Node-js-app-to-App-Engine-standard-environment.html?m=1

https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
