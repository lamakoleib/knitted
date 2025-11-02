import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest 
{
  return {
    name: "Knitted",
    short_name: "Knitted",
    description: "Crochet / knit progress app",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
