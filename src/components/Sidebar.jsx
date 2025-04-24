import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/IHK_logo2.png';
import React from "react";
import axiosClient from "../axiosClient";

import { useStateContext } from "../context/ContextProvider";
// Admin Icons
import { MdMenuOpen } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";

export default function Sidebar({ menuItems }) {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const { setUser, setToken, setRole, user } = useStateContext();

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await axiosClient.get('/logout');
      setUser(null);
      setToken(null);
      setRole(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => setUser(data))
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  return (
    <nav className={`overflow-y-auto overflow-x-hidden h-full flex flex-col duration-500 bg-gradient-to-b from-[#1E4D2B] to-[#2A6D3A] ${open ? 'w-64' : 'w-20'}`}>
      {/* Header */}
      <div className="px-4 py-6 flex justify-between items-center border-b border-[#3A8049]/30">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-full transition-all duration-300`} />
          {open && <span className="ml-3 text-[#E6F2E8] font-medium">Intramurals</span>}
        </div>
        <MdMenuOpen
          size={22}
          className={`text-[#E6F2E8] duration-500 cursor-pointer hover:bg-[#3A8049]/30 rounded-full p-1 box-content ${!open && 'rotate-180'}`}
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Menu Items */}
      <ul className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.route}
              className={`px-4 py-3 rounded-lg duration-300 cursor-pointer flex items-center
                ${location.pathname.split("/").pop() === item.route
                ? "bg-[#6BBF59] text-white shadow-md"
                : "text-[#E6F2E8] hover:bg-[#3A8049]/40"
              }`}
            >
              <div className="flex items-center justify-center w-6">
                {React.cloneElement(item.icon, {
                  size: 18,
                  color: location.pathname.split("/").pop() === item.route ? "white" : "#E6F2E8",
                })}
              </div>
              {open && (
                <p className="ml-3 text-sm font-medium transition-all duration-300">
                  {item.label}
                </p>
              )}
            </Link>
          </li>
        ))}
        <li>
        <div
          className="px-4 py-2 rounded-lg cursor-pointer flex items-center hover:bg-[#3A8049]/40 text-[#E6F2E8] transition-all duration-300"
          onClick={onLogout}
        >
          <div className="flex items-center justify-center w-6">
            <LuLogOut size={18} />
          </div>
          {open && <p className="ml-3 text-sm font-medium">Logout</p>}
        </div>
        </li>
      </ul>
      

      {/* User Profile & Logout */}
      <div className="border-t border-[#3A8049]/30 p-4">
        <div className="flex items-center mb-4">
          <div className="bg-[#E6F2E8]/10 p-2 rounded-full">
            <FaRegUserCircle className="text-[#E6F2E8]" size={18} />
          </div>
          {open && (
            <div className="ml-3 overflow-hidden">
              <p className="text-[#E6F2E8] font-medium text-sm truncate">{user?.name || "User"}</p>
            </div>
          )}
        </div>
        
        
      </div>
    </nav>
  );
}