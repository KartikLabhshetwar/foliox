import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Users, GitFork } from "lucide-react"
import type { NormalizedProfile, AboutData } from "@/types/github"

interface HeroSectionProps {
  profile: NormalizedProfile
  about?: AboutData | null
}

export function HeroSection({ profile, about }: HeroSectionProps) {
  const initials = profile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || profile.username.slice(0, 2).toUpperCase()

  return (
    <section className="w-full py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-border">
          <AvatarImage src={profile.avatar_url} alt={profile.name || profile.username} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {profile.name || profile.username}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-1.5">
                <span className="font-medium">@{profile.company.replace("@", "")}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{profile.followers} followers · {profile.following} following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitFork className="h-4 w-4" />
              <span>{profile.public_repos} repositories</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.twitter_username && (
              <a
                href={`https://twitter.com/${profile.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </a>
            )}
          </div>

          {about?.skills && about.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {about.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

