# Foliox Implementation Guide

This document describes the architecture, implementation details, and technical decisions for the Foliox portfolio generator.

## Architecture Overview

Foliox is built with:
- **Next.js 16** with App Router for server-side rendering and API routes
- **TypeScript** for type safety and better developer experience
- **Vercel AI SDK** with Groq provider for AI-powered content generation
- **GitHub GraphQL API** for efficient data fetching
- **PostgreSQL** with Prisma ORM for database operations
- **Database-backed caching** for performance optimization
- **Next.js middleware** for API key authentication and CORS

## Project Structure

```
foliox/
├── app/
│   ├── (portfolio)/
│   │   └── [username]/
│   │       └── page.tsx          # Dynamic portfolio pages with custom URL support
│   ├── api/
│   │   ├── custom-url/
│   │   │   ├── check/route.ts    # POST /api/custom-url/check
│   │   │   └── register/route.ts  # POST /api/custom-url/register
│   │   ├── user/
│   │   │   └── [username]/
│   │   │       ├── profile/route.ts      # GET /api/user/:username/profile
│   │   │       ├── projects/route.ts      # GET /api/user/:username/projects
│   │   │       ├── about/route.ts        # GET /api/user/:username/about
│   │   │       └── contributions/route.ts # GET /api/user/:username/contributions
│   │   └── linkedin/
│   │       └── [username]/route.ts       # GET /api/linkedin/:username
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
├── components/
│   ├── portfolio/                 # Portfolio-specific components
│   │   ├── hero-section.tsx
│   │   ├── share-button.tsx      # Share dialog with custom URL creation
│   │   ├── projects-section.tsx
│   │   └── ...
│   └── ui/                        # Reusable UI components (Shadcn)
├── lib/
│   ├── config/
│   │   └── settings.ts            # Environment configuration with Zod validation
│   ├── modules/
│   │   ├── github/
│   │   │   ├── fetcher.ts        # GitHubProfileFetcher (GraphQL)
│   │   │   ├── projects.ts       # GitHubProjectRanker
│   │   │   └── contributions.ts # Contribution graph data
│   │   ├── ai/
│   │   │   └── generator.ts     # AIDescriptionGenerator (Vercel AI SDK + Groq)
│   │   └── linkedin/
│   │       └── fetcher.ts       # LinkedInProfileFetcher
│   └── utils/
│       ├── user.ts               # Username validation
│       ├── cache.ts              # Database-backed caching with Prisma
│       ├── custom-url.ts         # Custom URL validation and management
│       ├── api-client.ts         # API client wrapper
│       └── db.ts                 # Prisma client instance
├── prisma/
│   └── schema.prisma             # Database schema (Cache, CustomUrl)
├── types/
│   ├── github.ts                 # GitHub API types
│   ├── api.ts                    # API response types
│   └── portfolio.ts             # Portfolio data types
└── middleware.ts                  # API key auth + CORS
```

## API Endpoints

### Portfolio Data Endpoints

#### 1. GET `/api/user/[username]/profile`
Fetches GitHub user profile with AI-generated bio and SEO metadata.

**Response:**
```json
{
  "username": "kartiklabhshetwar",
  "name": "Kartik Labhshetwar",
  "bio": "software engineer",
  "avatar_url": "https://...",
  "location": "India",
  "email": null,
  "website": "https://...",
  "twitter_username": "kartik",
  "company": "@company",
  "followers": 100,
  "following": 50,
  "public_repos": 42,
  "created_at": "2020-01-01T00:00:00Z",
  "cached": true,
  "about": {
    "summary": "...",
    "highlights": ["...", "..."],
    "skills": ["...", "..."]
  },
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": ["...", "..."]
  }
}
```

#### 2. GET `/api/user/[username]/projects`
Fetches featured GitHub projects with language statistics.

