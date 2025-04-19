import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Filter from "../../components/Filter";
import PlayerModal from "../../components/admin/PlayerModal";
import PaginationControls from "../../components/PaginationControls";

export default function PlayersPage() {
  const { intrams_id , event_id, participant_id} = useParams();

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
    { label: "Approved", value: "Approved" },
    { label: "Pending", value: "Pending" },
  ];

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

  const fetchPlayers = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/participants/${participant_id}/players`, {
        params: {
          page,
          sport: activeTab,
          search,
        },
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
      console.log(newPlayer);
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/participants/${participant_id}/players/create`, newPlayer);
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
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/participants/${participant_id}/players/${id}/edit?`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
        await axiosClient.delete(`/intramurals/${intrams_id}/events/${event_id}/participants/${participant_id}/players/${id}`);
        await fetchPlayers();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete player");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/intramurals/${intrams_id}/varsity_players/${id}/approve`, {
        approved: !currentStatus,
      });
      await fetchPlayers();
    } catch (err) {
      setError("Failed to update approval status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPlayers(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  const SkeletonLoader = () => (
    <div className="animate-pulse overflow-x-auto">
      <div className="shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{[1, 2, 3, 4, 5, 6, 7].map((i) => <th key={i} className="px-6 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, row) => (
              <tr key={row}>{[1, 2, 3, 4, 5, 6, 7].map((col) => <td key={col} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDownloadLink = (url) => (
    url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View
      </a>
    ) : (
      <span className="text-gray-400">N/A</span>
    )
  );

  return (
    <div className="flex flex-col w-full h-full text-sm">
      <h2 className="text-xl font-semibold mb-2 text-[#006600]">Players</h2>

      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm px-5 py-2.5"
            onClick={openModal}
            disabled={loading}
          >
            Add Player
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

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
          placeholder="Search player name"
          filterOptions={filterOptions}
        />

        {loading ? (
          <SkeletonLoader />
        ) : players.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No players found. Click "Add Player" to create one.</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Cert</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent's Consent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="px-6 py-4">{player.name}</td>
                    <td className="px-6 py-4">{player.id_number}</td>
                    <td className="px-6 py-4">{renderDownloadLink(player.medical_certificate)}</td>
                    <td className="px-6 py-4">{renderDownloadLink(player.parents_consent)}</td>
                    <td className="px-6 py-4">{renderDownloadLink(player.cor)}</td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={() => openEditModal(player)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => deletePlayer(player.id, player.name)}>Delete</button>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={player.approved}
                        onChange={() => toggleApproval(player.id, player.approved)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded"
                      />
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
      />
    </div>
  );
}
