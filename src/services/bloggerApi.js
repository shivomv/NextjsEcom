/**
 * Service for fetching blog posts from Google Blogger API
 */

// Replace with your actual Blogger blog ID
const BLOGGER_BLOG_ID = 'YOUR_BLOGGER_BLOG_ID';
// API Key for public data access (no auth required for public blog posts)
const API_KEY = 'YOUR_GOOGLE_API_KEY';

// Base URL for Blogger API v3
const BLOGGER_API_BASE_URL = 'https://www.googleapis.com/blogger/v3';

/**
 * Fetch blog posts from Blogger API
 * @param {Object} options - Options for fetching posts
 * @param {number} options.maxResults - Maximum number of posts to fetch (default: 10)
 * @param {string} options.pageToken - Token for pagination
 * @param {string} options.labels - Comma-separated list of labels to filter by
 * @param {boolean} options.fetchBodies - Whether to fetch post bodies (default: true)
 * @returns {Promise<Object>} - Posts and pagination info
 */
export const fetchBlogPosts = async ({
  maxResults = 10,
  pageToken = '',
  labels = '',
  fetchBodies = true,
} = {}) => {
  try {
    // Build URL with query parameters
    const url = new URL(`${BLOGGER_API_BASE_URL}/blogs/${BLOGGER_BLOG_ID}/posts`);
    
    // Add query parameters
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('maxResults', maxResults);
    
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }
    
    if (labels) {
      url.searchParams.append('labels', labels);
    }
    
    if (!fetchBodies) {
      url.searchParams.append('fields', 'items(id,title,url,published,updated,labels,images),nextPageToken');
    }
    
    // Fetch posts
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the response to a more convenient format
    return {
      posts: data.items || [],
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

/**
 * Fetch a single blog post by ID
 * @param {string} postId - The ID of the post to fetch
 * @returns {Promise<Object>} - The post data
 */
export const fetchBlogPost = async (postId) => {
  try {
    const url = `${BLOGGER_API_BASE_URL}/blogs/${BLOGGER_BLOG_ID}/posts/${postId}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog post ${postId}:`, error);
    throw error;
  }
};

/**
 * Fetch blog categories (labels) from Blogger
 * @returns {Promise<Array<string>>} - Array of category names
 */
export const fetchBlogCategories = async () => {
  try {
    // Fetch a small number of posts to extract labels
    const { posts } = await fetchBlogPosts({ maxResults: 20, fetchBodies: false });
    
    // Extract all labels from posts
    const allLabels = posts.reduce((labels, post) => {
      if (post.labels && Array.isArray(post.labels)) {
        return [...labels, ...post.labels];
      }
      return labels;
    }, []);
    
    // Count occurrences of each label
    const labelCounts = allLabels.reduce((counts, label) => {
      counts[label] = (counts[label] || 0) + 1;
      return counts;
    }, {});
    
    // Sort labels by frequency (most used first)
    const sortedLabels = Object.entries(labelCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label);
    
    return sortedLabels;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
};
