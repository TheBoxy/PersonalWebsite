import Link from 'next/link';
import { BlogPost } from '../data';

interface BlogNavigationProps {
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export default function BlogNavigation({ prevPost, nextPost }: BlogNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="flex justify-between items-center py-8 border-t border-gray-200 mt-8">
      <div className="flex-1">
        {prevPost && (
          <Link href={`/blog/${prevPost.slug}`}>
            <div className="group text-left">
              <div className="text-sm text-gray-500 mb-1 group-hover:text-cyan-600 transition-colors">
                ← Previous Post
              </div>
              <div className="text-lg font-medium text-gray-900 group-hover:text-cyan-700 transition-colors">
                {prevPost.title}
              </div>
            </div>
          </Link>
        )}
      </div>
      
      <div className="flex-shrink-0 mx-8">
        <Link href="/blog">
          <div className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 px-4 py-2 rounded-lg transition-colors duration-300 font-medium">
            All Posts
          </div>
        </Link>
      </div>
      
      <div className="flex-1">
        {nextPost && (
          <Link href={`/blog/${nextPost.slug}`}>
            <div className="group text-right">
              <div className="text-sm text-gray-500 mb-1 group-hover:text-cyan-600 transition-colors">
                Next Post →
              </div>
              <div className="text-lg font-medium text-gray-900 group-hover:text-cyan-700 transition-colors">
                {nextPost.title}
              </div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
} 