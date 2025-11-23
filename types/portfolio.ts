import type { NormalizedProfile, AboutData, SEOData, ProjectsData, FeaturedProject } from './github'

export interface PortfolioData {
  profile: NormalizedProfile;
  about?: AboutData | null;
  seo?: SEOData | null;
  projects?: ProjectsData;
}

export type Project = FeaturedProject

export interface LinkedInData {
  username: string;
  name: string | null;
  headline: string | null;
  location: string | null;
  profile_url: string;
  avatar_url: string | null;
  summary: string | null;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
  location?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  duration: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionData {
  totalContributions: number;
  weeks: {
    days: ContributionDay[];
  }[];
}

