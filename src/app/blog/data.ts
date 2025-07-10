export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
  imageUrl?: string | null;
  mediumUrl?: string;
}

// Cache for Medium posts to avoid frequent API calls
let cachedPosts: BlogPost[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function fetchMediumPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  
  // Return cached posts if they're still fresh
  if (cachedPosts.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return cachedPosts;
  }

  try {
    // Construct the full URL for server-side rendering
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com';
    
    const apiUrl = typeof window !== 'undefined' ? '/api/blog' : `${baseUrl}/api/blog`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      cache: 'force-cache' // Use cache to ensure consistency
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.posts) {
      cachedPosts = data.posts;
      lastFetchTime = now;
      return cachedPosts;
    } else {
      throw new Error(data.error || 'Failed to fetch posts');
    }
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    
    // Return cached posts if available, otherwise return fallback
    if (cachedPosts.length > 0) {
      return cachedPosts;
    }
    
    // Fallback to static posts if Medium fails
    return getFallbackPosts();
  }
}

// Fallback posts in case Medium RSS fails
function getFallbackPosts(): BlogPost[] {
  return [
    {
      id: 'fallback-1',
      title: 'Welcome to My Blog',
      slug: 'welcome-to-my-blog',
      date: new Date().toISOString().split('T')[0],
      excerpt: 'Welcome to my blog! I share thoughts on web development, design, and technology.',
      content: `
# Welcome to My Blog

I'm excited to share my thoughts and experiences with you. This blog covers topics including:

- Web Development
- Design Principles
- Technology Trends
- Programming Tips

Check back regularly for new content, or follow me on [Medium](https://medium.com/@kevinmartinez7616) for the latest posts.
      `,
      tags: ['Welcome', 'Blog'],
      readTime: '1 min read',
      imageUrl: null,
    }
  ];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await fetchMediumPosts();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await fetchMediumPosts();
  return posts.find(post => post.slug === slug);
}

export async function getAdjacentPosts(slug: string): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const sortedPosts = await getBlogPosts();
  const currentIndex = sortedPosts.findIndex(post => post.slug === slug);
  
  return {
    prev: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
    next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
  };
}

// Server-side function that pre-fetches data for SSR
export async function getServerSideProps() {
  try {
    // Pre-fetch and cache the posts for SSR
    const posts = await fetchMediumPosts();
    return {
      props: {
        initialPosts: posts
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialPosts: getFallbackPosts()
      }
    };
  }
} 