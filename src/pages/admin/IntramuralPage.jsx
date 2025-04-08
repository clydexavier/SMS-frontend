import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import { GrTrophy, GrLocation, GrHistory } from "react-icons/gr";
import { MdOutlinePeopleAlt, MdOutlinePersonAddAlt } from "react-icons/md";
import { IoDocumentsOutline ,IoMedalOutline} from "react-icons/io5";

const isize = 20;

const menuItems = [
  { icon: <GrTrophy size={isize} color="black" />,label: "Intramurals", route: "/admin/intramurals",},
  { icon: <IoMedalOutline size={isize} color="black" />, label: 'Events', route: 'events' },
  { icon: <GrLocation size={isize} color="black" />, label: 'Venues', route: 'venues' },
  { icon: <MdOutlinePeopleAlt size={isize} color="black" />, label: 'Teams', route: 'teams' },
  { icon: <MdOutlinePersonAddAlt size={isize} color="black" />, label: 'Varsity Players', route: 'vplayers' },
  { icon: <IoDocumentsOutline size={isize} color="black" />, label: 'Documents', route: 'documents' },
  { icon: <GrHistory size={isize} color="black" />, label: 'Log', route: 'logs' },
];

export default function IntramuralPage() {
  return (
    <div className="flex flex-col w-full h-full max-w-full max-h-full bg-red-200">
      <noscript>
        <strong>
          We're sorry, but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Full-Width Header */}
      <header className="h-16 bg-[#003204] text-white flex items-center justify-center shadow-md">
      <Link to = "/admin/intramurals">
          Home
        </Link>
        Intramural Page
      </header>

      {/* Main Content: Sidebar & Outlet */}
      <main className="flex flex-1">
        <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full" />
        <div className="flex-1 h-full max-w-full p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
