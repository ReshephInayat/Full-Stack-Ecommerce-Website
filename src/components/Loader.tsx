import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
