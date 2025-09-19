import { UserProfile } from "@/components/users/user-profile"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <UserProfile username={params.username} />
    </div>
  )
}
