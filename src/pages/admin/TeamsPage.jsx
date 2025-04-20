import React, { useState, useEffect } from "react";
import Filter from "../../components/Filter";
import TeamModal from "../../components/admin/TeamModal";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

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
      setError("Failed to fetch teams");
      console.error("Error fetching teams:", err);
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 bg-[#e0f2f1] rounded w-1/4" />
            <div className="h-4 bg-[#e0f2f1] rounded w-12" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-[#e0f2f1] rounded col-span-1" />
            <div className="h-4 bg-[#e0f2f1] rounded col-span-1" />
            <div className="h-4 bg-[#e0f2f1] rounded col-span-1" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          {error && (
            <div className="text-red-500 bg-red-50 px-3 py-1 rounded text-sm">
              {error}
            </div>
          )}
        </div>
        <button
          type="button"
          className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center"
          onClick={openModal}
          disabled={loading}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Add Team
        </button>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7] overflow-auto">
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

        {loading ? (
          <SkeletonLoader />
        ) : teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No teams found. Click "Add Team" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white divide-y divide-gray-200 shadow rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-4">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => openEditModal(team)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => deleteTeam(team.id, team.name)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls pagination={pagination} handlePageChange={handlePageChange} />
          </div>
        )}
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
