import SectionBorder from "@/components/portfolio/section-border"
import { Card } from "@/components/ui/card"

export function BentoLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
        
        {/* Profile / Intro - Large Card Skeleton */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-6 flex flex-col justify-center bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-9 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1 space-y-4 w-full">
              <div className="h-10 sm:h-12 md:h-16 w-64 bg-muted animate-pulse rounded" />
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-6 w-full max-w-2xl bg-muted animate-pulse rounded" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-5 w-24 bg-muted animate-pulse rounded" />
                ))}
              </div>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-5 w-5 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
            <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 bg-muted animate-pulse rounded-full shrink-0" />
          </div>
        </Card>

        {/* Work Experience / Top Languages - Beside Hero Skeleton */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-2 row-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            <div>
              <div className="h-8 w-40 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-56 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-md border border-border">
                <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </Card>

        {/* Capabilities / Skills - Wide Card Skeleton */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            <div>
              <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
              <div className="space-y-2 max-w-4xl">
                <div className="h-5 w-full bg-muted animate-pulse rounded" />
                <div className="h-5 w-full bg-muted animate-pulse rounded" />
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 space-y-4">
                <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </div>
              <div className="border border-border rounded-lg p-6 space-y-4">
                <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-7 w-20 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Projects - Grid Skeleton */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <div className="relative w-full py-6 sm:py-8 md:py-12">
            <SectionBorder className="absolute bottom-0 left-0 right-0" />
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="h-7 sm:h-8 w-40 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="flex flex-col overflow-hidden border-border bg-card">
                    <div className="aspect-video w-full bg-muted animate-pulse" />
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="flex gap-2">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="h-5 w-16 bg-muted animate-pulse rounded" />
                        ))}
                      </div>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Languages Skeleton */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 row-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </Card>

        {/* Proof of Work Skeleton */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            <div>
              <div className="h-8 w-40 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-56 bg-muted animate-pulse rounded" />
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="h-32 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </Card>

        {/* PRs Skeleton */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-6">
            <div>
              <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-md border border-border">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Contact - Footer Card Skeleton */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 w-5 bg-muted animate-pulse rounded" />
              ))}
            </div>
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </Card>

      </div>
    </div>
  )
}

