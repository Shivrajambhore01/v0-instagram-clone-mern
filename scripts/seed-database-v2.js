// Enhanced database seeding script with comprehensive sample data
import connectDB from "../lib/database.js"
import User from "../lib/models/User.js"
import Post from "../lib/models/Post.js"
import Follow from "../lib/models/Follow.js"

async function seedDatabase() {
  try {
    await connectDB()

    // Clear existing data
    console.log("Clearing existing data...")
    await User.deleteMany({})
    await Post.deleteMany({})
    await Follow.deleteMany({})

    console.log("Creating sample users...")

    // Create sample users with more realistic data
    const users = await User.create([
      {
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        name: "John Doe",
        bio: "Photography enthusiast 📸 | Travel lover ✈️",
        profilePicture: "/profile-photo-john.jpg",
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: "password123",
        name: "Jane Smith",
        bio: "Digital artist 🎨 | Coffee addict ☕",
        profilePicture: "/woman-profile.png",
      },
      {
        username: "mike_wilson",
        email: "mike@example.com",
        password: "password123",
        name: "Mike Wilson",
        bio: "Fitness coach 💪 | Healthy lifestyle",
        profilePicture: "/fit-man-gym.png",
      },
      {
        username: "sarah_jones",
        email: "sarah@example.com",
        password: "password123",
        name: "Sarah Jones",
        bio: "Food blogger 🍕 | Recipe creator",
        profilePicture: "/diverse-user-avatars.png",
      },
    ])

    console.log("Creating sample posts...")

    // Create sample posts with varied content
    const posts = await Post.create([
      {
        author: users[0]._id,
        imageUrl: "/sunset-landscape.jpg",
        caption: "Beautiful sunset from my weekend trip! 🌅 #nature #photography",
        likes: [
          { user: users[1]._id, createdAt: new Date("2024-01-25T10:30:00Z") },
          { user: users[2]._id, createdAt: new Date("2024-01-25T11:15:00Z") },
        ],
        comments: [
          {
            user: users[1]._id,
            text: "Absolutely stunning! Where was this taken?",
            createdAt: new Date("2024-01-25T12:00:00Z"),
          },
          {
            user: users[2]._id,
            text: "Amazing colors! 🔥",
            createdAt: new Date("2024-01-25T13:30:00Z"),
          },
        ],
      },
      {
        author: users[0]._id,
        imageUrl: "/coffee-morning.png",
        caption: "Perfect morning coffee ☕ Starting the day right!",
        likes: [{ user: users[1]._id, createdAt: new Date("2024-01-24T08:45:00Z") }],
        comments: [
          {
            user: users[1]._id,
            text: "That looks delicious! What's your favorite blend?",
            createdAt: new Date("2024-01-24T09:00:00Z"),
          },
        ],
      },
      {
        author: users[1]._id,
        imageUrl: "/digital-art-colorful.jpg",
        caption: "Latest digital artwork 🎨 Experimenting with new techniques",
        likes: [
          { user: users[0]._id, createdAt: new Date("2024-01-23T15:20:00Z") },
          { user: users[2]._id, createdAt: new Date("2024-01-23T16:10:00Z") },
        ],
        comments: [
          {
            user: users[0]._id,
            text: "Your art keeps getting better! Love the color palette",
            createdAt: new Date("2024-01-23T17:00:00Z"),
          },
        ],
      },
      {
        author: users[2]._id,
        imageUrl: "/gym-workout-fitness.jpg",
        caption: "Leg day complete! 💪 Remember, consistency is key #fitness #motivation",
        likes: [
          { user: users[0]._id, createdAt: new Date("2024-01-21T18:45:00Z") },
          { user: users[1]._id, createdAt: new Date("2024-01-21T19:20:00Z") },
        ],
        comments: [
          {
            user: users[0]._id,
            text: "Inspiring! What's your workout routine?",
            createdAt: new Date("2024-01-21T20:00:00Z"),
          },
          {
            user: users[1]._id,
            text: "You're so dedicated! 👏",
            createdAt: new Date("2024-01-21T20:30:00Z"),
          },
        ],
      },
      {
        author: users[3]._id,
        imageUrl: "/delicious-pasta-dish.png",
        caption: "Homemade pasta with fresh herbs 🍝 Recipe coming soon!",
        likes: [
          { user: users[0]._id, createdAt: new Date("2024-01-20T19:30:00Z") },
          { user: users[2]._id, createdAt: new Date("2024-01-20T20:15:00Z") },
        ],
        comments: [
          {
            user: users[2]._id,
            text: "This looks incredible! Can't wait for the recipe",
            createdAt: new Date("2024-01-20T21:00:00Z"),
          },
        ],
      },
    ])

    console.log("Creating follow relationships...")

    // Create follow relationships
    const follows = await Follow.create([
      { follower: users[0]._id, following: users[1]._id },
      { follower: users[1]._id, following: users[0]._id },
      { follower: users[1]._id, following: users[2]._id },
      { follower: users[2]._id, following: users[0]._id },
      { follower: users[2]._id, following: users[1]._id },
      { follower: users[3]._id, following: users[0]._id },
      { follower: users[0]._id, following: users[3]._id },
    ])

    console.log("Updating user relationships...")

    // Update users with posts and follow relationships
    await User.findByIdAndUpdate(users[0]._id, {
      posts: [posts[0]._id, posts[1]._id],
      followers: [users[1]._id, users[2]._id, users[3]._id],
      following: [users[1]._id, users[3]._id],
    })

    await User.findByIdAndUpdate(users[1]._id, {
      posts: [posts[2]._id],
      followers: [users[0]._id, users[2]._id],
      following: [users[0]._id, users[2]._id],
    })

    await User.findByIdAndUpdate(users[2]._id, {
      posts: [posts[3]._id],
      followers: [users[1]._id],
      following: [users[0]._id, users[1]._id],
    })

    await User.findByIdAndUpdate(users[3]._id, {
      posts: [posts[4]._id],
      followers: [users[0]._id],
      following: [users[0]._id],
    })

    console.log("✅ Database seeded successfully!")
    console.log(`Created:`)
    console.log(`- ${users.length} users`)
    console.log(`- ${posts.length} posts`)
    console.log(`- ${follows.length} follow relationships`)
    console.log(`- ${posts.reduce((total, post) => total + post.likes.length, 0)} likes`)
    console.log(`- ${posts.reduce((total, post) => total + post.comments.length, 0)} comments`)

    // Display login credentials
    console.log("\n🔑 Test Login Credentials:")
    users.forEach((user) => {
      console.log(`- Email: ${user.email} | Password: password123`)
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
