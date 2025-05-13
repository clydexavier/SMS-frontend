// src/pages/public/GoogleAuthButton.jsx - With error handling
import React, { useState } from 'react';
import axiosClient from '../../axiosClient';
import { Loader, AlertCircle } from 'lucide-react';

export default function GoogleAuthButton({ setErrorMessage }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Clear any previous error messages
      if (setErrorMessage) {
        setErrorMessage(null);
      }
      
      // First, get the Google OAuth URL from your Laravel backend
      const response = await axiosClient.get('/auth/google/redirect');
      
      if (response.data && response.data.url) {
        // Open the Google OAuth login page
        window.location.href = response.data.url;
      } else {
        throw new Error("Invalid response from server");
      }
      
    } catch (error) {
      console.error("Google auth error:", error);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        
        if (status === 500) {
          setErrorMessage("Server error. Please try again later.");
        } else if (status === 429) {
          setErrorMessage("Too many requests. Please try again in a few minutes.");
        } else {
          // Use error message from server if available
          const serverMessage = error.response.data?.message;
          setErrorMessage(serverMessage || "Failed to connect to Google authentication.");
        }
      } else if (error.request) {
        // Network error - no response received
        setErrorMessage("Cannot connect to server. Please check your internet connection.");
      } else {
        // Generic error message
        setErrorMessage("Failed to connect to Google authentication. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex justify-center items-center py-2.5 px-4 bg-white border border-[#E6F2E8] rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
    >
      {isLoading ? (
        <>
          <Loader size={18} className="mr-2 animate-spin" />
          Connecting to Google...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  );
}