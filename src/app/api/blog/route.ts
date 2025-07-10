import { NextResponse } from 'next/server';
import RSSParser from 'rss-parser';

const parser = new RSSParser({
  customFields: {
    item: ['content:encoded'],
  },
});

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

function transformMediumPost(item: any, index: number) {
  const content = item['content:encoded'] || item.content || '';
  const imageUrl = extractValidImage(content);
  
  return {
    id: item.guid || `medium-${index}`,
    title: item.title || 'Untitled Post',
    slug: createSlug(item.title || `untitled-post-${index}`),
    date: new Date(item.pubDate || item.isoDate || Date.now()).toISOString().split('T')[0],
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
    const feed = await parser.parseURL('https://medium.com/feed/@kevinmartinez7616');
    
    const posts = feed.items.map((item, index) => transformMediumPost(item, index));
    
    return NextResponse.json({
      success: true,
      posts: posts,
      totalPosts: posts.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Medium RSS:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Medium posts',
        posts: []
      },
      { status: 500 }
    );
  }
} 