---
layout: post
title: Training JavaScript - 2. Node.js (JavaScript)
excerpt: ""
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

I want to use Node.js to create a application which can receive the messages that come from [wechat](https://open.weixin.qq.com/
) server, and store them in [MongoDB](https://www.mongodb.com), and retrieve them by restful api.

## Setup Node.js Project

`$ mkdir training-javascript-node`

`$ cd training-javascript-node`

`npm init`

### Install Gulp

I am going to be using the Gulp task runner to compile the TypeScript source code. Use npm to install gulp:

`npm install gulp --save-dev`

> Note: this also generates a new **node_modules** folder in your project. If you are using **Git** then should add this folder to your **.gitignore** file.

Now that we have gulp installed, let’s install some task runners:

```

```

#### Create gulpfile.js

```javascript

```

Check the configuration by running:

`gulp build`

## HTTP Server

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

#### Test the Server

Start the express.js server:

`node ./app/server.js`

Test the api by accessing:

*http://localhost:6001/*

You will get: _**Cannot GET /**_ in your browser.

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

`npm install --save mongodb`

`npm install --save mongoose`

db/mongo-connect.js:

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

db/models/message.js:

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
	            text: event.content.text
	        }).save(function (err, message) {
	            if (err) {
	                return res.status(500).send('Error occurred: database error');
	            }
	            res.json({
	                id: message.id
	            });
	        });
    	}
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

## ES6 Promise



## IDE

## Debug
