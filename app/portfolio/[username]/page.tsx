import { Metadata } from "next"
import { notFound } from "next/navigation"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { ContributionGraph } from "@/components/portfolio/contribution-graph"
import { PortfolioNavbar } from "@/components/portfolio/navbar"
import { PortfolioFooter } from "@/components/portfolio/footer"
import type { PortfolioData } from "@/types/portfolio"
import { createAPIClient } from "@/lib/utils/api-client"

interface PageProps {
  params: Promise<{ username: string }>
}

async function fetchPortfolioData(username: string): Promise<PortfolioData | null> {
  const apiKey = process.env.API_KEYS?.split(",")[0] || ""
  const client = createAPIClient(apiKey)
  
  return client.getFullPortfolio(username, { revalidate: 3600 })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
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
  const { username } = await params
  const data = await fetchPortfolioData(username)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNavbar username={username} name={data.profile.name} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <HeroSection profile={data.profile} about={data.about} />
        
        <div className="space-y-8 mt-8">
          <AboutSection about={data.about} />
          <ProjectsSection projects={data.projects} />
          <ContributionGraph username={username} />
        </div>
      </main>

      <PortfolioFooter />
    </div>
  )
}

