const functions = require("firebase-functions");

const express = require("express");
const app = express();
const { FBAuth } = require("./util/fbAuth");
const {
  getAllStatus,
  postOneStatus,
  getStatus,
  commentOnStatus,
  likeStatus,
  unlikeStatus,
  deleteStatus
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
app.delete('/status/:statusId',FBAuth, deleteStatus);
// người dùng hiện tại like a status
app.get("/status/:statusId/like", FBAuth, likeStatus);
//  unlike a status
app.get("/status/:statusId/unlike", FBAuth, unlikeStatus);
// người dùng hiện tại comment on status (người dùng hiện tại xác thực qua token)
app.post("/status/:statusId/comment", FBAuth, commentOnStatus);

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
