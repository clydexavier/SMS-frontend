import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import ResultModal from "../../components/admin/ResultModal";

export default function BracketPage() {
  const { intrams_id, event_id } = useParams();
  const [bracketId, setBracketId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const fetchBracket = async () => {
    try {
      const res = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/bracket`
      );
      setBracketId(res.data.bracket_id);
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

  const handleSubmitResults = async (resultsData) => {
    try {
      await axiosClient.post(
        `/intramurals/${intrams_id}/events/${event_id}/podium/create`,
        resultsData
      );
      setSubmitStatus({
        type: "success",
        message: "Tournament results submitted successfully!"
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      
      return true;
    } catch (err) {
      console.error("Failed to submit results:", err);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit results. Please try again."
      });
      throw err;
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm text-center">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-10 w-1/3 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-300 rounded-lg" />
        <div className="h-[600px] w-full bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Event Bracket</h2>
        <button
          type="button"
          onClick={openModal}
          className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all"
        >
          Submit Results
        </button>
      </div>

      {submitStatus && (
        <div 
          className={`${
            submitStatus.type === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          } border p-3 mx-6 mt-4 rounded-lg text-sm flex items-center justify-between`}
        >
          <div className="flex items-center">
            {submitStatus.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {submitStatus.message}
          </div>
          <button 
            onClick={() => setSubmitStatus(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="mb-6">
          <iframe
            src={`https://challonge.com/${bracketId}/module`}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="auto"
            allowTransparency="true"
            title="Bracket"
          ></iframe>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitResults}
        event_id={event_id}
        intrams_id={intrams_id}
      />
    </div>
  );
}