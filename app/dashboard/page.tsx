"use client"

import { useState, useEffect } from "react"
import { CreatePostForm } from "@/components/posts/create-post-form"
import { FeedTabs } from "@/components/feed/feed-tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { UserIcon } from "lucide-react" // Renamed User to UserIcon to avoid redeclaration

interface DashboardUser {
  id: string
  username: string
  name: string
  email: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch("/api/auth/me")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }
        const userData = await userResponse.json()
        setUser(userData.user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Instagram </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/profile/${user?.username}`}>
                <UserIcon className="w-4 h-4" /> {/* Updated to UserIcon */}
              </Link>
            </Button>
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <CreatePostForm />
        <FeedTabs />
      </main>
    </div>
  )
}
