import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import PaginationControls from "../../components/PaginationControls";
import MatchScheduleModal from "../../components/admin/MatchScheduleModal";

export default function GamePage() {
  const { intrams_id, event_id } = useParams();

  const [matches, setMatches] = useState([]);
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

  const fetchMatches = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/matches`,
        {
          params: { page },
        }
      );
      setMatches(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      console.error("Failed to load matches", err);
      setError("Could not load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(pagination.currentPage);
  }, [pagination.currentPage]);

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

  const submitSchedule = async (scheduleData) => {
    try {
      console.log(scheduleData);
      
      console.log(scheduleData.time);
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/schedule/create`, scheduleData);
      alert("Match schedule saved.");
    } catch (err) {
      console.error("Failed to submit match schedule", err);
      alert("Failed to save match schedule.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Bracket Matches</h2>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        {loading ? (
          <div className="text-center text-gray-500">Loading matches...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-500">No matches found.</div>
        ) : (
          <>
            <div className="grid gap-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-[#F7FAF7] transition"
                >
                  <div className="text-sm text-gray-500 font-medium">
                    #{match.suggested_play_order} •{" "}
                    {match.round > 0
                      ? `Round ${match.round}`
                      : match.round === -1
                      ? "Losers 1"
                      : "Losers 2"}
                  </div>
                  <div className="flex items-center gap-2 font-medium text-base text-gray-800">
                    <span>{match.player1_name || "TBD"}</span>
                    <span className="text-gray-400">vs</span>
                    <span>{match.player2_name || "TBD"}</span>
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
        )}
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
