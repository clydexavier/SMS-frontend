import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import UserCard from "./card/UserCard";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useLocation } from "react-router-dom";
import { Users, Loader } from "lucide-react";

export default function UsersPage() {
  const location = useLocation();

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "GAM", value: "GAM" },
    { label: "Tournament Secretary", value: "tsecretary" },
    { label: "Secretariat", value: "secretariat" },
    { label: "User", value: "user" },
  ];

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination states
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  
  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const updateUserRole = async (id, role) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/users/${id}/role`,  role );
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
    } catch (err) {
      setError("Failed to update user role");
      console.error("Error updating user role:", err);
      setLoading(false);
    }
  };
  
  // Add handler for user deletion
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/users/${id}`);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
      setLoading(false);
    }
  };

  const handleFilterChange = (value, type) => {
    // Reset pagination to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (type === 'tab') {
      setActiveTab(value);
    } else if (type === 'search') {
      setSearch(value);
    }
  };

  // Single source of truth for data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data } = await axiosClient.get("/users", {
          params: {
            page: pagination.currentPage,
            role: activeTab !== "all" ? activeTab : null,
            search: search,
          },
        });
        
        setUsers(data.data);
        setPagination({
          currentPage: data.meta.current_page,
          perPage: data.meta.per_page,
          total: data.meta.total,
          lastPage: data.meta.last_page,
        });
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
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

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Users size={20} className="mr-2" /> User Management
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
            <Filter
              activeTab={activeTab}
              setActiveTab={(value) => handleFilterChange(value, 'tab')}
              search={search}
              setSearch={(value) => handleFilterChange(value, 'search')}
              placeholder="Search users by name or email"
              filterOptions={filterOptions}
            />
          </div>

          {/* Scrollable content area */}
          <div className="mt-4 flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : users.length === 0 ? (
              <div className="mt-4 flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No users found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm">
                    <UserCard
                      user={user}
                      updateUserRole={updateUserRole}
                      deleteUser={deleteUser}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination in a fixed position at the bottom */}
          {!loading && users.length > 0 && (
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