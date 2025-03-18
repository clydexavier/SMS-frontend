import React, { useState } from "react";
import { Link } from "react-router-dom";
import VenueCard from "../../components/VenueCard";

const venuesData = [
  {
    id: 1,
    name: "Basketball",
    type: "Double elim",
    participants: 4,
    location: "VSU",
    status: "complete",
    month: "March",
    date: "March 2025",
  },
  {
    id: 2,
    name: "Volleyball",
    type: "Double elim",
    participants: 0,
    location: "SLSU",
    status: "pending",
    month: "January",
    date: "January 2025",
  },
];


export default function VenuesPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Venues</h2>
      </div>
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <VenueCard/>
      </div>
    </div>
  )
}
