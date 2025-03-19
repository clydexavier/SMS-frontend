import React from 'react'

export default function VarsityPlayersPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Varsity Players</h2>
      </div>

    {/* Add Button */}
    <div className=" flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100" >
        <button className="cursor-pointer end-4 p-3 bg-[#ffcb35]">
          <p className="text-sm">
            Add event
          </p>
        </button>
      </div>

      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        
      </div>
    </div>
  )
}
