import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/react.svg';

// Admin Icons
import { MdMenuOpen } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";

export default function Sidebar({ menuItems }) {
  const location = useLocation();
  const user = { name: "Clyde" };
  const [open, setOpen] = useState(false);

  return (
    <nav className={`shadow-md h-full p-2 flex flex-col duration-500 bg-gray-900 border-r border-gray-800 ${open ? 'w-60' : 'w-16'}`}>
      {/* Header */}
      <div className="px-3 py-2 h-20 flex justify-between items-center">
        <img src={logo} alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-md`} />
        <MdMenuOpen size={34} className={`text-white duration-500 cursor-pointer ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)} />
      </div>

      {/* Menu Items */}
      <ul className="flex-1 h-screen">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.route}
              className={`px-3 py-2 my-2 rounded-md duration-300 cursor-pointer flex gap-2 items-center 
              ${location.pathname.split("/").pop() === item.route ? "bg-green-700 text-white font-semibold" : "hover:bg-gray-700 text-gray-300"}`}>
              <div>{item.icon}</div>
              <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
              
            </Link>
          </li>
        ))}

        {/* Logout Option */}
        <li>
          <div className="px-3 py-2 my-2 rounded-md duration-300 cursor-pointer flex gap-2 items-center hover:bg-gray-700 text-gray-300">
            <div><LuLogOut size={30} /></div>
            <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>Logout</p>
          </div>
        </li>
      </ul>

      {/* Footer */}
      <div className="flex items-center gap-2 px-3 py-2">
        <FaRegUserCircle size={30} className="text-gray-300" />
        <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
          <p className="text-white font-semibold">{user?.name}</p>
        </div>
      </div>
    </nav>
  );
}
