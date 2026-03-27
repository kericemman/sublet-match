import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg font-medium text-gray-800">
          Page not found
        </p>
        <p className="mt-2 text-sm text-gray-500">
          The page you’re looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;