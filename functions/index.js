const functions = require("firebase-functions");

const express = require("express");
const app = express();
const { FBAuth } = require("./util/fbAuth");
const {
  getAllStatus,
  postOneStatus,
  getStatus,
  commentOnStatus
} = require("./handlers/status");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/user");

// status routes
app.get("/status", getAllStatus);
app.post("/status", FBAuth, postOneStatus);
app.get("/status/:statusId", getStatus); // phải để là ':statusId' tức là 1 giá trị tham số để thay đổi
// delete status
// like a status
//  unlike a status
//  comment on status
app.post("/status/:statusId/comment", FBAuth, commentOnStatus);

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
