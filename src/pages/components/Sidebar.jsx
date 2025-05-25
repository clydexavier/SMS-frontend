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
    // Special case for tsecretary parent route - only highlight if exactly on /tsecretary
    if (route === '/tsecretary' && location.pathname !== '/tsecretary') {
      return false;
    }

    // For exact matches (complete URL match)
    if (location.pathname === route) {
      return true;
    }

    // For parent routes (e.g., /admin is active when on /admin/users)
    // Skip this check for tsecretary parent route
    if (route !== '/' && route !== '/tsecretary' && location.pathname.startsWith(route + '/')) {
      return true;
    }

    // For just the last segment of the URL (original behavior)
    const lastSegment = location.pathname.split('/').pop();
    if (lastSegment === route) {
      return true;
    }

    // For dynamic routes with parameters (e.g., /admin/:intrams_id/events)
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const routeSegments = route.split('/').filter(Boolean);
    
    // If route has fewer segments than path (might be a parent route with parameters)
    if (routeSegments.length < pathSegments.length) {
      // Check if all route segments match the beginning of path segments
      // or are parameter placeholders (starting with ':')
      return routeSegments.every((segment, i) => {
        return segment.startsWith(':') || segment === pathSegments[i];
      });
    }

    return false;
  };

  return (
    <nav
      className={`fixed md:relative h-full flex flex-col transition-all duration-300 bg-white border-r border-[#E6F2E8] z-30
      ${isOpen ? "w-64 translate-x-0" : "w-16 md:translate-x-0 -translate-x-full"}`}
      ref={sidebarRef}
      style={{ height: 'calc(100dvh - 4rem)' }} // Subtract header height (4rem = 64px)
    >
      {/* Company Logo/Name - Fixed at top */}
      <div className="p-4 border-b border-[#E6F2E8] flex-shrink-0">
        <div className="flex items-center">
          {/* Circular logo or icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E6F2E8] text-[#2A6D3A]">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="User profile" className="w-8 h-8 rounded-full"/>
            ) : 
              <span className="text-sm font-semibold">{user?.name ? user.name[0] : "U"}</span>
            }
          </div>
          
          {/* User name - only show when sidebar is open */}
          {isOpen && (
            <span className="ml-3 font-medium text-[#2A6D3A]">{user?.name || "User"}</span>
          )}
        </div>
      </div>
      
      {/* Menu Items - Scrollable middle section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="px-2 py-4 space-y-1">
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
      </div>

      {/* User Info & Logout - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
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