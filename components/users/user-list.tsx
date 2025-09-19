"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FollowButton } from "./follow-button"
import Link from "next/link"

interface User {
  _id: string
  username: string
  name: string
  profilePicture?: string
}

interface UserListProps {
  users: User[]
  title: string
  currentUserId?: string
}

export function UserList({ users, title, currentUserId }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No {title.toLowerCase()} yet</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.profilePicture || "/placeholder.svg"} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-gray-600 text-sm">{user.name}</p>
              </div>
            </Link>
            {currentUserId !== user._id && <FollowButton username={user.username} isFollowing={false} />}
          </div>
        ))}
      </div>
    </div>
  )
}
