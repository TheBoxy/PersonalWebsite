# Music Page Setup Guide

## Windows Media Player 9 Theme

The music page has been styled to look like Windows Media Player 9 from Windows XP, featuring:
- Classic blue/silver gradient theme
- WMP9-style title bar and menu bar
- Playlist sidebar
- Playback controls (Play/Pause, Next, Previous, Stop)
- YouTube video embedding

## YouTube RSS Feed Setup (NO API KEY REQUIRED!)

The music page now pulls videos directly from your YouTube channel's RSS feed - just like a blog RSS feed! No API key needed!

### Steps:

1. **Find Your YouTube Channel ID**
   
   **Option A - Automatic (Recommended):**
   - Visit: `http://localhost:3000/api/youtube/find-channel-id?handle=@gardenboy-z8q`
   - This will display your channel ID automatically
   
   **Option B - Manual:**
   - Go to your channel: https://www.youtube.com/@gardenboy-z8q
   - Right-click and select "View Page Source" (or press Ctrl+U / Cmd+U)
   - Search for `"channelId"` in the source code
   - Copy the ID that starts with `UC...`

2. **Update the API Route**
   - Open `/src/app/api/youtube/route.ts`
   - Replace the `CHANNEL_ID` value with your actual channel ID:
   ```typescript
   const CHANNEL_ID = 'UC...'; // Your channel ID here
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

That's it! No API keys, no authentication, no quotas. It works just like RSS feeds for blogs.

## Features

- ✅ Windows Media Player 9 retro design
- ✅ Fetches videos from your YouTube channel
- ✅ Click any track to play it
- ✅ Next/Previous track navigation
- ✅ Play/Pause controls
- ✅ Stop playback button
- ✅ Responsive playlist view
- ✅ YouTube video embedding

## Channel Configuration

To change the YouTube channel, edit `/src/app/api/youtube/route.ts`:

```typescript
const CHANNEL_HANDLE = '@gardenboy-z8q'; // Change this to any YouTube handle
```

