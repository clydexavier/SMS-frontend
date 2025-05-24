import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import axiosClient from '../../axiosClient';

import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineScoreboard } from "react-icons/md";
import logo from '../../assets/vsu_logo.png';
import { MdMenuOpen } from "react-icons/md";

import { Volleyball,Trophy , Medal, House, Users, Shuffle  , FileUser} from "lucide-react";

export default function SecEventPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(true);

  const { intrams_id, event_id } = useParams();
  const isize = 20;
  const menuItems = [
    { icon: <House size={isize} color="black" />, label: "Intramurals", route: "/secretariat/intramurals" },
    { 
      icon: <Volleyball size={isize} color="black" />, 
      label: `${event}`, 
      route: `/${intrams_id}/events`,
      submenu: [
        { icon: <LiaSitemapSolid size={isize} color="black" />, label: 'Bracket', route: 'bracket' },
        { icon: <MdOutlineScoreboard size={isize} color="black" />, label: 'Games', route: 'games' },
        { icon: <Medal size={isize} color="black" />, label: 'Event Result', route: 'result' },

      ]
    },
    
  { icon: <Medal size={isize} color="black" />, label: 'Events Result', route: `/secretariat/${intrams_id}/podiums` },
    { icon: <Trophy size={isize} color="black" />, label: 'Overall Tally', route: `/secretariat/${intrams_id}/tally` },    
    
  ];

  // Skeleton loader component for the page
  const SkeletonLoader = () => (
    <div className="flex flex-1 w-full">
      {/* Skeleton Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
        </div>
        <div className="px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 py-3 px-2 mb-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skeleton Content */}
      <div className="flex-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="shadow-md rounded-xl border border-[#E6F2E8]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F7FAF7]">
                <tr>
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, row) => (
                  <tr key={row}>
                    {[...Array(5)].map((_, col) => (
                      <td key={col} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}`,
      );
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event name:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
      fetchEvent();
  }, [event_id]);  
  
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto bg-gray-200">
      <noscript>
        <strong className="text-sm sm:text-xs md:text-sm lg:text-sm">
          We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Header */}
      <header className="bg-[#1E4D2B] shadow-md h-16 px-4 flex items-center justify-between z-30 relative">
            <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="IHK Logo" className={`h-12 w-40 rounded-full ${isSidebarOpen? "": "hidden"}`} />
            
          </Link>
          {/* Menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#E6F2E8] hover:bg-[#3A8049]/40 p-2 rounded-md mr-2"
          >
            <MdMenuOpen
              size={24}
              className={`duration-300 ${isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 w-full overflow-hidden">
        {/* Mobile Overlay - Only cover the sidebar area when it's open */}
        {isSidebarOpen && (
          <div
            className="fixed md:hidden left-0 top-16 bottom-0 w-64 bg-black bg-opacity-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          menuItems={menuItems}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 bg-white">
          <Breadcrumb/>
          <Outlet />
        </div>
      </main>
    </div>
  );
}