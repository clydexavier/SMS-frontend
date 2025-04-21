import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import ParticipantCard from "../../components/admin/ParticipantCard";
import ParticipantModal from "../../components/admin/ParticipantModal";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";

export default function ParticipantsPage() {
  const { intrams_id, event_id } = useParams();

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Finalized", value: "yes" },
    { label: "Pending", value: "no" },
  ];

  const [teams, setTeams] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const openModal = () => {
    setSelectedParticipant(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParticipant(null);
    setError(null);
  };

  const openEditModal = (participant) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const fetchParticipants = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `intramurals/${intrams_id}/events/${event_id}/participants`,
        {
          params: {
            page,
            finalized: activeTab,
            search,
          },
        }
      );
      setParticipants(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      setError("Failed to fetch participants");
      console.error(err);
    } finally {
      setLoading(false);
      setPendingPage(null);
    }
  };

  const handlePageChange = (page) => {
    setPendingPage(page);
  };

  const addParticipant = async (newData) => {
    try {
      await axiosClient.post(
        `intramurals/${intrams_id}/events/${event_id}/participants/create`,
        newData
      );
      await fetchParticipants(pagination.currentPage);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to create participant");
    }
  };

  const updateParticipant = async (id, updatedData) => {
    try {
      await axiosClient.patch(
        `intramurals/${intrams_id}/events/${event_id}/participants/${id}/edit`,
        updatedData
      );
      await fetchParticipants(pagination.currentPage);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update participant");
    }
  };

  const deleteParticipant = async (id) => {
    try {
      await axiosClient.delete(
        `intramurals/${intrams_id}/events/${event_id}/participants/${id}`
      );
      await fetchParticipants(pagination.currentPage);
    } catch (err) {
      console.error(err);
      setError("Failed to delete participant");
    }
  };

  const fetchTeamNames = async () => {
    try {
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/team_names`
      );
      setTeams(data);
    } catch (err) {
      console.error("Error fetching team names:", err);
    }
  };

  useEffect(() => {
    if (isModalOpen) fetchTeamNames();
  }, [isModalOpen]);

  useEffect(() => {
    if (!event_id || (pendingPage === null && search === "" && activeTab === "All")) return;

    const debounce = setTimeout(() => {
      fetchParticipants(pendingPage ?? pagination.currentPage);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, activeTab, pendingPage, event_id]);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full h-40 p-4 bg-[#E6F2E8]/50 animate-pulse rounded-lg shadow-sm"
        >
          <div className="w-3/4 h-4 bg-[#E6F2E8]/70 mb-3 rounded" />
          <div className="w-1/2 h-4 bg-[#E6F2E8]/70 mb-2 rounded" />
          <div className="w-full h-2 bg-[#E6F2E8]/70 rounded" />
          <div className="w-5/6 h-2 bg-[#E6F2E8]/70 mt-2 rounded" />
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
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Participant
        </button>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="mb-6">
          <Filter
            activeTab={activeTab}
            setActiveTab={(value) => {
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
              setPendingPage(1);
              setActiveTab(value);
            }}
            search={search}
            setSearch={(value) => {
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
              setPendingPage(1);
              setSearch(value);
            }}
            placeholder="Search participant"
            filterOptions={filterOptions}
          />
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : participants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No participants found. Click "Add Participant" to create one.
          </div>
        ) : (
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {participants.map((participant) => (
                <div key={participant.id} className="w-full h-auto">
                  <ParticipantCard
                    participant={participant}
                    openEditModal={openEditModal}
                    deleteParticipant={deleteParticipant}
                  />
                </div>
              ))}
            </div>

            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <ParticipantModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addParticipant={addParticipant}
        updateParticipant={updateParticipant}
        existingParticipant={selectedParticipant}
        isLoading={loading}
        error={error}
        teams={teams}
      />
    </div>
  );
}
