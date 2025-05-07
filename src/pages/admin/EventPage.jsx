import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axiosClient from '../../axiosClient';

import { GrTrophy, GrHistory} from "react-icons/gr";
import { IoDocumentsOutline, IoMedalOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { MdOutlineScoreboard } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import { GiPodium } from "react-icons/gi";


// Skeleton loader component for the page
const SkeletonLoader = () => (
  <div className="flex flex-1 w-full">
    {/* Skeleton Sidebar */}
    <div className="hidden md:block w-64 bg-white shadow-md">
      <div className="p-4">
        <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
      </div>
      <div className="px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 py-3 px-2 mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Skeleton Content */}
    <div className="flex-auto p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="shadow-md rounded-xl border border-[#E6F2E8]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F7FAF7]">
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, row) => (
                <tr key={row}>
                  {[...Array(5)].map((_, col) => (
                    <td key={col} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default function EventPage() {
  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(true);

  const { intrams_id, event_id } = useParams();
  const isize = 20;
  const menuItems = [
    { icon: <GrTrophy size={isize} color="black" />, label: "Intramurals", route: "/admin/intramurals" },
    { 
      icon: <IoMedalOutline size={isize} color="black" />, 
      label: `${event}`, 
      route: `/${intrams_id}/events`,
      submenu: [
        { icon: <TbUsersGroup size={isize} color="black" />, label: 'Players', route: 'players' },
        { icon: <MdOutlineScoreboard size={isize} color="black" />, label: 'Generate Gallery', route: 'gallery' },
        { icon: <LiaSitemapSolid size={isize} color="black" />, label: 'Team Seeder', route: 'seeder' },

        { icon: <LiaSitemapSolid size={isize} color="black" />, label: 'Bracket', route: 'bracket' },
        { icon: <MdOutlineScoreboard size={isize} color="black" />, label: 'Games', route: 'games' },
        { icon: <GiPodium size={isize} color="black" />, label: 'Event Result', route: 'result' },

      ]
    },
    { icon: <GrHistory size={isize} color="black" />, label: 'Log', route: 'logs' },
    
  ];


  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/intramurals/${intrams_id}/events/${event_id}`,
      );
      setEvent(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching event name:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
      fetchEvent();
  }, [event_id]);  
  
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto bg-gray-200">
      <noscript>
        <strong className="text-sm sm:text-xs md:text-sm lg:text-sm">
          We're sorry but the frontend doesn't work properly without JavaScript enabled. Please enable it to continue.
        </strong>
      </noscript>

      {/* Main Content */}
      <main className="flex flex-1 w-full overflow-auto">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* Sidebar (hidden on mobile) */}
            <div className="hidden md:block">
              <Sidebar menuItems={menuItems} className="bg-white shadow-md h-full hover:bg-gray-100" />
            </div>

            <div className="flex-auto overflow-y-auto p-6 bg-white-100 text-sm sm:text-xs md:text-sm lg:text-sm">
              <Outlet />
            </div>
          </>
        )}
      </main>
    </div>
  );
}