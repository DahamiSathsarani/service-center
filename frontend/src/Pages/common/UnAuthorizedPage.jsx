import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function UnAuthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white px-6">
      <div className="max-w-md text-center">
        <AlertTriangle size={80} className="text-[#F6CD28] mb-6 mx-auto" />
        <h1 className="text-4xl font-bold text-[#F6CD28]">Unauthorized Access</h1>
        <p className="mt-4 text-lg text-gray-300">
          You don’t have permission to access this page. If you believe this is a mistake, please contact the administrator.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-[#F6CD28] text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
