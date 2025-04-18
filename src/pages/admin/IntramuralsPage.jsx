import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import IntramuralCard from "../../components/IntramuralCard";
import Filter from "../../components/Filter";
import IntramuralModal from "../../components/admin/IntramuralModal";
import PaginationControls from "../../components/PaginationControls";
import { useLocation } from "react-router-dom";

export default function IntramuralsPage() {
  const location = useLocation();
  const intramural_id = location.state?.intramural_id;

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

  //page states
  const [pendingPage, setPendingPage] = useState(1);
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

  const fetchIntramurals = async () => {
    try {
      setLoading(true);
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

  const handlePageChange = (page) => {
    setPendingPage(page); 
  };

  const addIntramural = async (newIntramural) => {
    try {
      setLoading(true);
      await axiosClient.post("/intramurals/create", newIntramural);
      await fetchIntramurals();
      closeModal();
    } catch (err) {
      setError("Failed to create intramural");
      console.error("Error creating intramural:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateIntramural = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/intramurals/${id}/edit`, updatedData);
      await fetchIntramurals();
      closeModal();
    } catch (err) {
      setError("Failed to update intramural");
      console.error("Error updating intramural:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteIntramural = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/intramurals/${id}`);
      await fetchIntramurals();
    } catch (err) {
      setError("Failed to delete intramural");
      console.error("Error deleting intramural:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //  if (pendingPage === null && search === "" && activeTab === "all") return;
  
    setLoading(true); 
  
    const debounce = setTimeout(() => {
      const pageToFetch = pendingPage ?? pagination.currentPage;
  
      axiosClient
        .get("/intramurals", {
          params: {
            page: pageToFetch,
            status: activeTab,
            search: search,
          },
        })
        .then(({ data }) => {
          setIntramurals(data.data);
          setPagination({
            currentPage: data.meta.current_page,
            perPage: data.meta.per_page,
            total: data.meta.total,
            lastPage: data.meta.last_page,
          });
        })
        .catch((err) => {
          setError("Failed to fetch intramurals");
          console.error("Error fetching intramurals:", err);
        })
        .finally(() => {
          setLoading(false);
          setPendingPage(null);
        });
    }, 500);
  
    return () => clearTimeout(debounce);
  }, [search, activeTab, pendingPage]);
  

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full h-40 p-4 bg-gray-300 animate-pulse rounded-md"
        >
          <div className="w-3/4 h-4 bg-gray-400 mb-3 rounded" />
          <div className="w-1/2 h-4 bg-gray-400 mb-2 rounded" />
          <div className="w-full h-2 bg-gray-400 rounded" />
          <div className="w-5/6 h-2 bg-gray-400 mt-2 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full text-sm sm:text-xs md:text-sm lg:text-sm">
      <div>
        <h2 className="text-xl sm:text-lg md:text-xl font-semibold mb-2 text-[#006600]">
          Intramurals
        </h2>
      </div>

      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm sm:text-xs md:text-sm lg:text-sm px-5 py-2.5 mb-2"
            onClick={openModal}
          >
            Add intramural
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 bg-blue-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search intramural"
          filterOptions={filterOptions}
        />

        {loading ? (
          <SkeletonLoader />
        ) : intramurals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No intramurals found. Click "Add Intramural" to create one.
          </div>
        ) : (
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {intramurals.map((intramural) => (
                <div
                  key={intramural.id}
                  className="w-full h-40 p-4 bg-red-200 outline outline-1 outline-black rounded-md"
                >
                  <IntramuralCard
                    intramural={intramural}
                    openEditModal={openEditModal}
                    deleteIntramural={deleteIntramural}
                  />
                </div>
              ))}
            </div>

            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

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
