import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"

// GET users that this user is following
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    // Find user by username
    const user = await User.findOne({ username: params.username })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get following with pagination
    const following = await User.find({ _id: { $in: user.following } })
      .select("username name profilePicture")
      .skip(skip)
      .limit(limit)

    const totalFollowing = user.following.length

    return NextResponse.json({
      following,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFollowing / limit),
        totalFollowing,
        hasNext: page < Math.ceil(totalFollowing / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get following error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
