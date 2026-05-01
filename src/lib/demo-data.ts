import type { Tables } from "@/types/database.types"
import type { FeedPost } from "@/types/feed"

export type NotificationType = "like" | "comment" | "follow" | "tag"

/**
 * Static fixtures for the demo build. Backs every read in db-actions.ts so
 * the app renders without a database. The image paths point at the local
 * storage-bucket dump under /public/knitted-images.
 */

const VIEWER_ID = "eb4a628d-724f-4309-83f5-e733be9d0585"

const ASSET = "/knitted-images"

const profiles: Tables<"Profiles">[] = [
  {
    id: VIEWER_ID,
    username: "lama_knits",
    full_name: "Lama Koleib",
    email: "lama@example.com",
    avatar_url: `${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/avatars/avatar-1743375731827-9d92qb7b.png`,
    bio: "Sweater season, all year round. Sharing WIPs and finished pieces.",
    birthday: "1999-04-12",
    follower_count: 312,
    following_count: 184,
    project_count: 10,
    saved_projects: ["1741208658142", "1741906351417"],
    initialized: true,
  },
  {
    id: "3988553d-b929-48fe-884a-11aa2836b4c3",
    username: "brianna.makes",
    full_name: "Brianna B",
    email: "brianna@example.com",
    avatar_url: `${ASSET}/3988553d-b929-48fe-884a-11aa2836b4c3/avatars/avatar-1741209016475-52d64wzz.png`,
    bio: "Crochet > sleep. Granny squares forever.",
    birthday: "1997-08-21",
    follower_count: 1284,
    following_count: 91,
    project_count: 2,
    saved_projects: [],
    initialized: true,
  },
  {
    id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724",
    username: "zeynep.knit",
    full_name: "Zeynep Demir",
    email: "zeynep@example.com",
    avatar_url: `${ASSET}/8d0dd0dd-49bd-446f-b962-fa9fd5262724/avatars/avatar-1741384231139-ua39erdo.png`,
    bio: "Cables, colorwork, and very strong tea.",
    birthday: "1995-11-03",
    follower_count: 542,
    following_count: 210,
    project_count: 1,
    saved_projects: [],
    initialized: true,
  },
  {
    id: "bb52042e-5c20-4a0c-9e21-da04521ed82b",
    username: "squishy",
    full_name: "squishy",
    email: "shakir@example.com",
    avatar_url: `${ASSET}/bb52042e-5c20-4a0c-9e21-da04521ed82b/avatars/avatar-1741152574797-tshxonw5.png`,
    bio: "First-time knitter, future scarf empire.",
    birthday: "2000-02-14",
    follower_count: 47,
    following_count: 63,
    project_count: 2,
    saved_projects: [],
    initialized: true,
  },
  {
    id: "0863ff6d-580f-4e02-be6c-c76f4b5d2c4d",
    username: "aisha.fiber",
    full_name: "Aisha Khan",
    email: "aisha@example.com",
    avatar_url: null,
    bio: "Plant-dyed yarn enthusiast.",
    birthday: "1996-06-30",
    follower_count: 198,
    following_count: 88,
    project_count: 0,
    saved_projects: [],
    initialized: true,
  },
]

type DemoProject = Tables<"Project"> & { archived_at?: string | null }

