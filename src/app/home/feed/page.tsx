import { getCurrentUserProfile, getFeedPosts } from "@/lib/db-actions"
import { PostCard } from "@/app/home/feed/components/post-card"

export default async function Feed() {
  const feedPosts = await getFeedPosts()
  const profile = await getCurrentUserProfile()
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      {/* Posts Feed */}
      <div className="space-y-6">
        {feedPosts.map((post) => (
          <PostCard key={post.project_id} post={post} profile={profile} />
        ))}
      </div>
    </div>
  )
}
