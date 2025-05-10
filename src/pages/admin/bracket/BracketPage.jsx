import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { Award, Loader } from "lucide-react";

export default function BracketPage() {
  const { intrams_id, event_id } = useParams();
  const [bracketId, setBracketId] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");

  const fetchBracket = async () => {
    try {
      setLoading(true);
      
      // Get bracket data
      const res = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/bracket`
      );
      setBracketId(res.data.bracket_id);
      setEventStatus(res.data.status);
      
      // Get event name
      const eventResponse = await axiosClient.get(`intramurals/${intrams_id}/events/${event_id}`);
      if (eventResponse.data && eventResponse.data.name) {
        setEventName(eventResponse.data.name);
      }
      
      setError(null);
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

  const renderBracketContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
          <Loader size={32} className="animate-spin text-[#2A6D3A]" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
          {error}
        </div>
      );
    }
    
    if (eventStatus === "completed") {
      return (
        <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
          <Award size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600">Event Completed</h3>
          <p className="text-gray-500 mt-1">This event has been completed. Bracket display is for viewing only.</p>
        </div>
      );
    }
    
    if (eventStatus === "pending") {
      return (
        <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
          <Award size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600">Event Pending</h3>
          <p className="text-gray-500 mt-1">The bracket has not started yet. Please go to Team Seeder page to initialize the seeding of teams.</p>
        </div>
      );
    }
    
    if (eventStatus !== "in progress" || !bracketId) {
      return (
        <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
          <Award size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600">No Bracket Available</h3>
          <p className="text-gray-500 mt-1">
            The bracket could not be loaded. Please try again later.
          </p>
        </div>
      );
    }
    
    return (
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E6F2E8] shadow-md overflow-hidden min-h-0">
        <div className="flex-1 overflow-hidden">
          <iframe
            src={`https://challonge.com/${bracketId}/module`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="auto"
            allowtransparency="true"
            title="Bracket"
            className="w-full h-full min-h-[600px]"
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Award size={20} className="mr-2" /> Event Bracket
              {eventName && <span className="ml-2 text-gray-600 font-normal">- {eventName}</span>}
            </h2>
            
            {/* Status indicator */}
            {eventStatus && (
              <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                eventStatus === "pending" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : eventStatus === "in progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
              }`}>
                {eventStatus === "pending" 
                  ? "Pending" 
                  : eventStatus === "in progress"
                    ? "In Progress"
                    : "Completed"}
              </div>
            )}
          </div>

          {/* Manual refresh button (if needed) */}
          {error && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={fetchBracket}
                className="bg-[#E6F2E8] hover:bg-[#D8EBDB] text-[#2A6D3A] px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
            {renderBracketContent()}
          </div>
        </div>
      </div>
    </div>
  );
}