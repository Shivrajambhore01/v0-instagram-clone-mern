// Demo data for Instagram clone without MongoDB
export const demoUsers = [
  {
    _id: "user1",
    username: "john_doe",
    name: "John Doe",
    email: "john@example.com",
    bio: "Photography enthusiast 📸 | Travel lover ✈️",
    profilePicture: "/profile-photo-john.jpg",
    followers: ["user2", "user3"],
    following: ["user2"],
    posts: ["post1", "post2"],
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "user2",
    username: "jane_smith",
    name: "Jane Smith",
    email: "jane@example.com",
    bio: "Digital artist 🎨 | Coffee addict ☕",
    profilePicture: "/woman-profile.png",
    followers: ["user1", "user3"],
    following: ["user1", "user3"],
    posts: ["post3", "post4"],
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: "user3",
    username: "mike_wilson",
    name: "Mike Wilson",
    email: "mike@example.com",
    bio: "Fitness coach 💪 | Healthy lifestyle",
    profilePicture: "/fit-man-gym.png",
    followers: ["user2"],
    following: ["user1", "user2"],
    posts: ["post5"],
    createdAt: new Date("2024-01-20"),
  },
]

export const demoPosts = [
  {
    _id: "post1",
    author: "user1",
    imageUrl: "/sunset-landscape.jpg",
    caption: "Beautiful sunset from my weekend trip! 🌅 #nature #photography",
    likes: [
      { user: "user2", createdAt: new Date("2024-01-25T10:30:00Z") },
      { user: "user3", createdAt: new Date("2024-01-25T11:15:00Z") },
    ],
    comments: [
      {
        _id: "comment1",
        user: "user2",
        text: "Absolutely stunning! Where was this taken?",
        createdAt: new Date("2024-01-25T12:00:00Z"),
      },
      {
        _id: "comment2",
        user: "user3",
        text: "Amazing colors! 🔥",
        createdAt: new Date("2024-01-25T13:30:00Z"),
      },
    ],
    createdAt: new Date("2024-01-25T09:00:00Z"),
  },
  {
    _id: "post2",
    author: "user1",
    imageUrl: "/coffee-morning.png",
    caption: "Perfect morning coffee ☕ Starting the day right!",
    likes: [{ user: "user2", createdAt: new Date("2024-01-24T08:45:00Z") }],
    comments: [
      {
        _id: "comment3",
        user: "user2",
        text: "That looks delicious! What's your favorite blend?",
        createdAt: new Date("2024-01-24T09:00:00Z"),
      },
    ],
    createdAt: new Date("2024-01-24T08:30:00Z"),
  },
  {
    _id: "post3",
    author: "user2",
    imageUrl: "/digital-art-colorful.jpg",
    caption: "Latest digital artwork 🎨 Experimenting with new techniques",
    likes: [
      { user: "user1", createdAt: new Date("2024-01-23T15:20:00Z") },
      { user: "user3", createdAt: new Date("2024-01-23T16:10:00Z") },
    ],
    comments: [
      {
        _id: "comment4",
        user: "user1",
        text: "Your art keeps getting better! Love the color palette",
        createdAt: new Date("2024-01-23T17:00:00Z"),
      },
    ],
    createdAt: new Date("2024-01-23T15:00:00Z"),
  },
  {
    _id: "post4",
    author: "user2",
    imageUrl: "/creative-workspace.png",
    caption: "My creative workspace setup 💻 Where the magic happens!",
    likes: [{ user: "user3", createdAt: new Date("2024-01-22T14:30:00Z") }],
    comments: [],
    createdAt: new Date("2024-01-22T14:00:00Z"),
  },
  {
    _id: "post5",
    author: "user3",
    imageUrl: "/gym-workout-fitness.jpg",
    caption: "Leg day complete! 💪 Remember, consistency is key #fitness #motivation",
    likes: [
      { user: "user1", createdAt: new Date("2024-01-21T18:45:00Z") },
      { user: "user2", createdAt: new Date("2024-01-21T19:20:00Z") },
    ],
    comments: [
      {
        _id: "comment5",
        user: "user1",
        text: "Inspiring! What's your workout routine?",
        createdAt: new Date("2024-01-21T20:00:00Z"),
      },
      {
        _id: "comment6",
        user: "user2",
        text: "You're so dedicated! 👏",
        createdAt: new Date("2024-01-21T20:30:00Z"),
      },
    ],
    createdAt: new Date("2024-01-21T18:30:00Z"),
  },
]

export const demoFollows = [
  { _id: "follow1", follower: "user1", following: "user2", createdAt: new Date("2024-01-16") },
  { _id: "follow2", follower: "user2", following: "user1", createdAt: new Date("2024-01-17") },
  { _id: "follow3", follower: "user2", following: "user3", createdAt: new Date("2024-01-18") },
  { _id: "follow4", follower: "user3", following: "user1", createdAt: new Date("2024-01-19") },
  { _id: "follow5", follower: "user3", following: "user2", createdAt: new Date("2024-01-20") },
]

// Helper functions to work with demo data
export function getUserById(id) {
  return demoUsers.find((user) => user._id === id)
}

export function getUserByUsername(username) {
  return demoUsers.find((user) => user.username === username)
}

export function getUserByEmail(email) {
  return demoUsers.find((user) => user.email === email)
}

export function getPostById(id) {
  const post = demoPosts.find((post) => post._id === id)
  if (post) {
    return {
      ...post,
      author: getUserById(post.author),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }
  }
  return null
}

export function getPostsByUserId(userId) {
  return demoPosts
    .filter((post) => post.author === userId)
    .map((post) => ({
      ...post,
      author: getUserById(post.author),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getAllPosts() {
  return demoPosts
    .map((post) => ({
      ...post,
      author: getUserById(post.author),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getFeedPosts(userId) {
  const user = getUserById(userId)
  if (!user) return []

  const followingIds = [...user.following, userId]
  return demoPosts
    .filter((post) => followingIds.includes(post.author))
    .map((post) => ({
      ...post,
      author: getUserById(post.author),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: post.likes.some((like) => like.user === userId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getExplorePosts(userId) {
  const user = getUserById(userId)
  const excludeIds = user ? [...user.following, userId] : []

  return demoPosts
    .filter((post) => !excludeIds.includes(post.author))
    .map((post) => ({
      ...post,
      author: getUserById(post.author),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: userId ? post.likes.some((like) => like.user === userId) : false,
    }))
    .sort((a, b) => a.likesCount - b.likesCount) // Sort by popularity
}

export function isFollowing(followerId, followingId) {
  return demoFollows.some((follow) => follow.follower === followerId && follow.following === followingId)
}

export function searchUsers(query) {
  const regex = new RegExp(query, "i")
  return demoUsers.filter((user) => regex.test(user.username) || regex.test(user.name))
}

export function searchPosts(query) {
  const regex = new RegExp(query, "i")
  return demoPosts
    .filter((post) => regex.test(post.caption))
    .map((post) => ({
      ...post,
      author: getUserById(post.author),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    }))
}
