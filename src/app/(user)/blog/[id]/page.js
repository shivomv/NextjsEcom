'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { fetchBlogPost } from '@/services/bloggerApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDistanceToNow, format } from 'date-fns';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postData = await fetchBlogPost(params.id);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  // Format the published date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return 'Recently';
    }
  };

  // Get the featured image from the post content
  const getFeaturedImage = () => {
    if (post?.images && post.images.length > 0) {
      return post.images[0].url;
    }
    
    // Try to extract image from content if no images array
    if (post?.content) {
      const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
      }
    }
    
    // Return default image if no image found
    return '/images/blog-placeholder.jpg';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog Post</h2>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              {error || 'The blog post could not be found.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
              <Link
                href="/blog"
                className="inline-flex items-center bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Featured Image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/80 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full">
          <Image
            src={getFeaturedImage()}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg max-w-4xl">
              {post.title}
            </h1>
            <div className="flex items-center text-white/90">
              <span className="drop-shadow">
                Published {formatDate(post.published)}
              </span>
              {post.labels && post.labels.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex flex-wrap gap-2">
                    {post.labels.map((label) => (
                      <Link 
                        key={label} 
                        href={`/blog?category=${encodeURIComponent(label)}`}
                        className="text-xs font-medium px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-primary hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* Share Links */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-gray-600">
              Share this post:
            </div>
            <div className="flex space-x-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                aria-label="Share on Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(post.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:text-sky-700"
                aria-label="Share on Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(post.url)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:text-blue-900"
                aria-label="Share on LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a 
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this blog post: ${post.url}`)}`}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Share via Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
