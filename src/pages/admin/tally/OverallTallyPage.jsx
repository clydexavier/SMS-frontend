import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { Award, Loader, Medal, Trophy } from "lucide-react";
import { GiPodium } from "react-icons/gi";


export default function OverallTallyPage() {
  const { intrams_id } = useParams();

  const [loading, setLoading] = useState(true);
  const [tallyData, setTallyData] = useState([]);
  const [error, setError] = useState("");

  const fetchTallyData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/overall_tally`);
      
      setTallyData(data.data);
    } catch (err) {
      console.error("Error fetching tally data:", err);
      setError("Failed to fetch medal tally");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (intrams_id) {
      fetchTallyData();
    }
  }, [intrams_id]);

  // Calculate total medals for each team
  const calculateTotal = (team) => {
    return team.gold + team.silver + team.bronze;
  };

  // Get medal icon with appropriate styling based on rank
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} className="text-yellow-500" />;
      case 2:
        return <Trophy size={20} className="text-gray-400" />;
      case 3:
        return <Trophy size={20} className="text-amber-700" />;
      default:
        return <span className="w-5 text-center font-bold text-gray-600">{rank}</span>;
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Medal size={20} className="mr-2" /> Medal Table
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : tallyData.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Medal size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No medal data available</h3>
                <p className="text-gray-500 mt-1">Medal standings will appear once events are completed</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                {/* Table with horizontal and vertical scrolling */}
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-[#F7FAF7] border-b-2 border-[#E6F2E8] sticky top-0">
                      <tr>
                        <th className="flex items-center justify-center py-3 px-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Team</th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-yellow-500">
                          <span className="flex items-center justify-center">
                            <Medal size={16} className="mr-1" /> Gold
                          </span>
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-400">
                          <span className="flex items-center justify-center">
                            <Medal size={16} className="mr-1" /> Silver
                          </span>
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-amber-700">
                          <span className="flex items-center justify-center">
                            <Medal size={16} className="mr-1" /> Bronze
                          </span>
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tallyData.map((team, index) => (
                        <tr 
                          key={team.team_id} 
                          className={`border-b border-[#F0F8F2] hover:bg-[#F7FAF7] ${index < 3 ? "bg-[#FAFCFA]" : ""}`}
                        >
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              {getRankIcon(index + 1)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-200">
                                <img 
                                  src={team.team_logo} 
                                  alt={team.team_name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-logo.png";
                                  }} 
                                />
                              </div>
                              <span className="font-medium text-gray-800">{team.team_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-yellow-500">
                            {team.gold}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-gray-400">
                            {team.silver}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-amber-700">
                            {team.bronze}
                          </td>
                          <td className="py-3 px-4 text-center font-bold">
                            {calculateTotal(team)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}