import React, { useState } from "react";

export default function BracketPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    console.log("Bracket loaded");
    setIsLoaded(true);
  };

  return (
    <div className="flex flex-col w-full h-full text-sm">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Bracket</h2>
      </div>

      {/* Bracket Container */}
      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-gray-100 text-gray-900 rounded-lg">
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4 min-h-[500px] relative">
          {/* Loading Message */}
          {!isLoaded && (
            <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-80 rounded-lg">
              <p className="text-lg font-medium text-gray-700">Loading Bracket...</p>
            </div>
          )}

          {/* Responsive Iframe with Scroll */}
          <div className="w-full min-w-[800px]">
            <iframe
              src="https://challonge.com/wtjitg08/module"
              width="100%"
              height="500"
              allowtransparency="true"
              onLoad={handleLoad}
              className={`${isLoaded ? "block" : "hidden"} rounded-md w-full`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
