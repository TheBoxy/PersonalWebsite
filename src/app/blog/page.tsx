'use client';

import { getBlogPosts, BlogPost } from './data';
import BlogCard from './components/BlogCard';
import { useEffect, useState } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (forceRefresh = false) => {
    try {
      setLoading(!forceRefresh);
      setRefreshing(forceRefresh);
      setError(null);
      
      // Clear cache if force refresh
      if (forceRefresh && typeof window !== 'undefined') {
        // Clear any cached data by adding timestamp
        const timestamp = Date.now();
        const response = await fetch(`/api/blog?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
        } else {
          throw new Error(data.error || 'Failed to fetch posts');
        }
      } else {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      }
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    fetchPosts(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KBlog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughts on random things I find interesting. These are posted on my Medium.com account.
          </p>
        </div>
        
        <div className="grid gap-8 md:gap-6">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-400 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KBlog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughts on random things I find interesting. These are posted on my Medium.com account.
          </p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {error}
          </p>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <svg 
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            KBlog
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-2"
            title="Refresh blog posts"
          >
            <svg 
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thoughts on random things I find interesting. These are posted on my Medium.com account.
        </p>
      </div>

      <div className="grid gap-8 md:gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No blog posts yet. Check back soon for new content!
          </p>
        </div>
      )}
    </div>
  );
} 