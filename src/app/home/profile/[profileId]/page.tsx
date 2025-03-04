import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Grid3X3,
	Bookmark,
	Tag,
	MoreHorizontal,
	MessageCircle,
	Settings,
	Ban,
	CheckCircle2,
} from "lucide-react"
import { getProfileByID, isFollowing } from "@/lib/db-actions"
import { getCurrentUser } from "@/lib/auth-actions"
import Follow from "../components/follow-button"
import Unfollow from "../components/unfollow-button"

export default async function Profile({
	params,
}: {
	params: Promise<{ profileId: string }>
}) {
	const { profileId } = await params
	const profile = await getProfileByID(profileId)
	const currentUser = await getCurrentUser()
	const isOwner = currentUser.user.id == profileId
	const isFollower = await isFollowing(profileId)
	console.log(isFollower)
	return (
		<div className="container max-w-4xl mx-auto px-4 py-8 bg-muted">
			{/* Profile Header */}
			<div className="flex flex-col md:flex-row gap-8 mb-8">
				<div className="flex justify-center md:justify-start">
					<Avatar className="h-24 w-24 md:h-36 md:w-36 border-2 border-background">
						<AvatarImage
							src="/placeholder.svg?height=150&width=150"
							alt={profile.username ?? ""}
						/>
						<AvatarFallback>{profile.username?.split(" ")}</AvatarFallback>
					</Avatar>
				</div>

				<div className="flex-1 space-y-4">
					<div className="flex flex-col md:flex-row md:items-center gap-4">
						<div className="flex items-center gap-2">
							<h1 className="text-xl font-semibold">{profile.username}</h1>
							{/* <Badge
								variant="outline"
								className="rounded-full bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1 px-2"
							>
								<CheckCircle2 className="h-3 w-3" />
								<span className="text-xs">Verified</span>
							</Badge> */}
						</div>

						<div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
							{isOwner ? (
								<Button className="bg-red-300 text-primary-foreground hover:bg-red-300/90">
									Settings
								</Button>
							) : isFollower ? (
								<Unfollow profileId={profileId} />
							) : (
								<Follow profileId={profileId} />
							)}
							<Button variant="outline">Message</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="icon" className="h-10 w-10">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Ban className="mr-2 h-4 w-4" />
										<span>Block</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Bookmark className="mr-2 h-4 w-4" />
										<span>Add to list</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Stats */}
					<div className="flex gap-6">
						<div className="text-center md:text-left">
							<span className="font-semibold">{profile.project_count}</span>
							<span className="text-muted-foreground ml-1">projects</span>
						</div>
						<div className="text-center md:text-left">
							<span className="font-semibold">{profile.follower_count}</span>
							<span className="text-muted-foreground ml-1">followers</span>
						</div>
						<div className="text-center md:text-left">
							<span className="font-semibold">{profile.following_count}</span>
							<span className="text-muted-foreground ml-1">following</span>
						</div>
					</div>

					{/* Bio */}
					<div className="space-y-1">
						<h2 className="font-semibold">{profile.full_name}</h2>
						{/* <p className="text-sm text-muted-foreground">Digital creator</p> */}
						<p className="text-sm">{profile.bio}</p>
						{/* <Link href="#" className="text-sm text-blue-600 hover:underline">
							www.janedoe.com
						</Link> */}
					</div>
				</div>
			</div>

			{/* Tabs and Content */}
			<Tabs defaultValue="posts" className="w-full">
				<TabsList className="w-full grid grid-cols-2">
					<TabsTrigger value="posts" className="flex items-center gap-2">
						<Grid3X3 className="h-4 w-4" />
						<span className="hidden sm:inline">Posts</span>
					</TabsTrigger>
					<TabsTrigger value="tagged" className="flex items-center gap-2">
						<Tag className="h-4 w-4" />
						<span className="hidden sm:inline">Tagged</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="posts" className="mt-6">
					<div className="grid grid-cols-3 gap-1">
						{Array.from({ length: 9 }).map((_, i) => (
							<div key={i} className="aspect-square relative group">
								<Image
									src={`/placeholder.svg?height=300&width=300&text=Post${
										i + 1
									}`}
									alt={`Post ${i + 1}`}
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
									<div className="flex items-center gap-1">
										<MessageCircle className="h-5 w-5 fill-white" />
										<span className="font-semibold">
											{Math.floor(Math.random() * 100)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</TabsContent>

				<TabsContent value="tagged" className="mt-6">
					<div className="grid grid-cols-3 gap-1">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="aspect-square relative group">
								<Image
									src={`/placeholder.svg?height=300&width=300&text=Tagged${
										i + 1
									}`}
									alt={`Tagged ${i + 1}`}
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
									<div className="flex items-center gap-1">
										<MessageCircle className="h-5 w-5 fill-white" />
										<span className="font-semibold">
											{Math.floor(Math.random() * 100)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
