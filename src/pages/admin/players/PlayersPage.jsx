// PlayersPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import PlayerModal from "./modal/PlayerModal";
import PaginationControls from "../../components/PaginationControls";
import { Users, Loader } from "lucide-react";

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
        value: team.id.toString(),
      }));
      await setFilterOptions([{ label: "All", value: "All" }, ...dynamicOptions]);
    }
    catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const fetchTeamNames = async () => {
    try {
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/team_names`
      );
      await setTeams(data);
    } catch (err) {
      console.error("Error fetching team names:", err);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, [intrams_id]);

  useEffect(() => {
    if (isModalOpen) fetchTeamNames();
  }, [isModalOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPlayers(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

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
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Users size={20} className="mr-2" /> Players
            </h2>
            <button
              type="button"
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
              onClick={openModal}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Player
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
                placeholder="Search player name"
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
            ) : players.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No players found</h3>
                <p className="text-gray-500 mt-1">Click "Add Player" to create one</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
                {/* Table with horizontal and vertical scrolling */}
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8] sticky top-0">
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
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(player)}
                              className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors mr-2"
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
                          <td className="px-6 py-4 text-right whitespace-nowrap">
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