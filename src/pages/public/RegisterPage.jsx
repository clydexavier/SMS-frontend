import React, { useRef, useState, useContext } from 'react';
import logo from "../../assets/react.svg";
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from "../../context/ContextProvider";

export default function RegisterPage() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthenticated } = useContext(userContext);
  const navigate = useNavigate();

  const Submit = (ev) => {
    ev.preventDefault();
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setAuthenticated(true);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <div className="text-center">
          <img alt="Your Company" src={logo} className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Create an account</h2>
        </div>
        <form className="mt-6 space-y-4" onSubmit={Submit}>
          {errorMessage && (
            <div className="p-3 text-sm text-red-800 rounded bg-red-100" role="alert">
              {errorMessage}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              ref={passwordConfirmationRef}
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link className="font-semibold text-green-600 hover:text-green-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}