**Response:**
```json
{
  "featured": [
    {
      "name": "project-name",
      "description": "Project description",
      "url": "https://github.com/...",
      "stars": 42,
      "forks": 10,
      "language": "TypeScript",
      "topics": ["nextjs", "react"],
      "updated_at": "2024-01-01T00:00:00Z",
      "created_at": "2023-01-01T00:00:00Z",
      "languages": {
        "TypeScript": 50000,
        "JavaScript": 20000
      }
    }
  ],
  "languages": {
    "TypeScript": 150000,
    "JavaScript": 80000
  },
  "total_stars": 200,
  "total_repos": 42
}
```

#### 3. GET `/api/user/[username]/about`
Fetches cached about data for a user.

**Response:**
```json
{
  "about": {
    "summary": "...",
    "highlights": ["...", "..."],
    "skills": ["...", "..."]
  }
}
```

#### 4. GET `/api/user/[username]/contributions`
Fetches GitHub contribution graph data.

**Response:**
```json
{
  "contributions": [
    {
      "date": "2024-01-01",
      "count": 5
    }
  ]
}
```

### Custom URL Endpoints

#### 5. POST `/api/custom-url/check`
Checks if a custom URL slug is available.

**Request:**
```json
{
  "slug": "john-doe"
}
```

**Response:**
```json
{
  "available": true
}
```

or

```json
{
  "available": false,
  "error": "This custom URL is already taken. Please choose another one."
}
```

#### 6. POST `/api/custom-url/register`
Registers a custom URL for a GitHub username.

**Request:**
```json
{
  "customSlug": "john-doe",
  "githubUsername": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "customSlug": "john-doe"
}
```

### LinkedIn Endpoint

#### 7. GET `/api/linkedin/[username]`
Fetches LinkedIn profile data.

**Response:**
```json
{
  "username": "kartiklabhshetwar",
  "name": "Kartik Labhshetwar",
  "headline": "Full-stack Developer",
  "location": "India",
  "profile_url": "https://linkedin.com/in/kartik017",
  "avatar_url": "https://...",
  "summary": "...",
  "experience": [],
  "education": [],
  "skills": []
}
```

All API endpoints require an `X-API-Key` header (except when `DEBUG=true`). The API key must match one of the keys in the `API_KEYS` environment variable.

## Key Features

### 1. Environment Configuration (`lib/config/settings.ts`)
- Uses Zod for runtime validation of environment variables
- Type-safe environment variable access
- Validates required keys on application startup
- Provides sensible defaults for optional variables

### 2. GitHub Integration (`lib/modules/github/`)
- **GraphQL API** for efficient data fetching in a single query
- Fetches user profile, repositories, languages, and contribution data
- Automatic token authentication if `GITHUB_TOKEN` is provided
- Comprehensive error handling for missing users and API errors
- Project ranking algorithm to identify featured repositories

### 3. AI Generation (`lib/modules/ai/generator.ts`)
- Uses **Vercel AI SDK** with **Groq provider**
- Model: `llama-3.1-8b-instant`
- Generates profile summaries, highlights, and skills
- Generates SEO metadata (title, description, keywords)
- Fallback to extractive summaries on AI errors
- JSON response parsing with robust error handling
- Parallel generation of about and SEO data for performance

### 4. Caching Strategy (`lib/utils/cache.ts`)
- **Database-backed caching** using PostgreSQL and Prisma
- Cache entries stored with expiration times
- Automatic cleanup of expired entries (1% chance on each write)
- Tag-based cache organization for easy invalidation
- Cache keys use prefix-based naming: `prefix:part1:part2`
- Default TTL: 3600 seconds (1 hour)
- Configurable via `CACHE_ENABLED` and `DEFAULT_CACHE_TTL` environment variables

### 5. Custom URL System (`lib/utils/custom-url.ts`)
- Validates custom URL slugs with strict rules
- Checks availability in real-time
- Maps custom slugs to GitHub usernames in database
- Reserved word blocking (api, admin, www, etc.)
- Format validation: 3-40 characters, alphanumeric + hyphens only
- Portfolio routing resolves custom URLs to GitHub usernames

### 6. Middleware (`middleware.ts`)
- **API Key Authentication**: Validates `X-API-Key` header
- **CORS**: Whitelisted origins with fallback for development
- **Excluded paths**: Static assets, Next.js internals, favicon
- **Debug mode**: Bypasses auth when `DEBUG=true` for development

