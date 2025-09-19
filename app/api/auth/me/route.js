import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const userId = await getAuthUser()

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: user.posts.length,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
