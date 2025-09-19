// Database seeding script for development
import connectDB from "../lib/database.js"
import User from "../lib/models/User.js"
import Post from "../lib/models/Post.js"

async function seedDatabase() {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Post.deleteMany({})

    console.log("Creating sample users...")

    // Create sample users
    const users = await User.create([
      {
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        name: "John Doe",
        bio: "Photography enthusiast 📸",
        profilePicture: "/profile-photo-john.jpg",
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: "password123",
        name: "Jane Smith",
        bio: "Travel blogger ✈️",
        profilePicture: "/placeholder-m5e7j.png",
      },
      {
        username: "mike_wilson",
        email: "mike@example.com",
        password: "password123",
        name: "Mike Wilson",
        bio: "Food lover 🍕",
        profilePicture: "/placeholder-t93xg.png",
      },
    ])

    console.log("Creating sample posts...")

    // Create sample posts
    const posts = await Post.create([
      {
        author: users[0]._id,
        imageUrl: "/serene-mountain-lake.png",
        caption: "Beautiful sunset at the beach! 🌅 #photography #nature",
      },
      {
        author: users[1]._id,
        imageUrl: "/majestic-mountain-vista.png",
        caption: "Amazing view from the mountain top! #travel #adventure",
      },
      {
        author: users[2]._id,
        imageUrl: "/placeholder-by2ju.png",
        caption: "Homemade pizza night! 🍕 #food #cooking",
      },
    ])

    // Add posts to users
    users[0].posts.push(posts[0]._id)
    users[1].posts.push(posts[1]._id)
    users[2].posts.push(posts[2]._id)

    await Promise.all(users.map((user) => user.save()))

    console.log("Database seeded successfully!")
    console.log(`Created ${users.length} users and ${posts.length} posts`)
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

seedDatabase()
