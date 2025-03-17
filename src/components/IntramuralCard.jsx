import React from 'react'

function IntramuralCard({intramural}) {
  return (
    <div className="m-4 bg-gray-800 text-white p-4 rounded-lg shadow-md w-80">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-green-500 font-bold">{intramural.month}</p>
          <p className="text-2xl font-extrabold">{intramural.name}</p>
        </div>
        <div className="text-gray-600">
          {/* Add an icon if needed */}
          <svg width="30" height="30" fill="currentColor">
            <path d="M10 20l5-10 5 10z" />
          </svg>
        </div>
      </div>
      <h2 className="text-lg font-semibold italic">{intramural.date}</h2>
      <p className={`text-sm ${intramural.location ? "text-gray-400" : "text-orange-400"}`}>
        {intramural.location || "No location yet"}
      </p>
    </div>
  
  )
}

export default IntramuralCard