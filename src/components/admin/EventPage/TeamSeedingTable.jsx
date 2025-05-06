import React from "react";

const TeamsSeedingTable = ({ teams, seeds, onSeedChange, onSubmit, isSubmitting }) => {
  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Team Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{team.name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <input
                    type="number"
                    min="1"
                    max={teams.length}
                    className="border rounded-md px-3 py-2 w-20 focus:ring-green-500 focus:border-green-500 transition-shadow"
                    value={seeds[team.id] || ""}
                    onChange={(e) => onSeedChange(team.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`flex items-center bg-[#2A6D3A] hover:bg-[#225C2F] text-white px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-colors
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Submit Seeding & Start Tournament
        </button>
      </div>
    </>
  );
};

export default TeamsSeedingTable;