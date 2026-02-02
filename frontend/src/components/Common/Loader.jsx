import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-full border-4 border-red-200 border-t-red-600 animate-spin"></div>
        <p className="text-red-600 text-sm tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
