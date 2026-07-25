import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harry — Developer & Writer",
    short_name: "Harry",
    description: "Jiacheng (Harry) He's personal developer blog.",
    start_url: "/",
    display: "standalone",
    background_color: "#11111b",
    theme_color: "#11111b",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
