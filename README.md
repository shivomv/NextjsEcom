# Prashasak Samiti E-commerce Platform

This is a full-stack e-commerce application built with Next.js, using the App Router and integrated API routes for the backend. The application is designed for selling religious and spiritual products.

## Documentation

For detailed documentation, please check the [documentation folder](./documentation):

- [API Documentation](./documentation/api-documentation.md)
- [Requirements](./documentation/requirements.md)
- [Pending Pages](./documentation/pending-pages.md)

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Order processing
- Admin dashboard
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB installed locally or a MongoDB Atlas account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# Database
MONGODB_URI=mongodb://localhost:27017/prashasaksamiti

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# App
NODE_ENV=development
```

4. Seed the database with initial data:

```bash
npm run data:import
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
