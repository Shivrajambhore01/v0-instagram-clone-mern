import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"

// GET user's followers
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

    // Get followers with pagination
    const followers = await User.find({ _id: { $in: user.followers } })
      .select("username name profilePicture")
      .skip(skip)
      .limit(limit)

    const totalFollowers = user.followers.length

    return NextResponse.json({
      followers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFollowers / limit),
        totalFollowers,
        hasNext: page < Math.ceil(totalFollowers / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get followers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
