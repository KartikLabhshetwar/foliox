import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaExternalLinkAlt, FaGithub, FaStar, FaCodeBranch } from "react-icons/fa"
import Image from "next/image"
import type { ProjectsData } from "@/types/github"
import SectionBorder from "./section-border"

interface WorkGalleryProps {
  projects?: ProjectsData
}

export function WorkGallery({ projects }: WorkGalleryProps) {
  if (!projects || projects.featured.length === 0) return null

  const totalBytes = projects.languages 
    ? Object.values(projects.languages).reduce((sum, bytes) => sum + bytes, 0)
    : 0

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-16">
      <SectionBorder className="absolute bottom-0 left-0 right-0" />
      <div className="space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">Featured Work</h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {projects.total_stars.toLocaleString()} stars across {projects.total_repos} repositories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.featured.slice(0, 6).map((project) => {
            const urlParts = project.url.split('/')
            const owner = urlParts[urlParts.length - 2]
            const repo = urlParts[urlParts.length - 1]
            const imageUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`

            return (
              <Card 
                key={project.name} 
                className="flex flex-col overflow-hidden border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 group h-full"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted border-b border-border relative">
                  <Image 
                    src={imageUrl} 
                    alt={project.name} 
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <CardContent className="flex-1 p-5 sm:p-6 flex flex-col gap-4">
                  <div className="space-y-2.5 min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {project.languages && Object.keys(project.languages).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(project.languages)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([lang]) => (
                          <Badge 
                            key={lang} 
                            variant="outline" 
                            className="text-xs font-medium px-2.5 py-1 border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                          >
                            {lang}
                          </Badge>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <FaStar className="h-3.5 w-3.5 text-yellow-500/70" />
                      <span className="font-medium">{project.stars.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaCodeBranch className="h-3.5 w-3.5 text-blue-500/70" />
                      <span className="font-medium">{project.forks.toLocaleString()}</span>
                    </div>
                  </div>

                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.topics.slice(0, 3).map((topic) => (
                        <Badge 
                          key={topic} 
                          variant="secondary" 
                          className="text-xs font-normal px-2.5 py-1 bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-2 flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 gap-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="h-4 w-4" />
                        Code
                      </a>
                    </Button>
                    {project.homepage && (
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="flex-1 gap-2 text-sm font-medium"
                      >
                        <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                          <FaExternalLinkAlt className="h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {projects.languages && Object.keys(projects.languages).length > 0 && (
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Top Languages</h3>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {Object.keys(projects.languages).length} languages
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {Object.entries(projects.languages)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 12)
                  .map(([lang, bytes]) => {
                    const percentage = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0
                    return (
                      <Badge 
                        key={lang} 
                        variant="secondary" 
                        className="text-sm font-medium px-3 py-1.5 bg-secondary/80 hover:bg-secondary hover:scale-105 transition-all duration-200 cursor-default"
                        title={`${percentage}% of code`}
                      >
                        {lang}
                      </Badge>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

