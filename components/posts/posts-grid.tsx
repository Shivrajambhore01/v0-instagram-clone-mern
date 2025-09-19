"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"

interface Post {
  _id: string
  imageUrl: string
  caption: string
  likesCount: number
  commentsCount: number
}

interface PostsGridProps {
  username: string
}

export function PostsGrid({ username }: PostsGridProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${username}/posts`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [username])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1">
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
  )
}
