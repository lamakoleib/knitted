import "./globals.css"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knitted",
  description: "Share and discover knitting projects",
  applicationName: "Knitted",
  themeColor: "#ffffff",
  icons: {
    icon: [
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/web-app-manifest-192x192.png" }]
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Knitted" />

        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
