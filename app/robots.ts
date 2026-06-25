import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://formula-dash-1.vercel.app"

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/driver-standings",
          "/team-standings",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}