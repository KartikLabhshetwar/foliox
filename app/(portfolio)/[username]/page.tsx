import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ClassicLayout } from "@/components/portfolio/classic-layout"
import { BentoLayout } from "@/components/portfolio/bento-layout"
import { PortfolioTracker } from "@/components/portfolio/portfolio-tracker"
import type { PortfolioData } from "@/types/portfolio"
import type { PRByOrg } from "@/components/portfolio/prs-by-org-section"
import { createAPIClient } from "@/lib/utils/api-client"
import { verifyUsername } from "@/lib/utils/user"
import { getGithubUsernameByCustomSlug } from "@/lib/utils/custom-url"
import {  extractSubdomainFromHostname } from "@/lib/utils/domain"
import { headers } from "next/headers"

interface PageProps {
  params: Promise<{ username: string }>
  searchParams: Promise<{ layout?: string }>
}

async function fetchPortfolioData(username: string): Promise<PortfolioData | null> {
  const apiKey = process.env.API_KEYS?.split(",")[0] || ""
  const client = createAPIClient(apiKey)
  
  return client.getFullPortfolio(username, { revalidate: 3600 })
}

async function fetchPRsByOrg(username: string): Promise<PRByOrg[]> {
  try {
    const apiKey = process.env.API_KEYS?.split(",")[0] || ""
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/user/${username}/prs-by-org`, {
      headers: {
        "X-API-Key": apiKey,
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    return await response.json()
  } catch {
    return []
  }
}

async function resolveUsername(rawUsername: string): Promise<string | null> {
  const customGithubUsername = await getGithubUsernameByCustomSlug(rawUsername)
  if (customGithubUsername) {
    return customGithubUsername
  }
  
  try {
    return verifyUsername(rawUsername)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username: rawUsername } = await params
  const username = await resolveUsername(rawUsername)
  
  if (!username) {
    return {
      title: "Portfolio Not Found",
      description: "The requested portfolio could not be found.",
    }
  }
  
  const data = await fetchPortfolioData(username)

  if (!data) {
    return {
      title: "Portfolio Not Found",
      description: "The requested portfolio could not be found.",
    }
  }

  return {
    title: data.seo?.title || `${data.profile.name || username} - Developer Portfolio`,
    description: data.seo?.description || data.profile.bio || `Check out ${username}'s developer portfolio`,
    keywords: data.seo?.keywords || [],
    openGraph: {
      title: data.seo?.title || `${data.profile.name || username} - Developer Portfolio`,
      description: data.seo?.description || data.profile.bio || "",
      images: [data.profile.avatar_url],
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo?.title || `${data.profile.name || username} - Developer Portfolio`,
      description: data.seo?.description || data.profile.bio || "",
      images: [data.profile.avatar_url],
    },
  }
}

export default async function PortfolioPage({ params, searchParams }: PageProps) {
  const { username: rawUsername } = await params
  const hostname = (await headers()).get("host") || ""
  const subdomain = extractSubdomainFromHostname(hostname)
  if(!subdomain){
    return
  }
  const { layout } = await searchParams
  
  const username = await resolveUsername(rawUsername || subdomain)
  
  if (!username) {
    notFound()
  }
  
  const [data, prsByOrg] = await Promise.all([
    fetchPortfolioData(username),
    fetchPRsByOrg(username),
  ])

  if (!data) {
    notFound()
  }

  const wasCached = data.profile.cached === true
  const isBento = layout === "bento"

  return (
    <>
      <PortfolioTracker username={username} wasCached={wasCached} />
      
      {isBento ? (
        <BentoLayout
          profile={data.profile}
          about={data.about || null}
          projects={data.projects}
          username={username}
          prsByOrg={prsByOrg}
        />
      ) : (
        <ClassicLayout
          profile={data.profile}
          about={data.about || null}
          projects={data.projects}
          username={username}
          prsByOrg={prsByOrg}
        />
      )}
    </>
  )
}
