import React from "react";

export default function TableSearch({ searchTerm, setSearchTerm, placeholder = "Search..." }) {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm">
      <svg
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="ml-2 outline-none flex-1 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}