# Blogger API Integration

This directory contains services for integrating with external APIs, including the Google Blogger API.

## Blogger API Integration

The `bloggerApi.js` file provides functionality to fetch blog posts from a Google Blogger blog and display them in the Next.js application.

### Setup Instructions

1. **Get your Blogger Blog ID**:
   - Go to your Blogger dashboard
   - The Blog ID is in the URL when you're editing your blog: `https://www.blogger.com/blog/posts/YOUR_BLOG_ID`

2. **Create a Google API Key**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Library"
   - Search for and enable the "Blogger API v3"
   - Go to "APIs & Services" > "Credentials"
   - Create an API Key
   - Restrict the API key to only the Blogger API for security

3. **Update the configuration**:
   - Open `src/services/bloggerApi.js`
   - Replace `YOUR_BLOGGER_BLOG_ID` with your actual Blogger Blog ID
   - Replace `YOUR_GOOGLE_API_KEY` with your Google API Key

### Available Functions

- `fetchBlogPosts({ maxResults, pageToken, labels, fetchBodies })`: Fetches a list of blog posts with pagination and filtering options
- `fetchBlogPost(postId)`: Fetches a single blog post by ID
- `fetchBlogCategories()`: Fetches all categories (labels) used in the blog

### Usage Example

```javascript
import { fetchBlogPosts, fetchBlogPost, fetchBlogCategories } from '@/services/bloggerApi';

// Fetch blog posts
const { posts, nextPageToken } = await fetchBlogPosts({ maxResults: 10 });

// Fetch a single post
const post = await fetchBlogPost('post123');

// Fetch categories
const categories = await fetchBlogCategories();
```

## Troubleshooting

- If you see "Failed to fetch blog posts" errors, check that your API key and Blog ID are correct
- Make sure your Blogger blog is public or that you have the appropriate permissions
- Check the browser console for more detailed error messages
