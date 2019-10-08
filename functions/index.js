const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("socialape-679d2-5d8e5605a56a.json"); //this file is  in functions.node_modules get from firebase generate private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-679d2.firebaseio.com/"
});

const express = require("express");
const app = express();
const config = {
  apiKey: "AIzaSyAyajOGRnnwAAFrxqm_EbkYD7sEJCRqOk0",
  authDomain: "socialape-679d2.firebaseapp.com",
  databaseURL: "https://socialape-679d2.firebaseio.com",
  projectId: "socialape-679d2",
  storageBucket: "socialape-679d2.appspot.com",
  messagingSenderId: "571118632123",
  appId: "1:571118632123:web:e58af60f2af9f972af3d9e",
  measurementId: "G-9PRHEV7JY0"
};
const firebase = require('firebase');
firebase.initializeApp(config);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("xxxx");
});

app.get("/status", (req, res) => {
  admin
    .firestore()
    .collection("status")
    .get()
    .then(data => {
      let status = [];
      data.forEach(doc => {
        status.push({
          statusId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(status);
    })
    .catch(err => console.error(err));
});

app.post("/status", (req, res) => {
  const newStatus = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection("status")
    .add(newStatus)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

app.post('/signup',(req, res) => {
  const newUser ={
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  .then((data) => {
    return res.status(201).json({message: `user ${data.user.uid} signed up successfully`});
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).json({error: err.code});
  });
});

// https://basaeurl.com/api/
exports.api = functions.https.onRequest(app);
