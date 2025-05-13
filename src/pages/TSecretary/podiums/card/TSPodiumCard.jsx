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
    borderHighlight,
    medals
  }) => (
    <div className={`${bgGradient} rounded-lg p-3 border-2 ${borderColor} transform hover:-translate-y-2 hover:shadow-md transition-all duration-300 flex flex-col items-center`}>
      <div className="flex items-center justify-center mb-2">
        <div className={`p-1.5 ${iconBgColor} rounded-full shadow-sm`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className={`font-bold ${textColor} text-sm ml-2`}>{position}</span>
      </div>
      
      <div className="flex flex-col items-center">
        {logo ? (
          <img 
            src={logo} 
            alt={`${type} team`} 
            className={`w-14 h-14 rounded-full object-cover border-2 ${borderHighlight} shadow-sm`} 
          />
        ) : (
          <div className={`w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border-2 ${borderHighlight} shadow-sm`}>
            <span className="text-xs text-gray-500">N/A</span>
          </div>
        )}
        <div className="mt-2 text-center">
          <h4 className={`font-semibold text-sm ${textColor}`}>{type}</h4>
          <p className="text-xs font-medium text-gray-700 mt-0.5">{teamName || "—"}</p>
          
          {/* Medal count display */}
          <div className="flex items-center justify-center mt-1.5 bg-white bg-opacity-50 px-2 py-0.5 rounded-full">
            <Icon size={12} className={textColor} />
            <span className={`ml-1 text-xs font-bold ${textColor}`}>
              {medals || 0} {medals === 1 ? 'medal' : 'medals'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
        <h3 className="font-bold text-green-800 flex items-center">
          <Trophy size={16} className="text-green-700 mr-2" />
          {podium.event.name}
        </h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Gold Medal */}
          <MedalPosition
            type="Gold"
            logo={podium.gold_team_logo}
            teamName={podium.gold_team_name}
            icon={Trophy}
            position="1st"
            bgGradient="bg-gradient-to-b from-yellow-50 to-yellow-100"
            borderColor="border-yellow-300"
            iconBgColor="bg-yellow-500"
            textColor="text-yellow-700"
            borderHighlight="border-yellow-400"
            medals={podium.medals}
          />
          
          {/* Silver Medal */}
          <MedalPosition
            type="Silver"
            logo={podium.silver_team_logo}
            teamName={podium.silver_team_name}
            icon={Medal}
            position="2nd"
            bgGradient="bg-gradient-to-b from-gray-50 to-gray-100"
            borderColor="border-gray-300"
            iconBgColor="bg-gray-400"
            textColor="text-gray-600"
            borderHighlight="border-gray-300"
            medals={podium.medals}
          />
          
          {/* Bronze Medal */}
          <MedalPosition
            type="Bronze"
            logo={podium.bronze_team_logo}
            teamName={podium.bronze_team_name}
            icon={Award}
            position="3rd"
            bgGradient="bg-gradient-to-b from-amber-50 to-amber-100"
            borderColor="border-amber-300"
            iconBgColor="bg-amber-700"
            textColor="text-amber-800"
            borderHighlight="border-amber-400"
            medals={podium.medals}
          />
        </div>
      </div>
    </div>
  );
};

export default TSPodiumCard;