import { Metadata } from "next"
import { notFound } from "next/navigation"
import { IntroductionSection } from "@/components/portfolio/introduction-section"
import { CapabilitiesSection } from "@/components/portfolio/capabilities-section"
import { WorkGallery } from "@/components/portfolio/work-gallery"
import { ProofOfWorkSection } from "@/components/portfolio/proof-of-work-section"
import { WorkExperienceSection } from "@/components/portfolio/work-experience-section"
import { PRsByOrgSection } from "@/components/portfolio/prs-by-org-section"
import { GetInTouchSection } from "@/components/portfolio/get-in-touch-section"
import { PortfolioTracker } from "@/components/portfolio/portfolio-tracker"
import DiagonalPattern from "@/components/portfolio/diagonal-pattern"
import type { PortfolioData } from "@/types/portfolio"
import type { PRByOrg } from "@/components/portfolio/prs-by-org-section"
import { createAPIClient } from "@/lib/utils/api-client"
import { verifyUsername } from "@/lib/utils/user"
import { getGithubUsernameByCustomSlug } from "@/lib/utils/custom-url"

interface PageProps {
  params: Promise<{ username: string }>
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

export default async function PortfolioPage({ params }: PageProps) {
  const { username: rawUsername } = await params
  const username = await resolveUsername(rawUsername)
  
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

  return (
    <div className="min-h-screen bg-background relative">
      <PortfolioTracker username={username} wasCached={wasCached} />
      <DiagonalPattern side="left" />
      <DiagonalPattern side="right" />

      <main className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <IntroductionSection profile={data.profile} />
        
        <WorkExperienceSection profile={data.profile} />
        
        <CapabilitiesSection about={data.about} />
        
        <WorkGallery projects={data.projects} />

        <ProofOfWorkSection username={username} />

        <PRsByOrgSection prsByOrg={prsByOrg} username={username} />
      </main>

      <GetInTouchSection profile={data.profile} />
    </div>
  )
}

