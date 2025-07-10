'use client';

import { getBlogPost, getAdjacentPosts, BlogPost } from '../data';
import BlogNavigation from '../components/BlogNavigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Function to clean and process HTML content from Medium
function processHTMLContent(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Remove Medium-specific tracking and unwanted elements
  const cleanContent = htmlContent
    // Remove tracking pixels and analytics (but keep real images)
    .replace(/<img[^>]*src="[^"]*\/_\/stat[^"]*"[^>]*>/gi, '')
    .replace(/<img[^>]*src="[^"]*analytics[^"]*"[^>]*>/gi, '')
    .replace(/<img[^>]*src="[^"]*tracking[^"]*"[^>]*>/gi, '')
    .replace(/<img[^>]*src="[^"]*referrerSource=full_rss[^"]*"[^>]*>/gi, '')
    // Remove Medium's specific elements
    .replace(/<noscript>.*?<\/noscript>/gi, '')
    .replace(/data-[^=]*="[^"]*"/gi, '') // Remove data attributes
    // Fix image sources for better loading
    .replace(/src="\/\//g, 'src="https://')
    // Improve image styling - make images much smaller
          .replace(/<img([^>]*)>/gi, (match, attributes) => {
        // Don't process if it's a tracking image
        if (attributes.includes('/_/stat') || attributes.includes('analytics') || attributes.includes('tracking')) {
          return '';
        }
        return `<img${attributes} class="blog-image">`;
      })
    // Ensure proper paragraph spacing
    .replace(/<\/p>\s*<p>/gi, '</p><p>')
    // Add better styling to paragraphs
    .replace(/<p>/gi, '<p class="mb-4 leading-relaxed">')
    // Style headings
    .replace(/<h1>/gi, '<h1 class="text-3xl font-bold mt-8 mb-4">')
    .replace(/<h2>/gi, '<h2 class="text-2xl font-bold mt-6 mb-3">')
    .replace(/<h3>/gi, '<h3 class="text-xl font-bold mt-5 mb-2">')
    // Style links
    .replace(/<a([^>]*)>/gi, '<a$1 class="text-cyan-600 hover:text-cyan-800 underline">')
    // Style blockquotes
    .replace(/<blockquote([^>]*)>/gi, '<blockquote$1 class="border-l-4 border-cyan-400 pl-4 italic my-4">')
    // Style code blocks
    .replace(/<code([^>]*)>/gi, '<code$1 class="bg-gray-100 text-cyan-700 px-1 py-0.5 rounded text-sm">')
    .replace(/<pre([^>]*)>/gi, '<pre$1 class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleanContent;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [adjacentPosts, setAdjacentPosts] = useState<{ prev: BlogPost | null; next: BlogPost | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const [blogPost, adjacent] = await Promise.all([
          getBlogPost(slug),
          getAdjacentPosts(slug)
        ]);
        
        if (!blogPost) {
          setError('Post not found');
          return;
        }
        
        setPost(blogPost);
        setAdjacentPosts(adjacent);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="mb-8 text-center border-b border-gray-200 pb-8">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
            <div className="flex justify-center gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {error === 'Post not found' ? 'Post Not Found' : 'Error'}
        </h1>
        <p className="text-gray-600 mb-8">
          {error === 'Post not found' 
            ? 'The blog post you are looking for does not exist.' 
            : 'Failed to load the blog post. Please try again.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const processedContent = processHTMLContent(post.content);

  return (
    <div className="max-w-4xl mx-auto">
      <article>
        <header className="mb-8 text-center border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center text-gray-500 mb-6">
            <time dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <span className="mx-3">•</span>
            <span>{post.readTime}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-cyan-100 text-cyan-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Link to original Medium post if available */}
          {post.mediumUrl && (
            <div className="mt-4">
              <a
                href={post.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-cyan-600 hover:text-cyan-800 font-medium"
              >
                Read on Medium →
              </a>
            </div>
          )}
        </header>

        {/* Render HTML content directly with enhanced styling */}
        <div 
          className="blog-content text-gray-900 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </article>

      <BlogNavigation prevPost={adjacentPosts.prev} nextPost={adjacentPosts.next} />
    </div>
  );
}

