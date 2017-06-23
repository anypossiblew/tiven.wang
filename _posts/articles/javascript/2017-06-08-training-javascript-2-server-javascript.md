---
layout: post
title: Training JavaScript - 2. Create Server by Node.js (JavaScript version)
excerpt: "Node.js is an open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side. Historically, JavaScript was used primarily for client-side scripting, in which scripts written in JavaScript are embedded in a webpage's HTML, to be run client-side by a JavaScript engine in the user's web browser. Node.js enables JavaScript to be used for server-side scripting, and runs scripts server-side to produce dynamic web page content before the page is sent to the user's web browser."
modified: 2017-06-08T17:00:00-00:00
categories: articles
tags: [Node.js, JavaScript]
image:
  feature: nationalgeographic/Strutting-Stork.jpg
comments: true
share: true
references:
  - title: "Promises in Node.js – An Alternative to Callbacks"
    url: "https://strongloop.com/strongblog/promises-in-node-js-an-alternative-to-callbacks/"
  - title: "ES6 Promises in Depth"
    url: "https://ponyfoo.com/articles/es6-promises-in-depth"
  - title: "Express - Production best practices: performance and reliability"
    url: "https://expressjs.com/en/advanced/best-practice-performance.html"
  - title: "MDN - Promise"
    url: "https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise"
---

* TOC
{:toc}

JavaScript Series:

1. [JavaScript Foundation](/articles/training-javascript-1-foundation/) and [Node.js](/articles/professional-node.js/)
2. **Create a backend server by Node.js (JavaScript version)** or [Create Server by Node.js (TypeScript version)](/articles/training-javascript-2-server-typescript/)
3. [Angular for frontend development](/articles/training-javascript-3-frontend-angular/)

