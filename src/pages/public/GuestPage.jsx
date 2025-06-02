// src/pages/public/GuestPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../axiosClient';
import logo from "../../assets/vsu_logo.png";

//Tab components
import OverviewTab from './guest/OverviewTab';
import EventsTab from './guest/EventsTab';
import MedalStandingsTab from './guest/MedalStandingsTab';

import { 
  Trophy, 
  Calendar, 
  Medal, 
  Users, 
  Clock, 
  MapPin, 
  Loader,
  Home,
  LogIn,
  Star,
  Award,
  ChevronRight,
  ArrowLeft,
  Eye,
  FileDown
} from 'lucide-react';

export default function GuestPage() {
  const [intramurals, setIntramurals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIntramural, setSelectedIntramural] = useState(null);
  const [events, setEvents] = useState([]);
  const [tally, setTally] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Event viewing states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventActiveTab, setEventActiveTab] = useState('bracket');
  const [eventLoading, setEventLoading] = useState(false);
  const [bracketId, setBracketId] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  const [podiumData, setPodiumData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchIntramurals();
  }, []);

  const fetchIntramurals = async () => {
    try {
      setLoading(true);
      // You'll need to create public API endpoints for this
      const { data } = await axiosClient.get('/public/intramurals');
      setIntramurals(data.data);
      
      // Auto-select the first active intramural
      const activeIntramural = data.data.find(i => i.status === 'in progress') || data.data[0];
      if (activeIntramural) {
        setSelectedIntramural(activeIntramural);
        fetchIntramuralDetails(activeIntramural.id);
      }
    } catch (err) {
      console.error('Error fetching intramurals:', err);
      setError('Failed to load tournament information');
    } finally {
      setLoading(false);
    }
  };

  const fetchIntramuralDetails = async (intramuralId) => {
    try {
      const [eventsRes, tallyRes] = await Promise.all([
        axiosClient.get(`/public/intramurals/${intramuralId}/events`),
        axiosClient.get(`/public/intramurals/${intramuralId}/tally`)
      ]);
      
      setEvents(eventsRes.data.data || []);
      setTally(tallyRes.data.data || []);
    } catch (err) {
      console.error('Error fetching intramural details:', err);
    }
  };

  const handleIntramuralSelect = (intramural) => {
    setSelectedIntramural(intramural);
    setSelectedEvent(null); // Reset selected event when switching intramurals
    fetchIntramuralDetails(intramural.id);
  };

  const handleEventSelect = async (event) => {
    setSelectedEvent(event);
    setEventActiveTab('bracket');
    setEventLoading(true);
    
    try {
      // Fetch bracket data
      const bracketRes = await axiosClient.get(
        `/public/intramurals/${selectedIntramural.id}/events/${event.id}/bracket`
      );
      setBracketId(bracketRes.data.bracket_id);
      setEventStatus(bracketRes.data.status);
      
      // Fetch podium data if event is completed
      if (bracketRes.data.status === 'completed') {
        try {
          const podiumRes = await axiosClient.get(
            `/public/intramurals/${selectedIntramural.id}/events/${event.id}/podium`
          );
          setPodiumData(podiumRes.data);
        } catch (podiumErr) {
          console.log('No podium data available');
          setPodiumData(null);
        }
      } else {
        setPodiumData(null);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setBracketId(null);
      setEventStatus(null);
      setPodiumData(null);
    } finally {
      setEventLoading(false);
    }
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setActiveTab('events');
  };

  const downloadPodiumPDF = async () => {
    if (!selectedEvent || !podiumData) return;
    
    try {
      setIsDownloading(true);
      
      const response = await axiosClient.post(
        `/public/intramurals/${selectedIntramural.id}/events/${selectedEvent.id}/podium_pdf`,
        {},
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedEvent.name}_results.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download podium PDF", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'in progress': return 'text-green-600';
      case 'completed': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const renderBracketContent = () => {
    if (eventLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader size={32} className="animate-spin text-[#2A6D3A]" />
        </div>
      );
    }
    
    if (eventStatus === "pending") {
      return (
        <div className="bg-yellow-50 p-8 rounded-xl text-center border border-yellow-200">
          <Award size={48} className="mx-auto mb-4 text-yellow-400" />
          <h3 className="text-lg font-medium text-yellow-800">Event Pending</h3>
          <p className="text-gray-600 mt-1">The bracket has not started yet.</p>
        </div>
      );
    }
    
    if (!bracketId || bracketId === "no bracket") {
      return (
        <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
          <Award size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600">No Bracket Available</h3>
          <p className="text-gray-500 mt-1">This event does not use a bracket system.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <iframe
          src={`https://challonge.com/${bracketId}/module`}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="auto"
          allowtransparency="true"
          title="Bracket"
          className="w-full rounded-xl"
        ></iframe>
      </div>
    );
  };

  const renderResultsContent = () => {
    if (eventLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader size={32} className="animate-spin text-[#2A6D3A]" />
        </div>
      );
    }

    if (eventStatus !== "completed" || !podiumData) {
      return (
        <div className="flex-1 bg-white p-8 rounded-xl text-center border border-gray-200">
          <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600">No Results Available</h3>
          <p className="text-gray-500 mt-1">
            {eventStatus === "in progress" 
              ? "This event is still in progress." 
              : "Results will be available once the event is completed."}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Event Results</h3>
        </div>
        
        <div className="space-y-6">
          {/* Gold Medal */}
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-yellow-800">1st Place</h4>
              <p className="text-xl font-bold text-gray-900">{podiumData.gold_team_name}</p>
            </div>
          </div>

          {/* Silver Medal */}
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Medal size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-600">2nd Place</h4>
              <p className="text-xl font-bold text-gray-900">{podiumData.silver_team_name}</p>
            </div>
          </div>

          {/* Bronze Medal */}
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-orange-800">3rd Place</h4>
              <p className="text-xl font-bold text-gray-900">{podiumData.bronze_team_name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-[#2A6D3A] mx-auto mb-4" />
          <p className="text-gray-600">Loading tournament information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchIntramurals}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-dvh overflow-auto bg-gray-200">
      {/* Header */}
      <header className="bg-[#1E4D2B] shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={logo} alt="IHK Logo" className="h-12 w-40 rounded-full" />
              
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="flex items-center px-4 py-2 bg-[#6BBF59] hover:bg-[#5CAF4A] text-white rounded-lg transition-colors"
              >
                <LogIn size={16} className="mr-2" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 bg-white">
          <div className="flex flex-col w-full h-full">
            <div className="w-full h-full flex-1 flex flex-col">
              {/* Main container - matches EventsPage structure */}
              <div className="flex flex-1 flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
                
                {/* Intramural Selection */}
                {intramurals.length > 1 && !selectedEvent && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#2A6D3A] mb-4">Select Intramural</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {intramurals.map((intramural) => (
                        <button
                          key={intramural.id}
                          onClick={() => handleIntramuralSelect(intramural)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedIntramural?.id === intramural.id
                              ? 'border-[#6BBF59] bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{intramural.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(intramural.status)}`}>
                              {intramural.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{intramural.location}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(intramural.start_date).toLocaleDateString()} - {new Date(intramural.end_date).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIntramural && (
                  <>
                    {/* Tournament Header */}
                    {!selectedEvent && (
                      <div className="bg-white rounded-xl shadow-sm border border-[#E6F2E8] p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h1 className="text-2xl font-bold text-[#2A6D3A] mb-2">{selectedIntramural.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin size={16} className="mr-1" />
                                {selectedIntramural.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-1" />
                                {new Date(selectedIntramural.start_date).toLocaleDateString()} - {new Date(selectedIntramural.end_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedIntramural.status)}`}>
                              {selectedIntramural.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Event Detail View */}
                    {selectedEvent ? (
                      <div className="flex-1 flex flex-col">
                        {/* Event Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-[#E6F2E8] p-6 mb-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={handleBackToEvents}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <ArrowLeft size={20} className="text-gray-600" />
                              </button>
                              <div>
                                <h1 className="text-xl font-bold text-[#2A6D3A]">{selectedEvent.category} {selectedEvent.name}</h1>
                                <p className="text-gray-600">{selectedEvent.type}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                              {selectedEvent.status}
                            </span>
                          </div>
                        </div>

                        {/* Event Navigation */}
                        <div className="mb-6">
                          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
                            <nav className="flex space-x-8">
                              {[
                                { id: 'bracket', label: 'Bracket', icon: Calendar },
                                { id: 'results', label: 'Results', icon: Trophy }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => setEventActiveTab(tab.id)}
                                  className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm transition-colors ${
                                    eventActiveTab === tab.id
                                      ? 'border-[#6BBF59] text-[#2A6D3A]'
                                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  <tab.icon size={16} className="mr-2" />
                                  {tab.label}
                                </button>
                              ))}
                            </nav>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 flex flex-col">
                          {eventActiveTab === 'bracket' && renderBracketContent()}
                          {eventActiveTab === 'results' && renderResultsContent()}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Navigation Tabs */}
                        <div className="mb-6">
                          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
                            <nav className="flex space-x-8">
                              {[
                                { id: 'overview', label: 'Overview', icon: Home },
                                { id: 'events', label: 'Events', icon: Calendar },
                                { id: 'standings', label: 'Overall Tally', icon: Trophy }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveTab(tab.id)}
                                  className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                      ? 'border-[#6BBF59] text-[#2A6D3A]'
                                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                  }`}
                                >
                                  <tab.icon size={16} className="mr-2" />
                                  {tab.label}
                                </button>
                              ))}
                            </nav>
                          </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 flex flex-col">
                          {activeTab === 'overview' && (
                            <OverviewTab
                              events={events}
                              tally={tally}
                              onEventSelect={handleEventSelect}
                            />
                          )}

                          {activeTab === 'events' && (
                            <EventsTab
                              events={events}
                              onEventSelect={handleEventSelect}
                            />
                          )}

                          {activeTab === 'standings' && (
                            <MedalStandingsTab
                              tally={tally}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

                {!selectedIntramural && intramurals.length === 0 && (
                  <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                    <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments available</h3>
                    <p className="text-gray-600">Check back later for upcoming tournaments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}