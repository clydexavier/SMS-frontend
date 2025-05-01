import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";

export default function GalleryPage() {
  const { intrams_id, event_id } = useParams();

  const [galleries, setGalleries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const [filterOptions, setFilterOptions] = useState([{ label: "All", value: "All" }]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const fetchGalleries = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/galleries`, {
        params: { page, search, team_id: activeTab !== "All" ? activeTab : null },
      });

      setGalleries(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamOptions = async () => {
    try {
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/team_names`);
      const dynamicOptions = data.map((team) => ({
        label: team.name,
        value: team.id.toString(),
      }));
      setFilterOptions([{ label: "All", value: "All" }, ...dynamicOptions]);
    } catch (err) {
      console.error("Error fetching team options:", err);
    }
  };

  useEffect(() => {
    if (intrams_id) {
      fetchTeamOptions();
    }
  }, [intrams_id]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchGalleries(pagination.currentPage);
      }
    }, 800);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-lg shadow-md border border-[#E6F2E8] flex justify-between items-center"
        >
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );

  const renderFileView = (file) =>
    file ? (
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#2A6D3A] hover:text-[#6BBF59] underline text-sm"
      >
        View File
      </a>
    ) : (
      <span className="text-gray-400 text-sm">No File</span>
    );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Gallery</h2>
        <button
          type="button"
          className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all"
        >
          Generate Gallery
        </button>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="mb-6">
          <Filter
            activeTab={activeTab}
            setActiveTab={(val) => {
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
              setActiveTab(val);
            }}
            search={search}
            setSearch={(val) => {
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
              setSearch(val);
            }}
            placeholder="Search team name"
            filterOptions={filterOptions}
          />
        </div>

        {error && <div className="text-red-600 bg-red-50 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <SkeletonLoader />
        ) : galleries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No gallery entries found.
          </div>
        ) : (
          <div className="space-y-4">
            <h3>
              xd
            </h3>
            <PaginationControls pagination={pagination} handlePageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
