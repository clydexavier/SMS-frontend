import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function BracketPage() {
  const { intrams_id, event_id } = useParams();
  const [bracketId, setBracketId] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBracket = async () => {
    try {
      const res = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/bracket`
      );
      console.log(res.data.status);
      setBracketId(res.data.bracket_id);
      setEventStatus(res.data.status);
    } catch (err) {
      console.error("Failed to fetch bracket:", err);
      setError("Unable to load bracket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracket();
  }, [intrams_id, event_id]);

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm text-center">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full">
        <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex-1 p-6 bg-[#F7FAF7]">
          <div className="w-full h-[600px] bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">
          Event Bracket
        </h2>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        {eventStatus !== "in progress" ? (
          <div className="text-center text-gray-500 text-sm mt-20">
            {eventStatus === "pending"
              ? "The bracket has not started yet. Please go to Team Seeder page to initialize the seeding of teams."
              : "This event has been completed. Bracket display is for viewing only."}
          </div>
        ) : bracketId ? (
          <div className="mb-6">
            <iframe
              src={`https://challonge.com/${bracketId}/module`}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="auto"
              allowtransparency="true"
              title="Bracket"
            ></iframe>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">No bracket available.</div>
        )}
      </div>
    </div>
  );
}
