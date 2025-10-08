import { getCurrentUserProfile, getFeedPosts, getMySavedProjectIds } from "@/lib/db-actions";
import { PostCard } from "@/app/home/feed/components/post-card";

/**
 * Renders the main feed page with a list of posts.
 *
 * Fetches the user's profile and the feed posts from the database,
 * and displays each post using the `PostCard` component.
 */
export default async function Feed() {
  const [feedPosts, profile, savedIdsArr] = await Promise.all([
    getFeedPosts(),
    getCurrentUserProfile(),
    getMySavedProjectIds(), // one server call for all saved IDs
  ]);
  const savedIds = new Set(savedIdsArr);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      {/* Posts Feed */}
      <div className="space-y-6">
        {feedPosts.map((post) => (
          <PostCard
            key={post.project_id}
            post={post}
            profile={profile}
            initialSaved={savedIds.has(post.project_id)} // <-- pass server-known state
          />
        ))}
      </div>
    </div>
  );
}
