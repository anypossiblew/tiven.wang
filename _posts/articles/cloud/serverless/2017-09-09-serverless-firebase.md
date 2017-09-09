---
layout: post
title: Firebase - Hello world
excerpt: ""
modified: 2017-09-09T11:51:25-04:00
categories: articles
tags: [Firebase, Serverless, Cloud]
image:
  vendor: unsplash
  feature: /photo-1503301360699-4f60cf292ec8
  credit: Simon Matzinger
  creditlink: https://unsplash.com/@8moments
comments: true
share: true
references:
  - title: "Firebase Documentation"
    url: "https://firebase.google.com/docs/"
  - title: "Serverless Showdown: AWS Lambda vs Firebase Google Cloud Functions"
    url: "https://medium.com/@ste.grider/serverless-showdown-aws-lambda-vs-firebase-google-cloud-functions-cc7529bcfa7d"
  - title: "Adventures in Serverless Architecture with Firebase, Zapier & Cloud Functions"
    url: "https://medium.com/@james.morgan/adventures-in-serverless-architecture-with-firebase-zapier-cloud-functions-71281900f2b"
---

* TOC
{:toc}

## Setup

`npm install -g firebase-tools`

`firebase login`

`firebase init functions`

## Hello world

```javascript
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});
```

Deploy functions:

`firebase deploy --only functions` or `firebase deploy --only functions:addMessage`

```
Function URL (addMessage): https://us-central1-MY_PROJECT.cloudfunctions.net/addMessage
```


https://us-central1-MY_PROJECT.cloudfunctions.net/addMessage?text=uppercaseme
