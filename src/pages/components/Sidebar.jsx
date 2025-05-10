import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../../auth/AuthContext"; // Import the useAuth hook

// Icons
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { LogOut } from "lucide-react";

export default function Sidebar({ menuItems, isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { user, logout } = useAuth(); // Use the auth context
  const sidebarRef = useRef(null);

  const onLogout = (ev) => {
    ev.preventDefault();
    logout(); // Use the logout function from AuthContext
  };

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
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
    <>
      {/* Sidebar navigation */}
      <nav
        className={`fixed md:relative overflow-y-auto overflow-x-hidden h-full z-30 flex flex-col transition-all duration-300 bg-gradient-to-b from-[#1E4D2B] to-[#2A6D3A]
        ${isOpen ? "w-64 translate-x-0" : "w-0 md:w-0 -translate-x-full md:translate-x-0"}`}
        ref={sidebarRef}
      >
        {/* Menu Items */}
        <ul className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index} className="mb-1">
              {item.submenu ? (
                <div>
                  <div
                    className={`px-4 py-3 rounded-lg duration-300 cursor-pointer flex items-center justify-between
                    ${
                      isActiveRoute(item.route)
                        ? "bg-[#6BBF59] text-white shadow-md"
                        : "text-[#E6F2E8] hover:bg-[#3A8049]/40"
                    }`}
                    onClick={() => toggleSubmenu(index)}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-6">
                        {React.cloneElement(item.icon, {
                          size: 18,
                          color: isActiveRoute(item.route)
                            ? "white"
                            : "#E6F2E8",
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
                        color="#E6F2E8"
                      />
                    )}
                  </div>

                  {expandedMenus[index] && isOpen && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={`${index}-${subIndex}`}>
                          <Link
                            to={subItem.route}
                            className={`px-4 py-2 rounded-lg duration-300 cursor-pointer flex items-center
                            ${
                              isActiveRoute(subItem.route)
                                ? "bg-[#6BBF59]/70 text-white shadow-md"
                                : "text-[#E6F2E8] hover:bg-[#3A8049]/30"
                            }`}
                          >
                            <div className="flex items-center justify-center w-6">
                              {React.cloneElement(subItem.icon, {
                                size: 16,
                                color: isActiveRoute(subItem.route)
                                  ? "white"
                                  : "#E6F2E8",
                              })}
                            </div>
                            <p className="ml-3 text-sm font-medium">
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
                  className={`px-4 py-3 rounded-lg duration-300 cursor-pointer flex items-center
                    ${
                      isActiveRoute(item.route)
                        ? "bg-[#6BBF59] text-white shadow-md"
                        : "text-[#E6F2E8] hover:bg-[#3A8049]/40"
                    }`}
                >
                  <div className="flex items-center justify-center w-6">
                    {React.cloneElement(item.icon, {
                      size: 18,
                      color: isActiveRoute(item.route)
                        ? "white"
                        : "#E6F2E8",
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

          {/* Logout */}
          <li>
            <div
              className="px-4 py-3 rounded-lg cursor-pointer flex items-center hover:bg-[#3A8049]/40 text-[#E6F2E8] transition-all duration-300"
              onClick={onLogout}
            >
              <div className="flex items-center justify-center w-6">
                <LogOut size={18} />
              </div>
              {isOpen && (
                <p className="ml-3 text-sm font-medium">Logout</p>
              )}
            </div>
          </li>
        </ul>

        {/* User Info */}
        <div className="border-t border-[#3A8049]/30 p-4">
          <div className="flex items-center mb-4">
            <div className="bg-[#E6F2E8]/10 p-2 rounded-full">
              <FaRegUserCircle className="text-[#E6F2E8]" size={18} />
            </div>
            {isOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-[#E6F2E8] font-medium text-sm truncate">
                  {user?.name || "User"}
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}