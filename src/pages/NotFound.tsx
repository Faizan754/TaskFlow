import { Link } from "react-router";

const NotFound = () => (
  <div className="mx-auto max-w-xl px-6 py-24 text-center">
    <p className="text-sm font-semibold text-indigo-400">404</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
      Page not found
    </h1>
    <p className="mt-4 text-gray-300">
      The page you're looking for doesn't exist or has moved.
    </p>
    <Link
      to="/"
      className="mt-8 inline-block rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
    >
      Back to home
    </Link>
  </div>
);

export default NotFound;
