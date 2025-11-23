import { GitHubProfileFetcher } from './fetcher';
import { FeaturedProject, ProjectsData } from '@/types/github';
import { graphql } from '@octokit/graphql';
import { Settings } from '@/lib/config/settings';

const graphqlWithAuth = Settings.GITHUB_TOKEN
  ? graphql.defaults({
      headers: {
        authorization: `Bearer ${Settings.GITHUB_TOKEN}`,
      },
    })
  : graphql;

const PINNED_REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
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
    }
  }
`;

export class GitHubProjectRanker {
  static async getFeatured(username: string): Promise<ProjectsData> {
    if (!Settings.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required. Please set it in your environment variables.');
    }

    try {
      const repositories = await GitHubProfileFetcher.fetchUserRepositories(username);
      const nonForkRepos = repositories.filter(repo => !repo.isFork && !repo.isPrivate);

      let featuredRepos: typeof repositories = [];

      try {
        const pinnedResult = await graphqlWithAuth<{
          user: {
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
          };
        }>(PINNED_REPOS_QUERY, { username });

        const pinnedRepos = pinnedResult.user?.pinnedItems?.nodes || [];
        
        if (pinnedRepos.length > 0) {
          featuredRepos = pinnedRepos.map(pinned => ({
            name: pinned.name,
            description: pinned.description,
            url: pinned.url,
            homepageUrl: pinned.homepageUrl,
            stargazerCount: pinned.stargazerCount,
            forkCount: pinned.forkCount,
            isPinned: true,
            primaryLanguage: pinned.primaryLanguage,
            languages: pinned.languages,
            repositoryTopics: pinned.repositoryTopics,
            isPrivate: pinned.isPrivate,
            isFork: pinned.isFork,
            updatedAt: pinned.updatedAt,
            createdAt: pinned.createdAt,
          }));
        }
      } catch {
        // If pinned repos fail, fall through to star-based ranking
      }

      if (featuredRepos.length === 0) {
        const rankedRepos = nonForkRepos
          .map(repo => ({
            repo,
            score: this.calculateScore(repo),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        featuredRepos = rankedRepos.map(({ repo }) => repo);
      }

      const featured: FeaturedProject[] = featuredRepos.map((repo) => {
        const languages: { [key: string]: number } = {};
        repo.languages.edges.forEach(edge => {
          languages[edge.node.name] = edge.size;
        });

        return {
          name: repo.name,
          description: repo.description,
          url: repo.url,
          homepage: repo.homepageUrl || null,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          language: repo.primaryLanguage?.name || null,
          topics: repo.repositoryTopics.nodes.map(node => node.topic.name),
          updated_at: repo.updatedAt,
          created_at: repo.createdAt,
          languages,
        };
      });

      const allLanguages: { [key: string]: number } = {};
      let totalStars = 0;

      nonForkRepos.forEach(repo => {
        totalStars += repo.stargazerCount;
        repo.languages.edges.forEach(edge => {
          allLanguages[edge.node.name] = (allLanguages[edge.node.name] || 0) + edge.size;
        });
      });

      return {
        featured,
        languages: allLanguages,
        total_stars: totalStars,
        total_repos: nonForkRepos.length,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch projects: ${errorMessage}`);
    }
  }

  private static calculateScore(repo: {
    stargazerCount: number;
    forkCount: number;
    updatedAt: string;
  }): number {
    const starWeight = 10;
    const forkWeight = 5;
    const recentWeight = 2;

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyScore = Math.max(0, 365 - daysSinceUpdate) / 365;

    return (
      repo.stargazerCount * starWeight +
      repo.forkCount * forkWeight +
      recencyScore * recentWeight * 100
    );
  }
}

