import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import ResultModal from "../../components/admin/ResultModal";
import EventPodium from "../../components/admin/EventPage/EventPodium";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  const { intrams_id, event_id } = useParams();
  const [podiumData, setPodiumData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPodiumData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}/podium`
      );
      console.log(response.data);
      setPodiumData(response.data);
    } catch (err) {
      console.error("Error fetching podium data:", err);
      setError("Failed to fetch tournament results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodiumData();
  }, [event_id, intrams_id]);

  const handleSubmitResults = async (resultsData) => {
    try {
      setLoading(true);
      console.log(resultsData);
      const url = `/intramurals/${intrams_id}/events/${event_id}/podium/${podiumData ? "update" : "create"}`;
      const method = podiumData ? axiosClient.patch : axiosClient.post;
  
      await method(url, resultsData);
  
      setSubmitStatus({
        type: "success",
        message: podiumData
          ? "Event results updated successfully!"
          : "Event results submitted successfully!",
      });
  
      setTimeout(() => setSubmitStatus(null), 5000);
      fetchPodiumData();
      return true;
    } catch (err) {
      console.error("Failed to submit results:", err);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit results. Please try again.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  

  const SkeletonLoader = () => (
    <div className="w-full h-64 p-4 bg-[#E6F2E8]/50 animate-pulse rounded-lg shadow-sm">
      <div className="flex justify-center items-end h-full">
        {[32, 40, 24].map((h, idx) => (
          <div
            key={idx}
            className={`w-24 h-${h} bg-[#E6F2E8]/70 mx-2 rounded-t`}
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">
            Event Result
          </h2>
          {submitStatus && (
            <div
              className={`mt-2 px-3 py-1 rounded text-sm ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center"
          disabled={loading}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {podiumData ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            )}
          </svg>
          {podiumData ? "Edit Result" : "Submit Result"}
        </button>
      </div>

      <div className="flex-auto overflow-y-auto p-6 bg-[#F7FAF7]">
        {loading ? (
          <SkeletonLoader />
        ) : podiumData ? (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-full overflow-hidden">
            <div className="w-full">
              <EventPodium podiumData={podiumData} />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
            No results submitted yet. Click "Submit Result" to add tournament
            results.
          </div>
        )}
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
