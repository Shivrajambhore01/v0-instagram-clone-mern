"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Comment {
  _id: string
  user: {
    _id: string
    username: string
    name: string
    profilePicture?: string
  }
  text: string
  createdAt: string
}

interface CommentsSectionProps {
  postId: string
  initialCommentsCount: number
  currentUserId?: string
  postAuthorId?: string
}

export function CommentsSection({ postId, initialCommentsCount, currentUserId, postAuthorId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount)

  useEffect(() => {
    if (commentsCount > 0) {
      fetchComments()
    }
  }, [postId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment }),
      })

      const data = await response.json()

      if (response.ok) {
        setComments([data.comment, ...comments])
        setCommentsCount(data.commentsCount)
        setNewComment("")
      } else {
        alert(data.error || "Failed to add comment")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId))
        setCommentsCount(data.commentsCount)
      } else {
        alert(data.error || "Failed to delete comment")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      {/* Comments Count */}
      {commentsCount > 0 && (
        <p className="text-sm text-gray-600 font-medium">
          {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
        </p>
      )}

      {/* Add Comment Form */}
      {currentUserId && (
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1 w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Link href={`/profile/${comment.user.username}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.profilePicture || "/placeholder.svg"} />
                  <AvatarFallback>{comment.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/profile/${comment.user.username}`} className="font-semibold text-sm hover:underline">
                    {comment.user.username}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  {(currentUserId === comment.user._id || currentUserId === postAuthorId) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto ml-auto"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                    </Button>
                  )}
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && commentsCount === 0 && !isLoading && (
        <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}
