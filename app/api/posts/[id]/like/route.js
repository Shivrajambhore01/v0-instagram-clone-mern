import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import { getAuthUser } from "@/lib/auth"

// POST - Like a post
export async function POST(request, { params }) {
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

    // Check if user already liked the post
    const existingLike = post.likes.find((like) => like.user.toString() === userId)

    if (existingLike) {
      return NextResponse.json({ error: "Post already liked" }, { status: 400 })
    }

    // Add like
    post.likes.push({
      user: userId,
      createdAt: new Date(),
    })

    await post.save()

    return NextResponse.json({
      message: "Post liked successfully",
      isLiked: true,
      likesCount: post.likesCount,
    })
  } catch (error) {
    console.error("Like post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Unlike a post
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

    // Check if user has liked the post
    const likeIndex = post.likes.findIndex((like) => like.user.toString() === userId)

    if (likeIndex === -1) {
      return NextResponse.json({ error: "Post not liked" }, { status: 400 })
    }

    // Remove like
    post.likes.splice(likeIndex, 1)
    await post.save()

    return NextResponse.json({
      message: "Post unliked successfully",
      isLiked: false,
      likesCount: post.likesCount,
    })
  } catch (error) {
    console.error("Unlike post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
