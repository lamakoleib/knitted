"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Provides theme context (light, dark, or system) to the entire application.
 * Wraps the Next.js ThemeProvider from `next-themes`.
 *
 * @param children - React children that will have access to the theme context.
 * @param props - Additional props passed to `next-themes` ThemeProvider.
 */
export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
