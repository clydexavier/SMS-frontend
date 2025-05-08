import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Filter from "../../components/Filter";
import TeamModal from "../../components/admin/TeamModal";
import PaginationControls from "../../components/PaginationControls";
import { Users, Loader } from "lucide-react";

export default function TeamsPage() {
  const { intrams_id } = useParams();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];

  const openModal = () => {
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const openEditModal = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
    setError(null);
  };

  const fetchTeams = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/overall_teams`, {
        params: { page, type: activeTab, search },
      });
      setTeams(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addTeam = async (newTeam) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/overall_teams/create`, newTeam);
      await fetchTeams();
      closeModal();
    } catch (err) {
      setError("Failed to create team");
      console.error("Error creating team:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/overall_teams/${id}/edit`, updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchTeams();
      closeModal();
    } catch (err) {
      setError("Failed to update team");
      console.error("Error updating team:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      try {
        setLoading(true);
        await axiosClient.delete(`/intramurals/${intrams_id}/overall_teams/${id}`);
        await fetchTeams();
      } catch (err) {
        setError("Failed to delete team");
        console.error("Error deleting team:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchTeams(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Users size={20} className="mr-2" /> Teams
            </h2>
            <button
              type="button"
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium w-full sm:w-auto flex justify-center items-center"
              onClick={openModal}
              disabled={loading}
            >
              Add Team
            </button>
          </div>
          
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
                placeholder="Search team name"
                filterOptions={filterOptions}
              />
            </div>
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
            ) : teams.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No teams found</h3>
                <p className="text-gray-500 mt-1">Click "Add Team" to create one</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                {/* Table with horizontal and vertical scrolling */}
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8] sticky top-0">
                      <tr>
                        <th className="px-6 py-3 font-medium tracking-wider">Logo</th>
                        <th className="px-6 py-3 font-medium tracking-wider">Name</th>
                        <th className="px-6 py-3 font-medium tracking-wider">Type</th>
                        <th className="px-6 py-3 font-medium tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team, idx) => (
                        <tr
                          key={team.id}
                          className={`border-b border-[#E6F2E8] hover:bg-[#F7FAF7] transition duration-200 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <img
                              src={team.team_logo_path}
                              alt={team.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-logo.png";
                              }}
                            />
                          </td>
                          <td className="px-6 py-4">{team.name}</td>
                          <td className="px-6 py-4">{team.type}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(team)}
                              className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTeam(team.id, team.name)}
                              className="text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination with horizontal scroll if needed */}
                <div className="p-2 overflow-x-auto border-t border-[#E6F2E8] bg-white">
                  <PaginationControls
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TeamModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addTeam={addTeam}
        updateTeam={updateTeam}
        existingTeam={selectedTeam}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}