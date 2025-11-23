import type { NormalizedProfile, ProjectsData, AboutData } from "@/types/github"
import type { PortfolioData } from "@/types/portfolio"

interface FetchOptions {
  cache?: RequestCache
  revalidate?: number
}

export class APIClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl?: string, apiKey?: string) {
    const envUrl = process.env.NEXT_PUBLIC_API_URL
    const defaultUrl = typeof window === "undefined" 
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      : ""
    
    this.baseUrl = baseUrl || envUrl || defaultUrl
    this.apiKey = apiKey || process.env.API_KEYS?.split(",")[0] || ""
  }

  private getAbsoluteUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint
    }

    if (this.baseUrl) {
      return `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
    }

    if (typeof window !== "undefined") {
      return endpoint
    }

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const host = process.env.VERCEL_URL || "localhost:3000"
    return `${protocol}://${host}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  }

  private async fetch<T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T | null> {
    try {
      const url = this.getAbsoluteUrl(endpoint)
      const response = await fetch(url, {
        headers: {
          "X-API-Key": this.apiKey,
        },
        cache: options?.cache || "default",
        next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error(`Fetch error for ${endpoint}:`, error)
      return null
    }
  }

  async getProfile(username: string, options?: FetchOptions) {
    return this.fetch<NormalizedProfile>(
      `/api/user/${username}/profile`,
      options
    )
  }

  async getProjects(username: string, options?: FetchOptions) {
    return this.fetch<ProjectsData>(
      `/api/user/${username}/projects`,
      options
    )
  }

  async getAbout(username: string, options?: FetchOptions) {
    return this.fetch<{ about: AboutData | null }>(
      `/api/user/${username}/about`,
      options
    )
  }

  async getFullPortfolio(
    username: string,
    options?: FetchOptions
  ): Promise<PortfolioData | null> {
    const [profile, projects, aboutData] = await Promise.allSettled([
      this.getProfile(username, options),
      this.getProjects(username, options),
      this.getAbout(username, options),
    ])

    const profileData =
      profile.status === "fulfilled" ? profile.value : null
    const projectsData =
      projects.status === "fulfilled" ? projects.value : null
    const about =
      aboutData.status === "fulfilled" && aboutData.value
        ? aboutData.value.about
        : null

    if (!profileData) {
      return null
    }

    return {
      profile: profileData,
      about: about || profileData.about,
      seo: profileData.seo,
      projects: projectsData || undefined,
    }
  }
}

export const createAPIClient = (apiKey?: string, baseUrl?: string) => {
  return new APIClient(baseUrl, apiKey)
}

