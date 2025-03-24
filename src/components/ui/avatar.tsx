"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
/**
 * The main Avatar component.
 *
 * Wraps Radix UI's `AvatarPrimitive.Root` to create a circular container for profile images.
 * Typically used with `AvatarImage` and `AvatarFallback`.
 *
 * @param props - Props passed to the Radix Avatar root.
 * @param props.className - Optional Tailwind class names for custom styling.
 * @returns A circular avatar wrapper.
 */
const Avatar = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn(
			"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
			className
		)}
		{...props}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * The Avatar image component.
 *
 * Wraps Radix UI's `AvatarPrimitive.Image`, used to display a profile picture inside the avatar.
 *
 * @param props - Props passed to the Radix Avatar image.
 * @returns An image that fills the avatar circle.
 */
const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn("aspect-square h-full w-full", className)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
/**
 * The fallback UI when an image cannot be loaded.
 *
 * Wraps Radix UI's `AvatarPrimitive.Fallback`. Commonly used to display initials or an icon.
 *
 * @param props - Props passed to the Radix Avatar fallback.
 * @returns A fallback view when no image is available.
 */
const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-muted",
			className
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
