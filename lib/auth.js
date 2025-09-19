import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    return decoded.userId
  } catch (error) {
    return null
  }
}

export function setAuthCookie(token) {
  const cookieStore = cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}
