// src/pages/public/LoginPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import logo from "../../assets/IHK_logo1.png";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Loader, Eye, EyeOff, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

export default function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, googleAuthSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  
  // Enhanced message handling
  const [message, setMessage] = useState({
    type: null, // 'success', 'error', 'info', 'warning'
    text: '',
    visible: false,
    timeout: null
  });

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
      showMessage('error', `Authentication failed: ${error}`);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  // Clear message on component unmount
  useEffect(() => {
    return () => {
      if (message.timeout) {
        clearTimeout(message.timeout);
      }
    };
  }, [message.timeout]);

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

  const handleGoogleAuthSuccess = async (token) => {
    setIsLoading(true);
    
    try {
      const result = await googleAuthSuccess(token);
      
      if (result.success) {
        showMessage('success', 'Successfully logged in with Google!', 5000);
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Failed to authenticate with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: '', visible: false, timeout: null });
    
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const result = await login(payload);
      console.log(payload);
      if (result.success) {
        showMessage('success', 'Successfully logged in!', 5000);
      } else {
        showMessage('error', result.message || 'Invalid email or password');
      }
    } catch (error) {
      showMessage('error', 'An error occurred. Please try again later.');
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
          <h2 className="mt-6 text-2xl font-bold text-[#2A6D3A]">Sign in to your account</h2>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {message.visible && renderMessage()}
          
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
          
          <GoogleAuthButton setErrorMessage={(error) => showMessage('error', error)} />
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