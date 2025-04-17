# Project Structure

This document outlines the structure of the Prashasak Samiti E-commerce Platform codebase.

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/            # Admin route group
│   │   ├── admin/          # Admin dashboard pages
│   │   └── layout.js       # Admin layout (no header/footer)
│   ├── (user)/             # User-facing route group
│   │   ├── about/          # About page
│   │   ├── account/        # User account pages
│   │   ├── blog/           # Blog pages
│   │   ├── cart/           # Shopping cart page
│   │   ├── category/       # Category pages
│   │   ├── checkout/       # Checkout flow pages
│   │   ├── contact/        # Contact page
│   │   ├── faq/            # FAQ page
│   │   ├── login/          # Login page
│   │   ├── not-found/      # 404 page for user routes
│   │   ├── products/       # Product listing and detail pages
│   │   ├── register/       # Registration page
│   │   └── layout.js       # User layout (with header/footer)
│   ├── api/                # API routes
│   ├── globals.css         # Global CSS
│   ├── layout.js           # Root layout
│   ├── not-found.js        # Root 404 page
│   └── page.js             # Root page (redirects to home)
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── checkout/           # Checkout flow components
│   ├── common/             # Shared/common components
│   ├── layout/             # Layout components (header, footer)
│   └── products/           # Product-related components
├── context/                # React context providers
│   ├── AuthContext.js      # Authentication context
│   └── CartContext.js      # Shopping cart context
├── lib/                    # Utility libraries
├── models/                 # MongoDB models
│   ├── cartModel.js        # Cart model
│   ├── orderModel.js       # Order model
│   ├── productModel.js     # Product model
│   └── userModel.js        # User model
├── public/                 # Static assets
│   ├── images/             # Image assets
│   └── favicon.ico         # Favicon
├── services/               # Service layer
│   └── api.js              # API service
└── utils/                  # Utility functions
    ├── auth.js             # Authentication utilities
    └── db.js               # Database connection utility
```

## Route Groups

The application uses Next.js route groups to organize the codebase:

- `(admin)`: Contains all admin-related pages with a dedicated layout (no header/footer)
- `(user)`: Contains all user-facing pages with the standard layout (header/footer)

## Key Files

- `src/app/layout.js`: Root layout that includes global styles and metadata
- `src/app/(user)/layout.js`: User-facing layout with header, footer, and mobile navigation
- `src/app/(admin)/layout.js`: Admin layout without header and footer
- `src/context/AuthContext.js`: Manages user authentication state
- `src/context/CartContext.js`: Manages shopping cart state
- `src/services/api.js`: Handles API requests to the backend
- `src/utils/db.js`: Manages database connections
- `src/utils/auth.js`: Handles authentication logic

## Import Conventions

All imports use the `@/` alias pattern to reference files from the root of the `src` directory. For example:

```javascript
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/products/ProductCard';
```

This makes imports cleaner and more maintainable, especially when moving files between directories.

## Styling

The application uses Tailwind CSS for styling, with custom utility classes defined in `globals.css`:

- `text-gradient-purple-pink`: Creates a purple-to-pink text gradient
- `bg-gradient-purple-pink`: Creates a purple-to-pink background gradient

## Authentication Flow

1. User logs in via `/login` page
2. Authentication state is managed by `AuthContext`
3. Protected routes check authentication status
4. Admin routes check for admin role
5. Non-admin users are redirected to the home page when trying to access admin routes
