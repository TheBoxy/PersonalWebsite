'use client';

import { getBlogPosts, BlogPost } from './data';
import BlogCard from './components/BlogCard';
import { useEffect, useState } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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