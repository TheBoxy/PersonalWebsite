'use client';

import Link from 'next/link';
import { BlogPost } from '../data';
import { useState } from 'react';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasValidImage = post.imageUrl && !imageError;

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-orange-400 hover:border-purple-600 overflow-hidden relative">
          <div className="relative">
            <div className={`flex ${hasValidImage ? 'gap-4' : ''}`}>
              <div className={hasValidImage ? "flex-1 p-6 pr-2" : "p-4"}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-12">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full border border-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Featured image from Medium post - now on the right side */}
              {hasValidImage && post.imageUrl && (
                <div className="w-24 h-24 overflow-hidden bg-gray-100 rounded-lg flex-shrink-0 self-start mt-6 mr-6">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                  />
                  {/* Loading placeholder */}
                  {!imageLoaded && !imageError && (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400 text-xs">Loading...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Read more section positioned absolutely at bottom right */}
            <div className="absolute bottom-4 right-6 flex items-center gap-2">
              <div className="text-orange-600 group-hover:text-purple-800 transition-colors duration-300 font-medium">
                Read more →
              </div>
              {post.mediumUrl && (
                <span className="text-gray-400 text-sm">
                  via Medium
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
} 