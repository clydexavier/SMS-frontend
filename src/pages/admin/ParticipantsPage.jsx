import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import ParticipantCard from "../../components/admin/ParticipantCard";
import ParticipantModal from "../../components/admin/ParticipantModal";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";

export default function ParticipantsPage() {
  const {intrams_id, event_id } = useParams();

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Finalized", value: "yes" },
    { label: "Pending", value: "no" },
    // Add more as needed
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
            page: page,
            finalized: activeTab,
            search: search,
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
      await axiosClient.post(`intramurals/${intrams_id}/events/${event_id}/participants/create`, newData);
      await fetchParticipants(pagination.currentPage);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to create participant");
    }
  };

  const updateParticipant = async (id, updatedData) => {
    try {
    console.log(updatedData);
      await axiosClient.patch(`intramurals/${intrams_id}/events/${event_id}/participants/${id}/edit`, updatedData);
      await fetchParticipants(pagination.currentPage);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update participant");
    }
  };

  const deleteParticipant = async (id) => {
    try {
      await axiosClient.delete(`intramurals/${intrams_id}/events/${event_id}/participants/${id}`);
      await fetchParticipants(pagination.currentPage);
    } catch (err) {
      console.error(err);
      setError("Failed to delete participant");
    }
  };
  const fetchTeamNames = async () => {
    try {
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/team_names`);
      setTeams(data);
    } catch (err) {
      console.error("Error fetching team names:", err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchTeamNames();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!event_id || (pendingPage === null && search === "" && activeTab === "all")) return;

    const debounce = setTimeout(() => {
      fetchParticipants(pendingPage ?? pagination.currentPage);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, activeTab, pendingPage, event_id]);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="w-full h-40 p-4 bg-gray-300 animate-pulse rounded-md" />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full text-sm">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Participants</h2>
      </div>

      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm px-5 py-2.5 mb-2"
            onClick={openModal}
            disabled={loading}
          >
            Add Participant
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
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

        {loading ? (
          <SkeletonLoader />
        ) : participants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No participants found. Click "Add Participant" to add one.
          </div>
        ) : (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {participants.map((participant) => (
                <div
                key={participant.id}
                className="w-full h-40 p-4 bg-blue-200 outline outline-1 outline-black rounded-md"
              >
                <ParticipantCard
                  key={participant.id}
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
