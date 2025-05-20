import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../../auth/AuthContext";

// Icons - import what you need
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { PlusCircle, LogOut } from "lucide-react";

export default function Sidebar({ menuItems, isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);

  const onLogout = (ev) => {
    ev.preventDefault();
    logout();
  };

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(true);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    const newExpandedState = {};
    menuItems.forEach((item, index) => {
      if (item.submenu) {
        const hasActiveChild = item.submenu.some((subItem) =>
          location.pathname.includes(subItem.route)
        );
        if (hasActiveChild) {
          newExpandedState[index] = true;
        }
      }
    });
    setExpandedMenus(newExpandedState);
  }, [location.pathname, menuItems]);

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isActiveRoute = (route) => {
    return location.pathname.split("/").pop() === route;
  };

  return (
    <nav
      className={`fixed md:relative overflow-y-auto overflow-x-hidden h-full flex flex-col transition-all duration-300 bg-white border-r border-[#E6F2E8] z-30 max-h-[91vh]
      ${isOpen ? "w-64 translate-x-0" : "w-16 md:translate-x-0 -translate-x-full"}`}
      ref={sidebarRef}
    >
      {/* Company Logo/Name */}
      <div className="p-4 border-b border-[#E6F2E8]">
        <div className="flex items-center">
          {/* Circular logo or icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E6F2E8] text-[#2A6D3A]">
            {user?.picture ? (<img src={user.picture} alt="User profile" className="w-8 h-8 rounded-full"/>) : 
            <span className="text-sm font-semibold">{user?.name ? user.name[0] : "U"}</span>}
          </div>
          
          {/* User name - only show when sidebar is open */}
          {isOpen && (
            <span className="ml-3 font-medium text-[#2A6D3A]">{user?.name || "User"}</span>
          )}
        </div>
      </div>
      

      {/* Menu Items */}
      <ul className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <li key={index} className="mb-1">
            {item.submenu ? (
              <div>
                <div
                  className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-between
                  ${
                    isActiveRoute(item.route)
                      ? "bg-[#6BBF59] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                  }`}
                  onClick={() => toggleSubmenu(index)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6">
                      {React.cloneElement(item.icon, {
                        size: 18,
                        color: "currentColor"
                      })}
                    </div>
                    {isOpen && (
                      <p className="ml-3 text-sm font-medium">
                        {item.label}
                      </p>
                    )}
                  </div>
                  {isOpen && (
                    <MdKeyboardArrowDown
                      className={`transform transition-transform duration-200 ${
                        expandedMenus[index] ? "rotate-180" : ""
                      }`}
                      size={18}
                    />
                  )}
                </div>

                {expandedMenus[index] && isOpen && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={`${index}-${subIndex}`}>
                        <Link
                          to={subItem.route}
                          className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center
                          ${
                            isActiveRoute(subItem.route)
                              ? "bg-[#6BBF59]/70 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                          }`}
                        >
                          <div className="flex items-center justify-center w-5">
                            {React.cloneElement(subItem.icon, {
                              size: 16,
                              color: "currentColor"
                            })}
                          </div>
                          <p className="ml-3 text-sm">
                            {subItem.label}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                to={item.route}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center
                  ${
                    isActiveRoute(item.route)
                      ? "bg-[#6BBF59] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                  }`}
              >
                <div className="flex items-center justify-center w-6">
                  {React.cloneElement(item.icon, {
                    size: 18,
                    color: "currentColor"
                  })}
                </div>
                {isOpen && (
                  <p className="ml-3 text-sm font-medium">
                    {item.label}
                  </p>
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>

      
      {/* User Info & Logout */}
      <div className="border-t border-gray-200 p-4 mt-auto">
        <div 
          className="px-2 py-2 rounded-md cursor-pointer flex items-center text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors"
          onClick={onLogout}
        >
          <div className="flex items-center justify-center w-6">
            <LogOut size={18} color="currentColor" />
          </div>
          {isOpen && (
            <p className="ml-3 text-sm font-medium">Logout</p>
          )}
        </div>
      </div>
    </nav>
  );
}