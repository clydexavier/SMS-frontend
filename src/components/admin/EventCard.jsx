import React from 'react';
import { FaUser } from "react-icons/fa";
import { BsCheck } from "react-icons/bs";

export default function EventCard({ event }) {
  return (
    <div className=" m-4 p-4 mb-2 rounded bg-white shadow-md border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
      <p className="text-gray-600">{event.type}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-gray-700">
          <FaUser />
          <span>{event.participants}</span>
        </div>
        {event.date && (
          <div className="flex items-center gap-2 text-green-700 font-medium">
            <BsCheck />
            <span>{event.date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
