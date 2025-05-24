import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import ResultModal from "./modal/ResultModal";
import EventPodium from "./util/EventPodium";
import { useParams } from "react-router-dom";
import { Trophy, Loader, FileDown, Edit, PlusCircle } from "lucide-react";

const ResultPage = () => {
  const { intrams_id, event_id } = useParams();
  const [podiumData, setPodiumData] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventName, setEventName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchPodiumData = async () => {
    try {
      setLoading(true);
      
      // First, fetch the event status
      const eventStatusRes = await axiosClient.get(
        `intramurals/${intrams_id}/events/${event_id}/status`
      );
      setEventStatus(eventStatusRes.data.status);
      
      // Get event name
      const eventResponse = await axiosClient.get(`intramurals/${intrams_id}/events/${event_id}`);
      if (eventResponse.data && eventResponse.data.name) {
        setEventName(eventResponse.data.name);
      }
  
      // Only fetch podium data if status is "completed" or "in progress"
      if (eventStatusRes.data.status === "completed" ) {
        const podiumRes = await axiosClient.get(
          `/intramurals/${intrams_id}/events/${event_id}/podium`
        );
        setPodiumData(podiumRes.data);
      } else {
        setPodiumData(null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch event results.");
    } finally {
      setLoading(false);
    }
  };
  
  // Use effect hook to fetch data when component mounts
  useEffect(() => {
    fetchPodiumData();
  }, [intrams_id, event_id]);

  const handleSubmitResults = async (resultsData) => {
    try {
      setLoading(true);
      const url = `/intramurals/${intrams_id}/events/${event_id}/podium/${podiumData ? "update" : "create"}`;
      const method = podiumData ? axiosClient.patch : axiosClient.post;

      await method(url, resultsData);

      fetchPodiumData();
      return true;
    } catch (err) {
      console.error("Failed to submit results:", err);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Download podium PDF function
  const downloadPodiumPDF = async () => {
    try {
      setIsDownloading(true);
      
      const response = await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/podium_pdf`,
        {},
        { responseType: 'blob' } // Important for handling binary data
      );
      
      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `podium_${event_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      
      } catch (err) {
      console.error("Failed to download podium PDF", err);
      
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine if we should show the action button based on status
  const showActionButton = eventStatus === "completed" || eventStatus === "in progress";

  const renderStatusMessage = () => {
    if (eventStatus !== "pending" || loading) return null;
    
    return (
      <div className="bg-yellow-50 border-yellow-200 flex flex-col w-full border rounded-xl shadow-md p-8 text-center">
        <svg className="w-12 h-12 mx-auto mb-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 className="text-xl font-medium mb-2 text-yellow-700">Event Pending</h3>
        <p className="text-gray-600">This event has not started yet. Results will be available once the event begins.</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container - removed overflow-hidden to allow parent scrolling */}
        <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Trophy size={20} className="mr-2" /> Event Results {eventName && <span className="ml-2 text-gray-600 font-normal">- {eventName}</span>}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Show download button when podium data exists */}
              {podiumData && (
                <button
                  onClick={downloadPodiumPDF}
                  disabled={isDownloading || loading}
                  className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                >
                  {isDownloading ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FileDown size={16} className="mr-2" />
                      Download Podium
                    </>
                  )}
                </button>
              )}
              
              {showActionButton && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
                  disabled={loading || isDownloading}
                >
                  {podiumData ? (
                    <>
                      <Edit size={16} className="mr-2" />
                      Update Result
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} className="mr-2" />
                      Submit Result
                    </>
                  )}
                </button>
              )}
            </div>
          </div>


          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Content area - removed overflow and let parent handle scrolling */}
          <div className="flex flex-1 flex-col">
            {loading ? (
              <div className="flex  justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : podiumData ? (
              <div className="bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <div className="p-6">
                  <EventPodium podiumData={podiumData} />
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col">
                {renderStatusMessage() || (
                  <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                    <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600">No Results Available</h3>
                    <p className="text-gray-500 mt-1">
                      {eventStatus === "in progress" 
                        ? "Click 'Submit Result' to add event results."
                        : "This event has no results yet."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        onSubmit={handleSubmitResults}
        event_id={event_id}
        intrams_id={intrams_id}
        existingData={podiumData}
      />
    </div>
  );
};

export default ResultPage;