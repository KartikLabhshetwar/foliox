"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FaGithub } from "react-icons/fa"
import { FaMapMarkerAlt, FaBuilding, FaUsers } from "react-icons/fa"
import { FaStar } from "react-icons/fa"
import Link from "next/link"
import { trackEvent } from "@/lib/utils/analytics"
import type { NormalizedProfile } from "@/types/github"

export default function LandingPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewUser, setPreviewUser] = useState<NormalizedProfile | null>(null)
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)
  const [starCount, setStarCount] = useState(0)
  const [displayedStars, setDisplayedStars] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch('/api/github/stars')
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stars || 0)
        }
      } catch {
        setStarCount(0)
      }
    }

    fetchStarCount()
  }, [])

  useEffect(() => {
    if (starCount === 0) return

    const duration = 500
    const steps = 40
    const increment = starCount / steps
    const stepDuration = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const nextValue = Math.min(Math.floor(increment * currentStep), starCount)
      setDisplayedStars(nextValue)

      if (currentStep >= steps) {
        setDisplayedStars(starCount)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [starCount])

  useEffect(() => {
    const trimmedUsername = username.trim()
    
    if (!trimmedUsername || trimmedUsername.length < 1) {
      setPreviewUser(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsFetchingPreview(true)
      try {
        const response = await fetch(`https://api.github.com/users/${trimmedUsername}`, {
          headers: {
            Accept: "application/vnd.github+json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPreviewUser({
            username: data.login,
            name: data.name,
            bio: data.bio,
            avatar_url: data.avatar_url,
            location: data.location,
            email: data.email,
            website: data.blog || null,
            twitter_username: data.twitter_username,
            company: data.company,
            followers: data.followers,
            following: data.following,
            public_repos: data.public_repos,
            created_at: data.created_at,
          })
        } else {
          setPreviewUser(null)
        }
      } catch {
        setPreviewUser(null)
      } finally {
        setIsFetchingPreview(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    trackEvent('portfolio-generation-started', {
      username: username.trim(),
    })

    setIsLoading(true)
    router.push(`/${username.trim()}`)
  }

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[826px] px-4">
        <div className="flex w-full flex-row items-center justify-between gap-3 rounded-full border border-white/20 px-3 py-2.5 backdrop-blur-lg bg-white/10 transition-colors duration-1000 md:gap-4 md:px-3.5 md:py-3">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity ml-2.5 md:ml-3">
            <span className="text-lg md:text-xl text-white font-bold">
              <span className="font-[var(--font-playfair)] italic font-normal">folio</span>
              <span className="font-sans">x</span>
            </span>
          </Link>

          <Link
            href="https://github.com/kartiklabhshetwar/foliox"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center justify-center gap-1.5 outline-none transition-colors border border-transparent text-white px-2.5 py-1.5 rounded-full bg-gray-900 hover:bg-gray-700 active:bg-gray-600 text-xs md:text-sm lg:px-4 lg:py-2.5 lg:text-base tracking-normal whitespace-nowrap cursor-pointer relative group overflow-visible"
          >
            <FaGithub className="h-4 w-4 relative z-10 transition-transform group-hover:scale-110" />
            <span className="relative z-10">GitHub</span>
            {displayedStars > 0 && (
              <span className="relative z-10 flex items-center gap-1 text-yellow-400 font-medium">
                <FaStar className="h-3 w-3" />
                <span className="tabular-nums">{displayedStars.toLocaleString()}</span>
              </span>
            )}
            <FaStar className="absolute h-3 w-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-1 -right-1 animate-sparkle" />
            <FaStar className="absolute h-2 w-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -bottom-0.5 -left-0.5 animate-sparkle-float" style={{ animationDelay: '0.2s' }} />
            <FaStar className="absolute h-2.5 w-2.5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 top-1/2 -left-2 animate-sparkle" style={{ animationDelay: '0.4s' }} />
            <FaStar className="absolute h-2 w-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 top-1/2 -right-2 animate-sparkle-float" style={{ animationDelay: '0.6s' }} />
          </Link>

          <Link
            href="https://github.com/kartiklabhshetwar/foliox"
            target="_blank"
            rel="noreferrer"
            className="md:hidden flex items-center justify-center gap-1 outline-none transition-colors border border-transparent text-white px-2.5 py-1.5 rounded-full bg-gray-900 hover:bg-gray-700 active:bg-gray-600 text-xs tracking-normal whitespace-nowrap cursor-pointer mr-2.5 relative group overflow-visible"
          >
            <FaGithub className="h-4 w-4 relative z-10 transition-transform group-hover:scale-110" />
            {displayedStars > 0 && (
              <span className="relative z-10 flex items-center gap-0.5 text-yellow-400 text-[10px] font-medium">
                <FaStar className="h-2.5 w-2.5" />
                <span className="tabular-nums">{displayedStars > 999 ? `${(displayedStars / 1000).toFixed(1)}k` : displayedStars}</span>
              </span>
            )}
            <FaStar className="absolute h-2.5 w-2.5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-1 -right-1 animate-sparkle" />
            <FaStar className="absolute h-2 w-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -bottom-0.5 -left-0.5 animate-sparkle-float" style={{ animationDelay: '0.2s' }} />
            <FaStar className="absolute h-2 w-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 top-1/2 -left-2 animate-sparkle" style={{ animationDelay: '0.4s' }} />
            <FaStar className="absolute h-2 w-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 top-1/2 -right-2 animate-sparkle-float" style={{ animationDelay: '0.6s' }} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative mx-auto lg:h-[1127px] h-[800px] md:h-[1000px] min-h-screen w-full">
          {/* Background Image */}
          <Image
            alt="Background image"
            src="/bg.jpg"
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover blur-[2px] transition-opacity duration-1000 opacity-100"
            style={{ objectFit: "cover" }}
          />

          <div className="relative flex min-h-[100dvh] w-full px-5 md:px-[50px] pt-20">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center">
                <div className="z-10 flex w-full max-w-[826px] flex-col items-center justify-center gap-8 md:gap-[50px]">
                  {/* Logo and Description */}
                    <div className="flex w-full flex-col items-center justify-center text-center">
                      <div className="flex flex-col items-center gap-3 md:gap-8">
                        <div className="flex flex-col items-center gap-3 md:gap-8">
                          <h1 className="text-5xl md:text-7xl font-bold text-white">
                            <span className="font-[var(--font-playfair)] italic font-normal">folio</span>
                            <span className="font-sans">x</span>
                          </h1>
                        </div>
                        <p className="text-base md:text-2xl px-5 md:px-10 font-normal text-white tracking-normal opacity-80 max-w-2xl">
                          Turn your GitHub into a stunning portfolio. Powered by AI, zero coding required.
                        </p>
                      </div>
                    </div>

                  {/* Form */}
                  <div className="max-w-md mx-auto relative group w-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <form onSubmit={handleSubmit} className="relative flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                      <div className="relative flex-1">
                        <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input
                          placeholder="github-username"
                          className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10 text-white placeholder:text-white/50"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" className="rounded-3xl" disabled={!username || isLoading}>
                        {isLoading ? "Generating..." : "Generate"}
                      </Button>
                    </form>
                  </div>

                  {/* Preview User Card */}
                  {previewUser && (
                    <div className="max-w-md mx-auto pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <Card className="border-white/20 shadow-lg bg-transparent backdrop-blur-md">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Image
                              src={previewUser.avatar_url}
                              alt={previewUser.username}
                              width={64}
                              height={64}
                              className="rounded-full border-2 border-white/30"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg truncate text-white">
                                  {previewUser.name || previewUser.username}
                                </h3>
                                {previewUser.name && (
                                  <span className="text-sm text-white/70 truncate">
                                    @{previewUser.username}
                                  </span>
                                )}
                              </div>
                              {previewUser.bio && (
                                <p className="text-sm text-white/70 line-clamp-2 mb-3">
                                  {previewUser.bio}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                                {previewUser.location && (
                                  <div className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="h-3 w-3" />
                                    <span>{previewUser.location}</span>
                                  </div>
                                )}
                                {previewUser.company && (
                                  <div className="flex items-center gap-1">
                                    <FaBuilding className="h-3 w-3" />
                                    <span>{previewUser.company}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <FaUsers className="h-3 w-3" />
                                  <span>{previewUser.followers} followers</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaGithub className="h-3 w-3" />
                                  <span>{previewUser.public_repos} repos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {isFetchingPreview && username.trim() && (
                    <div className="max-w-md mx-auto pt-6 text-center text-sm text-muted-foreground text-white/80">
                      Checking GitHub profile...
                    </div>
                  )}

                  <div className="pt-4 text-sm text-white/80">
                    <span className="mr-2">Try example:</span>
                    <button
                      onClick={() => setUsername("t3dotgg")}
                      className="underline hover:text-white transition-colors"
                    >
                      Theo Browne
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative min-h-[400px] border-t border-border/20 backdrop-blur-xl bg-background/10">
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-wrap justify-between items-start gap-10 md:gap-[40px]">
            <div className="flex flex-col gap-4">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <span className="text-2xl md:text-3xl text-foreground font-bold">
                  <span className="font-[var(--font-playfair)] italic font-normal">folio</span>
                  <span className="font-sans">x</span>
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-10 md:gap-[40px]">
              <div className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Product</h2>
                <div className="flex flex-col gap-3">
                  <Link href="/" className="group">
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      Start building
                    </h3>
                  </Link>
                  <a
                    href="https://github.com/kartiklabhshetwar/foliox"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      GitHub
                    </h3>
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Resources</h2>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://github.com/kartiklabhshetwar/foliox#readme"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      Docs
                    </h3>
                  </a>
                  <a
                    href="https://github.com/kartiklabhshetwar/foliox/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      Contributing
                    </h3>
                  </a>
                  <a
                    href="https://github.com/kartiklabhshetwar/foliox/blob/main/IMPLEMENTATION.md"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      Implementation
                    </h3>
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-base font-semibold text-foreground">Company</h2>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://github.com/kartiklabhshetwar"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      About
                    </h3>
                  </a>
                  <a
                    href="https://github.com/kartiklabhshetwar/foliox/blob/main/LICENSE"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      License
                    </h3>
                  </a>
                  <a
                    href="https://github.com/kartiklabhshetwar/foliox/issues"
                    target="_blank"
                    rel="noreferrer"
                    className="group"
                  >
                    <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                      Contact
                    </h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
