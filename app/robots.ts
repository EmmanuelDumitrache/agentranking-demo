import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://agentrankingdemo.netlify.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
