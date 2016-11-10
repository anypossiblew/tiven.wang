---
layout: reference
title: SAP XS2 node-cds
excerpt: "SAP XS2 node-cds"
modified: 2016-11-09T17:00:00-00:00
categories: references
image:
  feature: hana/masthead-hana-xs2.jpg
comments: true
---

node-cds: Core Data Services for node.js
========================================

Important note:
---------------
    node-cds is deprecated. There will be no further development in this area.
    The library may be removed in a later release.

Abstract
--------

The *Core Data Services for node.js* (node-cds) are a JavaScript
client library for Core Data Services that allow node.js applications
to consume CDS artifacts natively in node.js applications.

node-cds supports major CDS features, in particular entities, types,
associations, and views.  The library offers a *managed mode* and an
*unmanaged mode* that differ in the way that data is retrieved from
the database.

The node-cds project is the successor of the XS Data Services (XSDS)
library available for the HANA XS Engine.


API Overview
------------

### Library Import

To use *node-cds*, require its main file:

    var cds = require('cds');

On Cloud Foundry, add a depencency on the latest node-cds release to
your `package.json`:

    "dependencies": {
        "cds": "*",
        ...
    }


### CDS Import

CDS entities are imported by name.  The import function takes a callback that
is invoked when all imports have completed.  Additional fields and overrides
may be supplied for each entity.

    cds.importEntities([
        { $entity: "xsds.test.cds::ds_test.e1" },
        { $entity: "xsds.test.cds::ds_test.e2",
          $fields: {
              a: { $association: "xsds.test.cds::ds_test.e2",
                   $viaBacklink: "b" }
          }
        }
    ], callback);

    function callback(error, entities) {
        var E1 = entities["xsds.test.cds::ds_test.e1"];
        var E2 = entities["xsds.test.cds::ds_test.e2"];
        // ...
    }

Note that the import is a regular asynchronous node.js function.  You may
import entities at any point in time, and in as many calls as you want.

Entities may not be imported more than once.  To retrieve an imported entity
use `$getEntity` or `$getEntities`:

    cds.$getEntities([
        "xsds.test.cds::ds_test.e1",
        "xsds.test.cds::ds_test.e2"
    ], function(err, entities) {
        var E1 = entities["xsds.test.cds::ds_test.e1"];
        // ...
    });

Both functions will wait until the requested entity has been imported successfully.
There is also a synchronous version:

    var E1 = $getEntitySync("xsds.test.cds::ds_test.e1");

Note that `$getEntitySync` will return `null` if the import has not completed yet.


### Database Connections and Transactions

Open new connection and transaction:

    cds.$getTransaction(function(error, tx) {
        tx.$get(...);
        // ...
        tx.$close();
    });

Reuse existing database connection `dbconn`, e.g., from `express` framework:

    cds.$getTransaction(dbconn, function(error, tx) {
        tx.$get(...);
        // ...
        tx.$close();
    });

Note: We recommend `node-hdbext` for setting up the
connection to your HANA instance.

Transaction management

    tx.$setAutoCommit(<boolean>);
    tx.$commit(callback);
    tx.$rollback(callback);

By default, transactions are in auto commit mode.  Note that auto commit refers
to node-cds operations, not database operations.


### Managed Instances

Retrieve entity instances by key:

    tx.$get(E1, { id1: 1, id2: 2, ... }, function(error, instance) {
        console.log(JSON.stringify(instance));
    });

