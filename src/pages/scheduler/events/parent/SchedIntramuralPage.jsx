import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Breadcrumb from '../../../components/Breadcrumb';
import logo from '../../../../assets/vsu_logo.png';
import { useState } from 'react';
import { MdMenuOpen } from "react-icons/md";


import { Volleyball,Trophy , Medal, House, Users, UserPlus } from "lucide-react";


const isize = 20;

const menuItems = [
  { icon: <House size={isize} color="black" />, label: "Intramurals", route: "/scheduler/intramurals" },
  { icon: <Volleyball size={isize} color="black" />, label: 'Events', route: 'events' },
  //{ icon: <IoDocumentsOutline size={isize} color="black" />, label: 'Documents', route: 'documents' },
  { icon: <Medal size={isize} color="black" />, label: 'Podium Results', route: 'podiums' },
  { icon: <Trophy size={isize} color="black" />, label: 'Overall Tally', route: 'tally' },
];

export default function SchedIntramuralPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col w-screen h-dvh overflow-auto bg-gray-200">
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

        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-50 bg-white">
        <Breadcrumb/>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
