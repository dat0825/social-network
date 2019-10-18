let db = {
  users: [
    {
      userId: "kNIZo8y7eEXwGYFlYWFhWdFSFUm1",
      email: "thainga0909@gmail.com",
      handle: "thai nga",
      createdAt: "2019-10-17T09:54:56.625Z",
      imageurl: "image/game_sport",
      bio: "I am from Japan hihihihi",
      website: "https://user.com",
      location: "London, UK"
    }
  ],
  status: [
    {
      userHandle: "user",
      body: "this is the sream body",
      createdAt: "2019-03-15T11:46:01.018Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "kdjsfgdksuufhgkdsufky",
      body: "nice one mate!",
      createdAt: "2019-03-15T10:59:52.798Z"
    }
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      screamId: "kdjsfgdksuufhgkdsufky",
      type: "like | comment",
      createdAt: "2019-03-15T10:59:52.798Z"
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "N43KJ5H43KJHREW4J5H3JWMERHB",
    email: "thainga0909@gmail.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "Lonodn, UK"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "hh7O5oWfWucVzGbHH2pa"
    },
    {
      userHandle: "user",
      screamId: "3IOnFoQexRcofs5OhBXO"
    }
  ]
};
