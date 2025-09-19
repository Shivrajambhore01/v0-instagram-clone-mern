import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import User from "@/lib/models/User"
import { getAuthUser } from "@/lib/auth"

// GET personalized feed - posts from users you follow
export async function GET(request) {
  try {
    await connectDB()

    const userId = await getAuthUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get user's following list
    const user = await User.findById(userId).select("following")
    const followingIds = [...user.following, userId] // Include own posts

    // Get posts from followed users
    const posts = await Post.find({ author: { $in: followingIds } })
      .populate("author", "username name profilePicture")
      .populate("likes.user", "username")
      .populate("comments.user", "username name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Add isLiked field for current user
    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: post.likes.some((like) => like.user._id.toString() === userId.toString()),
    }))

    const totalPosts = await Post.countDocuments({ author: { $in: followingIds } })

    return NextResponse.json({
      posts: postsWithLikeStatus,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: skip + limit < totalPosts,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get feed error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
