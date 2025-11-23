import { graphql } from '@octokit/graphql';
import { Settings } from '@/lib/config/settings';
import { ContributionData, ContributionDay } from '@/types/portfolio';

const graphqlWithAuth = Settings.GITHUB_TOKEN
  ? graphql.defaults({
      headers: {
        authorization: `Bearer ${Settings.GITHUB_TOKEN}`,
      },
    })
  : graphql;

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export class GitHubContributionsFetcher {
  static async fetchContributions(username: string): Promise<ContributionData> {
    if (!Settings.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required. Please set it in your environment variables.');
    }

    try {
      const to = new Date();
      const from = new Date();
      from.setFullYear(from.getFullYear() - 1);

      const result = await graphqlWithAuth<{
        user: {
          contributionsCollection: {
            totalCommitContributions: number;
            totalIssueContributions: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
            totalRepositoryContributions: number;
            contributionCalendar: {
              totalContributions: number;
              weeks: Array<{
                contributionDays: Array<{
                  date: string;
                  contributionCount: number;
                  color: string;
                }>;
              }>;
            };
          };
        } | null;
      }>(CONTRIBUTIONS_QUERY, {
        username,
        from: from.toISOString(),
        to: to.toISOString(),
      });

      if (!result.user) {
        throw new Error(`User ${username} not found`);
      }

      const calendar = result.user.contributionsCollection.contributionCalendar;
      const totalContributions = calendar.totalContributions;

      const weeks: { days: ContributionDay[] }[] = calendar.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: this.getContributionLevel(day.contributionCount),
        })),
      }));

      return {
        totalContributions,
        weeks,
      };
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
      throw new Error(`Failed to fetch contributions: ${errorMessage}`);
    }
  }


  private static getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  }
}

