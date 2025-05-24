import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home, Loader } from "lucide-react";
import axiosClient from "../../axiosClient";

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
      "GAM": "General Athletics Manager",
      "secretariat": "Secretariat",
      "scheduler": "Scheduler"
    };
    
    return routeNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Determine the current role from the path
  const getCurrentRole = () => {
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      if (["admin", "tsecretary", "GAM", "secretariat", "scheduler"].includes(firstSegment)) {
        return firstSegment;
      }
    }
    return null;
  };
  
  // Fetch intramurals data when needed (for roles that have intrams_id)
  useEffect(() => {
    const role = getCurrentRole();
    const needsIntramurals = ["admin", "secretariat", "scheduler"].includes(role);
    
    if (needsIntramurals && params.intrams_id && !intramurals[params.intrams_id]) {
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

  // Extract event_id from URL path segments regardless of route parameter naming
  const getEventIdFromPath = () => {
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    const eventsIndex = pathSegments.findIndex(segment => segment === 'events');
    
    // If 'events' is found and there's a segment after it
    if (eventsIndex !== -1 && eventsIndex + 1 < pathSegments.length) {
      return pathSegments[eventsIndex + 1];
    }
    return null;
  };

  // Fetch event data based on role and available parameters
  useEffect(() => {
    const eventId = getEventIdFromPath();
    const role = getCurrentRole();
    
    if (eventId && !events[eventId]) {
      setLoading(true);
      
      let eventEndpoint = "";
      
      // Different roles have different ways to access event data
      if (role === "admin" && params.intrams_id) {
        eventEndpoint = `/intramurals/${params.intrams_id}/events/${eventId}`;
      } else if (role === "secretariat" && params.intrams_id) {
        eventEndpoint = `/intramurals/${params.intrams_id}/events/${eventId}`;
      } else if (role === "scheduler" && params.intrams_id) {
        eventEndpoint = `/intramurals/${params.intrams_id}/events/${eventId}`;
      } else if (role === "GAM") {
        // GAM might need a different endpoint since they don't have intrams_id in the path
        // You might need to adjust this based on your API structure
        eventEndpoint = `/GAM/events/${eventId}`;
      } else if (role === "tsecretary") {
        // Tournament Secretary might have their own endpoint
        eventEndpoint = `/tsecretary/event`;
      }
      
      if (eventEndpoint) {
        axiosClient.get(eventEndpoint)
          .then(response => {
            const event = response.data;
            setEvents(prev => ({ 
              ...prev, 
              [eventId]: {
                name: event.name,
                category: event.category
              } 
            }));
          })
          .catch(error => {
            console.error("Error fetching event:", error);
            // If the specific role endpoint fails, you might want to try a generic endpoint
            // or handle this case differently based on your API structure
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [location.pathname, params.intrams_id, getCurrentRole()]);

  // Generate breadcrumb paths and labels
  const breadcrumbs = useMemo(() => {
    const role = getCurrentRole();
    const initialCrumbs = [{ path: "/", label: "Home", clickable: true }];
    
    if (location.pathname === "/") return initialCrumbs;
    
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    const eventId = getEventIdFromPath();
    
    const routeCrumbs = pathSegments.reduce((acc, segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      let label = segment;
      let clickable = true;
      
      // Handle role-specific logic
      if (index === 0 && ["admin", "tsecretary", "GAM", "secretariat", "scheduler"].includes(segment)) {
        // First segment is the role - format it nicely
        label = formatRouteName(segment);
        clickable = true;
      }
      // Handle intramural ID (for roles that have it)
      else if (params.intrams_id === segment && ["admin", "secretariat", "scheduler"].includes(role)) {
        label = intramurals[segment] || "Loading...";
        clickable = true;
      } 
      // Check if this segment is the event ID
      else if (eventId === segment) {
        const event = events[segment];
        label = event ? (event.category ? `${event.category} ${event.name}` : event.name) : "Loading...";
        clickable = true;
      } 
      // For regular route segments
      else {
        label = formatRouteName(segment);
      }
      
      // Don't add empty labels
      if (label && label !== "") {
        acc.push({ path, label, clickable, segment });
      }
      
      return acc;
    }, initialCrumbs);
    
    return routeCrumbs;
  }, [location.pathname, params, intramurals, events, getCurrentRole()]);

  // Don't render if only home breadcrumb
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <ol className="flex items-center flex-wrap text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <li key={`${crumb.path}-${index}`} className="flex items-center">
            {index === 0 ? (
              <Link 
                to={crumb.path} 
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <Home size={16} className="mr-1" />
                <span className="hidden sm:inline">{crumb.label}</span>
              </Link>
            ) : (
              <>
                <ChevronRight size={14} className="mx-2 text-gray-400" />
                {crumb.label === "Loading..." ? (
                  <span className="flex items-center text-gray-500">
                    <Loader size={12} className="animate-spin mr-1" />
                    Loading...
                  </span>
                ) : index === breadcrumbs.length - 1 || !crumb.clickable ? (
                  <span className={`${index === breadcrumbs.length - 1 ? "font-medium text-green-700" : "text-gray-600"}`}>
                    {crumb.label}
                  </span>
                ) : (
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