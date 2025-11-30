import { Settings } from "../config/settings";
import { type NextRequest, NextResponse } from 'next/server';

const URLMATCH_REGEX = /http:\/\/([^.]+)\.localhost/

export const protocol = Settings.NODE_ENV === "production" ? "https" : "http"
export const rootDomain = Settings.NEXT_PUBLIC_SITE_URL || "localhost:3000"

export function extractSubdomainFromRequest(request: NextRequest): string | null {
    const url = request.url;
    const host = request.headers.get('host') || '';
    const hostname = host.split(':')[0];

    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        const fullUrlMatch = url.match(URLMATCH_REGEX);
        if (fullUrlMatch && fullUrlMatch[1]) {
            return fullUrlMatch[1];
        }

        if (hostname.includes('.localhost')) {
            return hostname.split('.')[0];
        }

        return null;
    }

    const rootDomainFormatted = rootDomain.split(':')[0];

    if (hostname.includes('---') && hostname.endsWith('.foliox.site')) {
        const parts = hostname.split('---');
        return parts.length > 0 ? parts[0] : null;
    }

    const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

    return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export function extractSubdomainFromHostname(host: string): string  {
    if (!host) return null

    if (host.includes(".localhost")) {
        const parts = host.split(".")
        return parts[0] || null
    }

    const parts = host.split(".")
    if (parts.length > 2) {
        return parts[0]
    }

    return null
}