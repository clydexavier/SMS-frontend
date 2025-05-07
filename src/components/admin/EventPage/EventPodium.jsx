import React from "react";

const EventPodium = ({ podiumData }) => {
  if (
    !podiumData ||
    !("gold_team_id" in podiumData) ||
    !("gold_team_name" in podiumData)
  ) {
    return (
      <div className="text-center text-gray-500 py-10">
        No podium results available.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-4">
      <div className="flex justify-center items-center pb-6">
        <div className="flex flex-col sm:flex-row justify-around items-center sm:items-end w-full max-w-3xl gap-6 sm:gap-0">
          {/* Silver - 2nd Place */}
          <div className="flex flex-col items-center order-2 sm:order-1">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 border-4 border-gray-300">
                  2
                </div>
              </div>
            </div>
            <div className="text-center mb-2">
              <p className="font-bold text-gray-800">
                {podiumData.silver_team_name}
              </p>
              <p className="text-sm text-gray-500">Silver</p>
            </div>
            <div className="h-32 w-28 sm:w-32 bg-gray-200 rounded-t-lg"></div>
          </div>

          {/* Gold - 1st Place */}
          <div className="flex flex-col items-center order-1 sm:order-2">
            <div className="relative mb-2 sm:mb-4">
              <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-300">
                <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center text-2xl font-bold text-yellow-800">
                  1
                </div>
              </div>
            </div>
            <div className="text-center mb-2">
              <p className="font-bold text-gray-800">
                {podiumData.gold_team_name}
              </p>
              <p className="text-sm text-gray-500">Gold</p>
            </div>
            <div className="h-48 w-28 sm:w-32 bg-yellow-400 rounded-t-lg"></div>
          </div>

          {/* Bronze - 3rd Place */}
          <div className="flex flex-col items-center order-3">
            <div className="relative">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center text-xl font-bold text-orange-800 border-4 border-orange-400">
                  3
                </div>
              </div>
            </div>
            <div className="text-center mb-2">
              <p className="font-bold text-gray-800">
                {podiumData.bronze_team_name}
              </p>
              <p className="text-sm text-gray-500">Bronze</p>
            </div>
            <div className="h-24 w-28 sm:w-32 bg-orange-600 rounded-t-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPodium;
