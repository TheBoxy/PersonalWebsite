import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Ordered by release date, newest first
const VIDEOS = [
  { videoId: 'OlZDo7mtHes', title: 'Desmadre del Gobierno - Garden Boy', publishedAt: '2026-04-17' },
  { videoId: 'FyKrICbnG7o', title: 'My Kind of Woman Cover - Garden Boy', publishedAt: '2026-03-16' },
  { videoId: 'EGRp6bItDC8', title: 'Bad Time - Garden Boy', publishedAt: '2025-11-14' },
  { videoId: 'rxmUzVMK4DU', title: 'Apriendendo - Garden Boy', publishedAt: '2025-11-06' },
  { videoId: 'fc80Svg7VxA', title: 'Todos Mienten - Garden Boy', publishedAt: '2025-10-17' },
  { videoId: '80KuIlT8JQE', title: 'Mirror Reflection - Living Life', publishedAt: '2024-07-29' },
  { videoId: 'G2VVlXJWiLI', title: 'Mirror Reflection - Why?', publishedAt: '2024-07-29' },
  { videoId: 'jvMG7aGFdxs', title: 'Mirror Reflection - Wishful', publishedAt: '2024-07-29' },
  { videoId: 'D8lGVHWus-E', title: 'Mirror Reflection - Catching Speed', publishedAt: '2024-07-29' },
  { videoId: 'Jh--zKODqbA', title: 'Echo Chamber - Living Loving Life', publishedAt: '2024-07-15' },
  { videoId: 'HQFsecPT9_Y', title: 'Echo Chamber - Meadow', publishedAt: '2024-07-15' },
  { videoId: '3A5bLbwiea8', title: 'Echo Chamber - Avalon Gardener', publishedAt: '2024-07-15' },
  { videoId: 'uzqgCLNLh50', title: 'Echo Chamber - Home', publishedAt: '2024-07-15' },
];

export async function GET() {
  const items = VIDEOS.map(v => ({
    id: { videoId: v.videoId },
    snippet: {
      title: v.title,
      thumbnails: {
        medium: {
          url: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`
        }
      },
      publishedAt: v.publishedAt
    }
  }));

  return NextResponse.json({ items });
}

