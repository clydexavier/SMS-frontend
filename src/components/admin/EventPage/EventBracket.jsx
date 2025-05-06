import React from "react";

const EventBracket = ({ bracketId, isLoaded, setIsLoaded }) => {
  const handleLoad = () => setIsLoaded(true);

  return (
    <div className="bg-white shadow-md rounded-xl border border-[#E6F2E8] overflow-hidden transition-all duration-300">
      <div className="relative max-h">
        {!isLoaded && (
          <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-80 transition-opacity duration-300">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2A6D3A] mx-auto"></div>
              <p className="text-[#2A6D3A] text-sm font-medium">Loading tournament bracket...</p>
            </div>
          </div>
        )}
        <iframe
          src={`https://challonge.com/${bracketId}/module?theme=7838&show_final_results=1&show_standings=0`}
          width="100%"
          height="600"
          allowtransparency="true"
          onLoad={handleLoad}
          className={`rounded-b-xl w-full border-none transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          title="Tournament Bracket"
        ></iframe>
      </div>
    </div>
  );
};

export default EventBracket;