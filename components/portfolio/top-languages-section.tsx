'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TopLanguagesSectionProps {
  languages?: { [key: string]: number }
  variant?: 'classic' | 'bento'
}

export function TopLanguagesSection({ languages, variant = 'bento' }: TopLanguagesSectionProps) {
  if (!languages || Object.keys(languages).length === 0) return null

  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
  const isAnimated = variant === 'bento'

  const cardClassName = isAnimated
    ? "h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10"
    : "h-full flex flex-col border-border"

  const badgeClassName = isAnimated
    ? "text-sm font-medium px-3 py-1.5 bg-secondary/80 hover:bg-secondary hover:scale-105 transition-all duration-200 cursor-default"
    : "text-sm font-medium px-3 py-1.5 bg-secondary/80 hover:bg-secondary transition-colors cursor-default"

  return (
    <Card className={cardClassName}>
      <CardContent className="p-6 flex flex-col justify-center h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Top Languages</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {Object.keys(languages).length} languages
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {Object.entries(languages)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 12)
            .map(([lang, bytes]) => {
              const percentage = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0
              return (
                <Badge 
                  key={lang} 
                  variant="secondary" 
                  className={badgeClassName}
                  title={`${percentage}% of code`}
                >
                  {lang}
                </Badge>
              )
            })}
        </div>
      </CardContent>
    </Card>
  )
}

