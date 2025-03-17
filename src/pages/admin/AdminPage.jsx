import React from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

// Admin Icons
import { GrTrophy, GrHistory } from "react-icons/gr";

const menuItems = [
  {
    icon: <GrTrophy size={25} color="white" />,
    label: "Intramurals",
    route: "intramurals",
  },
  {
    icon: <GrHistory size={25} color="white" />,
    label: "Log",
    route: "logs",
  },
];

export default function AdminPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-200">
      <noscript>
        <strong>
          We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Full-Width Header */}
      <header className="h-16 bg-green-900 text-white flex items-center justify-center shadow-md">
        Admin Page
      </header>

      {/* Main Content: Sidebar & Outlet */}
      <main className="flex flex-1">
        <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full" />
        <div className="flex-1 h-full w-full p-6 bg-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
