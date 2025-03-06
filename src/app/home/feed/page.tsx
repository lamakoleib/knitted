import { getFeedPosts } from "@/lib/db-actions"
import { PostCard } from "./components/post-card"

export default async function Feed() {
  const feedPosts = await getFeedPosts()
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      {/* Posts Feed */}
      <div className="space-y-6">
        {feedPosts.map((post) => (
          <PostCard key={post.project_id} post={post} />
        ))}
      </div>
    </div>
  )
}
