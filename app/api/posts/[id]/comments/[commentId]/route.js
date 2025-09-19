import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Post from "@/lib/models/Post"
import { getAuthUser } from "@/lib/auth"

// DELETE - Delete a comment
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

    // Find the comment
    const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === params.commentId)

    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const comment = post.comments[commentIndex]

    // Check if user owns the comment or the post
    if (comment.user.toString() !== userId && post.author.toString() !== userId) {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 })
    }

    // Remove comment
    post.comments.splice(commentIndex, 1)
    await post.save()

    return NextResponse.json({
      message: "Comment deleted successfully",
      commentsCount: post.commentsCount,
    })
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
