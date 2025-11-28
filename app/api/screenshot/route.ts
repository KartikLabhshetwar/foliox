import { NextRequest, NextResponse } from 'next/server';
import { Settings } from '@/lib/config/settings';
import { getCache, setCache, getCacheKey } from '@/lib/utils/cache';

interface ScreenshotParams {
  url: string;
  width?: number;
  height?: number;
  fullPage?: boolean;
  format?: 'png' | 'jpeg' | 'pdf';
  quality?: number;
}

async function fetchScreenshot(params: ScreenshotParams): Promise<Buffer> {
  const screenshotApiUrl = Settings.SCREENSHOT_API_URL;
  const { url, width = 1280, height = 800, fullPage = false, format = 'png', quality = 80 } = params;

  let apiUrl: string;

  if (screenshotApiUrl) {
    // Use configured custom screenshot service
    const searchParams = new URLSearchParams({
      url,
      width: width.toString(),
      height: height.toString(),
      fullPage: fullPage.toString(),
      format,
    });

    if (format === 'jpeg') {
      searchParams.set('quality', quality.toString());
    }

    apiUrl = `${screenshotApiUrl}/take?${searchParams.toString()}`;
  } else {
    // Fallback to image.thum.io for testing (public free tier)
    // Format: https://image.thum.io/get/width/{width}/crop/{height}/noanimate/{url}
    // Note: thum.io ignores some params like format/quality/fullPage in the free tier URL structure used here
    apiUrl = `https://image.thum.io/get/width/${width}/crop/${height}/noanimate/${url}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': format === 'pdf' ? 'application/pdf' : `image/${format}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      let errorMessage = `Screenshot API failed: ${response.status}`;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorMessage = errorJson.error;
        } else if (errorJson.details) {
          errorMessage = `${errorJson.error || 'Screenshot failed'}: ${errorJson.details}`;
        }
      } catch {
        if (errorText && errorText.length < 200) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error('TIMEOUT');
      }
      throw error;
    }

    throw new Error('Unknown error occurred while fetching screenshot');
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const width = searchParams.get('width')
      ? parseInt(searchParams.get('width')!, 10)
      : 1280;
    const height = searchParams.get('height')
      ? parseInt(searchParams.get('height')!, 10)
      : 800;
    const fullPage = searchParams.get('fullPage') === 'true';
    const format = (searchParams.get('format') || 'png') as 'png' | 'jpeg' | 'pdf';
    const quality = searchParams.get('quality')
      ? parseInt(searchParams.get('quality')!, 10)
      : 80;

    if (width < 1 || width > 3840 || height < 1 || height > 2160) {
      return NextResponse.json(
        { error: 'Width and height must be between 1 and 3840/2160 respectively' },
        { status: 400 }
      );
    }

    if (quality < 1 || quality > 100) {
      return NextResponse.json(
        { error: 'Quality must be between 1 and 100' },
        { status: 400 }
      );
    }

    const failureCacheKey = getCacheKey('screenshot_failure', url);
    const failureData = await getCache<{ count: number; lastFailure: string }>(failureCacheKey);

    if (failureData && failureData.count >= 3) {
      return NextResponse.json(
        {
          error: 'Screenshot permanently failed',
          details: `This URL has failed ${failureData.count} times. Using fallback image.`,
          fallback: 'Please use the GitHub OpenGraph image as fallback'
        },
        { status: 410 }
      );
    }

    const cacheKey = getCacheKey('screenshot', url, width.toString(), height.toString(), fullPage.toString(), format, quality.toString());

    const cachedScreenshot = await getCache<{ data: string; contentType: string }>(cacheKey);

    if (cachedScreenshot) {
      const buffer = Buffer.from(cachedScreenshot.data, 'base64');
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': cachedScreenshot.contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-Cache': 'HIT',
        },
      });
    }

    const screenshotBuffer = await fetchScreenshot({ url, width, height, fullPage, format, quality });

    const contentType = format === 'pdf'
      ? 'application/pdf'
      : `image/${format}`;

    const base64Data = screenshotBuffer.toString('base64');
    await setCache(
      cacheKey,
      { data: base64Data, contentType },
      {
        ttl: 86400,
        tags: ['screenshot', `url:${url}`],
      }
    );

    return new NextResponse(new Uint8Array(screenshotBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const targetUrl = request.nextUrl.searchParams.get('url');

    if (errorMessage.includes('not configured')) {
      return NextResponse.json(
        { error: 'Screenshot service is not available' },
        { status: 503 }
      );
    }

    const isTimeout = errorMessage === 'TIMEOUT' || errorMessage.includes('timeout');
    const statusCode = isTimeout ? 408 : 500;

    if (targetUrl) {
      const failureCacheKey = getCacheKey('screenshot_failure', targetUrl);
      const failureData = await getCache<{ count: number; lastFailure: string }>(failureCacheKey);
      const newCount = (failureData?.count || 0) + 1;

      await setCache(
        failureCacheKey,
        { count: newCount, lastFailure: new Date().toISOString() },
        {
          ttl: 30 * 24 * 60 * 60,
          tags: ['screenshot_failure', `url:${targetUrl}`],
        }
      );
    }

    console.error('Screenshot API error:', {
      url: targetUrl,
      error: errorMessage,
      isTimeout,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: isTimeout ? 'Screenshot request timed out' : 'Screenshot failed',
        details: isTimeout ? 'The screenshot service took too long to respond' : errorMessage,
        fallback: 'Please use the GitHub OpenGraph image as fallback'
      },
      { status: statusCode }
    );
  }
}

