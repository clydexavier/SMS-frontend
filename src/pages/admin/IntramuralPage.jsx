import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../../components/Sidebar';

import { GrTrophy, GrLocation, GrHistory } from "react-icons/gr";
import { MdOutlinePeopleAlt, MdOutlinePersonAddAlt } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";

const isize = 25;

const menuItems = [
  { icon: <GrTrophy size={isize} color="white" />, label: 'Events', route: 'events' },
  { icon: <GrLocation size={isize} color="white" />, label: 'Venues', route: 'venues' },
  { icon: <MdOutlinePeopleAlt size={isize} color="white" />, label: 'Teams', route: 'teams' },
  { icon: <MdOutlinePersonAddAlt size={isize} color="white" />, label: 'Varsity Players', route: 'vplayers' },
  { icon: <IoDocumentsOutline size={isize} color="white" />, label: 'Documents', route: 'documents' },
  { icon: <GrHistory size={isize} color="white" />, label: 'Log', route: 'logs' },
];

export default function IntramuralPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-200">
      <noscript>
        <strong>
          We're sorry, but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Full-Width Header */}
      <header className="h-16 bg-green-900 text-white flex items-center justify-center shadow-md">
        Intramural Page
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
