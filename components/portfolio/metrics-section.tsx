import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitMerge, GitPullRequest, GitCommit, CircleDot, FolderGit2, Users } from "lucide-react"
import type { GitHubMetrics } from "@/types/github"

interface MetricsSectionProps {
  metrics?: GitHubMetrics | null
  publicRepos: number
  followers: number
}

export function MetricsSection({ metrics, publicRepos, followers }: MetricsSectionProps) {
  if (!metrics) return null

  const statCards = [
    {
      label: "PRs Merged",
      value: metrics.prs_merged.toLocaleString(),
      icon: GitMerge,
      color: "text-green-600",
    },
    {
      label: "Open PRs",
      value: metrics.prs_open.toLocaleString(),
      icon: GitPullRequest,
      color: "text-blue-600",
    },
    {
      label: "Total Contributions",
      value: metrics.total_contributions.toLocaleString(),
      icon: GitCommit,
      color: "text-purple-600",
    },
    {
      label: "Issues Opened",
      value: metrics.issues_opened.toLocaleString(),
      icon: CircleDot,
      color: "text-orange-600",
    },
    {
      label: "Repositories",
      value: publicRepos.toLocaleString(),
      icon: FolderGit2,
      color: "text-indigo-600",
    },
    {
      label: "Followers",
      value: followers.toLocaleString(),
      icon: Users,
      color: "text-pink-600",
    },
  ]

  return (
    <section className="w-full py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