Batch retrieval for multiple instances:

    var requests = [
        { $entity: E1, id11: 1, id2: 2 },
        { $entity: E2, id: "key" }, ...
    ];
    tx.$getAll(requests, function(error, instances) {
        console.log("e1 = " + JSON.stringify(instances[0]);
        console.log("e2 = " + JSON.stringify(instances[1]);
    });

Syntactic sugar for above:

    var requests = [
        E1.$prepare({ id1: 1, id2: 2 }),
        E2.$prepare({ id: "key" }), ...
    ];
    tx.$getAll(requests, ...);

Retrieve entity instances by condition:

    tx.$find(E1, { value: { $gt: 69 } }, function(error, instances) {
        console.log("found " + instance.length + " instances");
    });

Batch retrieval by condition:

    tx.$findAll([
        { $entity: E1, { prop: { $eq: 1 } },
        { $entity: E2, { prop: { $ne: 2 } }
    ], callback);

Note that the result of `$findAll` is an array of arrays; to flatten the result
set you may use

    var flattenedInstanceArray = [].concat.apply([], findAllResult));

For complex data types you need to supply a comparison function using `$using` that
compares their values in JavaScript:

    tx.$find(E1, { prop: { $lt: "1.0e-10", $using: function(arg1, arg2) {
            return Math.sign(parseFloat(arg1) - parseFloat(arg2));
        } }, callback);

A comparison function takes two arguments and returns values `< 0`, `== 0`, or `> 0`
depending on their relation to each other.

Create new instance:

    tx.$save({ $entity: E, key: 1, value: "hello world" }, function(error, instance) {
        if (!error)
            console.log("instance created");
    });

Batch creation:

    var newinsts = [
        { $entity: E1, id1: 1, value: 2 },
        E2.$prepare({ id: "new", value: 4 }), ...
    ];
    tx.$saveAll(newinsts, function(error, instances) {
        console.log("" + instances.length + " instances created");
    });

Update existing instance:

    instance.value++;
    tx.$save(instance, function (error, savedInstance) {
        if (!error)
            console.log("instance updated");
    });

Batch update:

    tx.$saveAll([ instance1, instance2, ... ], function (error, instances) {
        console.log("instances updated");
    });

Discard entity instances:

    tx.$discard(instance, function(error) {
        if (error)
            console.error("Error discarding instance: " + error);
    });

Batch discard:

    tx.$discardAll([ instance1, instance2, ...], function(error) {
        if (error)
            console.error("Error discarding instances: " + error);
    });

Unmanaged delete:

    tx.$delete(entity, condition, callback);

*CAUTION!*  Unmanaged `delete`s bypass the cache and will not cascade to
target instances!  The `$delete` method is merely syntactic sugar for
`$query().$matching().$delete()`!


### Associations

Adding via backlink 1:n associations:

    cds.importEntities([{
        $entity: "cds.test::parent",
        $fields: {
            BacklinkAssoc: {
                $association: {
                    $entity: "cds.test::target",
                    $viaBacklink: "backassoc"
                }
            }
        }
    }], callback);

Adding via entity m:n associations:

    cds.importEntities([{
        $entity: "cds.test::parent",
        $fields: {
            BacklinkAssoc: {
				$association: {
					$entity: "cds.test::target",
					$viaEntity: "cds.test::link",
					$source: "sourceassoc",
					$target: "targetassoc"
				}
            }
        }
    }], callback);

Declaring lazy associations:

    cds.importEntities([{
        $entity: "cds.test::parent",
        $fields: {
            LazyAssoc: {
                $association: {
					$lazy: true
				}
            }
        }
    ], callback);

Lazy retrieval of lazy associations:

    instance.lazyAssoc.$load(function (error, targets) {
        // targets == instance.lazyAssoc
        console.log("" + targets.length + " targets retrieved");
    });

Re-syncing backlinking and unmanaged associations

    instance.unmanagedAssoc.$reload(function (error, targets) {
        // targets == instance.unmanagedAssoc
        console.log("association has " + targets.length + " targets");
    });


### Unmanaged Queries

Basic query:

    E1.$query().$matching({ key: 1 })
               .$execute({}, function(error, result) {
        console.log("result = " + JSON.stringify(result);
    });

More complex query conditions:

    E1.$query().$matching({ value1: { $lt: 42 }, value2: { $null: true } })
               .$execute({}, function(error, result) {
        console.log("result = " + JSON.stringify(result);
    });

Projection and navigation:

    E2.$query().$matching({ key: 1 })
               .$project({ value1: true, assoc: { value2: true, value3: true })
               .$execute({}, function(error, result) { ... });

Stream interface:

    E1.$query().$execute({ $stream: true }, function(error, stream) {
        stream.on('data', function(chunk) {
            console.log(chunk);
        }).on('end', function() {
            console.log("done");
        });
    });
