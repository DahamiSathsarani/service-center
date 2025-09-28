import React from "react";
import { useLoading } from "../../Helpers/LoadingState";

export default function GlobalLoader() {
  const loading = useLoading(); // Get loading state

  if (!loading) return null; // Hide loader if not loading

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#F6CD28] border-solid rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-black font-bold text-lg">Loading...</span>
        </div>
      </div>
    </div>
  );
}
