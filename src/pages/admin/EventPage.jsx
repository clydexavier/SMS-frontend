import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

import { GrTrophy, GrHistory} from "react-icons/gr";
import { FaSitemap, FaGamepad, FaUsers, FaHistory, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { IoDocumentsOutline, IoMedalOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineScoreboard } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";





export default function EventPage() {
  const location = useLocation();
  const { intrams_id,event_id } = useParams();
  
  const isize = 20;
  const menuItems = [
    { icon: <GrTrophy size={isize} color="black" />, label: "Intramurals", route: "/admin/intramurals" },
    { icon: <IoMedalOutline size={isize} color="black" />, label: 'Events', route: `/${intrams_id}/events` },
    { icon: <LiaSitemapSolid size={isize} color="black" />, label: 'Bracket', route: 'bracket' },
    { icon: <MdOutlineScoreboard size={isize} color="black" />, label: 'Games', route: 'games' },
    { icon: <TbUsersGroup size={isize} color="black" />, label: 'Participants', route: 'participants' },
    { icon: <GrHistory size={isize} color="black" />, label: 'Log', route: 'logs' },
  ];
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto bg-gray-200">
      <noscript>
        <strong className="text-sm sm:text-xs md:text-sm lg:text-sm">
          We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Header */}
      <header className="h-16 bg-green-900 text-white flex items-center justify-between px-6 shadow-md">
        <Link
          to="/admin/intramurals"
          className="hover:text-gray-200 transition-colors text-sm sm:text-xs md:text-sm lg:text-sm"
        >
          Home
        </Link>
        <div className="font-semibold sm:text-sm md:text-md lg:text-lg">
          Event Management
        </div>
        <div></div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 w-full overflow-auto">
        {/* Sidebar (hidden on mobile) */}
        <div className="hidden md:block">
          <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full hover:bg-gray-100" />
        </div>

        <div className="flex-auto overflow-y-auto p-6 bg-green-100 text-sm sm:text-xs md:text-sm lg:text-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
