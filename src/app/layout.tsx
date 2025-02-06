import "./globals.css"
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<meta name="apple-mobile-web-app-title" content="knitted" />
			<link rel="shortcut icon" href="/favicon.ico" />
			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

			<body>{children}</body>
		</html>
	)
}
