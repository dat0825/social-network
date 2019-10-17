const { db } = require("../util/admin");

exports.getAllStatus = (req, res) => {
  db.collection("status")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let status = [];
      data.forEach(doc => {
        status.push({
          statusId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return res.json(status);
    })
    .catch(err => console.error(err));
};

exports.postOneStatus = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }
  const newStatus = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString()
  };

  db.collection("status")
    .add(newStatus)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.getStatus = (req, res) => {
  let statusData = {};
  db.doc(`/status/${req.params.statusId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      // console.log(doc);
      statusData = doc.data();
      statusData.statusId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("statusId", "==", req.params.statusId)
        .get();
    })
    .then(data => {
      statusData.comments = [];
      data.forEach(doc => {
        statusData.comments.push(doc.data()); // push comments into status's information
      });
      return res.json(statusData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnStatus = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ error: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    statusId: req.params.statusId,
    userHandle: req.user.handle, // lấy từ FBAuth trong file fbAuth.js
    userImage: req.user.imageUrl
  };

  db.doc(`/status/${req.params.statusId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