I want to use Node.js to create a application which can receive the messages that come from [wechat](https://open.weixin.qq.com/
) server, and store them in [MongoDB](https://www.mongodb.com), and retrieve them by restful api.

> Get the project from [Github](https://github.com/tiven-wang/training-javascript-node)

## Setup Node.js Project

`$ mkdir training-javascript-node`

`$ cd training-javascript-node`

`npm init`

## Application Server

[Express.js](https://expressjs.com/), or simply **Express**, is a web application framework for Node.js. Express is the backend part of the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)), together with MongoDB database and AngularJS frontend framework.

To install the Express dependency. I am including the `--save` flag to my `npm install` command so that the dependency is saved in the *package.json* file:

`npm install --save express`

`npm install --save body-parser`

`npm install --save cfenv`

### Basic Server

#### Create Server Class

Create a file `server.js` in *app/*:

```javascript
let express = require('express');
let bodyParser = require('body-parser');
let cfenv = require('cfenv');

// create express instance
let oApp = express();

// Cloud Foundry environment variables
let oAppEnv = cfenv.getAppEnv();

// body parser middleware to handle URL parameter and JSON bodies
oApp.use(bodyParser.urlencoded({extended: false}));
oApp.use(bodyParser.json());

// TODO connect db
// TODO routes

// express app listener
oApp.listen(oAppEnv.port, function(){
    console.log('Server listening at ' + oAppEnv.url);
});
```

#### Static Pages

Add the statement:

`oApp.use(express.static('public'))`

and the public static pages in folder *public*

for example: *index.html*

#### Test the Server

Start the express.js server:

`node ./app/server.js`

Test the api by accessing:

*http://localhost:6001/*

You will get the index.html in your browser.

### Create Routes

```javascript
'use strict';

module.exports = function (oApp) {

    oApp.get('/api/message', function (req, res) {
        res.json([]);
    });

    oApp.get('/api/message/:id', function (req, res) {
      res.json({
          id: 1
        });
    });

    oApp.post('/api/message', function (req, res) {
    	res.json({info:'Saved!'});
    });

    oApp.delete('/api/message/:id', function (req, res) {
        return res.send('Deleted!');
    });

    oApp.put('/api/message/:id', function(req,res){
        res.send('Changed!');
    });

};

```

## MongoDB and mongoose

### MongoDB

Install the dependency:

`npm install --save mongodb`


```javascript
var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
// Connection url
var url = 'mongodb://localhost:27017/test';

// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
  // Create a collection we want to drop later
  var col = db.collection('messages');

  // Show that duplicate records got dropped
  col.find({}).toArray(function(err, items) {
    test.equal(null, err);
    console.log(items);
    db.close();
  });
});
```

### mongoose
Install the mongoose dependency;

`npm install --save mongoose`

Create mongodb connect
*db/mongo-connect.js*:

```javascript
'use strict';

let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function(oAppEnv){
  if(oAppEnv.isLocal === true){
      mongoose.connect('mongodb://localhost:27017/test');
  }else{
      mongoose.connect(oAppEnv.services.mongodb[0].credentials.uri);
  }
}
```

Create mongodb model
*db/models/message.js*:

```javascript
'use strict';

let mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
    id: String,
    createdTime: String,
    eventType: String,
    text: String,
    created: Boolean
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;
```

Now we can change the message route to load data from mongodb collection:

```javascript
'use strict';

module.exports = function (oApp) {

    let message = require('../db/models/message.js');

    oApp.get('/api/message', function (req, res) {
      message.find(function (err, messages) {
          if (err) {
              return res.status(500).send('Error occurred: database error');
          }

          res.json(messages.map(function (message) {
              return {
                  id: message.id,
                  createdTime: message.createdTime,
                  eventType: message.eventType,
                  text: message.text,
                  created: message.created
              };
          }));
      });
    });

    oApp.get('/api/message/:id', function (req, res) {
      message.findOne({ id: req.params.id }, function (err, message) {
            if (err || message === null) {
                return res.status(500).send('Error occurred: database error');
            }

            res.json({
                id: message.id,
                createdTime: message.createdTime,
                eventType: message.eventType,
                text: message.text,
                created: message.created
            });
        });
    });

    oApp.post('/api/message', function (req, res) {
      for(var i = 0; i < req.body.result.length; i++) {
    		var event = req.body.result[i];

    		new message({
	            id: event.id,
	            createdTime: event.createdTime,
	            eventType: event.eventType,
	            text: event.content && event.content.text
	        }).save(function (err, message) {
	            if (err) {
	                //return res.status(500).send('Error occurred: database error');
	            }
	        });
    	}

      res.send('success');
    });

    oApp.delete('/api/message/:id', function (req, res) {
      message.remove({ id: req.params.id }, function (err) {
          if (err) {
              return res.status(500).send('Error occurred: database error');
          }

          return res.send();
      });
    });

    oApp.put('/api/message/:id', function(req,res){
      message.update({
            id: req.params.id
        }, {
            created: req.body.created
        }, function(err){
            if(err){
                return res.status(500).send('Error occurred: database error');
            }
            res.send();
        });
    });

};
```

### Update server.js

Endable express routes and mongodb connection in server.js:

```javascript
// connect to mongodb
require('./db/mongo-connect.js')(oAppEnv);
// api
require('./api/messages.js')(oApp);
```

### Test MongoDB Layer

Run a docker container for mongodb locally:

`docker run --rm --name my-mongo -d -p 27017:27017 mongo`

Then start the node http server:

`node server.js`

Now you can create and get messages through the message url:

*http://localhost:6001/api/message*

## Promises

Promises are usually vaguely defined as "a proxy for a value that will eventually become available".

> A promise is an abstraction for asynchronous programming. It’s an object that proxies for the return value or the exception thrown by a function that has to do some asynchronous processing. — [Kris Kowal on JSJ](http://javascriptjabber.com/037-jsj-promises-with-domenic-denicola-and-kris-kowal/)

Callbacks are the simplest possible mechanism for asynchronous code in JavaScript. Unfortunately, raw callbacks sacrifice the control flow, exception handling, and function semantics familiar from synchronous code. Promises provide a way to get those things back.

The core component of a promise object is its **then** method. The **then** method is how we get the return value (known as the fulfillment value) or the exception thrown (known as the rejection reason) from an asynchronous operation. then takes two optional callbacks as arguments, which we’ll call **onFulfilled** and **onRejected**

```javascript
var promise = doSomethingAync()
promise.then(onFulfilled, onRejected)
```

[Promises/A+](http://promises-aplus.github.io/promises-spec/), a specification that has made its way into ES6 JavaScript as well as multiple third-party libraries.

### Mongoose Promises
Mongoose has [built-in Promises](http://mongoosejs.com/docs/promises.html), Mongoose async operations, like .save() and queries, return [Promises/A+ conformant promises](https://promisesaplus.com/).

Change the query callback to promise:

```javascript
oApp.get('/api/message/:id', function (req, res) {
  message.findOne({ id: req.params.id })
    .then(message => {
      res.json({
          id: message.id,
          createdTime: message.createdTime,
          eventType: message.eventType,
          text: message.text,
          created: message.created
      });
    })
    .catch(err => {
      if (err) {
          res.status(500).send('Error occurred: database error');
      }
    });
});
```

### bluebird

There are many third party promise libraries (e.g. [async][async]) available for JavaScript and even the standard library contains a promise implementation in newer versions of browsers and node/io.js. We use [bluebird][bluebird] promises over other third party or the standard library implementations.

Install the bluebird in Node:

`npm install --save bluebird`

Then

`var Promise = require("bluebird");`

We use the [Promise.reduce](http://bluebirdjs.com/docs/api/promise.reduce.html) method to gather the result of async saving messages.

```javascript
oApp.post('/api/message', function (req, res) {
  Promise.reduce(req.body.result, function(total, event) {
    return new message({
          id: event.id,
          createdTime: event.createdTime,
          eventType: event.eventType,
          text: event.content && event.content.text
      }).save(function (err, message) {
          if (err) {
              //return res.status(500).send('Error occurred: database error');
          }
      })
      .then((message) => {
        return total + 1;
      });
  }, 0).then(total => {
      //Total number of messages
      res.json({
        total: total
      });
  });
});
```

## Deploy to Cloud

If you want to deploy the application to CloudFoundry based cloud service, please refer to my another article:
[How to develop a Node.js application with MongoDB service on HCP Cloud Foundry](/articles/nodejs-with-mongodb-on-hcp-cloud-foundry/)

`cf api https://api.run.pivotal.io`

`cf login`

`cf create-service mlab sandbox training-javascript-node`

`cf push`

Access url *http://training-javascript-node.cfapps.io/api/message*


[async]:https://caolan.github.io/async/
[bluebird]:http://bluebirdjs.com
