"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"

interface FollowButtonProps {
  username: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export function FollowButton({ username, isFollowing: initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollowToggle = async () => {
    setIsLoading(true)

    try {
      const method = isFollowing ? "DELETE" : "POST"
      const response = await fetch(`/api/users/${username}/follow`, {
        method,
      })

      const data = await response.json()

      if (response.ok) {
        setIsFollowing(data.isFollowing)
        onFollowChange?.(data.isFollowing)
      } else {
        alert(data.error || "Failed to update follow status")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className="min-w-[100px]"
    >
      {isLoading ? (
        "Loading..."
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  )
}
