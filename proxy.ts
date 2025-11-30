import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Settings } from '@/lib/config/settings';
import { extractSubdomainFromRequest } from './lib/utils/domain';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  process.env.NEXT_PUBLIC_SITE_URL,
];

const EXCLUDED_PATHS = ['/api/docs', '/api/openapi.json', '/api/screenshot', '/api/github/stars', '/api/auth', '/_next', '/favicon.ico'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    const apiKey = request.headers.get('x-api-key');

    if (!Settings.DEBUG && !apiKey) {
      return NextResponse.json(
        { detail: 'API Key header is missing' },
        { status: 401 }
      );
    }

    if (!Settings.DEBUG && apiKey && !Settings.API_KEYS.includes(apiKey)) {
      return NextResponse.json(
        { detail: 'Invalid API Key' },
        { status: 403 }
      );
    }

    const response = NextResponse.next();

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (Settings.DEBUG) {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-API-Key');
    response.headers.set('Access-Control-Max-Age', '600');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  // Subdomain routing logic ->
  const subdomain = extractSubdomainFromRequest(request)
  if (subdomain && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }


  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|[\\w-]+\\.\\w+).*)'],
};

