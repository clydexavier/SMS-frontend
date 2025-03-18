import React from 'react'

function IntramuralCard({intramural}) {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md border w-64 relative overflow-hidden">
      {/* Header with Date */}
      <div className="bg-gray-800 text-white p-2 rounded-t-lg flex flex-col items-center">
        <span className="text-2xl font-extrabold">{intramural.name}</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-lg font-semibold text-gray-800">{intramural.date}</p>
        <p className={`text-sm font-medium ${
          intramural.status === "complete" ? "text-green-600" : "text-yellow-600"
        }`}>Status: {intramural.status}</p>
        <p className={`text-sm ${intramural.location ? "text-gray-600" : "text-red-600 font-medium"}`}>
          {intramural.location ? `Location: ${intramural.location}` : "No location yet"}
        </p>
      </div>
    </div>
  );
}

export default IntramuralCard