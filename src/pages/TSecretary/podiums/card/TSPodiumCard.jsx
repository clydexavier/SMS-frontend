import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

const TSPodiumCard = ({ podium }) => {
  // Helper component for medal display
  const MedalPosition = ({ 
    type, 
    logo, 
    teamName, 
    icon: Icon, 
    position, 
    bgGradient, 
    borderColor, 
    iconBgColor, 
    textColor, 
    borderHighlight 
  }) => (
    <div className={`${bgGradient} rounded-lg p-2 border ${borderColor} transform hover:-translate-y-1 transition-transform flex flex-col items-center`}>
      <div className="flex items-center justify-center mb-1">
        <div className={`p-1 ${iconBgColor} rounded-full`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className={`font-bold ${textColor} text-sm ml-1`}>{position}</span>
      </div>
      
      <div className="flex flex-col items-center">
        {logo ? (
          <img 
            src={logo} 
            alt={`${type} team`} 
            className={`w-10 h-10 rounded-full object-cover border-2 ${borderHighlight}`} 
          />
        ) : (
          <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 ${borderHighlight}`}>
            <span className="text-xs text-gray-500">N/A</span>
          </div>
        )}
        <div className="mt-1 text-center">
          <h4 className="font-medium text-xs text-gray-800">{type}</h4>
          <p className="text-xs text-gray-700">{teamName || "—"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      <div className="px-4 py-2 bg-green-50 border-b border-green-100">
        <h3 className="font-semibold text-green-800">{podium.event.name}</h3>
      </div>
      
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Gold Medal */}
          <MedalPosition
            type="Gold"
            logo={podium.gold_team_logo}
            teamName={podium.gold_team_name}
            icon={Trophy}
            position="1st"
            bgGradient="bg-gradient-to-b from-yellow-50 to-yellow-100"
            borderColor="border-yellow-200"
            iconBgColor="bg-yellow-500"
            textColor="text-yellow-700"
            borderHighlight="border-yellow-400"
          />
          
          {/* Silver Medal */}
          <MedalPosition
            type="Silver"
            logo={podium.silver_team_logo}
            teamName={podium.silver_team_name}
            icon={Medal}
            position="2nd"
            bgGradient="bg-gradient-to-b from-gray-50 to-gray-100"
            borderColor="border-gray-200"
            iconBgColor="bg-gray-400"
            textColor="text-gray-600"
            borderHighlight="border-gray-300"
          />
          
          {/* Bronze Medal */}
          <MedalPosition
            type="Bronze"
            logo={podium.bronze_team_logo}
            teamName={podium.bronze_team_name}
            icon={Award}
            position="3rd"
            bgGradient="bg-gradient-to-b from-amber-50 to-amber-100"
            borderColor="border-amber-200"
            iconBgColor="bg-amber-700"
            textColor="text-amber-800"
            borderHighlight="border-amber-400"
          />
        </div>
      </div>
    </div>
  );
};

export default TSPodiumCard;