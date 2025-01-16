import * as React from "react";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, Plus } from "lucide-react";

export default function PostCard() {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<Image
					src="https://cdn.discordapp.com/attachments/947578607209963571/1329283786872979467/IMG_8811.png?ex=6789c77f&is=678875ff&hm=6c82c1e55fc557bbb830f1e7dd5858aac59bf2b08c09d8f2784a75fc1e8dddc7&"
					width={340}
					height={255}
					alt="Picture of the author"
				/>
			</CardHeader>
			<CardContent className="pb-0">
				<div className="flex items-center justify-between ">
					<span className="flex gap-2 items-center">
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<span className="text-xs">
							Lama <span className="text-md">&#183;</span> 1h
						</span>
					</span>
					<span className="flex gap-2">
						<MessageCircle size={20} />
						<Heart size={20} />
					</span>
				</div>
				<div className="flex flex-col gap-1 pt-2 pl-5">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[250px]" />
				</div>
			</CardContent>
			<CardFooter className="justify-end">
				<Plus />
			</CardFooter>
		</Card>
	);
}
