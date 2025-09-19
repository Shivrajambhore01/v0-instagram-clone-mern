import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import Follow from "@/lib/models/Follow"
import { getAuthUser } from "@/lib/auth"

// POST - Follow a user
export async function POST(request, { params }) {
  try {
    await connectDB()

    const currentUserId = await getAuthUser()
    if (!currentUserId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Find the user to follow
    const userToFollow = await User.findOne({ username: params.username })
    if (!userToFollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Can't follow yourself
    if (userToFollow._id.toString() === currentUserId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userToFollow._id,
    })

    if (existingFollow) {
      return NextResponse.json({ error: "Already following this user" }, { status: 400 })
    }

    // Create follow relationship
    const follow = new Follow({
      follower: currentUserId,
      following: userToFollow._id,
    })
    await follow.save()

    // Update both users' follower/following arrays
    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: userToFollow._id },
    })

    await User.findByIdAndUpdate(userToFollow._id, {
      $push: { followers: currentUserId },
    })

    return NextResponse.json({
      message: "Successfully followed user",
      isFollowing: true,
    })
  } catch (error) {
    console.error("Follow user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Unfollow a user
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const currentUserId = await getAuthUser()
    if (!currentUserId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Find the user to unfollow
    const userToUnfollow = await User.findOne({ username: params.username })
    if (!userToUnfollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find and delete the follow relationship
    const follow = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userToUnfollow._id,
    })

    if (!follow) {
      return NextResponse.json({ error: "Not following this user" }, { status: 400 })
    }

    // Update both users' follower/following arrays
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userToUnfollow._id },
    })

    await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: { followers: currentUserId },
    })

    return NextResponse.json({
      message: "Successfully unfollowed user",
      isFollowing: false,
    })
  } catch (error) {
    console.error("Unfollow user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
