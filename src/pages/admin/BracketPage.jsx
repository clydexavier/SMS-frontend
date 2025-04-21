import React, { useState } from "react";

export default function BracketPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    console.log("Bracket loaded");
    setIsLoaded(true);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Bracket</h2>
      </div>

      {/* Bracket Container */}
      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="relative overflow-x-auto bg-white shadow-md rounded-xl border border-[#E6F2E8] min-h-[500px]">
          {/* Loading Overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-80 rounded-xl">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6BBF59] mx-auto"></div>
                <p className="text-gray-600 text-sm font-medium">Loading bracket...</p>
              </div>
            </div>
          )}

          {/* Iframe */}
          <div className="w-full min-w-[800px]">
            <iframe
              src="https://challonge.com/wtjitg08/module"
              width="100%"
              height="500"
              allowtransparency="true"
              onLoad={handleLoad}
              className={`rounded-xl w-full border-none ${isLoaded ? "block" : "hidden"}`}
              title="Tournament Bracket"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
