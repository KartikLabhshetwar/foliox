"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Wand2, Rocket, GitBranch, Sparkles, Zap, Globe, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [starCount, setStarCount] = useState<number | null>(null)
  const [isStarAnimating, setIsStarAnimating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch("/api/github/stars")
        const data = await response.json()
        const stars = typeof data.stars === "number" ? data.stars : 0
        setStarCount(stars)
      } catch {
        setStarCount(null)
      }
    }
    fetchStars()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    router.push(`/${username.trim()}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Foliox"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <span className="font-bold text-xl text-foreground">Foliox</span>
          </Link>
          <Link 
            href="https://github.com/kartiklabhshetwar/foliox" 
            target="_blank" 
            rel="noreferrer"
            onMouseEnter={() => setIsStarAnimating(true)}
            onMouseLeave={() => setIsStarAnimating(false)}
          >
            <Button variant="ghost" size="sm" className="gap-2 group">
              <div className="flex items-center gap-1.5">
                <Star 
                  className={`h-4 w-4 transition-all duration-300 ${
                    isStarAnimating 
                      ? "fill-primary text-primary scale-110 rotate-12" 
                      : "fill-none"
                  }`}
                />
                {typeof starCount === "number" && starCount >= 0 && (
                  <span className="text-sm font-medium tabular-nums">
                    {starCount.toLocaleString()}
                  </span>
                )}
                <span className="hidden sm:inline">Star on GitHub</span>
              </div>
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-32 px-4 text-center relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl -z-10 opacity-50 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
              <span> AI-Powered • Free Forever</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              From GitHub to Portfolio
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                in Seconds
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your GitHub profile into a stunning portfolio with AI-powered insights. 
              No coding required—just enter your username and watch the magic happen.
            </p>

            {/* Form */}
            <div className="max-w-md mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <form onSubmit={handleSubmit} className="relative flex gap-2 p-2 bg-card border border-border rounded-lg shadow-lg">
                <div className="relative flex-1">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="github-username"
                    className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={!username || isLoading}>
                  {isLoading ? "Generating..." : "Generate"}
                  {!isLoading && <Wand2 className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              <span className="mr-2">Try example:</span>
              <button onClick={() => setUsername("KartikLabhshetwar")} className="underline hover:text-primary transition-colors">
                KartikLabhshetwar
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Foliox?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to showcase your developer journey in one beautiful portfolio
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <CardTitle>AI-Powered Summaries</CardTitle>
                  <CardDescription>
                    Groq AI analyzes your repositories and contributions to generate professional project descriptions, 
                    technical highlights, and compelling case studies automatically.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle>Zero Setup Required</CardTitle>
                  <CardDescription>
                    No sign-ups, no configurations. Enter your GitHub username and get an instant, 
                    shareable portfolio URL. Your portfolio is live in seconds.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <GitBranch className="h-6 w-6" />
                  </div>
                  <CardTitle>Live GitHub Sync</CardTitle>
                  <CardDescription>
                    Your portfolio automatically updates as you push new code, create repositories, 
                    and contribute to open source. Always reflects your latest work.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <CardTitle>Custom Share URLs</CardTitle>
                  <CardDescription>
                    Create memorable custom URLs for your portfolio instead of using your GitHub username. 
                    Perfect for sharing on resumes, LinkedIn, or business cards.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <CardTitle>SEO Optimized</CardTitle>
                  <CardDescription>
                    Every portfolio is built with SEO best practices. Dynamic metadata, semantic HTML, 
                    and optimized content help you rank better in search results.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Wand2 className="h-6 w-6" />
                  </div>
                  <CardTitle>Smart Caching</CardTitle>
                  <CardDescription>
                    Intelligent database caching ensures lightning-fast portfolio generation while minimizing 
                    API calls. Your portfolio loads instantly, every time.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Foliox"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="text-sm font-medium text-foreground">Foliox</span>
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              Built by{" "}
              <a 
                href="https://github.com/kartiklabhshetwar" 
                target="_blank" 
                rel="noreferrer" 
                className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Kartik
              </a>
              {" "}• Open source on{" "}
              <a 
                href="https://github.com/kartiklabhshetwar/foliox" 
                target="_blank" 
                rel="noreferrer" 
                className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
