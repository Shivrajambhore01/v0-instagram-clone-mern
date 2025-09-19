import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="text-center text-white space-y-8">
        <h1 className="text-6xl font-bold mb-4">Instagram Clone</h1>
        <p className="text-xl mb-8">Share your moments with the world</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-sm">
            🎯 <strong>Demo Mode:</strong> No database required!
            <br />
            Use any email/password to login or create an account.
          </p>
        </div>
        <div className="space-x-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