### 7. Project Ranking Algorithm (`lib/modules/github/projects.ts`)
- Scores repositories based on:
  - Stars (weight: 10)
  - Forks (weight: 5)
  - Recency (weight: 2)
- Filters out forks and private repositories
- Returns top 12 featured projects
- Aggregates language statistics across all repositories

## Database Schema

The application uses PostgreSQL with Prisma ORM. The schema includes:

### Cache Model
Stores cached API responses with expiration times:
- `id`: Unique identifier
- `key`: Unique cache key
- `value`: Cached data (JSON string)
- `tags`: Array of tags for cache organization
- `expiresAt`: Expiration timestamp
- Indexes on `key`, `expiresAt`, and `tags`

### CustomUrl Model
Maps custom URL slugs to GitHub usernames:
- `id`: Unique identifier
- `customSlug`: Unique custom URL slug
- `githubUsername`: Associated GitHub username
- Indexes on `customSlug` and `githubUsername`

## Environment Variables

Required:
- `GROQ_API_KEY`: Groq API key for AI generation
- `API_KEYS`: Comma-separated list of API keys for authentication
- `DATABASE_URL`: PostgreSQL connection string

Optional:
- `GITHUB_TOKEN`: GitHub personal access token (increases rate limits)
- `CACHE_ENABLED`: Enable/disable caching (default: true)
- `DEFAULT_CACHE_TTL`: Cache time-to-live in seconds (default: 3600)
- `DEBUG`: Bypass API key authentication (default: false)
- `NODE_ENV`: Environment mode (development/production/test)

## Performance Optimizations

1. **GraphQL over REST**: Single query fetches all required GitHub data
2. **Database-backed caching**: Persistent cache across deployments
3. **Parallel AI generation**: About and SEO data generated concurrently
4. **Automatic cache cleanup**: Expired entries removed automatically
5. **Indexed database queries**: Fast lookups for cache and custom URLs
6. **Next.js App Router**: Server components for optimal performance

## Security Features

1. **API Key Authentication**: Required for all endpoints (except in DEBUG mode)
2. **CORS Whitelist**: Only allowed origins can access the API
3. **Input Validation**: Username and custom URL format validation
4. **Error Sanitization**: No sensitive data in error messages
5. **SQL Injection Protection**: Prisma ORM handles parameterized queries
6. **Reserved Word Protection**: Prevents custom URLs from conflicting with system routes

## Custom URL Resolution

When a user visits a portfolio URL, the system:

1. Checks if the path matches a custom URL slug in the database
2. If found, resolves to the associated GitHub username
3. If not found, treats the path as a GitHub username directly
4. Fetches and displays the portfolio for the resolved username

This allows both custom URLs (`/john-doe`) and GitHub usernames (`/johndoe`) to work seamlessly.

## Testing

Run linter:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set all environment variables in Vercel dashboard
4. Deploy

The application will automatically run database migrations on first deployment.

### Other Platforms

1. Set up a PostgreSQL database
2. Configure all environment variables
3. Run `npm run build` to build the application
4. Run `npx prisma migrate deploy` to apply migrations
5. Start the application with `npm start`

## Troubleshooting

### Environment Validation Failed
- Ensure all required environment variables are set in `.env.local`
- Check that `GROQ_API_KEY`, `API_KEYS`, and `DATABASE_URL` are not empty

### Invalid API Key
- Verify `X-API-Key` header matches one of the keys in `API_KEYS`
- Set `DEBUG=true` to bypass authentication during development

### GitHub User Not Found
- Check username spelling
- Ensure GitHub user exists and is public
- Verify `GITHUB_TOKEN` if rate limited

### Database Connection Issues
- Verify `DATABASE_URL` is correct and database is accessible
- Ensure migrations have been run with `npx prisma migrate dev`

### Custom URL Not Working
- Verify the custom URL was registered successfully
- Check database for the CustomUrl entry
- Ensure the portfolio route handler is resolving custom URLs correctly

## License

GNU General Public License v3.0 - see LICENSE file for details
