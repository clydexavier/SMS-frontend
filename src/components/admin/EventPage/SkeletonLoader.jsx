import React from "react";

// Skeleton Loader Component for Bracket
export const BracketSkeleton = () => (
  <div className="bg-white shadow-md rounded-xl border border-[#E6F2E8] overflow-hidden animate-pulse">
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4 h-[540px]">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={`col1-${i}`} className="h-24 bg-gray-100 rounded-md"></div>
          ))}
        </div>
        <div className="space-y-6 pt-12">
          {[...Array(2)].map((_, i) => (
            <div key={`col2-${i}`} className="h-24 bg-gray-100 rounded-md"></div>
          ))}
        </div>
        <div className="space-y-0 pt-24">
          <div className="h-24 bg-gray-100 rounded-md"></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-24 w-full bg-gray-100 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton Loader Component for Teams Table
export const TeamsTableSkeleton = () => (
  <div className="bg-white p-8 shadow-md rounded-xl border border-[#E6F2E8] animate-pulse">
    <div className="h-7 bg-gray-200 rounded-md w-1/4 mb-6"></div>
    <div className="h-5 bg-gray-100 rounded-md w-3/4 mb-8"></div>
    
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mb-6">
      <div className="min-w-full">
        <div className="bg-gray-50 px-6 py-3.5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 h-5 bg-gray-200 rounded-md"></div>
            <div className="col-span-4 h-5 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        
        <div className="bg-white divide-y divide-gray-200">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 h-5 bg-gray-100 rounded-md"></div>
                <div className="col-span-4 h-8 bg-gray-100 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex justify-end">
      <div className="h-10 bg-gray-200 rounded-md w-64"></div>
    </div>
  </div>
);

// Podium Skeleton
export const PodiumSkeleton = () => (
  <div className="bg-white p-8 shadow-md rounded-xl border border-[#E6F2E8] animate-pulse mb-6">
    <div className="h-7 bg-gray-200 rounded-md w-1/4 mb-6"></div>
    <div className="flex justify-center items-end space-x-4 pt-8 pb-6">
      <div className="flex flex-col items-center">
        <div className="h-6 bg-gray-200 rounded-md w-24 mb-2"></div>
        <div className="h-32 w-24 bg-gray-100 rounded-t-md"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-6 bg-gray-200 rounded-md w-24 mb-2"></div>
        <div className="h-40 w-24 bg-gray-100 rounded-t-md"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-6 bg-gray-200 rounded-md w-24 mb-2"></div>
        <div className="h-24 w-24 bg-gray-100 rounded-t-md"></div>
      </div>
    </div>
  </div>
);

// Page Header Skeleton
export const PageHeaderSkeleton = () => (
  <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center shadow-sm animate-pulse">
    <div>
      <div className="h-6 bg-gray-200 rounded-md w-48"></div>
      <div className="h-4 bg-gray-100 rounded-md w-64 mt-2"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded-md w-28"></div>
  </div>
);

// Error Message Component
export const ErrorMessage = ({ message }) => (
  <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg mb-6 shadow-sm flex items-start">
    <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{message}</span>
  </div>
);

// No Teams Message Component
export const NoTeamsMessage = () => (
  <div className="text-center py-10">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No teams available</h3>
    <p className="mt-1 text-sm text-gray-500">
      Teams need to be added before seeding can be assigned.
    </p>
  </div>
);

// Loading Spinner Component
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex justify-center py-10">
    <div className="text-center space-y-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2A6D3A] mx-auto"></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  </div>
);

// No Results Message Component 
export const NoResultsMessage = ({ onSubmitClick }) => (
  <div className="text-center py-6">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No results available</h3>
    <p className="mt-1 text-sm text-gray-500">
      Results need to be submitted for this completed tournament.
    </p>
    <button
      onClick={onSubmitClick}
      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2A6D3A] hover:bg-[#225C2F]"
    >
      Submit Result
    </button>
  </div>
);