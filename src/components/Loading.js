import React from "react";

function Loading() {
  console.log("Loading");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-500"></div>
    </div>
  );
}

export default Loading;
