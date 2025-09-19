"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/posts/post-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Post {
  _id: string
  author: {
    _id: string
    username: string
    name: string
    profilePicture?: string
  }
  imageUrl: string
  caption: string
  likes: Array<{ user: string }>
  likesCount: number
  commentsCount: number
  createdAt: string
  isLiked: boolean
}

export function FeedPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Get current user
        const userResponse = await fetch("/api/auth/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setCurrentUserId(userData.user.id)
        }

        // Get feed posts
        const response = await fetch("/api/feed")
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
          setHasMore(data.pagination.hasNext)
        }
      } catch (error) {
        console.error("Error fetching feed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const response = await fetch(`/api/feed?page=${currentPage + 1}`)
      if (response.ok) {
        const data = await response.json()
        setPosts((prev) => [...prev, ...data.posts])
        setCurrentPage((prev) => prev + 1)
        setHasMore(data.pagination.hasNext)
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((post) => post._id !== postId))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No posts in your feed</h3>
        <p className="text-gray-600 mb-4">Follow some users to see their posts here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} currentUserId={currentUserId} onDelete={handlePostDeleted} />
      ))}

      {hasMore && (
        <div className="flex justify-center py-4">
          <Button onClick={loadMorePosts} disabled={loadingMore} variant="outline">
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
