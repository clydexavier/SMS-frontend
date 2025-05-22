import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { Trophy, Loader, Medal, Award, FileDown, FileText } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";

export default function TSPodiumsPage() {
  const {user} = useAuth();
  const intrams_id = user.intrams_id;

  const [loading, setLoading] = useState(true);
  const [podiums, setPodiums] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Sports", value: "sports" },
    { label: "Music", value: "music" },
    { label: "Dance", value: "dance" },
  ];

  const fetchPodiums = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/podiums`, {
        params: { page, type: activeTab, search },
      });
      setPodiums(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      console.error("Error fetching podiums:", err);
      setError("Failed to fetch podiums");
    } finally {
      setLoading(false);
    }
  };

  // Function to download all podium results as PDF
  const downloadPodiumPDF = async () => {
    try {
      setIsDownloading(true);
      
      const response = await axiosClient.post(
        `/intramurals/${intrams_id}/podiums_pdf`,
        {},
        { responseType: 'blob' } // Important for handling binary data
      );
      
      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `podium_results_${intrams_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      
      
      
    } catch (err) {
      console.error("Failed to download podium results PDF", err);
      
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPodiums(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage]);

  // Medal component to display team logo and name
  const MedalWinner = ({ logo, name, count, icon: Icon, color }) => (
    <div className="flex items-center space-x-2">
      
      {count && (
      
      <div className={`p-1 ${color} rounded-full w-8 h-8 text-center`}>
        
          {count}
        
       </div>
      )}
      
      <div className="flex items-center">
        {logo ? (
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-2" 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#E6F2E8] text-[#2A6D3A] flex items-center justify-center mr-2 border border-gray-200">
            <span className="text-xs text-gray-500">{name.charAt(0)}</span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-800 truncate max-w-[10rem]">
          {name || "—"}
        </span>
      </div>
      
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header section with title and download button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Medal size={20} className="mr-2" /> Events Results
            </h2>
            
            {/* Download PDF button - only shown if there are podiums */}
            {!loading && podiums.length > 0 && (
              <button
                onClick={downloadPodiumPDF}
                disabled={isDownloading}
                className={`bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isDownloading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Download All Results
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Download status message */}
          
          
          {/* Filter section */}
          <div className="mb-4">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
              <Filter
                activeTab={activeTab}
                setActiveTab={(value) => {
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  setActiveTab(value);
                }}
                search={search}
                setSearch={(value) => {
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  setSearch(value);
                }}
                placeholder="Search event name"
                filterOptions={filterOptions}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Table container */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : podiums.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Medal size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No results found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                {/* Table with horizontal and vertical scrolling */}
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#F7FAF7] sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2A6D3A] uppercase tracking-wider">
                          Event Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2A6D3A] uppercase tracking-wider">
                          Gold Medalist
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2A6D3A] uppercase tracking-wider">
                          Silver Medalist
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#2A6D3A] uppercase tracking-wider">
                          Bronze Medalist
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {podiums.map((podium, index) => (
                        <tr 
                          key={index}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          {/* Event Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mr-3">
                                <Trophy size={16} className="text-amber-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 max-w-[14rem] truncate">
                                  {podium.event.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {podium.event.category} • {podium.event.type}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Gold Medalist */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <MedalWinner 
                              logo={podium.gold_team_logo} 
                              name={podium.gold_team_name} 
                              count={podium.medals}
                              icon={Trophy} 
                              color="bg-yellow-500" 
                            />
                          </td>

                          {/* Silver Medalist */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <MedalWinner 
                              logo={podium.silver_team_logo} 
                              name={podium.silver_team_name} 
                              count={podium.medals}
                              icon={Medal} 
                              color="bg-gray-400" 
                            />
                          </td>

                          {/* Bronze Medalist */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <MedalWinner 
                              logo={podium.bronze_team_logo} 
                              name={podium.bronze_team_name}
                              count={podium.medals}
                              icon={Award} 
                              color="bg-amber-700" 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {!loading && podiums.length > 0 && (
                  <div className="p-2 overflow-x-auto border-t border-[#E6F2E8] bg-white">
                    <PaginationControls
                      pagination={pagination}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}