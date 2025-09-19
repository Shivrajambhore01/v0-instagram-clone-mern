"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  postId: string
  initialIsLiked: boolean
  initialLikesCount: number
  onLikeChange?: (isLiked: boolean, likesCount: number) => void
}

export function LikeButton({ postId, initialIsLiked, initialLikesCount, onLikeChange }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleLikeToggle = async () => {
    setIsLoading(true)

    try {
      const method = isLiked ? "DELETE" : "POST"
      const response = await fetch(`/api/posts/${postId}/like`, {
        method,
      })

      const data = await response.json()

      if (response.ok) {
        setIsLiked(data.isLiked)
        setLikesCount(data.likesCount)
        onLikeChange?.(data.isLiked, data.likesCount)
      } else {
        console.error("Like error:", data.error)
      }
    } catch (error) {
      console.error("Network error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={handleLikeToggle} disabled={isLoading}>
        <Heart
          className={cn(
            "w-6 h-6 transition-colors",
            isLiked ? "fill-red-500 text-red-500" : "text-gray-700 hover:text-gray-500",
          )}
        />
      </Button>
      <span className="text-sm font-medium">{likesCount}</span>
    </div>
  )
}
