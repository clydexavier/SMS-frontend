import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home, Loader } from "lucide-react";
import axiosClient from "../../axiosClient";
import { useAuth } from "../../auth/AuthContext";

const Breadcrumb = () => {
  const {user} = useAuth();
  const location = useLocation();
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

  // Extract parameters from current route
  const getRouteParams = () => {
    const role = getCurrentRole();
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    
    let intrams_id = null;
    let event_id = null;
    
    if (role === "admin") {
      // Admin routes: /admin/:intrams_id/events/:event_id
      if (pathSegments.length >= 2 && pathSegments[1] !== "intramurals" && pathSegments[1] !== "users") {
        intrams_id = pathSegments[1];
      }
      if (pathSegments.length >= 4 && pathSegments[2] === "events") {
        event_id = pathSegments[3];
      }
    } else if (role === "secretariat") {
      // Secretariat routes: /secretariat/:intrams_id/events/:event_id
      if (pathSegments.length >= 2 && pathSegments[1] !== "intramurals") {
        intrams_id = pathSegments[1];
      }
      if (pathSegments.length >= 4 && pathSegments[2] === "events") {
        event_id = pathSegments[3];
      }
    } else if (role === "scheduler") {
      // Scheduler routes: /scheduler/:intrams_id/events/:event_id
      if (pathSegments.length >= 2 && pathSegments[1] !== "intramurals") {
        intrams_id = pathSegments[1];
      }
      if (pathSegments.length >= 4 && pathSegments[2] === "events") {
        event_id = pathSegments[3];
      }
    } else if (role === "GAM") {
      // GAM routes: /GAM/events/:event_id
      if (pathSegments.length >= 3 && pathSegments[1] === "events") {
        event_id = pathSegments[2];
      }
    } else if (role === "tsecretary") {
      // TSecretary routes: /tsecretary (no params in URL)
      // They get their event from their assignment
    }
    
    return { intrams_id, event_id };
  };
  
  // Fetch intramurals data when needed
  useEffect(() => {
    const role = getCurrentRole();
    const { intrams_id } = getRouteParams();
    
    // Only fetch for roles that have intrams_id in their routes
    const needsIntramurals = ["admin", "secretariat", "scheduler"].includes(role);
    
    if (needsIntramurals && intrams_id && !intramurals[intrams_id]) {
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
  }, [location.pathname]);

  // Fetch event data based on role and available parameters
  useEffect(() => {
    const role = getCurrentRole();
    const { intrams_id, event_id } = getRouteParams();
    
    if (event_id && !events[event_id]) {
      setLoading(true);
      
      let eventEndpoint = "";
      
      // Different roles have different ways to access event data
      if (role === "admin" && intrams_id) {
        eventEndpoint = `/intramurals/${intrams_id}/events/${event_id}`;
      } else if (role === "secretariat" && intrams_id) {
        eventEndpoint = `/intramurals/${intrams_id}/events/${event_id}`;
      } else if (role === "scheduler" && intrams_id) {
        eventEndpoint = `/intramurals/${intrams_id}/events/${event_id}`;
      } else if (role === "GAM") {
        // GAM might need a different endpoint since they don't have intrams_id in the path
        eventEndpoint = `/intramurals/${user.intrams_id}/events/${event_id}`;
      }
      
      if (eventEndpoint) {
        axiosClient.get(eventEndpoint)
          .then(response => {
            // Handle different response formats
            let eventData;
            if (typeof response.data === 'string') {
              // If response is just the event name string
              eventData = { name: response.data };
            } else if (response.data.name) {
              // If response is an object with name and possibly category
              eventData = {
                name: response.data.name,
                category: response.data.category
              };
            } else {
              eventData = { name: "Event" };
            }
            
            setEvents(prev => ({ 
              ...prev, 
              [event_id]: eventData
            }));
          })
          .catch(error => {
            console.error("Error fetching event:", error);
            // Set a fallback name
            setEvents(prev => ({ 
              ...prev, 
              [event_id]: { name: "Event" }
            }));
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [location.pathname]);

  // Special handling for TSecretary event data
  useEffect(() => {
    const role = getCurrentRole();
    
    if (role === "tsecretary" && Object.keys(events).length === 0) {
      setLoading(true);
      
      // Fetch TSecretary's assigned event
      axiosClient.get(`/intramurals/${user.intrams_id}/events/${user.event_id}`)
        .then(response => {
          const eventData = response.data;
          // Use a special key for tsecretary event since there's no event_id in URL
          setEvents(prev => ({ 
            ...prev, 
            "tsecretary_event": {
              name: eventData.name || eventData,
              category: eventData.category
            }
          }));
        })
        .catch(error => {
          console.error("Error fetching TSecretary event:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.pathname]);

  // Generate breadcrumb paths and labels
  const breadcrumbs = useMemo(() => {
    const role = getCurrentRole();
    const { intrams_id, event_id } = getRouteParams();
    const initialCrumbs = [{ path: "/", label: "Home", clickable: true }];
    
    if (location.pathname === "/") return initialCrumbs;
    
    const pathSegments = location.pathname.split("/").filter(segment => segment !== "");
    
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
      else if (intrams_id === segment && ["admin", "secretariat", "scheduler"].includes(role)) {
        label = intramurals[segment] || "Loading...";
        clickable = true;
      } 
      // Check if this segment is the event ID
      else if (event_id === segment) {
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

    // Special handling for TSecretary - add event info if available
    if (role === "tsecretary" && events.tsecretary_event) {
      const event = events.tsecretary_event;
      const eventLabel = event.category ? `${event.category} ${event.name}` : event.name;
      
      // Find if we're in a specific tsecretary sub-route
      const currentSegment = pathSegments[pathSegments.length - 1];
      if (["bracket", "result", "podiums", "tally", "games"].includes(currentSegment)) {
        // Insert event name before the current page
        const lastCrumb = routeCrumbs.pop();
        routeCrumbs.push({
          path: "/tsecretary",
          label: eventLabel,
          clickable: false
        });
        routeCrumbs.push(lastCrumb);
      }
    }
    
    return routeCrumbs;
  }, [location.pathname, intramurals, events]);

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
                  <span className={`${index === breadcrumbs.length - 1 ? "font-medium text-green-700" : "text-gray-600"} max-w-[200px] truncate`}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    className="hover:text-green-600 transition-colors max-w-[200px] truncate"
                    title={crumb.label}
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