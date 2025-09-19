import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import User from "@/lib/models/User"
import { getAuthUser } from "@/lib/auth"

// GET single post
export async function GET(request, { params }) {
  try {
    await connectDB()

    const post = await Post.findById(params.id)
      .populate("author", "username name profilePicture")
      .populate("likes.user", "username")
      .populate("comments.user", "username name profilePicture")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const userId = await getAuthUser()
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user owns the post
    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: "Not authorized to delete this post" }, { status: 403 })
    }

    // Remove post from user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: post._id },
    })

    // Delete the post
    await Post.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
