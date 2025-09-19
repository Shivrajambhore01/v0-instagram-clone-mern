import { NextResponse } from "next/server"
import { getExplorePosts } from "@/lib/demo-data"
import { cookies } from "next/headers"

// GET explore feed - popular posts from users you don't follow
export async function GET(request) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get("demo-auth-user")?.value

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const allExplorePosts = getExplorePosts(userId)
    const posts = allExplorePosts.slice(skip, skip + limit)

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allExplorePosts.length / limit),
        totalPosts: allExplorePosts.length,
        hasNext: skip + limit < allExplorePosts.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get explore error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
