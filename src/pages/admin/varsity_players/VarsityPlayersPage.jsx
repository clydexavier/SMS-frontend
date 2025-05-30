import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import VarsityPlayerModal from "./modal/VarsityPlayerModal";
import PaginationControls from "../../components/PaginationControls";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { Users, Loader } from "lucide-react";

export default function VarsityPlayersPage() {
  const { intrams_id } = useParams();

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete confirmation modal states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" }
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const openModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setError(null);
  };

  const fetchFilterOptions = async () => {
    try {
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/vplayers_sport`);
      // Assuming the API returns an array of sport names
      const options = [
        { label: "All", value: "All" },
        ...data.data.map(sport => ({ label: sport, value: sport }))
      ];
      setFilterOptions(options);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const fetchPlayers = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/varsity_players`, {
        params: { page, sport: activeTab, search },
      });

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

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addPlayer = async (newPlayer) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/varsity_players/create`, newPlayer);
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
      await axiosClient.patch(`/intramurals/${intrams_id}/varsity_players/${id}/edit`, updatedData);
      await fetchPlayers();
      closeModal();
    } catch (err) {
      setError("Failed to update player");
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const confirmDeletePlayer = (player) => {
    setPlayerToDelete(player);
    setDeleteError(null);
    setShowDeleteConfirmation(true);
  };
  
  // Handle the actual deletion after confirmation
  const handleDeletePlayer = async () => {
    if (!playerToDelete) return;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      await axiosClient.delete(`/intramurals/${intrams_id}/varsity_players/${playerToDelete.id}`);
      
      // Close modal and refresh data
      setShowDeleteConfirmation(false);
      await fetchPlayers();
    } catch (err) {
      console.error("Error deleting player:", err);
      setDeleteError("Failed to delete player. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    // Fetch filter options when component mounts
    if (intrams_id) {
      fetchFilterOptions();
    }
  }, [intrams_id]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPlayers(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container - removed overflow-hidden to allow parent scrolling */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Users size={20} className="mr-2" /> Varsity Players
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

          {/* Content area - removed overflow and let parent handle scrolling */}
          <div className="flex flex-1  flex-col">
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
              <div className="flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                {/* Table with horizontal and vertical scrolling */}
                <div className="overflow-auto flex flex-1">
                  <table className="flex-1 min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8] sticky top-0">
                      <tr>
                        <th className="px-6 py-3 font-medium tracking-wider">Name</th>
                        <th className="px-6 py-3 font-medium tracking-wider">ID Number</th>
                        <th className="px-6 py-3 font-medium tracking-wider">Sport</th>
                        <th className="px-6 py-3 font-medium tracking-wider text-right">Actions</th>
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
                          <td className="px-6 py-4">{player.name}</td>
                          <td className="px-6 py-4">{player.id_number}</td>
                          <td className="px-6 py-4">{player.sport}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(player)}
                              className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDeletePlayer(player)}
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
                <div className="p-2 border-t border-[#E6F2E8] bg-white">
                  
                </div>
              </div>
            )}
          </div>
          <PaginationControls
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                  />
        </div>
      </div>

      {/* Varsity Player Modal */}
      <VarsityPlayerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addPlayer={addPlayer}
        updatePlayer={updatePlayer}
        existingPlayer={selectedPlayer}
        isLoading={loading}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeletePlayer}
        title="Delete Varsity Player"
        itemName={playerToDelete ? playerToDelete.name : ""}
        message={playerToDelete ? 
          `Are you sure you want to delete ${playerToDelete.name}? This action cannot be undone.` 
          : "Are you sure you want to delete this varsity player? This action cannot be undone."
        }
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}