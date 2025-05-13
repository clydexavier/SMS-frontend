import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { Trophy, Loader , Medal} from "lucide-react";

import PodiumCard from "./card/PodiumCard";

export default function PodiumsPage() {
  const { intrams_id } = useParams();

  const [loading, setLoading] = useState(true);
  const [podiums, setPodiums] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Sports", value: "sports" },
    { label: "Music", value: "music" },
    { label: "Dance", value: "dance" },
  ];

  const fetchPodiums = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/podiums`, {
        params: { page, type: activeTab, search },
      });
      setPodiums(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      console.error("Error fetching podiums:", err);
      setError("Failed to fetch podiums");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchPodiums(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="space-y-8 w-full h-full flex-1">
        <div className="flex flex-col w-full h-full bg-gray-75 p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-[#2A6D3A] mb-4 flex items-center">
            <Medal size={20} className="mr-2" /> Events Result
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-md border border-[#E6F2E8]">
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
              placeholder="Search event name"
              filterOptions={filterOptions}
            />
          </div>

          {/* Podiums List / State Handling */}
          <div className="mt-4 flex-1 overflow-y-auto min-h-0">

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader size={32} className="animate-spin text-[#2A6D3A]" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
              {error}
            </div>
          ) : podiums.length === 0 ? (
            <div className="mt-4 flex-1 h-full bg-white p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
              <Medal size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600">No results found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {podiums.map((podium, index) => (
                <div key={index} className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm p-4">
                  <PodiumCard podium={podium} />
                </div>
              ))}
            </div>
          )}
          </div>

          {/* Pagination */}
          {!loading && podiums.length > 0 && (
            <div className="bg-white shadow-md rounded-xl border border-[#E6F2E8] p-2 mt-4 overflow-x-auto">
            <PaginationControls
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
