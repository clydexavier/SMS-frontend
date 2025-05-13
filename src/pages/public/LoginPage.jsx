// src/pages/public/LoginPage.jsx - With Error Handling
import React, { useRef, useState } from 'react';
import logo from "../../assets/IHK_logo1.png";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Loader, Eye, EyeOff, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import axiosClient from "../../axiosClient";

export default function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setToken, setUser, setRole, redirectToRoleBasedRoute, googleAuthSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Simple error message state
  const [errorMessage, setErrorMessage] = useState(null);
  
  useEffect(() => {
    // Check if we're returning from OAuth flow with a token or error message
    const queryParams = new URLSearchParams(location.search);
    const oauthToken = queryParams.get('token');
    const error = queryParams.get('error');
    const pending = queryParams.get('pending');
    const pendingMessage = queryParams.get('message');
    
    // Clean URL parameters after processing
    const shouldCleanUrl = oauthToken || error || pending;
    
    if (oauthToken) {
      handleGoogleAuthSuccess(oauthToken);
    } else if (error) {
      // Handle explicit error from OAuth
      setErrorMessage(decodeURIComponent(error));
    } else if (pending && pendingMessage) {
      // Handle the case where a user with 'user' role tried to login via Google
      setErrorMessage(decodeURIComponent(pendingMessage));
    }
    
    // Clean up URL parameters if needed
    if (shouldCleanUrl) {
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);
  
  // Enhanced Google auth success handler
  const handleGoogleAuthSuccess = async (token) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Call the googleAuthSuccess function from AuthContext
      const result = await googleAuthSuccess(token);
      
      // If there was a problem, handle it
      if (result && !result.success) {
        setErrorMessage(result.message || "Failed to authenticate with Google.");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      
      // Handle specific error cases if available
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          setErrorMessage("Google authentication failed. Invalid credentials.");
        } else if (status === 403) {
          setErrorMessage("Your account requires approval before you can log in.");
        } else {
          setErrorMessage(error.response.data?.message || "Failed to authenticate with Google.");
        }
      } else {
        setErrorMessage("Failed to complete Google authentication. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login logic with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailRef.current || !passwordRef.current) {
      return;
    }
    
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await axiosClient.post('/login', {
        email,
        password
      });
      
      if (response.data.user && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        setRole(response.data.user.role);
        redirectToRoleBasedRoute(response.data.user.role);
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle specific error cases based on status codes
      if (err.response) {
        const status = err.response.status;
        console.log("Status:", status);
        
        if (status === 422) {
          // Validation error
          setErrorMessage(err.response.data.message || "Invalid login credentials.");
        } else if (status === 403) {
          // Pending approval
          setErrorMessage(err.response.data.message || "Your account is awaiting approval.");
        } else if (status === 401) {
          // Unauthorized
          setErrorMessage("Invalid email or password.");
        } else {
          // General error
          setErrorMessage("An error occurred during login. Please try again.");
        }
      } else {
        // Network error or other unexpected error
        setErrorMessage("Could not connect to the server. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Simple error message component
  const ErrorMessage = () => {
    if (!errorMessage) return null;
    
    return (
      <div className="p-3 rounded-lg border flex items-start gap-2 bg-red-50 border-red-200 text-red-800" role="alert">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle size={18} className="text-red-500" />
        </div>
        <div className="text-sm flex-grow">{errorMessage}</div>
        <button 
          onClick={() => setErrorMessage(null)}
          className="flex-shrink-0 ml-auto -mr-1 -mt-1 text-gray-500 hover:text-gray-700"
        >
          <XCircle size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-sm w-full border border-[#E6F2E8]">
        <div className="text-center">
          <img alt="IHK Logo" src={logo} className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-2xl font-bold text-[#2A6D3A]">Sign in to your account</h2>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {errorMessage && <ErrorMessage />}
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                required
                className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full pl-10 p-2.5 transition-colors duration-200"
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full pr-10 p-2.5 transition-colors duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#2A6D3A]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-[#E6F2E8] rounded bg-white focus:ring-[#6BBF59] text-[#6BBF59]"
                />
              </div>
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-[#6BBF59] hover:underline">
              Forgot password?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#6BBF59] hover:bg-[#5CAF4A] text-white rounded-lg shadow-md transition-colors duration-200 flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
          
          <div className="relative flex items-center mt-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <GoogleAuthButton setErrorMessage={(error) => setErrorMessage(error)} />
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link className="font-semibold text-[#6BBF59] hover:text-[#5CAF4A]" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}