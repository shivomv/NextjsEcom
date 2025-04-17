# Prashasak Samiti E-commerce Platform

This is a full-stack e-commerce application built with Next.js, using the App Router and integrated API routes for the backend. The application is designed for selling religious and spiritual products.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
