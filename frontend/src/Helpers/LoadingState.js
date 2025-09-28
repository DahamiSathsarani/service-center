import { useState, useEffect } from "react";

// Global variable to store loading state
let globalLoading = false;
let listeners = [];

// Function to set global loading state
export const setGlobalLoading = (state) => {
  globalLoading = state;
  listeners.forEach((listener) => listener(globalLoading));
};

// Custom Hook to get global loading state
export const useLoading = () => {
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    const updateState = (newState) => setLoading(newState);
    listeners.push(updateState);

    return () => {
      listeners = listeners.filter((listener) => listener !== updateState);
    };
  }, []);

  return loading;
};
