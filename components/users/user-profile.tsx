"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FollowButton } from "./follow-button"
import { PostsGrid } from "@/components/posts/posts-grid"
import { Grid3X3, Settings } from "lucide-react"

interface UserProfileProps {
  username: string
}

interface UserProfile {
  id: string
  username: string
  name: string
  bio: string
  profilePicture?: string
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
  isOwnProfile: boolean
}

export function UserProfile({ username }: UserProfileProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  const handleFollowChange = (isFollowing: boolean) => {
    if (user) {
      setUser({
        ...user,
        isFollowing,
        followersCount: isFollowing ? user.followersCount + 1 : user.followersCount - 1,
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-8 mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="w-32 h-32">
          <AvatarImage src={user.profilePicture || "/placeholder.svg"} />
          <AvatarFallback className="text-4xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 className="text-2xl font-light">{user.username}</h1>
            {user.isOwnProfile ? (
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <FollowButton
                username={user.username}
                isFollowing={user.isFollowing}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <div className="font-semibold">{user.postsCount}</div>
              <div className="text-gray-600 text-sm">posts</div>
            </div>
            <div className="text-center cursor-pointer hover:text-gray-600">
              <div className="font-semibold">{user.followersCount}</div>
              <div className="text-gray-600 text-sm">followers</div>
            </div>
            <div className="text-center cursor-pointer hover:text-gray-600">
              <div className="font-semibold">{user.followingCount}</div>
              <div className="text-gray-600 text-sm">following</div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="font-semibold mb-1">{user.name}</div>
            {user.bio && <div className="text-sm">{user.bio}</div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t">
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-t-2 ${
              activeTab === "posts" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            POSTS
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">{activeTab === "posts" && <PostsGrid username={user.username} />}</div>
    </div>
  )
}