const projects: DemoProject[] = [
  // --- Lama (viewer): 8 projects
  {
    project_id: 1743375803,
    user_id: VIEWER_ID,
    title: "Spring Cardigan",
    description: "Lightweight cotton cardigan in pale rose. Lots of yarn-overs.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1743375803201-ekm1ysy7/1743375803250-screenshot-2025-03-30-190137.png`],
    yarn: ["cotton", "merino-wool"],
    pattern: "cardigan",
    needle_size: "4.0mm",
    difficulty: "intermediate",
    status: "completed",
    time_spent: 42,
    tags: ["spring", "cardigan", "rose"],
    like_count: 124,
    comments: null,
    created_at: "2026-03-30T19:01:37.000Z",
  },
  {
    project_id: 1760059273,
    user_id: VIEWER_ID,
    title: "Autumn Pullover (WIP)",
    description: "A worsted-weight raglan in caramel. Halfway through the body.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760059273475-4niwy7pj/1760059273589-screenshot-2025-10-09-211937.png`],
    yarn: ["merino-wool"],
    pattern: "cable-knit-sweater",
    needle_size: "5.0mm",
    difficulty: "intermediate",
    status: "in-progress",
    time_spent: 18,
    tags: ["pullover", "fall"],
    like_count: 86,
    comments: null,
    created_at: "2025-10-09T21:19:37.000Z",
  },
  {
    project_id: 1760061297,
    user_id: VIEWER_ID,
    title: "Cable Sampler Swatch",
    description: "Trying out three new cable charts before committing.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760061297989-5hnfs8rd/1760061298079-screenshot-2025-10-09-211937.png`],
    yarn: ["alpaca"],
    pattern: "cable-knit-sweater",
    needle_size: "4.5mm",
    difficulty: "advanced",
    status: "completed",
    time_spent: 6,
    tags: ["swatch", "cables"],
    like_count: 41,
    comments: null,
    created_at: "2025-10-09T21:34:57.000Z",
  },
  {
    project_id: 1760061309,
    user_id: VIEWER_ID,
    title: "Granny Square Throw",
    description: "Stash-busting throw, 80 squares and counting.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760061309235-pdicmzhi/1760061309332-screenshot-2025-10-09-211937.png`],
    yarn: ["acrylic"],
    pattern: "baby-blanket",
    needle_size: "5.5mm",
    difficulty: "easy",
    status: "in-progress",
    time_spent: 24,
    tags: ["crochet", "blanket", "scrap"],
    like_count: 67,
    comments: null,
    created_at: "2025-10-09T21:35:09.000Z",
  },
  {
    project_id: 1760061360,
    user_id: VIEWER_ID,
    title: "Lace Shawl in Mohair",
    description: "First mohair project. Counting stitches very slowly.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760061360946-bzk120j4/1760061361049-screenshot-2025-10-09-211937.png`],
    yarn: ["silk"],
    pattern: "lace-shawl",
    needle_size: "3.75mm",
    difficulty: "advanced",
    status: "in-progress",
    time_spent: 31,
    tags: ["lace", "mohair"],
    like_count: 153,
    comments: null,
    created_at: "2025-10-10T02:16:00.000Z",
  },
  {
    project_id: 1760567782,
    user_id: VIEWER_ID,
    title: "Linen Summer Tee",
    description: "Boxy tee from a linen-cotton blend. Breezy and cool.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760567782759-r1z2rbap/1760567782853-screenshot-2025-10-09-211937.png`],
    yarn: ["linen", "cotton"],
    pattern: "basic-scarf",
    needle_size: "3.5mm",
    difficulty: "easy",
    status: "completed",
    time_spent: 22,
    tags: ["summer", "linen"],
    like_count: 92,
    comments: null,
    created_at: "2025-10-15T17:43:02.000Z",
  },
  {
    project_id: 1760568703,
    user_id: VIEWER_ID,
    title: "Two-Color Beanie",
    description: "Stranded colorwork beanie in cream and forest.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760568703487-ltka6rbp/1760568703569-screenshot-2025-10-09-211937.png`],
    yarn: ["merino-wool"],
    pattern: "beanie-hat",
    needle_size: "3.75mm",
    difficulty: "intermediate",
    status: "completed",
    time_spent: 9,
    tags: ["colorwork", "hat"],
    like_count: 58,
    comments: null,
    created_at: "2025-10-15T17:58:23.000Z",
  },
  {
    project_id: 1760568995,
    user_id: VIEWER_ID,
    title: "Mittens for the Cabin",
    description: "Cozy thrummed mittens. Warmer than they look.",
    images: [`${ASSET}/eb4a628d-724f-4309-83f5-e733be9d0585/projects/1760568995651-dt1k12mp/1760568995738-screenshot-2025-10-09-211937.png`],
    yarn: ["alpaca", "merino-wool"],
    pattern: "mittens",
    needle_size: "4.0mm",
    difficulty: "intermediate",
    status: "completed",
    time_spent: 14,
    tags: ["winter", "mittens"],
    like_count: 76,
    comments: null,
    created_at: "2025-10-15T18:03:15.000Z",
  },

  // --- Maya (3988553d): 2 projects
  {
    project_id: 1741208658,
    user_id: "3988553d-b929-48fe-884a-11aa2836b4c3",
    title: "Granny Square Cardigan",
    description: "100 squares assembled into a vintage-inspired cardigan.",
    images: [`${ASSET}/3988553d-b929-48fe-884a-11aa2836b4c3/projects/1741208658142-lhmm32rg/1741208658209-screenshot-2025-03-05-160221.png`],
    yarn: ["cotton"],
    pattern: "cardigan",
    needle_size: "5.0mm",
    difficulty: "intermediate",
    status: "completed",
    time_spent: 56,
    tags: ["crochet", "cardigan", "granny"],
    like_count: 412,
    comments: null,
    created_at: "2025-03-05T16:02:21.000Z",
  },
  {
    project_id: 1741208985,
    user_id: "3988553d-b929-48fe-884a-11aa2836b4c3",
    title: "Patchwork Crochet Bag",
    description: "Mini market bag from leftover squares.",
    images: [`${ASSET}/3988553d-b929-48fe-884a-11aa2836b4c3/projects/1741208985655-cj3ckds7/1741208985729-screenshot-2025-03-05-160851.png`],
    yarn: ["cotton"],
    pattern: "frog",
    needle_size: "4.0mm",
    difficulty: "easy",
    status: "completed",
    time_spent: 12,
    tags: ["crochet", "bag", "scrap"],
    like_count: 187,
    comments: null,
    created_at: "2025-03-05T16:08:51.000Z",
  },

  // --- Zeynep (8d0dd0dd): 1 project
  {
    project_id: 1741906351,
    user_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724",
    title: "Aran Cabled Blanket",
    description: "Heavy aran blanket with five cable panels. Took forever.",
    images: [`${ASSET}/8d0dd0dd-49bd-446f-b962-fa9fd5262724/projects/1741906351417-6jueg0ds/1741906351478-screenshot-2025-03-07-000913.png`],
    yarn: ["merino-wool"],
    pattern: "baby-blanket",
    needle_size: "6.0mm",
    difficulty: "advanced",
    status: "completed",
    time_spent: 96,
    tags: ["cables", "blanket"],
    like_count: 268,
    comments: null,
    created_at: "2025-03-07T00:09:13.000Z",
  },

  // --- Shakir (bb52042e): 2 projects
  {
    project_id: 1741066981,
    user_id: "bb52042e-5c20-4a0c-9e21-da04521ed82b",
    title: "First Scarf",
    description: "My very first piece. Garter stitch the whole way down.",
    images: [`${ASSET}/bb52042e-5c20-4a0c-9e21-da04521ed82b/projects/1741066981282-jl3dz19b/1741066981339-img_8811.png`],
    yarn: ["acrylic"],
    pattern: "basic-scarf",
    needle_size: "5.0mm",
    difficulty: "beginner",
    status: "completed",
    time_spent: 8,
    tags: ["beginner", "scarf"],
    like_count: 31,
    comments: null,
    created_at: "2025-03-04T00:23:01.000Z",
  },
  {
    project_id: 1741067007,
    user_id: "bb52042e-5c20-4a0c-9e21-da04521ed82b",
    title: "Second Try Scarf",
    description: "Same pattern, fewer dropped stitches this time.",
    images: [`${ASSET}/bb52042e-5c20-4a0c-9e21-da04521ed82b/projects/1741067007706-26f5m7dn/1741067007758-img_8811.png`],
    yarn: ["acrylic"],
    pattern: "basic-scarf",
    needle_size: "5.0mm",
    difficulty: "beginner",
    status: "completed",
    time_spent: 7,
    tags: ["beginner", "scarf"],
    like_count: 22,
    comments: null,
    created_at: "2025-03-04T00:23:27.000Z",
  },

  // --- Lama (viewer): 2 more projects (originally Aisha's images)
  {
    project_id: 1764521997,
    user_id: VIEWER_ID,
    title: "Plant-Dyed Skein Sample",
    description: "Avocado pit + iron mordant. Such a soft pink.",
    images: [`${ASSET}/0863ff6d-580f-4e02-be6c-c76f4b5d2c4d/projects/1764521997684-ayn5gpxy/1764521997779-screenshot-2025-11-30-at-11.59.37-am.png`],
    yarn: ["merino-wool"],
    pattern: null,
    needle_size: "—",
    difficulty: "easy",
    status: "completed",
    time_spent: 4,
    tags: ["dye", "plant"],
    like_count: 144,
    comments: null,
    created_at: "2025-11-30T11:59:37.000Z",
  },
  {
    project_id: 1764531967,
    user_id: VIEWER_ID,
    title: "Naturally-Dyed Mitts",
    description: "Mitts from the avocado-dyed skein. Perfect match.",
    images: [`${ASSET}/0863ff6d-580f-4e02-be6c-c76f4b5d2c4d/projects/1764531967036-i7krx97f/1764531967182-screenshot-2025-11-30-at-2.42.15-pm.png`],
    yarn: ["merino-wool"],
    pattern: "mittens",
    needle_size: "3.5mm",
    difficulty: "intermediate",
    status: "completed",
    time_spent: 11,
    tags: ["mittens", "dye"],
    like_count: 98,
    comments: null,
    created_at: "2025-11-30T14:42:15.000Z",
  },
]

