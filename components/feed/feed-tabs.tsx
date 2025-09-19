"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedPosts } from "./feed-posts"
import { ExplorePosts } from "./explore-posts"

export function FeedTabs() {
  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="feed">Following</TabsTrigger>
        <TabsTrigger value="explore">Explore</TabsTrigger>
      </TabsList>
      <TabsContent value="feed">
        <FeedPosts />
      </TabsContent>
      <TabsContent value="explore">
        <ExplorePosts />
      </TabsContent>
    </Tabs>
  )
}
