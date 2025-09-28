import { useState } from "react";

export default function useTableSearch(initialData = [], searchFields = []) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = initialData.filter((item) => {
    if (!searchTerm) return true;
    
    return searchFields.some((field) => {
      const fieldValue = item[field]?.toString().toLowerCase() || "";
      return fieldValue.includes(searchTerm.toLowerCase());
    });
  });

  return { searchTerm, setSearchTerm, filteredData };
}