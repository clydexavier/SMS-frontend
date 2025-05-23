import React, { useState, useEffect } from "react";
import { Trophy, Users, Flag, X, Loader, Search } from "lucide-react";
import axiosClient from "../../../../axiosClient";

export default function AssignmentModal({ 
  show, 
  onClose, 
  selectedRole, 
  userId, 
  updateUserRole 
}) {
  // States for assignments
  const [intramurals, setIntramurals] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    intrams_id: null,
    team_id: null,
    event_id: null
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (show) {
      fetchIntramurals();
      // Reset form when modal is opened
      setAssignmentData({
        intrams_id: null,
        team_id: null,
        event_id: null
      });
      setValidationErrors({});
      setEventSearchTerm("");
    }
  }, [show]);

  // Filter events based on search term
  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(event => {
        const eventName = (event.name || event.title || "").toLowerCase();
        return eventName.includes(eventSearchTerm.toLowerCase());
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents([]);
    }
  }, [events, eventSearchTerm]);

  // Fetch intramurals for initial assignment selection
  const fetchIntramurals = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/intramurals');
      setIntramurals(response.data.data || []);
    } catch (error) {
      console.error("Error fetching intramurals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch teams based on selected intramural
  const fetchTeams = async (intrams_id) => {
    if (!intrams_id) return;
    
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/intramurals/${intrams_id}/team_names`);
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events based on selected intramural
  const fetchEvents = async (intrams_id) => {
    if (!intrams_id) return;
    
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/intramurals/${intrams_id}/useful_events`);
      const eventsData = response.data.data || [];
      setEvents(eventsData);
      setEventSearchTerm(""); // Reset search when new events are loaded
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntramSelection = async (intrams_id) => {
    setAssignmentData(prev => ({
      ...prev,
      intrams_id,
      // Reset dependent fields
      team_id: null,
      event_id: null
    }));
    
    // Clear validation error
    if (validationErrors.intrams_id) {
      setValidationErrors(prev => ({
        ...prev,
        intrams_id: null
      }));
    }
    
    // Fetch related data based on role
    if (selectedRole === 'GAM') {
      await fetchTeams(intrams_id);
    } else if (selectedRole === 'tsecretary') {
      await fetchEvents(intrams_id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleEventSearchChange = (e) => {
    setEventSearchTerm(e.target.value);
  };

  const validateAssignments = () => {
    const errors = {};
    
    if (!assignmentData.intrams_id) {
      errors.intrams_id = "Intramural selection is required";
    }
    
    if (selectedRole === 'GAM' && !assignmentData.team_id) {
      errors.team_id = "Team selection is required for GAM role";
    }
    
    if (selectedRole === 'tsecretary' && !assignmentData.event_id) {
      errors.event_id = "Event selection is required for Tournament Secretary role";
    }
    
    return errors;
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateAssignments();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Prepare data for submission
    const updateData = {
      role: selectedRole,
      ...assignmentData
    };
    
    // Send update request
    setIsLoading(true);
    try {
      await updateUserRole(userId, updateData);
      onClose();
    } catch (error) {
      console.error("Error updating user role and assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-[#E6F2E8] px-6 py-4">
          <h3 className="text-lg font-medium text-[#2A6D3A]">
            {selectedRole === 'GAM' ? "GAM Assignment" : "Tournament Secretary Assignment"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAssignmentSubmit} className="p-6">
          <div className="space-y-4">
            {/* Intramural Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intramural Assignment
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Trophy size={18} className="text-gray-400" />
                </div>
                <select
                  name="intrams_id"
                  value={assignmentData.intrams_id || ""}
                  onChange={(e) => handleIntramSelection(e.target.value)}
                  className={`pl-10 pr-4 py-2 block w-full rounded-lg border ${
                    validationErrors.intrams_id ? "border-red-300" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#6BBF59] focus:border-transparent`}
                  disabled={isLoading}
                >
                  <option value="">Select Intramural</option>
                  {intramurals.map(intramural => (
                    <option key={intramural.id} value={intramural.id}>
                      {intramural.name || intramural.title}
                    </option>
                  ))}
                </select>
              </div>
              {validationErrors.intrams_id && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.intrams_id}</p>
              )}
            </div>

            {/* Team Selection for GAM */}
            {selectedRole === 'GAM' && assignmentData.intrams_id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Assignment
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={18} className="text-gray-400" />
                  </div>
                  <select
                    name="team_id"
                    value={assignmentData.team_id || ""}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 block w-full rounded-lg border ${
                      validationErrors.team_id ? "border-red-300" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#6BBF59] focus:border-transparent`}
                    disabled={isLoading || teams.length === 0}
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.team_id && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.team_id}</p>
                )}
              </div>
            )}

            {/* Event Selection for Tournament Secretary */}
            {selectedRole === 'tsecretary' && assignmentData.intrams_id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Assignment
                  {events.length > 0 && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({filteredEvents.length} of {events.length} events)
                    </span>
                  )}
                </label>
                
                {/* Event Search Input */}
                {events.length > 0 && (
                  <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={eventSearchTerm}
                      onChange={handleEventSearchChange}
                      className="pl-9 pr-4 py-2 block w-full text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6BBF59] focus:border-transparent"
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag size={18} className="text-gray-400" />
                  </div>
                  <select
                    name="event_id"
                    value={assignmentData.event_id || ""}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-2 block w-full rounded-lg border ${
                      validationErrors.event_id ? "border-red-300" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#6BBF59] focus:border-transparent ${
                      filteredEvents.length > 8 ? 'max-h-48 overflow-y-auto' : ''
                    }`}
                    disabled={isLoading || events.length === 0}
                    size={filteredEvents.length > 8 ? 8 : undefined}
                  >
                    <option value="">
                      {eventSearchTerm && filteredEvents.length === 0 
                        ? "No events match your search" 
                        : "Select Event"
                      }
                    </option>
                    {filteredEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.name || event.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Helper text for large number of events */}
                {events.length > 10 && !eventSearchTerm && (
                  <p className="mt-1 text-xs text-gray-500">
                    Tip: Use the search box above to quickly find specific events
                  </p>
                )}
                
                {validationErrors.event_id && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.event_id}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-[#6BBF59] hover:bg-[#5CAF4A] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6BBF59] flex justify-center items-center"
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                "Save Assignment"
              )}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}