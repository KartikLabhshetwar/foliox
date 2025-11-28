import DiagonalPattern from "@/components/portfolio/diagonal-pattern"
import SectionBorder from "@/components/portfolio/section-border"

export function ClassicLoading() {
  return (
    <div className="min-h-screen bg-background relative">
      <DiagonalPattern side="left" />
      <DiagonalPattern side="right" />

      <main className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        {/* Introduction Section Skeleton */}
        <div className="relative w-full py-8 sm:py-12 md:py-16">
          <SectionBorder className="absolute bottom-0 left-0 right-0" />
          <div className="flex items-center justify-between mb-6">
            <div className="h-14 w-14 bg-muted animate-pulse rounded" />
            <div className="h-9 w-20 bg-muted animate-pulse rounded" />
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
        </div>

        {/* About Section Skeleton */}
        <div className="relative w-full py-8 sm:py-12 md:py-16">
          <SectionBorder className="absolute bottom-0 left-0 right-0" />
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div>
              <div className="h-8 sm:h-10 md:h-12 w-32 bg-muted animate-pulse rounded mb-4" />
              <div className="space-y-2 max-w-4xl">
                <div className="h-5 w-full bg-muted animate-pulse rounded" />
                <div className="h-5 w-full bg-muted animate-pulse rounded" />
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="border border-border rounded-lg p-6 sm:p-8 space-y-4">
                <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-muted animate-pulse mt-2" />
                      <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-border rounded-lg p-6 sm:p-8 space-y-4">
                <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-7 w-20 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Gallery Skeleton */}
        <div className="relative w-full py-8 sm:py-12 md:py-16">
          <SectionBorder className="absolute bottom-0 left-0 right-0" />
          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="h-7 sm:h-8 w-40 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contributions Section Skeleton */}
        <div className="relative w-full py-8 sm:py-12 md:py-16">
          <SectionBorder className="absolute bottom-0 left-0 right-0" />
          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="h-8 sm:h-10 md:h-12 w-48 bg-muted animate-pulse rounded mb-2" />
              <div className="h-5 w-56 bg-muted animate-pulse rounded" />
            </div>
            <div className="border border-border rounded-lg p-4 sm:p-6 md:p-8">
              <div className="h-32 sm:h-40 md:h-48 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="bg-muted/30 py-12 sm:py-16">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 w-5 bg-muted animate-pulse rounded" />
              ))}
            </div>
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </main>
    </div>
  )
}

