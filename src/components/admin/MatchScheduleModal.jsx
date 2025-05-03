import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function MatchScheduleModal({
  selectedMatch,
  isOpen,
  onClose,
  submitSchedule,
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDate("");
      setTime("");
    }
  }, [isOpen]);

  if (!isOpen || !selectedMatch) return null;

  const handleSubmit = () => {
    if (!date || !time) {
      alert("Please fill in both date and time.");
      return;
    }

    submitSchedule({
      match_id: String(selectedMatch.id),
      challonge_event_id: String(selectedMatch.tournament_id),
      team1_name: String(selectedMatch.player1_name),
      team2_name: String(selectedMatch.player2_name),
      team_1: String(selectedMatch.player1_id),
      team_2: String(selectedMatch.player2_id),
      date,
      time,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-[#E6F2E8]">
            <h3 className="text-lg font-semibold text-[#2A6D3A]">Set Match Schedule</h3>
            <button
              onClick={onClose}
              className="text-[#2A6D3A]/70 hover:text-[#2A6D3A]"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-[#6BBF59] text-white py-2 px-4 rounded-lg hover:bg-[#5CAF4A] transition"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
