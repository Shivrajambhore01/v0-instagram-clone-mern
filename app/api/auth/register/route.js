import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    await connectDB()

    const { username, email, password, name } = await request.json()

    // Validation
    if (!username || !email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      name,
      bio: "",
      profilePicture: "/diverse-user-avatars.png",
    })

    await newUser.save()

    // Generate JWT token
    const token = generateToken(newUser._id)

    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        profilePicture: newUser.profilePicture,
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
