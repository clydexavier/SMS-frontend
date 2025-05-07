import React from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from '../../assets/vsu_logo.png';

//import ResponsiveDropdown from "../../components/ResponsiveDropdown";
// Admin Icons
import { GrTrophy, GrHistory } from "react-icons/gr";

const menuItems = [
  {
    icon: <GrTrophy className="text-[20px] sm:text-[15px]" color="black" />,
    label: "Intramurals",
    route: "intramurals",
  },
  {
    icon: <GrHistory className="text-[20px] sm:text-[15px]" color="black" />,
    label: "Log",
    route: "logs",
  },
];

export default function AdminPage() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto bg-gray-200">
      <noscript>
        <strong className="text-sm sm:text-xs md:text-sm lg:text-sm">
          We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

     
      {/* Header 
      <header className="h-16 bg-gradient-to-r from-[#1E4D2B] to-[#2A6D3A] text-white flex items-center justify-between px-6 shadow-md">
   
      <Link
        to="/admin/intramurals"
        className="hover:text-gray-200 transition-colors text-sm sm:text-xs md:text-sm lg:text-sm h-full flex items-center"
      >
        <img src={logo} alt="vsu logo" className="h-full object-contain" />
      </Link>

      <div className="font-semibold sm:text-sm md:text-md lg:text-lg">
       
      </div>
      
      <div></div>
    </header>
    */}


      {/* Responsive Dropdown - Only shows on mobile 
      <div className="md:hidden w-full px-4 py-2 bg-gray-900">
        <ResponsiveDropdown title="Your Tournaments" items={menuItems} />
      </div>*/}

      {/* Main Content */}
      <main className="flex flex-1 w-full overflow-auto">
        {/*  Sidebar for medium and up */}
        <div className="hidden md:block">
          <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full hover:bg-gray-100" />
        </div>

        <div className="flex-auto rounded-lg overflow-y-auto p-6 bg-white-200 text-sm sm:text-xs md:text-sm lg:text-sm">
          <Outlet />
        </div>
      </main>
    </div>

  );
}
