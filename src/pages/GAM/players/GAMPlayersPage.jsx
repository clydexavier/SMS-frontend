// PlayersPage.jsx with automated approval and consistent modals
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import PlayerModal from "./modal/PlayerModal";
import PaginationControls from "../../components/PaginationControls";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import PlayerStatusModal from "./modal/PlayerStatusModal";
import DocumentStatusModal from "./modal/DocumentStatusModal";
import { Users, Loader, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";

export default function GAMPlayersPage() {
  const {  event_id } = useParams();
  const {user} = useAuth();
  const intrams_id = user?.intrams_id;
  const team_id = user?.team_id;

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  // Delete confirmation modal states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Document status modal states
  const [showDocumentStatusModal, setShowDocumentStatusModal] = useState(false);
  const [documentToUpdate, setDocumentToUpdate] = useState(null);
  const [isUpdatingDocument, setIsUpdatingDocument] = useState(false);
  const [documentUpdateError, setDocumentUpdateError] = useState(null);
  
  // Player status modal states
  const [showPlayerStatusModal, setShowPlayerStatusModal] = useState(false);
  const [playerToUpdateStatus, setPlayerToUpdateStatus] = useState(null);
  const [statusAction, setStatusAction] = useState("");
  const [isProcessingStatus, setIsProcessingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  // Teams filter options
  const [filterOptions, setFilterOptions] = useState([
    { label: "All", value: "All" },
  ]);

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

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addPlayer = async (newPlayer) => {
    try {
      setLoading(true);
      
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
      
      await axiosClient.delete(
        `/intramurals/${intrams_id}/events/${event_id}/players/${playerToDelete.id}`
      );
      
      // Close modal and refresh data
      setShowDeleteConfirmation(false);
      await fetchPlayers();
    } catch (err) {
      console.error("Error deleting player:", err);
      setDeleteError(err.response?.data?.message || "Failed to delete player. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open document status modal
  const openDocumentStatusModal = (player, documentType) => {
    setDocumentToUpdate({
      player: player,
      documentType: documentType
    });
    setDocumentUpdateError(null);
    setShowDocumentStatusModal(true);
  };
  
  // Handle document status update
  const handleDocumentStatusUpdate = async (status) => {
    if (!documentToUpdate) return;
    
    try {
      setIsUpdatingDocument(true);
      setDocumentUpdateError(null);
      
      await axiosClient.patch(
        `/intramurals/${intrams_id}/events/${event_id}/players/${documentToUpdate.player.id}/document-status`,
        { 
          document_type: documentToUpdate.documentType,
          status: status 
        }
      );
      
      // Close modal and refresh data
      setShowDocumentStatusModal(false);
      await fetchPlayers();
    } catch (err) {
      console.error("Error updating document status:", err);
      setDocumentUpdateError("Failed to update document status. Please try again.");
    } finally {
      setIsUpdatingDocument(false);
    }
  };
  
  // Open player status modal
  const openPlayerStatusModal = (player, action) => {
    setPlayerToUpdateStatus(player);
    setStatusAction(action);
    setStatusError(null);
    setShowPlayerStatusModal(true);
  };
  
  // Handle player status update
  const handlePlayerStatusUpdate = async (rejectionReason = null) => {
    if (!playerToUpdateStatus || !statusAction) return;
    
    try {
      setIsProcessingStatus(true);
      setStatusError(null);
      
      if (statusAction === "reject") {
        await axiosClient.patch(
          `/intramurals/${intrams_id}/events/${event_id}/players/${playerToUpdateStatus.id}/reject`,
          { rejection_reason: rejectionReason }
        );
      } else if (statusAction === "clear-rejection") {
        await axiosClient.patch(
          `/intramurals/${intrams_id}/events/${event_id}/players/${playerToUpdateStatus.id}/clear-rejection`
        );
      }
      
      // Close modal and refresh data
      setShowPlayerStatusModal(false);
      await fetchPlayers();
    } catch (err) {
      console.error("Error updating player status:", err);
      setStatusError(err.response?.data?.message || "Failed to update player status. Please try again.");
    } finally {
      setIsProcessingStatus(false);
    }
  };

  const fetchPlayers = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/players`,
        {
          params: { 
            page, 
            activeTab,  // for team filtering
            search
          },
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


  useEffect(() => {
    fetchFilterOptions();
  }, [intrams_id]);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPlayers(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  // Helper function to render document status
  const renderDocumentStatus = (status, player, documentType) => {
    if (!status) status = 'pending';
    
    let statusIcon, statusText, statusClass;
    
    switch(status) {
      case 'valid':
        statusIcon = <CheckCircle size={16} className="text-green-600" />;
        statusText = "Valid";
        statusClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case 'invalid':
        statusIcon = <AlertCircle size={16} className="text-red-600" />;
        statusText = "Invalid";
        statusClass = "bg-red-100 text-red-800 border-red-200";
        break;
      default:
        statusIcon = <Clock size={16} className="text-yellow-600" />;
        statusText = "Pending";
        statusClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    
    return (
      <button
        onClick={() => openDocumentStatusModal(player, documentType)}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusClass} hover:opacity-80 transition-opacity`}
      >
        {statusIcon}
        {statusText}
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container - matches EventsPage structure */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
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
          
          {/* Filter section - only team filter and search */}
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
                label="Team"
              />
            </div>
          </div>

          {/* Information about automated approval */}
          <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start text-blue-800">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-medium">Automated Approval System</p>
                <p className="text-sm mt-1">
                  Players are automatically approved when all three documents are marked as valid. 
                  If any document is marked as invalid or pending, the player's status will be changed to pending.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Content area - matches EventsPage structure */}
          <div className="flex flex-1 mt-4 flex flex-col">
            {loading ? (
              <div className="flex justify-center items-center py-16 flex-1">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : players.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8] flex flex-col justify-center">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No players found</h3>
                <p className="text-gray-500 mt-1">Click "Add Player" to create one</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                {/* Table with horizontal scrolling only */}
                <div className="overflow-auto">
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
                          <td className="px-6 py-4">
                            {renderDocumentStatus(player.medical_certificate_status, player, 'medical_certificate')}
                          </td>
                          <td className="px-6 py-4">
                            {renderDocumentStatus(player.parents_consent_status, player, 'parents_consent')}
                          </td>
                          <td className="px-6 py-4">
                            {renderDocumentStatus(player.cor_status, player, 'cor')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div 
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  player.approval_status === 'approved' 
                                    ? "bg-green-100 text-green-800" 
                                    : player.approval_status === 'rejected'
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {player.approval_status === 'approved' ? (
                                  <><CheckCircle size={16} /> Approved</>
                                ) : player.approval_status === 'rejected' ? (
                                  <><AlertCircle size={16} /> Rejected</>
                                ) : (
                                  <><Clock size={16} /> Pending</>
                                )}
                              </div>
                              {player.approval_status === 'rejected' && player.rejection_reason && (
                                <div className="text-xs text-red-600 italic">
                                  Reason: {player.rejection_reason}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                              <button
                                onClick={() => openEditModal(player)}
                                className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-3 py-1.5 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDeletePlayer(player)}
                                className="text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-xs px-3 py-1.5 transition-colors"
                              >
                                Delete
                              </button>
                              
                              {/* Reject/Clear Rejection buttons */}
                              {player.approval_status !== 'rejected' ? (
                                <button
                                  onClick={() => openPlayerStatusModal(player, "reject")}
                                  className="text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-xs px-3 py-1.5 transition-colors"
                                >
                                  Reject
                                </button>
                              ) : (
                                <button
                                  onClick={() => openPlayerStatusModal(player, "clear-rejection")}
                                  className="text-yellow-600 bg-white border border-yellow-200 hover:bg-yellow-50 font-medium rounded-lg text-xs px-3 py-1.5 transition-colors"
                                >
                                  Clear Rejection
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                  <PaginationControls
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                  />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Modal */}
      <PlayerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addPlayer={addPlayer}
        updatePlayer={updatePlayer}
        existingPlayer={selectedPlayer}
        isLoading={loading}
        error={error}
        team_id={team_id}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeletePlayer}
        title="Delete Player"
        itemName={playerToDelete ? playerToDelete.name : ""}
        message={playerToDelete ? 
          `Are you sure you want to delete ${playerToDelete.name}? This action cannot be undone.` 
          : "Are you sure you want to delete this player? This action cannot be undone."
        }
        isDeleting={isDeleting}
        error={deleteError}
      />

      {/* Document Status Modal using the new component */}
      <DocumentStatusModal 
        isOpen={showDocumentStatusModal}
        onClose={() => setShowDocumentStatusModal(false)}
        onUpdate={handleDocumentStatusUpdate}
        player={documentToUpdate?.player}
        documentType={documentToUpdate?.documentType}
        isProcessing={isUpdatingDocument}
        error={documentUpdateError}
      />

      {/* Player Status Modal - for rejecting or clearing rejection */}
      <PlayerStatusModal
        isOpen={showPlayerStatusModal}
        onClose={() => setShowPlayerStatusModal(false)}
        onConfirm={handlePlayerStatusUpdate}
        player={playerToUpdateStatus}
        action={statusAction}
        isProcessing={isProcessingStatus}
        error={statusError}
      />
    </div>
  );
}