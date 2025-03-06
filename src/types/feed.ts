import type { Database } from "./database.types"

type ProjectRow = Database["public"]["Tables"]["Project"]["Row"]
type ProfileRow = Database["public"]["Tables"]["Profiles"]["Row"]

type LikesData = {
  count?: number
  like_id?: number
  created_at?: string
  user_id?: string
  project_id?: number
}

export type FeedPost = ProjectRow & {
  Profiles: {
    id: string
    username: string | null
    avatar_url: string | null
    full_name: string
    bio?: string | null
  } | null

  Likes?: LikesData[] | { count: number } | null

  _commentCount?: number

  userHasLiked?: boolean
}

export type FeedResponse = {
  posts: FeedPost[] | null
  error: string | null
}
