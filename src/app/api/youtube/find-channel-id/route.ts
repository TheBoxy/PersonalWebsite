import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle') || '@gardenboy-z8q';
    
    // Fetch the channel page
    const response = await fetch(`https://www.youtube.com/${handle}`);
    const html = await response.text();
    
    // Try to extract channel ID from various possible locations in the HTML
    const patterns = [
      /"channelId":"(UC[\w-]+)"/,
      /"externalChannelId":"(UC[\w-]+)"/,
      /channel_id=(UC[\w-]+)/,
      /"channelUrl":"http:\/\/www\.youtube\.com\/channel\/(UC[\w-]+)"/
    ];
    
    let channelId = null;
    
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        channelId = match[1];
        break;
      }
    }
    
    if (channelId) {
      return NextResponse.json({ 
        success: true,
        handle,
        channelId,
        rssUrl: `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
      });
    } else {
      return NextResponse.json({ 
        success: false,
        error: 'Could not extract channel ID. Please find it manually.',
        instructions: 'Visit your channel page, view page source (Ctrl+U), and search for "channelId"'
      });
    }
  } catch (error) {
    console.error('Error finding channel ID:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch channel data'
    }, { status: 500 });
  }
}


