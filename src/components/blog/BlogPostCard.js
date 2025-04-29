'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

/**
 * Component to display a blog post card
 */
export default function BlogPostCard({ post }) {
  // Extract the first image from the post content if available
  const getPostImage = () => {
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }
    
    // Try to extract image from content if no images array
    if (post.content) {
      const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
      }
    }
    
    // Return default image if no image found
    return '/images/blog-placeholder.jpg';
  };

  // Format the published date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  // Extract a snippet from the content
  const getContentSnippet = () => {
    if (!post.content) return '';
    
    // Remove HTML tags and get plain text
    const plainText = post.content.replace(/<[^>]+>/g, '');
    
    // Return a snippet (first 150 characters)
    return plainText.length > 150 
      ? `${plainText.substring(0, 150)}...` 
      : plainText;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={getPostImage()}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        {/* Labels/Categories */}
        {post.labels && post.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.labels.slice(0, 2).map((label) => (
              <span 
                key={label} 
                className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800"
              >
                {label}
              </span>
            ))}
            {post.labels.length > 2 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                +{post.labels.length - 2} more
              </span>
            )}
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/blog/${post.id}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        
        {/* Snippet */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {getContentSnippet()}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {formatDate(post.published)}
          </span>
          
          <Link 
            href={`/blog/${post.id}`}
            className="text-primary font-medium text-sm hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
