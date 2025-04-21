import React, { useState, useEffect } from "react";
import Filter from "../../components/Filter";
import VenueModal from "../../components/admin/VenueModal";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function VenuesPage() {
  const { intrams_id } = useParams();

  // State
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Indoor", value: "Indoor" },
    { label: "Outdoor", value: "Outdoor" },
  ];

  const openModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    setError(null);
  };

  const fetchVenues = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/venues`, {
        params: {
          page,
          type: activeTab,
          search,
        },
      });
      setVenues(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      setError("Failed to fetch venues");
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addVenue = async (newVenue) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/venues/create`, newVenue);
      await fetchVenues();
      closeModal();
    } catch (err) {
      setError("Failed to create venue");
      console.error("Error creating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateVenue = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/intramurals/${intrams_id}/venues/${id}/edit`, updatedData);
      await fetchVenues();
      closeModal();
    } catch (err) {
      setError("Failed to update venue");
      console.error("Error updating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteVenue = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      try {
        setLoading(true);
        await axiosClient.delete(`/intramurals/${intrams_id}/venues/${id}`);
        await fetchVenues();
      } catch (err) {
        setError("Failed to delete venue");
        console.error("Error deleting venue:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Debounced fetch
  useEffect(() => {
    setLoading(true);
    setError(null);
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchVenues(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);
  

  const SkeletonLoader = () => {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-[#e0f2f1] rounded w-1/4" />
              <div className="h-4 bg-[#e0f2f1] rounded w-12" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-[#e0f2f1] rounded col-span-1" />
              <div className="h-4 bg-[#e0f2f1] rounded col-span-1" />
              <div className="h-4 bg-[#e0f2f1] rounded col-span-1" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  

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
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Add Venue
        </button>
      </div>
  
      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="mb-6">
          <Filter
            activeTab={activeTab}
            setActiveTab={(value) => {
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
              setActiveTab(value);
            }}
            search={search}
            setSearch={(value) => {
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
              setSearch(value);
            }}
            placeholder="Search venue name"
            filterOptions={filterOptions}
          />
        </div>
  
        {loading ? (
          <SkeletonLoader />
        ) : venues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No venues found. Click "Add Venue" to create one.
          </div>
        ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl mt-4 border border-[#E6F2E8]">
          <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-[#F7FAF7] text-[#2A6D3A] border-b border-[#E6F2E8]">
                <tr>
                  <th className="px-6 py-3 font-medium tracking-wider">Name</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Location</th>
                  <th className="px-6 py-3 font-medium tracking-wider">Type</th>
                  <th className="px-6 py-3 font-medium tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue, idx) => (
                  <tr
                    key={venue.id}
                    className={`border-b border-[#E6F2E8] hover:bg-[#F7FAF7] transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{venue.name}</td>
                    <td className="px-6 py-4">{venue.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          venue.type === "Indoor"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : venue.type === "Outdoor"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {venue.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(venue)}
                        className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVenue(venue.id, venue.name)}
                        className="text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-xs px-4 py-2 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
  
      <VenueModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addVenue={addVenue}
        updateVenue={updateVenue}
        existingVenue={selectedVenue}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
