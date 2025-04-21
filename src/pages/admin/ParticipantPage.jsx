import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

import { GrTrophy, GrHistory} from "react-icons/gr";
import { FaSitemap, FaGamepad, FaUsers, FaHistory, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { IoDocumentsOutline, IoMedalOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineScoreboard } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";


export default function ParticipantPage() {
      const { intrams_id,event_id, participant_id } = useParams();
      const isize = 20;
    const menuItems = [
        { icon: <GrTrophy size={isize} color="black" />, label: "Intramurals", route: "/admin/intramurals" },
        { icon: <IoMedalOutline size={isize} color="black" />, label: 'Events', route: `/${intrams_id}/events` },
            { icon: <TbUsersGroup size={isize} color="black" />, label: 'Participants', route: `/${intrams_id}/events/${event_id}/participants` },
        { icon: <TbUsersGroup size={isize} color="black" />, label: 'Players', route: 'players' },
        { icon: <GrHistory size={isize} color="black" />, label: 'Log', route: 'logs' },
    ];

    return (
        <div className="flex flex-col w-screen h-screen overflow-auto bg-gray-200">
          <noscript>
            <strong className="text-sm sm:text-xs md:text-sm lg:text-sm">
              We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
            </strong>
          </noscript>
    
          {/* Main Content */}
          <main className="flex flex-1 w-full overflow-auto">
            {/* Sidebar (hidden on mobile) */}
            <div className="hidden md:block">
              <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full hover:bg-gray-100" />
            </div>
    
            <div className="flex-auto overflow-y-auto p-6 bg-white-100 text-sm sm:text-xs md:text-sm lg:text-sm">
              <Outlet />
            </div>
          </main>
        </div>
      );
}