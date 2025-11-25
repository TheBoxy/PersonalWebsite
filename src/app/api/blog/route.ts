import { NextResponse } from 'next/server';

interface RSSItem {
  guid?: string;
  title?: string;
  pubDate?: string;
  isoDate?: string;
  categories?: string[];
  link?: string;
  content?: string;
  'content:encoded'?: string;
}

interface Rss2JsonItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: object;
  categories: string[];
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');
  // Get first paragraph or truncate to maxLength
  const excerpt = textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
  return excerpt.trim();
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function extractValidImage(content: string): string | null {
  // Find all img tags
  const imgMatches = content.match(/<img[^>]+src="([^">]+)"[^>]*>/g);
  
  if (!imgMatches) return null;
  
  // Filter out tracking pixels and analytics URLs
  for (const imgTag of imgMatches) {
    const srcMatch = imgTag.match(/src="([^">]+)"/);
    if (!srcMatch) continue;
    
    const src = srcMatch[1];
    
    // Skip tracking pixels and analytics URLs
    if (
      src.includes('/_/stat') ||
      src.includes('?event=') ||
      src.includes('analytics') ||
      src.includes('tracking') ||
      src.includes('pixel') ||
      src.includes('1x1') ||
      src.includes('transparent') ||
      src.endsWith('.gif') && src.includes('stat') ||
      src.includes('medium.com/_/stat') ||
      src.includes('referrerSource=full_rss')
    ) {
      continue;
    }
    
    // Look for actual image files
    if (
      src.includes('cdn-images-1.medium.com') ||
      src.includes('miro.medium.com') ||
      src.includes('medium.com/max/') ||
      src.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i) ||
      src.includes('unsplash.com') ||
      src.includes('pexels.com') ||
      src.includes('pixabay.com')
    ) {
      return src;
    }
  }
  
  return null;
}

function transformMediumPost(item: RSSItem, index: number) {
  const content = item['content:encoded'] || item.content || '';
  const imageUrl = extractValidImage(content);
  
  return {
    id: item.guid || `medium-${index}`,
    title: item.title || 'Untitled Post',
    slug: createSlug(item.title || `untitled-post-${index}`),
    date: new Date(item.pubDate || item.isoDate || Date.now()).toISOString(),
    excerpt: extractExcerpt(content),
    content: content,
    tags: item.categories || ['Blog'],
    readTime: estimateReadTime(content),
    imageUrl: imageUrl,
    mediumUrl: item.link || item.guid,
  };
}

export async function GET() {
  try {
    // Use rss2json as a proxy to avoid Medium's 403 Forbidden error
    const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://medium.com/feed/@kevinmartinez7616')}`;
    
    const feedResponse = await fetch(RSS2JSON_URL, {
      next: { revalidate: 120 }
    });

    if (!feedResponse.ok) {
      throw new Error(`RSS2JSON returned status: ${feedResponse.status}`);
    }

    const data = await feedResponse.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSS2JSON returned error status');
    }
    
    // Map rss2json items to our expected format
    const posts = data.items.map((item: Rss2JsonItem, index: number) => transformMediumPost({
      ...item,
      'content:encoded': item.content, // rss2json puts full content in 'content'
      categories: item.categories || [],
      isoDate: item.pubDate
    }, index));
    
    const response = NextResponse.json({
      success: true,
      posts: posts,
      totalPosts: posts.length,
      lastUpdated: new Date().toISOString()
    });

    // Add cache-busting headers for development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    } else {
      // In production, cache for 2 minutes for more responsive updates
      response.headers.set('Cache-Control', 'public, max-age=120, s-maxage=120');
    }

    return response;
  } catch (error) {
    console.error('Error fetching Medium RSS:', error);
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Medium posts',
        posts: []
      },
      { status: 500 }
    );

    // No cache for errors
    errorResponse.headers.set('Cache-Control', 'no-store');
    return errorResponse;
  }
} 