// src/pages/public/components/EventsTab.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Calendar } from 'lucide-react';
import Filter from '../../components/Filter';
import PaginationControls from '../../components/PaginationControls';

export default function EventsTab({ events, onEventSelect }) {
  // Filter and search state
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 6, // 2 rows x 3 columns
    total: 0,
    lastPage: 1,
  });

  // Filter options for event types and status
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Sports", value: "sports" },
    { label: "Dance", value: "dance" },
    { label: "Music", value: "music" },
  ];

  // Filter events based on active tab and search
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by type or status
    if (activeTab !== "all") {
      filtered = filtered.filter(event => 
        event.type?.toLowerCase() === activeTab.toLowerCase() ||
        event.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(event =>
        event.name?.toLowerCase().includes(searchLower) ||
        event.category?.toLowerCase().includes(searchLower) ||
        event.type?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [events, activeTab, search]);

  // Update pagination when filtered events change
  useEffect(() => {
    const total = filteredEvents.length;
    const lastPage = Math.ceil(total / pagination.perPage);
    
    setPagination(prev => ({
      ...prev,
      total,
      lastPage,
      currentPage: Math.min(prev.currentPage, Math.max(1, lastPage))
    }));
  }, [filteredEvents, pagination.perPage]);

  // Get current page events
  const currentEvents = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.perPage;
    const endIndex = startIndex + pagination.perPage;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, pagination.currentPage, pagination.perPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Reset pagination when filters change
  const handleFilterChange = (value, type) => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (type === 'tab') {
      setActiveTab(value);
    } else if (type === 'search') {
      setSearch(value);
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'in progress': return 'text-green-600';
      case 'completed': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Events</h3>
        
        {/* Filter and Search */}
        <Filter
          activeTab={activeTab}
          setActiveTab={(value) => handleFilterChange(value, 'tab')}
          search={search}
          setSearch={(value) => handleFilterChange(value, 'search')}
          placeholder="Search events by name  "
          filterOptions={filterOptions}
        />
        
        {/* Events Content */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              {search || activeTab !== "all" ? "No Events Found" : "No Events Available"}
            </h4>
            <p className="text-gray-500">
              {search || activeTab !== "all" 
                ? "Try adjusting your search terms or filters." 
                : "This intramural currently has no events."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#6BBF59] hover:bg-green-50 transition-all cursor-pointer group"
                  onClick={() => onEventSelect(event)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 group-hover:text-[#2A6D3A] transition-colors">
                      {event.category} {event.name}
                    </h4>
                    <div className="flex items-center">
                      <span className={`text-xs font-medium mr-2 ${getEventStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      <Eye size={16} className="text-gray-400 group-hover:text-[#6BBF59] transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.type}</p>
                  {event.gold && (
                    <div className="text-xs text-gray-500">
                      Medal Value: {event.gold}G {event.silver || 0}S {event.bronze || 0}B
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}