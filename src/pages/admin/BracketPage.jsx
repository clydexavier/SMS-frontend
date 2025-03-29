import React, { useState } from "react";

export default function BracketPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    console.log("Bracket loaded");
    setIsLoaded(true);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Intramurals</h2>
      </div>

      <div className="flex-1 p-6 bg-gray-100 text-gray-900 flex justify-center items-center relative">
        {/* Show loading message until iframe is fully loaded */}
        {!isLoaded && (
          <div className="absolute text-xl font-semibold text-gray-700">
            Loading Bracket...
          </div>
        )}

        {/* Always render iframe but hide it until it's loaded */}
        <iframe 
          src="https://challonge.com/2rp6ee7s/module" 
          width="100%" 
          height="500" 
          frameBorder="0" 
          allowTransparency="true"
          onLoad={handleLoad}
          style={{ display: isLoaded ? "block" : "none" }}
        ></iframe>
      </div>
    </div>
  );
}
