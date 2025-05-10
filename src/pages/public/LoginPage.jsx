// src/pages/public/LoginPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import logo from "../../assets/IHK_logo1.png";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Loader, Eye, EyeOff, Mail } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

export default function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, googleAuthSuccess } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  // Handle OAuth callback
  useEffect(() => {
    // Check if we're returning from OAuth flow with a token
    const queryParams = new URLSearchParams(location.search);
    const oauthToken = queryParams.get('token');
    const error = queryParams.get('error');
    
    if (oauthToken) {
      handleGoogleAuthSuccess(oauthToken);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, location.pathname);
    } else if (error) {
      setErrorMessage("Authentication failed: " + error);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  const handleGoogleAuthSuccess = async (token) => {
    setIsLoading(true);
    
    try {
      const result = await googleAuthSuccess(token);
      
      if (result.success) {
        setSuccessMessage("Successfully logged in with Google!");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Failed to authenticate with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const result = await login(payload);
      
      if (result.success) {
        setSuccessMessage("Successfully logged in!");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-sm w-full border border-[#E6F2E8]">
        <div className="text-center">
          <img alt="IHK Logo" src={logo} className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-2xl font-bold text-[#2A6D3A]">Sign in to your account</h2>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="p-3 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 text-sm text-green-800 rounded-lg bg-green-50 border border-green-200" role="alert">
              {successMessage}
            </div>
          )}
          
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
          
          <GoogleAuthButton setErrorMessage={setErrorMessage} />
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