import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email in database
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user._id)

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: user.posts.length,
      },
    })

    // Set JWT auth cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
