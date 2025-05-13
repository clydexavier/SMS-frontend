import React, { useRef, useState } from 'react';
import logo from "../../assets/IHK_logo1.png";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../axiosClient';
import { Loader, Eye, EyeOff, Mail, User, XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import GoogleAuthButton from '../public/GoogleAuthButton';

export default function RegisterPage() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser, setToken, setRole, googleAuthSuccess } = useAuth();
  
  // Enhanced message handling
  const [message, setMessage] = useState({
    type: null, // 'success', 'error', 'info', 'warning'
    text: '',
    visible: false,
    timeout: null
  });
  
  // Show message with optional auto-dismiss
  const showMessage = (type, text, duration = 0) => {
    // Clear any existing timeout
    if (message.timeout) {
      clearTimeout(message.timeout);
    }
    
    // Set the new message
    setMessage(prev => ({
      type,
      text,
      visible: true,
      timeout: duration > 0 ? setTimeout(() => {
        setMessage(prev => ({ ...prev, visible: false }));
      }, duration) : null
    }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setMessage({ type: null, text: '', visible: false, timeout: null });
    setIsLoading(true);

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      const { data } = await axiosClient.post("/register", payload);
      
      // Check if the backend response contains only message (user role case)
      if (data.message && !data.token) {
        showMessage('warning', data.message, 5000);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
        return;
      }
      
      // Regular success flow
      showMessage('success', "Account created successfully! Redirecting...", 5000);
      
      // Set user data in auth context
      setUser(data.user);
      setToken(data.token);
      setRole(data.user.role);
      
      // No need to navigate manually - the AuthContext will handle redirection based on user role
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        // Validation errors
        showMessage('error', Object.values(response.data.errors)[0][0], 5000);
      } else if (response && response.data && response.data.message) {
        // Server returned an error message
        showMessage('error', response.data.message, 5000);
      } else {
        // Generic error
        showMessage('error', "An error occurred. Please try again later.", 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the appropriate message UI based on message type
  const renderMessage = () => {
    if (!message.visible) return null;
    
    const messageStyles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: <CheckCircle size={18} className="text-green-500" />
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: <XCircle size={18} className="text-red-500" />
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: <AlertCircle size={18} className="text-yellow-500" />
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: <AlertCircle size={18} className="text-blue-500" />
      }
    };
    
    const style = messageStyles[message.type] || messageStyles.info;
    
    return (
      <div className={`p-3 rounded-lg border flex items-start gap-2 ${style.bg} ${style.border} ${style.text}`} role="alert">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="text-sm flex-grow">{message.text}</div>
        <button 
          onClick={() => setMessage(prev => ({ ...prev, visible: false }))}
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
          {message.visible && renderMessage()}
          
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
          
          <GoogleAuthButton setErrorMessage={(error) => showMessage('error', error, 5000)} />
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