import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

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
  
  // Parse date more carefully - try multiple formats
  let postDate: Date;
  if (item.isoDate) {
    postDate = new Date(item.isoDate);
  } else if (item.pubDate) {
    postDate = new Date(item.pubDate);
  } else {
    postDate = new Date();
  }
  
  // Validate date
  if (isNaN(postDate.getTime())) {
    postDate = new Date();
  }
  
  return {
    id: item.guid || `medium-${index}`,
    title: item.title || 'Untitled Post',
    slug: createSlug(item.title || `untitled-post-${index}`),
    date: postDate.toISOString(),
    excerpt: extractExcerpt(content),
    content: content,
    tags: item.categories || ['Blog'],
    readTime: estimateReadTime(content),
    imageUrl: imageUrl,
    mediumUrl: item.link || item.guid,
  };
}

export async function GET(request: Request) {
  try {
    const mediumRssUrl = 'https://medium.com/feed/@kevinmartinez7616';
    let posts: ReturnType<typeof transformMediumPost>[] = [];
    
    // Try parsing Medium RSS directly first (bypasses RSS2JSON cache)
    try {
      const parser = new Parser({
        customFields: {
          item: [
            ['content:encoded', 'contentEncoded'],
            ['media:content', 'mediaContent'],
          ]
        }
      });
      
      const feed = await parser.parseURL(mediumRssUrl);
      
      // Map Medium RSS items to our expected format
      posts = feed.items.map((item, index) => transformMediumPost({
        guid: item.guid || item.link,
        title: item.title,
        pubDate: item.pubDate,
        isoDate: item.isoDate,
        categories: item.categories || [],
        link: item.link,
        content: item['content:encoded'] || item.content || item.contentSnippet || '',
        'content:encoded': item['content:encoded'] || item.content || item.contentSnippet || ''
      }, index));
      
    } catch (directError: any) {
      // Fallback to RSS2JSON
      const rssUrl = encodeURIComponent(mediumRssUrl);
      const apiKey = process.env.RSS2JSON_API_KEY;
      
      let RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
      if (apiKey) {
        RSS2JSON_URL += `&api_key=${apiKey}&count=50`;
      }
      
      const feedResponse = await fetch(RSS2JSON_URL, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!feedResponse.ok) {
        const errorText = await feedResponse.text();
        throw new Error(`RSS2JSON returned status: ${feedResponse.status} - ${errorText}`);
      }

      const data = await feedResponse.json();
      
      if (data.status !== 'ok') {
        throw new Error(`RSS2JSON returned error status: ${data.status} - ${data.message || 'Unknown error'}`);
      }
      
      // Map rss2json items to our expected format
      posts = data.items.map((item: Rss2JsonItem, index: number) => transformMediumPost({
        ...item,
        'content:encoded': item.content,
        categories: item.categories || [],
        isoDate: item.pubDate
      }, index));
    }
    
    // Sort posts by date (newest first) to ensure latest posts appear first
    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
    
    const response = NextResponse.json({
      success: true,
      posts: sortedPosts,
      totalPosts: sortedPosts.length,
      lastUpdated: new Date().toISOString()
    });

    // Always use no-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
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