type DemoComment = {
  comment_id: number
  project_id: number
  user_id: string
  comment: string
  created_at: string
}

const comments: DemoComment[] = [
  { comment_id: 1, project_id: 1743375803, user_id: "3988553d-b929-48fe-884a-11aa2836b4c3", comment: "The color is gorgeous!", created_at: "2026-03-31T08:11:00.000Z" },
  { comment_id: 2, project_id: 1743375803, user_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724", comment: "Pattern link please?", created_at: "2026-03-31T10:42:00.000Z" },
  { comment_id: 3, project_id: 1743375803, user_id: "bb52042e-5c20-4a0c-9e21-da04521ed82b", comment: "Goals 😍", created_at: "2026-04-01T15:02:00.000Z" },
  { comment_id: 4, project_id: 1760059273, user_id: "0863ff6d-580f-4e02-be6c-c76f4b5d2c4d", comment: "That caramel is perfect for fall.", created_at: "2025-10-10T09:20:00.000Z" },
  { comment_id: 5, project_id: 1760061360, user_id: "3988553d-b929-48fe-884a-11aa2836b4c3", comment: "Mohair is no joke. Looks amazing!", created_at: "2025-10-11T18:00:00.000Z" },
  { comment_id: 6, project_id: 1760567782, user_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724", comment: "Need this for July.", created_at: "2025-10-16T11:30:00.000Z" },
  { comment_id: 7, project_id: 1741208658, user_id: VIEWER_ID, comment: "100 squares?? Incredible.", created_at: "2025-03-06T12:10:00.000Z" },
  { comment_id: 8, project_id: 1741208658, user_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724", comment: "Saving for inspo.", created_at: "2025-03-06T13:42:00.000Z" },
  { comment_id: 9, project_id: 1741906351, user_id: VIEWER_ID, comment: "The cables on this are unreal.", created_at: "2025-03-08T20:00:00.000Z" },
  { comment_id: 10, project_id: 1764521997, user_id: "0863ff6d-580f-4e02-be6c-c76f4b5d2c4d", comment: "Stunning. What mordant did you use?", created_at: "2025-12-01T09:00:00.000Z" },
  { comment_id: 11, project_id: 1741066981, user_id: VIEWER_ID, comment: "Welcome to the club! 🧶", created_at: "2025-03-04T22:00:00.000Z" },
]

// Viewer follows everyone except Shakir; Maya & Zeynep follow viewer back.
type Follow = { user_id: string; followers_id: string }
const follows: Follow[] = [
  { user_id: VIEWER_ID, followers_id: "3988553d-b929-48fe-884a-11aa2836b4c3" },
  { user_id: VIEWER_ID, followers_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724" },
  { user_id: VIEWER_ID, followers_id: "0863ff6d-580f-4e02-be6c-c76f4b5d2c4d" },
  { user_id: "3988553d-b929-48fe-884a-11aa2836b4c3", followers_id: VIEWER_ID },
  { user_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724", followers_id: VIEWER_ID },
  { user_id: "bb52042e-5c20-4a0c-9e21-da04521ed82b", followers_id: VIEWER_ID },
]

type DemoNotification = {
  notification_id: number
  user_id: string
  actor_id: string
  project_id: number | null
  type: NotificationType
  is_read: boolean | null
  created_at: string
}

const notifications: DemoNotification[] = [
  { notification_id: 1, user_id: VIEWER_ID, actor_id: "3988553d-b929-48fe-884a-11aa2836b4c3", project_id: 1743375803, type: "like", is_read: false, created_at: "2026-04-29T10:11:00.000Z" },
  { notification_id: 2, user_id: VIEWER_ID, actor_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724", project_id: 1760061360, type: "comment", is_read: false, created_at: "2026-04-29T08:55:00.000Z" },
  { notification_id: 3, user_id: VIEWER_ID, actor_id: "bb52042e-5c20-4a0c-9e21-da04521ed82b", project_id: null, type: "follow", is_read: false, created_at: "2026-04-28T20:14:00.000Z" },
  { notification_id: 4, user_id: VIEWER_ID, actor_id: "0863ff6d-580f-4e02-be6c-c76f4b5d2c4d", project_id: 1760567782, type: "like", is_read: true, created_at: "2026-04-27T17:00:00.000Z" },
  { notification_id: 5, user_id: VIEWER_ID, actor_id: "3988553d-b929-48fe-884a-11aa2836b4c3", project_id: 1760059273, type: "tag", is_read: true, created_at: "2026-04-26T14:20:00.000Z" },
  { notification_id: 6, user_id: VIEWER_ID, actor_id: "8d0dd0dd-49bd-446f-b962-fa9fd5262724", project_id: 1760568703, type: "comment", is_read: true, created_at: "2026-04-26T11:02:00.000Z" },
]

type Like = { project_id: number; user_id: string }
const likes: Like[] = [
  { project_id: 1741208658, user_id: VIEWER_ID },
  { project_id: 1741906351, user_id: VIEWER_ID },
  { project_id: 1764521997, user_id: "0863ff6d-580f-4e02-be6c-c76f4b5d2c4d" },
]

type ProjectTag = { project_id: number; tagged_user: string; tagged_by: string }
const projectTags: ProjectTag[] = [
  { project_id: 1760059273, tagged_user: VIEWER_ID, tagged_by: "3988553d-b929-48fe-884a-11aa2836b4c3" },
]

const profilesById = new Map(profiles.map((p) => [p.id, p]))

export const demoData = {
  viewerId: VIEWER_ID,
  profiles,
  profilesById,
  projects,
  comments,
  follows,
  notifications,
  likes,
  projectTags,
}

export type { DemoComment, DemoNotification, Like, Follow, ProjectTag }

// Helper to assemble a feed-shaped post (with attached Profiles)
export function attachProfile(project: DemoProject): FeedPost {
  const author = profilesById.get(project.user_id) ?? null
  return {
    ...project,
    Profiles: author
      ? {
          id: author.id,
          username: author.username,
          avatar_url: author.avatar_url,
          full_name: author.full_name,
          bio: author.bio,
        }
      : null,
  } as FeedPost
}
