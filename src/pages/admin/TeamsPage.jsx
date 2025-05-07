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

  const SkeletonLoader = () => (
    <div className="animate-pulse overflow-x-auto bg-white p-4 rounded-xl shadow-md border border-[#E6F2E8]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {[...Array(4)].map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, row) => (
            <tr key={row}>
              {[...Array(4)].map((_, col) => (
                <td key={col} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="space-y-8 w-full h-full flex-1">
        <div className="flex flex-col w-full h-full bg-gray-75 p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#2A6D3A] mb-4 flex items-center">
              <Users size={20} className="mr-2" /> Teams
            </h2>
            <button
              type="button"
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white p-4 py-3 mb-4 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium"
              onClick={openModal}
              disabled={loading}
            >
              Add Team
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col bg-white p-4 rounded-xl shadow-md border border-[#E6F2E8] flex-grow">
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

          {/* Teams Table / State Handling */}
          {loading ? (
            <SkeletonLoader />
          ) : teams.length === 0 ? (
            <div className="mt-4 flex-1 bg-white p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600">No teams found</h3>
              <p className="text-gray-500 mt-1">Click "Add Team" to create one</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8]">
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
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(team)}
                            className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
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
              
              {/* Pagination */}
              <div className="p-2">
                <PaginationControls
                  pagination={pagination}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          )}
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