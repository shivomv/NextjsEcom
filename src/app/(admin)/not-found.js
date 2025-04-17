import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The admin page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
