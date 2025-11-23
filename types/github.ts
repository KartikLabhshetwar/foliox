export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubReadme {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

export interface GitHubGraphQLUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  email: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  company: string | null;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
    nodes: Array<{
      name: string;
      description: string | null;
      url: string;
      homepageUrl: string | null;
      stargazerCount: number;
      forkCount: number;
      isPinned?: boolean;
      primaryLanguage: {
        name: string;
        color: string;
      } | null;
      languages: {
        edges: Array<{
          size: number;
          node: {
            name: string;
            color: string;
          };
        }>;
      };
      repositoryTopics: {
        nodes: Array<{
          topic: {
            name: string;
          };
        }>;
      };
      isPrivate: boolean;
      isFork: boolean;
      updatedAt: string;
      createdAt: string;
    }>;
  };
  pinnedItems: {
    nodes: Array<{
      name: string;
      description: string | null;
      url: string;
      homepageUrl: string | null;
      stargazerCount: number;
      forkCount: number;
      primaryLanguage: {
        name: string;
        color: string;
      } | null;
      languages: {
        edges: Array<{
          size: number;
          node: {
            name: string;
            color: string;
          };
        }>;
      };
      repositoryTopics: {
        nodes: Array<{
          topic: {
            name: string;
          };
        }>;
      };
      isPrivate: boolean;
      isFork: boolean;
      updatedAt: string;
      createdAt: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GitHubMetrics {
  prs_merged: number;
  prs_open: number;
  total_contributions: number;
  issues_opened: number;
  issues_closed: number;
}

export interface NormalizedProfile {
  username: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  email: string | null;
  website: string | null;
  twitter_username: string | null;
  linkedin_url?: string | null;
  company: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  updated_at?: string;
  cached?: boolean;
  about?: AboutData | null;
  seo?: SEOData | null;
  metrics?: GitHubMetrics | null;
}

export interface AboutData {
  summary: string;
  highlights: string[];
  skills: string[];
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
}

export interface FeaturedProject {
  name: string;
  description: string | null;
  url: string;
  homepage?: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  languages?: { [key: string]: number };
  ai_summary?: string;
}

export interface ProjectsData {
  featured: FeaturedProject[];
  languages: { [key: string]: number };
  total_stars: number;
  total_repos: number;
}

