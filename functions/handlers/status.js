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
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("status")
    .add(newStatus)
    .then(doc => {
      const resStatus = newStatus;
      resStatus.statusId = doc.id;
      res.json(resStatus);
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
    userHandle: req.user.handle, // lreq.user là người dùng hiện tại
    userImage: req.user.imageUrl
  };

  db.doc(`/status/${req.params.statusId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      console.log(doc);
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 }); // update count comment khi comment
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

exports.likeStatus = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("statusId", "==", req.params.statusId)
    .limit(1);

  const statusDocument = db.doc(`/status/${req.params.statusId}`);

  let statusData;
  statusDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        // lấy data status
        statusData = doc.data();
        statusData.statusId = doc.id;
        // nếu có status thì mới lấy like
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Status not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        // chưa like status nên chưa có dữ liệu
        return db
          .collection("likes")
          .add({
            statusId: req.params.statusId,
            userHandle: req.user.handle
          })
          .then(() => {
            // console.log(statusDocument);
            statusData.likeCount++; // update lại lượt like
            return statusDocument.update({ likeCount: statusData.likeCount });
          })
          .then(() => {
            res.json(statusData);
          });
      } else {
        return res.status(400).json({ error: "Status already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.unlikeStatus = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("statusId", "==", req.params.statusId)
    .limit(1);

  const statusDocument = db.doc(`/status/${req.params.statusId}`);

  let statusData;
  statusDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        // nếu có status thì mới lấy like
        statusData = doc.data();
        statusData.statusId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Status not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        // status chưa được người dùng hiện tại like
        return res.status(400).json({ error: "Status not liked" });
      } else {
        // console.log(data.docs[0]);
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            statusData.likeCount--;
            return statusDocument.update({ likeCount: statusData.likeCount });
          })
          .then(() => {
            res.json(statusData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteStatus = (req, res) => {
  const document = db.doc(`/status/${req.params.statusId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Status not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Status deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
