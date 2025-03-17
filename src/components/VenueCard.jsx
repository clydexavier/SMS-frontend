import React from 'react'

export default function VenueCard() {
  return (
    <div className="w-48 h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer">
      <FaPlus className="text-gray-500 text-2xl" />
      <p className="text-gray-600 font-medium mt-2">Create new station</p>
    </div>
    )
}
