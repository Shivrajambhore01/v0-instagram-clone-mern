"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Share, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { LikeButton } from "./like-button"
import { CommentsSection } from "./comments-section"

interface PostCardProps {
  post: {
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
  currentUserId?: string
  onDelete?: (postId: string) => void
}

export function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const isOwner = currentUserId === post.author._id
  const isLiked = post.likes.some((like) => like.user === currentUserId)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete?.(post._id)
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      alert("Error deleting post")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} />
            <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{post.author.username}</p>
          </div>
        </Link>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.caption || "Post image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Post Actions */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <LikeButton
              postId={post._id}
              initialIsLiked={isLiked}
              initialLikesCount={likesCount}
              onLikeChange={(_, newLikesCount) => setLikesCount(newLikesCount)}
            />
            <Button variant="ghost" size="sm" className="p-0" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <Share className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mb-2">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </p>

        {/* Caption */}
        {post.caption && (
          <div className="mb-2">
            <Link href={`/profile/${post.author.username}`} className="font-semibold text-sm mr-2">
              {post.author.username}
            </Link>
            <span className="text-sm">{post.caption}</span>
          </div>
        )}

        {/* Comments Toggle */}
        {post.commentsCount > 0 && (
          <Button
            variant="ghost"
            className="p-0 h-auto text-gray-500 text-sm mb-2"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? "Hide" : "View all"} {post.commentsCount} comments
          </Button>
        )}

        {/* Timestamp */}
        <p className="text-gray-500 text-xs uppercase mb-3">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>

        {/* Comments Section */}
        {showComments && (
          <CommentsSection
            postId={post._id}
            initialCommentsCount={post.commentsCount}
            currentUserId={currentUserId}
            postAuthorId={post.author._id}
          />
        )}
      </CardContent>
    </Card>
  )
}
