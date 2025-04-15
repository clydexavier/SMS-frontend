import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Filter from "../../components/Filter";
import TeamModal from "../../components/admin/TeamModal";
import PaginationControls from "../../components/PaginationControls";

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
        params: {
          page,
          type: activeTab,
          search,
        },
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
      console.log(newTeam);
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
      console.log(updatedData);
      await axiosClient.post(`/intramurals/${intrams_id}/overall_teams/${id}/edit?`, updatedData, {
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
    <div className="animate-pulse overflow-x-auto">
      <div className="shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{[1, 2, 3].map((i) => <th key={i} className="px-6 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, row) => (
              <tr key={row}>{[1, 2, 3].map((col) => <td key={col} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full text-sm">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Teams</h2>
      </div>
      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm px-5 py-2.5 mb-2"
            onClick={openModal}
            disabled={loading}
          >
            Add Team
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-gray-100 text-gray-900 rounded-lg">
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
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={team.team_logo_path}
                        alt={team.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-logo.png";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => openEditModal(team)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
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
            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
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
