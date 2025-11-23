"use client"

import React from "react"
import { GitHubCalendar } from "react-github-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContributionGraphProps {
  username: string
  data?: unknown
}

export function ContributionGraph({ username }: ContributionGraphProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const theme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  }

  if (!mounted) {
    return (
      <section className="w-full py-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">GitHub Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contribution Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[160px] rounded-xl bg-muted animate-pulse" />
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="w-full py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">GitHub Activity</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contribution Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <div className="relative overflow-hidden rounded-xl p-3 hover:shadow-sm transition-shadow duration-300">
              <GitHubCalendar
                username={username}
                fontSize={12}
                blockSize={12}
                blockMargin={4}
                showWeekdayLabels={true}
                colorScheme="light"
                theme={{
                  light: theme.light,
                  dark: theme.dark,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#ebedf0] dark:bg-[#161b22]" />
              <div className="w-3 h-3 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]" />
              <div className="w-3 h-3 rounded-sm bg-[#40c463] dark:bg-[#006d32]" />
              <div className="w-3 h-3 rounded-sm bg-[#30a14e] dark:bg-[#26a641]" />
              <div className="w-3 h-3 rounded-sm bg-[#216e39] dark:bg-[#39d353]" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

