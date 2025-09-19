import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import User from "@/lib/models/User"

// GET user's posts
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Find user by username
    const user = await User.findOne({ username: params.username })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's posts
    const posts = await Post.find({ author: user._id })
      .populate("author", "username name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPosts = await Post.countDocuments({ author: user._id })

    return NextResponse.json({
      posts,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: totalPosts,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: page < Math.ceil(totalPosts / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get user posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
