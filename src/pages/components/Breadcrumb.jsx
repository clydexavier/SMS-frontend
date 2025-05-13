import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home, Loader } from "lucide-react";
import axiosClient from "../../axiosClient";

/**
 * Enhanced Breadcrumb component for nested routing navigation
 * with dynamic data fetching for intramural and event names
 */
const Breadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const [intramurals, setIntramurals] = useState({});
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(false);

  // Format route segments into readable names
  const formatRouteName = (name) => {
    // Handle params (they start with ":")
    if (name.startsWith(":")) return "";
    
    // Handle specific routes with custom names
    const routeNameMap = {
      "admin": "Admin",
      "intramurals": "Intramurals",
      "events": "Events",
      "teams": "Teams",
      "vplayers": "Varsity Players",
      "podiums": "Podiums",
      "tally": "Overall Tally",
      "bracket": "Bracket",
      "games": "Games",
      "players": "Players",
      "gallery": "Gallery",
      "result": "Results",
      "logs": "Logs",
      "seeder": "Team Seeder",
      "tsecretary": "Tournament Secretary",
      "GAM": "Game Affairs Manager",
      "secretariat": "Secretariat"
    };
    
    // Return mapped name or capitalized version of the route segment
    return routeNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // Fetch intramurals data when needed
  useEffect(() => {
    // Check if we need to fetch intramurals data
    if (location.pathname.includes('/admin/') && params.intrams_id && !intramurals[params.intrams_id]) {
      setLoading(true);
      
      axiosClient.get("/intramurals")
        .then(response => {
          const intramuralsData = {};
          response.data.data.forEach(intramural => {
            intramuralsData[intramural.id] = intramural.name;
          });
          setIntramurals(prev => ({ ...prev, ...intramuralsData }));
        })
        .catch(error => {
          console.error("Error fetching intramurals:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.pathname, params.intrams_id]);

  // Fetch events data when needed
  useEffect(() => {
    // Check if we need to fetch events data
    if (location.pathname.includes('/events/') && params.intrams_id && params.event_id && !events[params.event_id]) {
      setLoading(true);
      
      axiosClient.get(`/intramurals/${params.intrams_id}/events`)
        .then(response => {
          const eventsData = {};
          response.data.data.forEach(event => {
            eventsData[event.id] = event.name;
          });
          setEvents(prev => ({ ...prev, ...eventsData }));
        })
        .catch(error => {
          console.error("Error fetching events:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.pathname, params.intrams_id, params.event_id]);

  // Generate breadcrumb paths and labels
  const breadcrumbs = useMemo(() => {
    // Start with home
    const initialCrumbs = [{ path: "/", label: "Home", clickable: true }];
    
    // Skip if we're at the root
    if (location.pathname === "/") return initialCrumbs;
    
    // Split the path into segments and build the breadcrumb array
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    
    // Process the actual URL segments
    const routeCrumbs = pathSegments.reduce((acc, segment, index) => {
      // Build current path
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      
      // Replace parameter values with their actual values
      let label = segment;
      let clickable = true;
      
      // Handle intramural ID
      if (params.intrams_id === segment) {
        // Use the intramural name if available, otherwise use a placeholder
        label = intramurals[segment] || "Loading...";
        // Make the breadcrumb for the intramural details clickable
        clickable = true;
      } 
      // Handle event ID
      else if (params.event_id === segment) {
        // Use the event name if available, otherwise use a placeholder
        label = events[segment] || "Loading...";
        // Make the breadcrumb for the event details clickable
        clickable = true;
      } 
      // For regular route segments
      else {
        label = formatRouteName(segment);
      }
      
      // Only add non-empty labels to avoid empty breadcrumbs
      if (label) {
        acc.push({ path, label, clickable, segment });
      }
      
      return acc;
    }, initialCrumbs);
    
    return routeCrumbs;
  }, [location.pathname, params, intramurals, events]);

  // Don't render if there's only the home breadcrumb
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <ol className="flex items-center flex-wrap text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <li key={`${crumb.path}-${index}`} className="flex items-center">
            {index === 0 ? (
              // Home icon for the first item
              <Link 
                to={crumb.path} 
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <Home size={16} className="mr-1" />
                <span className="hidden sm:inline">{crumb.label}</span>
              </Link>
            ) : (
              // Regular links for other items
              <>
                <ChevronRight size={14} className="mx-2 text-gray-400" />
                {crumb.label === "Loading..." ? (
                  // Show loading spinner when data is being fetched
                  <span className="flex items-center text-gray-500">
                    <Loader size={12} className="animate-spin mr-1" />
                    Loading...
                  </span>
                ) : index === breadcrumbs.length - 1 || !crumb.clickable ? (
                  // Current page or non-clickable item
                  <span className={`${index === breadcrumbs.length - 1 ? "font-medium text-green-700" : "text-gray-600"}`}>
                    {crumb.label}
                  </span>
                ) : (
                  // Intermediate clickable pages
                  <Link 
                    to={crumb.path} 
                    className="hover:text-green-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;