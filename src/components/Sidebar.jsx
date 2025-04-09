import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/react.svg';
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
  const { setUser, setToken, setRole,user } = useStateContext();


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
    <nav className={`overflow-y-auto overflow-x-hidden shadow-md h-full p-2 flex flex-col duration-500 bg-red-200 border-gray-800 ${open ? 'w-60' : 'w-16'}`}>
  {/* Header */}
  <div className="px-3 py-2 h-20 flex justify-between items-center">
    <img src={logo} alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-md`} />
    <MdMenuOpen
      size={25}
      className={`text-black duration-500 cursor-pointer ${!open && 'rotate-180'}`}
      onClick={() => setOpen(!open)}
    />
  </div>

  {/* Menu Items */}
  <ul className="flex-1 h-screen">
    {menuItems.map((item, index) => (
      <li key={index}>
        <Link
          to={item.route}
          className={`px-3 py-2 my-2 rounded-md duration-300 cursor-pointer flex gap-2 items-center 
            ${location.pathname.split("/").pop() === item.route
              ? "bg-[#00a30e] text-white"
              : "hover:bg-gray-400 text-black-300"
            }`}
        >
          <div>
            {React.cloneElement(item.icon, {
              color: location.pathname.split("/").pop() === item.route ? "white" : "black",
            })}
          </div>
          <p
            className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden 
              text-sm sm:text-xs md:text-sm lg:text-sm`}
          >
            {item.label}
          </p>
        </Link>
      </li>
    ))}

    {/* Logout Option */}
    <li>
      <div
        className="px-3 py-2 my-2 rounded-md duration-300 cursor-pointer flex gap-2 items-center hover:bg-gray-700 text-black-300"
        onClick={onLogout}
      >
        <div><LuLogOut className="text-[20px] sm:text-[15px]" /></div>
        <p
          className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden 
            text-sm sm:text-xs md:text-sm lg:text-sm`}
        >
          Logout
        </p>
      </div>
    </li>
  </ul>

  {/* Footer */}
  <div className="flex items-center gap-2 px-3 py-2">
    <FaRegUserCircle className="text-[20px] sm:text-[15px]" />
    <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
      <p className="text-black font-semibold text-sm sm:text-xs md:text-sm lg:text-sm">{user?.name}</p>
    </div>
  </div>
</nav>

  );
}
