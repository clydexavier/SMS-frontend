import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { Award, Loader, Medal, Trophy } from "lucide-react";
import { GiPodium } from "react-icons/gi";


export default function TSOverallTallyPage() {

  const [loading, setLoading] = useState(true);
  const [tallyData, setTallyData] = useState([]);
  const [error, setError] = useState("");

  const fetchTallyData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/tsecretary/tally`);
      
      setTallyData(data.data);
    } catch (err) {
      console.error("Error fetching tally data:", err);
      setError("Failed to fetch medal tally");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchTallyData();
  }, []);

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
      <div className="space-y-8 w-full h-full flex-1">
        <div className="w-full h-full bg-gray-75 p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-[#2A6D3A] mb-4 flex items-center">
            <Medal size={20} className="mr-2" /> Medal Table
          </h2>
          
          {error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
              {error}
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
              <Loader size={32} className="animate-spin text-[#2A6D3A]" />
            </div>
          ) : tallyData.length === 0 ? (
            <div className="min-w-full flex flex-col bg-white p-8 rounded-xl justify-center items-center text-center shadow-sm border border-[#E6F2E8]">
              <Medal size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600">No medal data available</h3>
              <p className="text-gray-500 mt-1">Medal standings will appear once events are completed</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl border border-[#E6F2E8] shadow-md">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#E6F2E8] bg-[#F7FAF7]">
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
          )}
        </div>
      </div>
    </div>
  );
}