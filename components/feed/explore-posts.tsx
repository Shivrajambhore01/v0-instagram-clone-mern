"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Loader2 } from "lucide-react"

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
  likesCount: number
  commentsCount: number
  isLiked: boolean
}

export function ExplorePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/explore")
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
          setHasMore(data.pagination.hasNext)
        }
      } catch (error) {
        console.error("Error fetching explore posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const response = await fetch(`/api/explore?page=${currentPage + 1}`)
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
        <h3 className="text-lg font-semibold mb-2">No posts to explore</h3>
        <p className="text-gray-600">Check back later for new content!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 mb-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post._id}`} className="group relative aspect-square">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.caption || "Post"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-1">
                  <Heart className="w-6 h-6 fill-current" />
                  <span className="font-semibold">{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-6 h-6 fill-current" />
                  <span className="font-semibold">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

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
