import { graphql } from '@octokit/graphql';
import { Settings } from '@/lib/config/settings';
import { NormalizedProfile, GitHubGraphQLUser, GitHubMetrics } from '@/types/github';
import { parseSocialLinksFromReadme } from '@/lib/utils/readme-parser';

const graphqlWithAuth = Settings.GITHUB_TOKEN
  ? graphql.defaults({
      headers: {
        authorization: `Bearer ${Settings.GITHUB_TOKEN}`,
      },
    })
  : graphql;

const USER_QUERY = `
  query($username: String!) {
    user(login: $username) {
      login
      name
      bio
      avatarUrl
      location
      email
      websiteUrl
      twitterUsername
      company
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
        totalCount
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          isPrivate
          isFork
          updatedAt
          createdAt
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            isPrivate
            isFork
            updatedAt
            createdAt
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const PR_STATS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      mergedPRs: pullRequests(states: MERGED) {
        totalCount
      }
      openPRs: pullRequests(states: OPEN) {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }
    }
  }
`;

export class GitHubProfileFetcher {
  static async fetchPRStatistics(username: string): Promise<GitHubMetrics> {
    if (!Settings.GITHUB_TOKEN) {
      return {
        prs_merged: 0,
        prs_open: 0,
        total_contributions: 0,
        issues_opened: 0,
        issues_closed: 0,
      };
    }

    try {
      const result = await graphqlWithAuth<{
        user: {
          mergedPRs: {
            totalCount: number;
          };
          openPRs: {
            totalCount: number;
          };
          contributionsCollection: {
            totalCommitContributions: number;
            totalIssueContributions: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
          };
        } | null;
      }>(PR_STATS_QUERY, { username });

      if (!result.user) {
        return {
          prs_merged: 0,
          prs_open: 0,
          total_contributions: 0,
          issues_opened: 0,
          issues_closed: 0,
        };
      }

      const merged = result.user.mergedPRs.totalCount;
      const open = result.user.openPRs.totalCount;
      const contributions = result.user.contributionsCollection;

      return {
        prs_merged: merged,
        prs_open: open,
        total_contributions:
          contributions.totalCommitContributions +
          contributions.totalIssueContributions +
          contributions.totalPullRequestContributions +
          contributions.totalPullRequestReviewContributions,
        issues_opened: contributions.totalIssueContributions,
        issues_closed: 0,
      };
    } catch (error) {
      console.error('Failed to fetch PR statistics:', error);
      return {
        prs_merged: 0,
        prs_open: 0,
        total_contributions: 0,
        issues_opened: 0,
        issues_closed: 0,
      };
    }
  }

  static async fetchReadmeContent(username: string): Promise<string | null> {
    if (!Settings.GITHUB_TOKEN) {
      return null;
    }

    try {
      const readmeQuery = `
        query($username: String!) {
          user(login: $username) {
            repository(name: $username) {
              object(expression: "HEAD:README.md") {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      `;

      const result = await graphqlWithAuth<{
        user: {
          repository: {
            object: { text: string } | null;
          } | null;
        };
      }>(readmeQuery, { username });

      return result.user?.repository?.object?.text || null;
    } catch {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
          { next: { revalidate: 3600 } }
        );
        if (response.ok) {
          return await response.text();
        }
      } catch {
        // Try alternative branch
        try {
          const response = await fetch(
            `https://raw.githubusercontent.com/${username}/${username}/master/README.md`,
            { next: { revalidate: 3600 } }
          );
          if (response.ok) {
            return await response.text();
          }
        } catch {
          // Silently fail
        }
      }
      return null;
    }
  }

  static async fetchUserProfile(username: string): Promise<NormalizedProfile> {
    if (!Settings.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required. Please set it in your environment variables.');
    }

    try {
      const result = await graphqlWithAuth<{ user: GitHubGraphQLUser }>(USER_QUERY, {
        username,
      });

      if (!result.user) {
        throw new Error(`User ${username} not found`);
      }

      const user = result.user;

      let linkedinUrl: string | undefined;
      let twitterUrl: string | undefined;

      try {
        const readmeContent = await this.fetchReadmeContent(username);
        if (readmeContent) {
          const socialLinks = parseSocialLinksFromReadme(readmeContent);
          linkedinUrl = socialLinks.linkedin;
          twitterUrl = socialLinks.twitter || socialLinks.x;
        }
      } catch {
        // Silently fail if README parsing fails
      }

      const normalizeWebsiteUrl = (url: string | null | undefined): string | null => {
        if (!url) return null;
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return null;
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
          return trimmedUrl;
        }
        return `https://${trimmedUrl}`;
      };

      const metrics = await this.fetchPRStatistics(username);

      const normalizedProfile: NormalizedProfile = {
        username: user.login,
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatarUrl,
        location: user.location,
        email: user.email,
        website: normalizeWebsiteUrl(user.websiteUrl),
        twitter_username: user.twitterUsername || (twitterUrl ? new URL(twitterUrl).pathname.split('/').pop() || null : null),
        linkedin_url: linkedinUrl,
        company: user.company,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        public_repos: user.repositories.totalCount,
        created_at: user.createdAt || new Date().toISOString(),
        cached: false,
        metrics,
      };

      return normalizedProfile;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStatus = (error as { status?: number })?.status;

      if (errorMessage.includes('Could not resolve to a User') || errorMessage.includes('NOT_FOUND')) {
        throw new Error(`GitHub user ${username} not found`);
      }
      if (errorMessage.includes('Bad credentials') || errorStatus === 401) {
        throw new Error('Invalid GitHub token. Please check your GITHUB_TOKEN environment variable.');
      }
      if (errorStatus === 403) {
        throw new Error('GitHub API rate limit exceeded or token lacks required permissions.');
      }
      throw new Error(`Failed to fetch GitHub profile: ${errorMessage}`);
    }
  }

  static async fetchUserRepositories(username: string) {
    if (!Settings.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required. Please set it in your environment variables.');
    }

    try {
      const result = await graphqlWithAuth<{ user: GitHubGraphQLUser }>(USER_QUERY, {
        username,
      });

      if (!result.user) {
        throw new Error(`User ${username} not found`);
      }

      return result.user.repositories.nodes;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStatus = (error as { status?: number })?.status;

      if (errorMessage.includes('Could not resolve to a User') || errorMessage.includes('NOT_FOUND')) {
        throw new Error(`GitHub user ${username} not found`);
      }
      if (errorMessage.includes('Bad credentials') || errorStatus === 401) {
        throw new Error('Invalid GitHub token. Please check your GITHUB_TOKEN environment variable.');
      }
      if (errorStatus === 403) {
        throw new Error('GitHub API rate limit exceeded or token lacks required permissions.');
      }
      throw new Error(`Failed to fetch repositories: ${errorMessage}`);
    }
  }
}

