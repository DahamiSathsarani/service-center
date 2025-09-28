import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-9xl font-bold text-[#F6CD28]">404</h1>
      <p className="text-2xl font-semibold text-gray-900 mt-4">
        Oops! Page Not Found
      </p>
      <p className="text-md text-gray-600 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-[#F6CD28] text-black font-bold text-md rounded-lg shadow-md hover:bg-[#ffe06f] transition-all duration-300"
      >
        Go Home
      </Link>
    </div>
  );
}
