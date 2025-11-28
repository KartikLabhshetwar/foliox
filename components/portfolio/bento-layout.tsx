import { IntroductionSection } from "@/components/portfolio/introduction-section"
import { CapabilitiesSection } from "@/components/portfolio/capabilities-section"
import { WorkGallery } from "@/components/portfolio/work-gallery"
import { ProofOfWorkSection } from "@/components/portfolio/proof-of-work-section"
import { WorkExperienceSection } from "@/components/portfolio/work-experience-section"
import { PRsByOrgSection } from "@/components/portfolio/prs-by-org-section"
import { GetInTouchSection } from "@/components/portfolio/get-in-touch-section"
import { TopLanguagesSection } from "@/components/portfolio/top-languages-section"
import { Card } from "@/components/ui/card"
import type { NormalizedProfile } from "@/types/github"
import type { AboutData } from "@/types/portfolio"
import type { ProjectsData } from "@/types/github"
import type { PRByOrg } from "@/components/portfolio/prs-by-org-section"

interface BentoLayoutProps {
  profile: NormalizedProfile
  about: AboutData | null
  projects?: ProjectsData
  username: string
  prsByOrg: PRByOrg[]
}

export function BentoLayout({
  profile,
  about,
  projects,
  username,
  prsByOrg,
}: BentoLayoutProps) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
        
        {/* Profile / Intro - Large Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-6 flex flex-col justify-center bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
          <IntroductionSection profile={profile} />
        </Card>

        {/* Top Languages */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 row-span-2">
          <TopLanguagesSection languages={projects?.languages} />
        </div>

        {/* Work Experience - Wide Card */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 p-6 overflow-y-auto max-h-[600px] bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
          <WorkExperienceSection profile={profile} />
        </Card>

        {/* Capabilities / Skills - Wide Card */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
          <CapabilitiesSection about={about} />
        </Card>

        {/* Projects - Grid within Grid */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
           <WorkGallery projects={projects} />
        </div>

        {/* Proof of Work */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
          <ProofOfWorkSection username={username} />
        </Card>

        {/* PRs */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-2 p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
           <PRsByOrgSection prsByOrg={prsByOrg} username={username} />
        </Card>

        {/* Contact - Footer Card */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-primary/10">
          <GetInTouchSection profile={profile} />
        </Card>

      </div>
    </div>
  )
}
