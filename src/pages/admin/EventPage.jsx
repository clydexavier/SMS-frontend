import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../../components/Sidebar';

import { FaSitemap, FaGamepad, FaUsers, FaHistory, FaTrophy, FaCalendarAlt } from "react-icons/fa";

const isize = 20;

const menuItems = [
  { icon: <FaTrophy size={isize} color="black" />, label: 'Intramurals', route: '/admin/intramurals' },
  { icon: <FaCalendarAlt size={isize} color="black" />, label: 'Events', route: '/intramural/events' },
  { icon: <FaSitemap size={isize} color="black" />, label: 'Bracket', route: 'bracket' },
  { icon: <FaGamepad size={isize} color="black" />, label: 'Games', route: 'games' },
  { icon: <FaUsers size={isize} color="black" />, label: 'Participants', route: 'participants' },
  { icon: <FaHistory size={isize} color="black" />, label: 'Log', route: 'logs' },
];

export default function EventPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-200">
      <noscript>
        <strong>
          We're sorry, but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Full-Width Header */}
      <header className="h-16 bg-[#003204] text-white flex items-center justify-between px-6 shadow-md">
        <span>Event Management</span>
      </header>

      {/* Main Content: Sidebar & Outlet */}
      <main className="flex flex-1">
        <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full" />
        <div className="flex-1 h-full w-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
