"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search/search-bar"
import { UserList } from "@/components/users/user-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SearchResults {
  users?: {
    data: Array<{
      _id: string
      username: string
      name: string
      profilePicture?: string
    }>
    pagination: {
      currentPage: number
      totalPages: number
      total: number
    }
  }
  posts?: {
    data: Array<{
      _id: string
      imageUrl: string
      caption: string
      likesCount: number
      commentsCount: number
    }>
    pagination: {
      currentPage: number
      totalPages: number
      total: number
    }
  }
}

export default function SearchPage() {
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  const handleSearch = async (searchQuery: string) => {
    setLoading(true)
    setQuery(searchQuery)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        setResults(null)
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setResults(null)
    setQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Search</h1>
        </div>
      </header>

      {/* Search Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <SearchBar onSearch={handleSearch} onClear={handleClear} />

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {results && !loading && (
          <div className="space-y-8">
            {/* Users Results */}
            {results.users && results.users.data.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Users ({results.users.pagination.total})</h2>
                <UserList users={results.users.data} title="" />
              </div>
            )}

            {/* Posts Results */}
            {results.posts && results.posts.data.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Posts ({results.posts.pagination.total})</h2>
                <div className="grid grid-cols-3 gap-1">
                  {results.posts.data.map((post) => (
                    <Link key={post._id} href={`/post/${post._id}`} className="group relative aspect-square">
                      <img
                        src={post.imageUrl || "/placeholder.svg"}
                        alt={post.caption || "Post"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-6 text-white">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{post.likesCount} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{post.commentsCount} comments</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {(!results.users || results.users.data.length === 0) &&
              (!results.posts || results.posts.data.length === 0) && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching for something else</p>
                </div>
              )}
          </div>
        )}

        {!results && !loading && query && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Start searching</h3>
            <p className="text-gray-600">Enter a search term to find users and posts</p>
          </div>
        )}
      </main>
    </div>
  )
}
