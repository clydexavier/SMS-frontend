import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

import { GrTrophy, GrLocation, GrHistory } from "react-icons/gr";
import { MdOutlinePeopleAlt, MdOutlinePersonAddAlt } from "react-icons/md";
import { IoDocumentsOutline, IoMedalOutline } from "react-icons/io5";

const isize = 20;

const menuItems = [
  { icon: <GrTrophy size={isize} color="black" />, label: "Intramurals", route: "/admin/intramurals" },
  { icon: <IoMedalOutline size={isize} color="black" />, label: 'Events', route: 'events' },
  { icon: <GrLocation size={isize} color="black" />, label: 'Venues', route: 'venues' },
  { icon: <MdOutlinePeopleAlt size={isize} color="black" />, label: 'Teams', route: 'teams' },
  { icon: <MdOutlinePersonAddAlt size={isize} color="black" />, label: 'Varsity Players', route: 'vplayers' },
  { icon: <IoDocumentsOutline size={isize} color="black" />, label: 'Documents', route: 'documents' },
  { icon: <GrHistory size={isize} color="black" />, label: 'Log', route: 'logs' },
];

export default function IntramuralPage() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto bg-gray-200">
      <noscript>
        <strong className="text-sm sm:text-xs md:text-sm lg:text-base">
          We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Header */}
      <header className="h-16 bg-green-900 text-white flex items-center justify-between px-6 shadow-md">
        <Link
          to="/admin/intramurals"
          className="hover:text-gray-200 transition-colors text-sm sm:text-xs md:text-sm lg:text-base"
        >
          Home
        </Link>
        <div className="font-semibold sm:text-sm md:text-md lg:text-lg">
          Intramural Page
        </div>
        <div></div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 w-full overflow-auto">
        {/* Sidebar (hidden on mobile) */}
        <div className="hidden md:block">
          <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full hover:bg-gray-100" />
        </div>

        <div className="flex-auto overflow-y-auto p-6 bg-green-100 text-sm sm:text-xs md:text-sm lg:text-base">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
