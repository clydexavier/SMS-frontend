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

  // Auto-expand menus that contain active routes
  useEffect(() => {
    const newExpandedState = {};
    menuItems.forEach((item, index) => {
      if (item.submenu) {
        const hasActiveChild = item.submenu.some((subItem) =>
          isActiveRoute(subItem.route, true, item.route)
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

  const isActiveRoute = (route, isSubmenuCheck = false, parentRoute = null) => {
    const currentPath = location.pathname;
    
    // Handle empty route
    if (!route) return false;
    
    // Handle root route
    if (route === '/' && currentPath === '/') {
      return true;
    }
    
    // For submenu items
    if (isSubmenuCheck) {
      const pathSegments = currentPath.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      // Direct match of last segment
      if (lastSegment === route) {
        return true;
      }
      
      return false;
    }
    
    // SPECIAL CASES FOR ROLE-BASED ROUTES
    
    // Handle GAM routes
    if (route.startsWith('/GAM/')) {
      if (route === '/GAM/events') {
        return currentPath === '/GAM/events';
      }
      
      if (route === '/GAM/podiums' || route === '/GAM/tally') {
        return currentPath === route;
      }
      
      // For event-specific routes like /GAM/events/123
      if (route.startsWith('/GAM/events/')) {
        return currentPath === route;
      }
    }
    
    // Handle Admin routes
    if (route.startsWith('/admin/')) {
      // For routes like /admin/intramurals - only exact match
      if (route === '/admin/intramurals') {
        return currentPath === '/admin/intramurals';
      }
      
      // For routes with intrams_id like /admin/123/podiums or /admin/123/tally  
      if (route.includes('/podiums') || route.includes('/tally') || route.includes('/events')) {
        return currentPath === route;
      }
      
      // For event-specific routes like /admin/123/events/456
      if (route.includes('/events/')) {
        return currentPath === route;
      }
    }
    
    // Handle Secretariat routes - SPECIAL CASE ADDED
    if (route.startsWith('/secretariat/')) {
      // For routes like /secretariat/intramurals - only exact match
      if (route === '/secretariat/intramurals') {
        return currentPath === '/secretariat/intramurals';
      }
      
      // For routes with intrams_id like /secretariat/123/podiums or /secretariat/123/tally  
      if (route.includes('/podiums') || route.includes('/tally') || route.includes('/events')) {
        return currentPath === route;
      }
      
      // For event-specific routes like /secretariat/123/events/456
      if (route.includes('/events/')) {
        return currentPath === route;
      }
    }
    
    // Handle Scheduler routes
    if (route.startsWith('/scheduler/')) {
      if (route === '/scheduler/intramurals') {
        return currentPath === '/scheduler/intramurals';
      }
      
      if (route.includes('/podiums') || route.includes('/tally') || route.includes('/events')) {
        return currentPath === route;
      }
      
      // For event-specific routes
      if (route.includes('/events/')) {
        return currentPath === route;
      }
    }
    
    // Handle TSecretary routes
    if (route === '/tsecretary' && currentPath !== '/tsecretary') {
      return false;
    }
    
    // For parent menu items - general case
    
    // First check for exact match
    if (currentPath === route) {
      return true;
    }
    
    // If route starts with '/', it's an absolute path
    if (route.startsWith('/')) {
      // For non-role routes that haven't been handled above
      if (!route.startsWith('/GAM/') && 
          !route.startsWith('/admin/') && 
          !route.startsWith('/secretariat/') && 
          !route.startsWith('/scheduler/') &&
          route !== '/tsecretary') {
        
        // Check if current path starts with the route
        if (currentPath.startsWith(route)) {
          // Make sure it's a proper path segment match (not partial)
          if (currentPath === route || currentPath[route.length] === '/') {
            return true;
          }
        }
        
        // Handle dynamic route parameters
        return matchesDynamicRoute(currentPath, route);
      }
    }
    
    // Special handling for routes with variables like /${intrams_id}/events
    if (route.includes('${') || route.includes(':')) {
      return matchesVariableRoute(currentPath, route);
    }
    
    // For relative routes, check if any segment of current path matches
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Check if route matches any segment in the path
    if (pathSegments.includes(route)) {
      // Additional check: make sure we're not highlighting parent when in deeper context
      const routeIndex = pathSegments.indexOf(route);
      
      // If this is not a submenu check and we have more segments after this route,
      // check if we might be in a submenu context
      if (!isSubmenuCheck && routeIndex < pathSegments.length - 1) {
        const remainingSegments = pathSegments.slice(routeIndex + 1);
        // If we have submenu items and the remaining path matches a submenu item, don't highlight parent
        const hasActiveSubmenu = menuItems.some(item => 
          item.submenu && 
          item.submenu.some(subItem => remainingSegments.includes(subItem.route))
        );
        if (hasActiveSubmenu) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  };

  // Helper function to match routes with variables like /${intrams_id}/events
  const matchesVariableRoute = (currentPath, routePattern) => {
    const currentSegments = currentPath.split('/').filter(Boolean);
    
    // Handle role-based patterns
    const rolePatterns = {
      'admin': /^\/admin\/\d+\/events/,
      'secretariat': /^\/secretariat\/\d+\/events/,
      'scheduler': /^\/scheduler\/\d+\/events/
    };
    
    for (const [role, pattern] of Object.entries(rolePatterns)) {
      if (routePattern.includes('${intrams_id}/events') && 
          currentSegments[0] === role && 
          pattern.test(currentPath)) {
        return true;
      }
    }
    
    return false;
  };

  // Helper function to match dynamic routes with parameters
  const matchesDynamicRoute = (currentPath, routePattern) => {
    const currentSegments = currentPath.split('/').filter(Boolean);
    const routeSegments = routePattern.split('/').filter(Boolean);
    
    // If route has more segments than current path, it can't match as a parent
    if (routeSegments.length > currentSegments.length) {
      return false;
    }
    
    // Check if all route segments match (considering :param as wildcards)
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const currentSegment = currentSegments[i];
      
      // Parameter segments (starting with :) match any value
      if (routeSegment.startsWith(':')) {
        continue;
      }
      
      // Regular segments must match exactly
      if (routeSegment !== currentSegment) {
        return false;
      }
    }
    
    return true;
  };

  // Helper function to build the correct link path
  const buildLinkPath = (route, parentRoute = null) => {
    // If route starts with '/', it's absolute
    if (route.startsWith('/')) {
      return route;
    }
    
    // For relative routes, we need to build the path based on current location
    const currentSegments = location.pathname.split('/').filter(Boolean);
    
    // Special handling for different role contexts
    const role = currentSegments[0];
    
    // Handle Admin routes
    if (role === 'admin') {
      // If we're in an event context like /admin/123/events/456
      if (currentSegments.length >= 4 && currentSegments[2] === 'events') {
        const intramsId = currentSegments[1];
        const eventId = currentSegments[3];
        return `/admin/${intramsId}/events/${eventId}/${route}`;
      }
      // If we're in an intramural context like /admin/123
      else if (currentSegments.length >= 2 && !isNaN(currentSegments[1])) {
        const intramsId = currentSegments[1];
        return `/admin/${intramsId}/${route}`;
      }
      // If we're at the top admin level like /admin
      else {
        return `/admin/${route}`;
      }
    }
    
    // Handle Secretariat routes - SPECIAL CASE ADDED
    if (role === 'secretariat') {
      // If we're in an event context like /secretariat/123/events/456
      if (currentSegments.length >= 4 && currentSegments[2] === 'events') {
        const intramsId = currentSegments[1];
        const eventId = currentSegments[3];
        return `/secretariat/${intramsId}/events/${eventId}/${route}`;
      }
      // If we're in an intramural context like /secretariat/123
      else if (currentSegments.length >= 2 && !isNaN(currentSegments[1])) {
        const intramsId = currentSegments[1];
        return `/secretariat/${intramsId}/${route}`;
      }
      // If we're at the top secretariat level like /secretariat
      else {
        return `/secretariat/${route}`;
      }
    }
    
    // Handle other roles
    if (['GAM', 'scheduler'].includes(role)) {
      // For GAM routes
      if (role === 'GAM' && currentSegments.length >= 3 && currentSegments[1] === 'events') {
        const eventId = currentSegments[2];
        return `/GAM/events/${eventId}/${route}`;
      }
      
      // For scheduler routes
      if (role === 'scheduler' && currentSegments.length >= 4 && currentSegments[2] === 'events') {
        const intramsId = currentSegments[1];
        const eventId = currentSegments[3];
        return `/scheduler/${intramsId}/events/${eventId}/${route}`;
      }
      
      // For scheduler intramural level
      if (role === 'scheduler' && currentSegments.length >= 2 && !isNaN(currentSegments[1])) {
        const intramsId = currentSegments[1];
        return `/scheduler/${intramsId}/${route}`;
      }
      
      // Fallback to role-based path
      return `/${role}/${route}`;
    }
    
    // For tsecretary
    if (role === 'tsecretary') {
      return `/tsecretary/${route}`;
    }
    
    // Fallback: build relative to current path
    const basePath = '/' + currentSegments.slice(0, -1).join('/');
    
    if (basePath === '/') {
      return `/${route}`;
    }
    
    return `${basePath}/${route}`;
  };

  // Check if a parent menu item should be highlighted (has active submenu)
  const hasActiveSubmenu = (item) => {
    if (!item.submenu) return false;
    return item.submenu.some(subItem => isActiveRoute(subItem.route, true, item.route));
  };

  return (
    <nav
      className={`fixed md:relative h-full flex flex-col transition-all duration-300 bg-white border-r border-[#E6F2E8] z-30
      ${isOpen ? "w-64 translate-x-0" : "w-16 md:translate-x-0 -translate-x-full"}`}
      ref={sidebarRef}
      style={{ height: 'calc(100dvh - 4rem)' }}
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
                      hasActiveSubmenu(item)
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
                            to={buildLinkPath(subItem.route, item.route)}
                            className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center
                            ${
                              isActiveRoute(subItem.route, true, item.route)
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
                  to={buildLinkPath(item.route)}
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