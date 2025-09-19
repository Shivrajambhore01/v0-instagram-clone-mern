"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { LikeButton } from "@/components/posts/like-button"
import { CommentsSection } from "@/components/posts/comments-section"

interface PostPageProps {
  params: {
    id: string
  }
}

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
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const userResponse = await fetch("/api/auth/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setCurrentUserId(userData.user.id)
        }

        // Get post
        const postResponse = await fetch(`/api/posts/${params.id}`)
        if (postResponse.ok) {
          const postData = await postResponse.json()
          setPost(postData.post)
        } else {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={() => router.push("/dashboard")}>Go back to feed</Button>
        </div>
      </div>
    )
  }

  const isLiked = post.likes.some((like) => like.user === currentUserId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Post</h1>
        </div>
      </header>

      {/* Post Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
                {post.author.username}
              </Link>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="md:flex">
            {/* Post Image */}
            <div className="md:flex-1">
              <div className="relative aspect-square">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.caption || "Post image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Post Details */}
            <div className="md:w-80 md:flex md:flex-col">
              <div className="p-4 flex-1">
                {/* Caption */}
                {post.caption && (
                  <div className="mb-4">
                    <Link href={`/profile/${post.author.username}`} className="font-semibold mr-2">
                      {post.author.username}
                    </Link>
                    <span>{post.caption}</span>
                  </div>
                )}

                {/* Comments */}
                <CommentsSection
                  postId={post._id}
                  initialCommentsCount={post.commentsCount}
                  currentUserId={currentUserId}
                  postAuthorId={post.author._id}
                />
              </div>

              {/* Actions */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-4 mb-2">
                  <LikeButton postId={post._id} initialIsLiked={isLiked} initialLikesCount={post.likesCount} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
