import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  try {
    // YouTube channel ID for @gardenboy-z8q
    const CHANNEL_ID = 'UC7Z1nRz8lN2fnOh_qnB3wSw';
    
    // YouTube RSS feed URL - works without any API key!
    const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

    const parser = new Parser({
      customFields: {
        item: [
          ['media:group', 'media'],
          ['yt:videoId', 'videoId']
        ]
      }
    });

    const feed = await parser.parseURL(RSS_URL);

    // Transform RSS feed data to match the expected format
    const items = feed.items.map(item => {
      // Extract video ID from the link (format: https://www.youtube.com/watch?v=VIDEO_ID)
      const videoId = item.videoId || item.link?.split('v=')[1] || '';
      
      return {
        id: { videoId },
        snippet: {
          title: item.title || '',
          thumbnails: {
            medium: {
              url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
            }
          },
          publishedAt: item.pubDate || item.isoDate || ''
        }
      };
    });

    return NextResponse.json({ items }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch videos',
      items: [] 
    }, { status: 500 });
  }
}

