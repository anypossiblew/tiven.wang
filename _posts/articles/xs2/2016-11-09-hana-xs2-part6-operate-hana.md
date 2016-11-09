---
layout: post
title: HANA XS2 On-Premise part 6 - Operate artifacts in HANA from Nodejs
excerpt: "HANA XS2 On-Premise part 6 - Operate artifacts in HANA from Nodejs"
modified: 2016-11-09T17:00:00-00:00
categories: articles
tags: [XS2, XS, HANA]
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
share: true
---

* TOC
{:toc}

In this article, we introduce how to operate HANA artifacts in Node.js application using SAP component [*sap-cds*][1] and other components like [*async*][2].

## Application

Following the previous article, we add the creation and destruction for HANA CDS entities in this topic. Create the files *testdataCreator.js* and *testdataDestructor.js* in the folder *routes*.

### Use async

In [*sap-cds*][1] component, there is a regular asynchronous node.js function that is often used,
so we can use the function [`waterfall`][3] of [`async`][2] that will be integrated with *sap-cds* smoothly.

```javascript
var async = require('async');

function testdataCreator(dbConnection, userid, appCallback) {
    var conn = null;
    async.waterfall([
        init,
        function connect(callback) {
          // reuse connection attached to HTTP request
          cds.$getTransaction(dbConnection, callback);
        },
        function store(tx, callback) {
            //call callback(null); when finished
        },
        function createBook(callback) {
          ...
          //call callback(null, book); when finished
        },
        function createAddresses(book, callback) {
          ...
          //call callback(null, instances); when finished
        },
        function release(instances, callback) {
            conn.$close();
            cb(null);
        }
    ], appCallback);
}

module.exports = testdataCreator;
```

### Use sap-cds

SAP provide the Core Data Services for node.js ([sap-cds][1]) which is a JavaScript client library for Core Data Services that allow node.js applications to consume CDS artifacts natively in node.js applications.

We use the sap-cds component to operate HANA CDS entities in this topic.

Import the sap-cds component:

```javascript
var cds = require('sap-cds');
```
#### Import Entities

CDS entities are imported by name. The import function takes a callback that is invoked when all imports have completed. Additional fields and overrides may be supplied for each entity.

In the *init* function, we also use *async.waterfall* to serialize the operations.

```javascript
function init(appCallback) {
    if (BOOK && ADDRESS) {
        appCallback();
    } else {
        async.waterfall([
            function (callback) {
                cds.importEntities([ {
                        $entity: "com.sap.xs2.tiven::AddressBook.Book",
                        $fields: { // for convenience we add an association from books to addresses
                            addresses: {
                                $association: {
                                    $entity: "com.sap.xs2.tiven::AddressBook.Address",
                                    $viaBacklink: "book"
                                }
                            }
                        }
                    },
                    {$entity: "com.sap.xs2.tiven::AddressBook.Address"}
                ], callback);
            },
            function (entities, callback) {
                BOOK = entities["com.sap.xs2.tiven::AddressBook.Book"];
                ADDRESS = entities["com.sap.xs2.tiven::AddressBook.Address"];
                callback(null);
            }
        ], function (error) {
            appCallback(error);
        });
    }
}
```

#### Database Connections and Transactions

Open new connection and transaction:

```javascript
cds.$getTransaction(function(error, tx) {
    tx.$get(...);
    // or tx.$save({entity});
    // ...
    tx.$close();
});
```

Reuse existing database connection dbconn, e.g., from express framework:

```javascript
cds.$getTransaction(dbconn, function(error, tx) {
    tx.$get(...);
    // ...
    tx.$close();
});
```

> SAP recommend **sap-hdbext** for setting up the connection to your HANA instance.

You can also use transaction management

```javascript
tx.$setAutoCommit(<boolean>);
tx.$commit(callback);
tx.$rollback(callback);
```

#### Created Entity Instances

We can save a single entity instance into HANA DB

```javascript
function createBook(callback) {
    var bookId = Math.floor(Math.random() * 1000000);
    conn.$save({
        $entity: BOOK,
        id: bookId,
        name: 'My Book #' + bookId + ' created by ' + userid
    }, callback);
}
```

or save an array of entity instances

```javascript
function createAddresses(book, callback) {
    conn.$saveAll([
        {
            $entity: ADDRESS,
            id: Math.floor(Math.random() * 1000000),
            book: book,
            first_name: 'Tiven',
            last_name: 'Wang',
            address: 'Pudong, Chenhui road, 1001',
            city: 'Shanghai',
            country: 'China',
            zip: '20001',
            phone: '+86 21 6108 7986',
            email: 'tiwen.wang@sap.com',
            web: 'http://tiven.wang'
        },
        {
            $entity: ADDRESS,
            id: Math.floor(Math.random() * 1000000),
            book: book,
            first_name: 'Max',
            last_name: 'Mustermann',
            address: 'Dietmar-Hopp-Allee 16',
            city: 'Walldorf',
            country: 'Germany',
            zip: '69169',
            phone: '+49 6227 7 54321',
            email: 'john.doe@sap.com',
            web: 'https://sap.de'
        }
    ], callback);
}
```

### Express Routes

We add the routes in file *testdata.js*:

```javascript
var express = require('express');
var router = express.Router();
var testdataCreator = require('./testdataCreator');

router.get('/rest/addressbook/testdata', function (req, res) {
    testdataCreator(req.db, req.user.id, function(error) {
        if (error) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            console.error(error);
            res.end('{}');
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ status: 'success'}));
        }
    });
});
```

#### Testdata Destructor

We also add the delete all books function used `$discardAll` in the file *testdataDestructor.js*:

```javascript
function deleteAllBooks(books, callback) {
    conn.$discardAll(books, callback);
}
```

#### Add Routes

Add the routes into express application:

```javascript
var testdata = require('./routes/testdata');

app.use('/', hdbext.middleware(), userinfo, testdata);
```

## Test

Execute `npm start` then access

*http://localhost:3001/rest/addressbook/testdata*

once got the success result, you can check the data in HANA tables.

## Next


[1]:/references/sap-github-xs2-node-cds-readme/
[2]:http://caolan.github.io/async/index.html
[3]:http://caolan.github.io/async/docs.html#waterfall
