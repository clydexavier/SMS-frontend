import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import IntramuralCard from "../../components/IntramuralCard";
import Filter from "../../components/Filter";
import IntramuralModal from "../../components/admin/IntramuralModal";
import PaginationControls from "../../components/PaginationControls";
import { useLocation, useParams } from "react-router-dom";

export default function IntramuralsPage() {
  const location = useLocation();
  const { id } = useParams();

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in progress" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  const [intramurals, setIntramurals] = useState([]);
  const [selectedIntramural, setSelectedIntramural] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const openModal = () => {
    setSelectedIntramural(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIntramural(null);
    setError(null);
  };
  
  const openEditModal = (intramural) => {
    setSelectedIntramural(intramural);
    setIsModalOpen(true);
  };

  // Instead of calling fetchIntramurals directly, we trigger a refetch
  const addIntramural = async (newIntramural) => {
    try {
      setLoading(true);
      await axiosClient.post("/intramurals/create", newIntramural);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      closeModal();
    } catch (err) {
      setError("Failed to create intramural");
      console.error("Error creating intramural:", err);
      setLoading(false);
    }
  };

  const updateIntramural = async (id, updatedData) => {
    try {
      setLoading(true);
      console.log("Updating intramural with ID:", id);
      console.log("Updated data:", updatedData);
      await axiosClient.patch(`/intramurals/${id}/edit`, updatedData);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      closeModal();
    } catch (err) {
      setError("Failed to update intramural");
      console.error("Error updating intramural:", err);
      setLoading(false);
    }
  };

  const deleteIntramural = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/intramurals/${id}`);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
    } catch (err) {
      setError("Failed to delete intramural");
      console.error("Error deleting intramural:", err);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Single source of truth for data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data } = await axiosClient.get("/intramurals", {
          params: {
            page: pagination.currentPage,
            status: activeTab,
            search: search,
          },
        });
        
        setIntramurals(data.data);
        setPagination({
          currentPage: data.meta.current_page,
          perPage: data.meta.per_page,
          total: data.meta.total,
          lastPage: data.meta.last_page,
        });
      } catch (err) {
        setError("Failed to fetch intramurals");
        console.error("Error fetching intramurals:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, activeTab, pagination.currentPage, shouldRefetch]);

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full h-40 p-4 bg-[#E6F2E8]/50 animate-pulse rounded-lg shadow-sm"
        >
          <div className="w-3/4 h-4 bg-[#E6F2E8]/70 mb-3 rounded" />
          <div className="w-1/2 h-4 bg-[#E6F2E8]/70 mb-2 rounded" />
          <div className="w-full h-2 bg-[#E6F2E8]/70 rounded" />
          <div className="w-5/6 h-2 bg-[#E6F2E8]/70 mt-2 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-lg shadow-sm border border-gray-100 flex flex-col w-full h-full ">
      {/* Header with gradient background <div className="bg-gradient-to-r from-[#1E4D2B] to-[#2A6D3A] px-6 py-4 shadow-md">   </div>*/}
    
      {/* Add Intramural Button Section */}
      <div className="bg-[#F7FAF7] px-6 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Intramurals</h2>

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
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Intramural
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 p-6 bg-[#F7FAF7]">
        {/* Filter Component */}
        <div className="mb-6">
          <Filter
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            search={search}
            setSearch={setSearch}
            placeholder="Search intramural"
            filterOptions={filterOptions}
          />
        </div>

        {/* Content Display Area */}
        {loading ? (
          <SkeletonLoader />
        ) : intramurals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-[#2A6D3A]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="mt-4 text-[#2A6D3A]/70 font-medium">No intramurals found</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Intramural" to create one</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {intramurals.map((intramural) => (
                <div
                  key={intramural.id}
                  className="w-full h-auto"
                >
                  <IntramuralCard
                    intramural={intramural}
                    openEditModal={openEditModal}
                    deleteIntramural={deleteIntramural}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <PaginationControls
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Component */}
      <IntramuralModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addIntramural={addIntramural}
        updateIntramural={updateIntramural}
        existingIntramural={selectedIntramural}
      />
    </div>
  );
}