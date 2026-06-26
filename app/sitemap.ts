import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://formuladash1.vercel.app/"
    return [
    {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 1,
    },
    {
        url: `${baseUrl}driver-standings`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    },
    {
        url: `${baseUrl}driver-standings`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    },
    ]
}