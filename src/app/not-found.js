import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-6xl font-bold text-gradient-purple-pink mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-purple-pink text-white px-6 py-3 rounded-full font-medium transition-transform hover:scale-105"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
