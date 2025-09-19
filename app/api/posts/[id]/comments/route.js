import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import { getAuthUser } from "@/lib/auth"

// GET - Get post comments
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const post = await Post.findById(params.id).populate("comments.user", "username name profilePicture")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Sort comments by creation date (newest first) and paginate
    const sortedComments = post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedComments = sortedComments.slice(startIndex, endIndex)

    return NextResponse.json({
      comments: paginatedComments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(post.comments.length / limit),
        totalComments: post.comments.length,
        hasNext: endIndex < post.comments.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add a comment
export async function POST(request, { params }) {
  try {
    await connectDB()

    const userId = await getAuthUser()
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
    }

    if (text.length > 500) {
      return NextResponse.json({ error: "Comment too long (max 500 characters)" }, { status: 400 })
    }

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Add comment
    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    }

    post.comments.push(newComment)
    await post.save()

    // Populate the new comment with user data for response
    await post.populate("comments.user", "username name profilePicture")
    const addedComment = post.comments[post.comments.length - 1]

    return NextResponse.json({
      message: "Comment added successfully",
      comment: addedComment,
      commentsCount: post.commentsCount,
    })
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
