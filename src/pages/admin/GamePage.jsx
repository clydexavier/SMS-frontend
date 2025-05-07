import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import PaginationControls from "../../components/PaginationControls";
import MatchScheduleModal from "../../components/admin/MatchScheduleModal";

export default function GamePage() {
  const { intrams_id, event_id } = useParams();

  const [schedules, setSchedules] = useState([]);
  const [eventStatus, setEventStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchEventStatus = async () => {
    try {
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/status`);
      console.log("Event status:", data);

      setEventStatus(data); // expected to be 'pending', 'in_progress', or 'completed'
    } catch (err) {
      console.error("Failed to fetch event status", err);
      setError("Could not load event status.");
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/schedule`
      );
      setSchedules(data);
      setPagination((prev) => ({
        ...prev,
        total: data.length,
        lastPage: Math.ceil(data.length / prev.perPage),
      }));
    } catch (err) {
      console.error("Failed to load schedules", err);
      setError("Could not load schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEventStatus();
      fetchSchedules();
    };
    
    loadData();
  }, []);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const openScoreModal = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const submitSchedule = async (id, scheduleData) => {
    try {
      await axiosClient.patch(
        `/intramurals/${intrams_id}/events/${event_id}/schedule/${id}/edit`,
        scheduleData
      );
      fetchSchedules(); // refresh the list
    } catch (err) {
      console.error("Failed to update match schedule", err);
      alert("Failed to update match schedule.");
    }
  };

  const currentItems = schedules.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  // Render content based on loading, error, and event status
  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading matches...</div>;
    }
    
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }

    if (eventStatus === "completed") {
      return (
        <div className="text-center text-gray-500">
          This event has been completed. No matches to show.
        </div>
      );
    }

    if (eventStatus === "pending") {
      return (
        <div className="text-center text-gray-500">
          This event is pending. Matches will appear once the event begins.
        </div>
      );
    }

    if (eventStatus === "in progress") {
      if (currentItems.length === 0) {
        return <div className="text-center text-gray-500">No matches found.</div>;
      }

      return (
        <>
          <div className="grid gap-4">
            {currentItems.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-[#F7FAF7] transition"
              >
                <div className="text-sm text-gray-500 font-medium">
                  Match ID: {match.match_id}
                </div>
                <div className="flex items-center gap-2 font-medium text-base text-gray-800">
                  <span>{match.team1_name || "TBD"}</span>
                  <span className="text-gray-400">vs</span>
                  <span>{match.team2_name || "TBD"}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {match.date && match.time
                    ? new Date(`${match.date}T${match.time}`).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "TBA"}
                </div>

                <button
                  onClick={() => openScoreModal(match)}
                  className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                >
                  Set Schedule
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        </>
      );
    }

    // Fallback for unexpected status
    return <div className="text-center text-gray-500">Event status: {eventStatus || "Unknown"}</div>;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">
          Bracket Matches
        </h2>
        {eventStatus === "in_progress" && (
          <button
            type="button"
            className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all"
          >
            Generate
          </button>
        )}
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        {renderContent()}
      </div>

      {isModalOpen && selectedMatch && (
        <MatchScheduleModal
          isOpen={isModalOpen}
          selectedMatch={selectedMatch}
          onClose={closeModal}
          submitSchedule={submitSchedule}
        />
      )}
    </div>
  );
}