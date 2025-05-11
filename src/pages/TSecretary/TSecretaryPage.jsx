import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import axiosClient from '../../axiosClient';

import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineScoreboard, MdMenuOpen } from "react-icons/md";
import { GiPodium } from "react-icons/gi";
import logo from '../../assets/IHK_logo2.png';

import { Trophy, Medal, Clipboard, ChartBarIcon, ListChecks, Volleyball } from "lucide-react";

export default function TSecretaryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const isize = 20;
  
  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {

        const { data } = await axiosClient.get('/user');
        console.log(data);
        setUser(data);
        if (data.intrams_id && data.event_id) {
          fetchEvent(data.intrams_id, data.event_id);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch event data
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `tsecretary/event`
      );
      console.log(data);
      setEvent(data);
      console.log("Event data:", data);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const menuItems = [
    { 
      icon: <Volleyball size={isize} color="black" />, 
      label: loading ? "Loading..." : (event.category + " " +event.name || "Event"), 
      route: "/tsecretary",
      submenu: [
        { icon: <MdOutlineScoreboard size={isize} color="black" />, label: 'Games', route: 'games' },
        { icon: <LiaSitemapSolid size={isize} color="black" />, label: 'Bracket', route: 'bracket' },
        { icon: <Medal size={isize} color="black" />, label: 'Result', route: 'result' },
      ],
    },       
    { icon: <GiPodium size={isize} color="black" />, label: 'Podiums', route: 'podiums' },
    { icon: <ChartBarIcon size={isize} color="black" />, label: 'Tally', route: 'tally' },

  ];

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
            <img src={logo} alt="IHK Logo" className={`h-8 w-auto rounded-full ${isSidebarOpen? "": "hidden"}`} />
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