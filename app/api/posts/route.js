import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import User from "@/lib/models/User"
import { getAuthUser } from "@/lib/auth"

// GET all posts (for feed)
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate("author", "username name profilePicture")
      .populate("likes.user", "username")
      .populate("comments.user", "username name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPosts = await Post.countDocuments()

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: skip + limit < totalPosts,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new post
export async function POST(request) {
  try {
    await connectDB()

    const userId = await getAuthUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { imageUrl, caption } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Create new post
    const newPost = new Post({
      author: userId,
      imageUrl,
      caption: caption || "",
    })

    await newPost.save()

    // Add post to user's posts array
    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    })

    // Populate author info
    await newPost.populate("author", "username name profilePicture")

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: newPost,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
