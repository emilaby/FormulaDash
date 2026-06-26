import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.formuladash.com"

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