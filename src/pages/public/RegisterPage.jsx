// src/pages/public/RegisterPage.jsx - With Error Handling
import React, { useRef, useState } from 'react';
import logo from "../../assets/IHK_logo1.png";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Loader, Eye, EyeOff, Mail, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import axiosClient from "../../axiosClient";

export default function RegisterPage() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  // Error and success messages
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { setToken, setUser, setRole, redirectToRoleBasedRoute, googleAuthSuccess } = useAuth();
  
  const handleGoogleAuthSuccess = async (token) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await googleAuthSuccess(token);
    } catch (error) {
      console.error(error);
      setErrorMessage("Google authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Registration logic with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      // Fixed variable name from credentials to payload
      const response = await axiosClient.post("/register", payload);
      
      // Handle pending approval case
      if (response.data.pending) {
        setSuccessMessage(response.data.message || "Your account has been created and is awaiting approval.");
        
        // Navigate to login after delay for pending approval
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        return;
      }
      
      // Handle successful registration with immediate login
      if (response.data.user && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        setRole(response.data.user.role);
        redirectToRoleBasedRoute(response.data.user.role);
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle specific error cases based on status codes
      if (err.response) {
        const status = err.response.status;
        
        if (status === 422) {
          // Validation errors
          const errors = err.response.data.errors;
          
          if (errors) {
            // Format validation errors for display
            const formattedErrors = Object.values(errors)
              .flat()
              .join('\n• ');
            
            setErrorMessage(`Please correct the following errors:\n• ${formattedErrors}`);
          } else {
            setErrorMessage(err.response.data.message || "Invalid registration data.");
          }
        } else {
          // General error
          setErrorMessage(err.response.data.message || "An error occurred during registration. Please try again.");
        }
      } else {
        // Network error or other unexpected error
        setErrorMessage("Could not connect to the server. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Error message component
  const MessageComponent = ({ type, message }) => {
    if (!message) return null;
    
    const styles = {
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: <AlertCircle size={18} className="text-red-500" />
      },
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: <CheckCircle size={18} className="text-green-500" />
      }
    };
    
    const style = styles[type];
    
    // Check if the message contains line breaks for validation errors
    const hasLineBreaks = message.includes('\n');
    
    if (hasLineBreaks) {
      const messageLines = message.split('\n');
      
      return (
        <div className={`p-3 rounded-lg border flex items-start gap-2 ${style.bg} ${style.border} ${style.text}`} role="alert">
          <div className="flex-shrink-0 mt-0.5">
            {style.icon}
          </div>
          <div className="text-sm flex-grow">
            <ul className="list-none">
              {messageLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
          <button 
            onClick={() => type === 'error' ? setErrorMessage(null) : setSuccessMessage(null)}
            className="flex-shrink-0 ml-auto -mr-1 -mt-1 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={16} />
          </button>
        </div>
      );
    }
    
    return (
      <div className={`p-3 rounded-lg border flex items-start gap-2 ${style.bg} ${style.border} ${style.text}`} role="alert">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="text-sm flex-grow">{message}</div>
        <button 
          onClick={() => type === 'error' ? setErrorMessage(null) : setSuccessMessage(null)}
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
          <h2 className="mt-6 text-2xl font-bold text-[#2A6D3A]">Create an account</h2>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {errorMessage && <MessageComponent type="error" message={errorMessage} />}
          {successMessage && <MessageComponent type="success" message={successMessage} />}
          
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                required
                className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full pl-10 p-2.5 transition-colors duration-200"
                placeholder="Juan dela Cruz"
              />
            </div>
          </div>
          
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
          
          <div>
            <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                ref={passwordConfirmationRef}
                id="password_confirmation"
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full pr-10 p-2.5 transition-colors duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#2A6D3A]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 border border-[#E6F2E8] rounded bg-white focus:ring-[#6BBF59] text-[#6BBF59]"
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-[#6BBF59] hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#6BBF59] hover:bg-[#5CAF4A] text-white rounded-lg shadow-md transition-colors duration-200 flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          
          <div className="relative flex items-center mt-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">Or register with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <GoogleAuthButton setErrorMessage={(error) => setErrorMessage(error)} />
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link className="font-semibold text-[#6BBF59] hover:text-[#5CAF4A]" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}