const admin = require("firebase-admin");
var serviceAccount = require("socialape-679d2-5d8e5605a56a.json"); //this file is  in functions/node_modules get from firebase generate private key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-679d2.firebaseio.com/",
  storageBucket: "socialape-679d2.appspot.com"
});
const db = admin.firestore();

module.exports = {admin, db};
