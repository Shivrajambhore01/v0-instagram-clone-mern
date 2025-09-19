import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Post from "@/lib/models/Post"

// GET search users and posts
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all" // 'users', 'posts', or 'all'
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const searchRegex = new RegExp(query.trim(), "i")
    const results = {}

    if (type === "users" || type === "all") {
      // Search users by username or name
      const users = await User.find({
        $or: [{ username: searchRegex }, { name: searchRegex }],
      })
        .select("username name profilePicture")
        .skip(skip)
        .limit(limit)

      const totalUsers = await User.countDocuments({
        $or: [{ username: searchRegex }, { name: searchRegex }],
      })

      results.users = {
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          total: totalUsers,
        },
      }
    }

    if (type === "posts" || type === "all") {
      // Search posts by caption
      const posts = await Post.find({
        caption: searchRegex,
      })
        .populate("author", "username name profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const totalPosts = await Post.countDocuments({
        caption: searchRegex,
      })

      results.posts = {
        data: posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          total: totalPosts,
        },
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
