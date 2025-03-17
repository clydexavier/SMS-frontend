import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";


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
    <div className="h-full w-full p-6 bg-gray-100 text-gray-900">
      <div className="w-48 h-48 flex flex-col items-center justify-center border-2  border-gray-400 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer">
        <FaPlus className="text-gray-500 text-2xl" />
       <p className="text-gray-600 font-medium mt-2">Add new venue</p>
     </div>
  </div>
  )
}
