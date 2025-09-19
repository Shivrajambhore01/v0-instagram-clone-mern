import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Follow from "@/lib/models/Follow"
import { getAuthUser } from "@/lib/auth"

// GET user profile
export async function GET(request, { params }) {
  try {
    await connectDB()

    const currentUserId = await getAuthUser()

    // Find user by username
    const user = await User.findOne({ username: params.username }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if current user is following this user
    let isFollowing = false
    if (currentUserId) {
      const followRelation = await Follow.findOne({
        follower: currentUserId,
        following: user._id,
      })
      isFollowing = !!followRelation
    }

    const userProfile = {
      id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postsCount: user.posts.length,
      isFollowing,
      isOwnProfile: currentUserId === user._id.toString(),
    }

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
