// PlayersPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Filter from "../../components/Filter";
import PlayerModal from "../../components/admin/PlayerModal";
import PaginationControls from "../../components/PaginationControls";

export default function PlayersPage() {
  const { intrams_id, event_id } = useParams();

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const [teams, setTeams] = useState([]);


  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" },
  ]);
  

  const openModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (player) => {
    console.log("COR player:", player.cor);
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setError(null);
  };

  

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addPlayer = async (newPlayer) => {
    try {
      setLoading(true);
      for (let [key, value] of newPlayer.entries()) {
        console.log(key, value);
      }
      
      await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/players/create`,
        newPlayer
      );
      await fetchPlayers();
      closeModal();
    } catch (err) {
      setError("Failed to create player");
    } finally {
      setLoading(false);
    }
  };

  const updatePlayer = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/players/${id}/edit`,
        updatedData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      await fetchPlayers();
      closeModal();
    } catch (err) {
      setError("Failed to update player");
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      try {
        setLoading(true);
        await axiosClient.delete(
          `/intramurals/${intrams_id}/events/${event_id}/players/${id}`
        );
        await fetchPlayers();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete player");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleApproval = async (id, currentStatus, name) => {
    const confirm = window.confirm(
      `Are you sure you want to ${currentStatus ? "mark as pending" : "approve"} ${name}?`
    );
    if (confirm) {
      try {
        setLoading(true);
        await axiosClient.patch(
          `/intramurals/${intrams_id}/events/${event_id}/players/${id}/edit`,
          { approved: currentStatus ? 0 : 1 }
        );
        await fetchPlayers();
      } catch (err) {
        setError("Failed to update approval status");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPlayers = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/players`,
        {
          params: { page, activeTab, search },
        }
      );

      setPlayers(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to fetch players");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const {data} = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/team_names`
      );
      const dynamicOptions = data.map((team) => ({
        label: team.name,
        value: team.id.toString(), // or just team.id if you want it as number
      }));
      await setFilterOptions([{ label: "All", value: "All" }, ...dynamicOptions]);
    }
    catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const fetchTeamNames = async () => {
    try {
      console.log(intrams_id, event_id);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/team_names`
      );
      console.log(intrams_id, event_id);
      await setTeams(data);

    } catch (err) {
      console.error("Error fetching team names:", err);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [intrams_id])

  useEffect(() => {
    if (isModalOpen) fetchTeamNames();
  }, [isModalOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPlayers(pagination.currentPage);

        //fetchTeamNames();
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  const SkeletonLoader = () => (
    <div className="animate-pulse overflow-x-auto">
      <div className="shadow-md rounded-xl border border-[#E6F2E8]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F7FAF7]">
            <tr>
              {[...Array(7)].map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, row) => (
              <tr key={row}>
                {[...Array(7)].map((_, col) => (
                  <td key={col} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDownloadLink = (url) =>
    url ? (
      <a
        href={url}
        className="text-[#2A6D3A] hover:text-[#6BBF59] hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    ) : (
      <span className="text-gray-400">N/A</span>
    );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Players</h2>
        <button
          type="button"
          className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center"
          onClick={openModal}
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Player
        </button>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="mb-6">
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
            placeholder="Search player name"
            filterOptions={filterOptions}
          />
        </div>

        {error && <div className="text-red-600 bg-red-50 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <SkeletonLoader />
        ) : players.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No players found. Click "Add Player" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-[#E6F2E8]">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8]">
                <tr>
                  <th className="px-6 py-3 font-medium tracking-wider">Picture</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Name</th>
                  <th className="px-6 py-3 font-medium tracking-wider">ID Number</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Medical Cert</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Parent's Consent</th>
                  <th className="px-6 py-3 font-medium tracking-wider">COR</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-3 font-medium tracking-wider text-right">Actions</th>
                  <th className="px-6 py-3 font-medium tracking-wider text-right">Approval</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, idx) => (
                  <tr
                    key={player.id}
                    className={`border-b border-[#E6F2E8] hover:bg-[#F7FAF7] transition duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      {player.picture ? (
                        <img
                          src={player.picture}
                          alt={`${player.name}'s photo`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>

                    <td className="px-6 py-4">{player.name}</td>
                    <td className="px-6 py-4">{player.id_number}</td>
                    <td className="px-6 py-4">{renderDownloadLink(player.medical_certificate)}</td>
                    <td className="px-6 py-4">{renderDownloadLink(player.parents_consent)}</td>
                    <td className="px-6 py-4">{renderDownloadLink(player.cor)}</td>
                    <td className="px-6 py-4">
                      <div 
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          player.approved 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {player.approved ? "Approved" : "Pending"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(player)}
                        className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePlayer(player.id, player.name)}
                        className="text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2"> 
                    <button
                        onClick={() => toggleApproval(player.id, player.approved, player.name)}
                        className={`${
                          player.approved
                            ? "text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                            : "text-green-600 border-green-200 hover:bg-green-50"
                        } bg-white border font-medium rounded-lg text-xs px-4 py-2 transition-colors`}
                      >
                        {player.approved ? "Mark Pending" : "Approve"}
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

      <PlayerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addPlayer={addPlayer}
        updatePlayer={updatePlayer}
        existingPlayer={selectedPlayer}
        isLoading={loading}
        error={error}
        teams={teams}
      />
    </div>
  );
}