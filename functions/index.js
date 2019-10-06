const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("socialape-679d2-a51525b1dae0.json");  //this file is  in functions.node_modules get from firebase generate private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://socialape-679d2.firebaseio.com/'
});

const express = require("express");
const app = express();
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
        status.push(doc.data());
      });
      return res.json(status);
    })
    .catch(err => console.error(err));
});

app.post("/status", (req, res) => {
  const newStatus = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
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

// https://basaeurl.com/api/
exports.api = functions.https.onRequest(app);
