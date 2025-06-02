import React from 'react';
import { Award } from 'lucide-react';

const MedalStandingsTab = ({ tally = [] }) => {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medal Standings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-yellow-600 uppercase tracking-wider">
                  Gold
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Silver
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-orange-600 uppercase tracking-wider">
                  Bronze
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tally.map((team, index) => (
                <tr key={team.team_id} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <Award className={`w-5 h-5 mr-2 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-600'
                        }`} />
                      ) : (
                        <span className="w-5 h-5 mr-2 text-center text-sm">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {team.team_logo_path ? (
                        <img 
                          className="h-8 w-8 rounded-full mr-3" 
                          src={team.team_logo_path} 
                          alt={`${team.team_name} logo`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 ${
                          team.team_logo_path ? 'hidden' : ''
                        }`}
                      >
                        <span className="text-xs font-medium text-gray-500">
                          {team.team_name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{team.team_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-yellow-600">
                    {team.gold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-400">
                    {team.silver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-orange-600">
                    {team.bronze}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                    {team.gold + team.silver + team.bronze}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tally.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No medal standings available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedalStandingsTab;