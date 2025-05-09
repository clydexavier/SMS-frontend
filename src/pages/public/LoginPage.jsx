import React, { useRef, useState , useEffect} from 'react';
import logo from "../../assets/IHK_logo1.png";
import axiosClient from '../../axiosClient';
import { Link } from 'react-router-dom';
import { useStateContext } from "../../context/ContextProvider";

export default function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken, setRole,user, token,role } = useStateContext();
  const [errorMessage, setErrorMessage] = useState("");

  const Submit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient.post("/login", payload).then(({ data }) => {
      setUser(data.user);
      setToken(data.token);
      setRole(data.user.role);
      setErrorMessage("");
    }).catch(err => {
      const response = err.response;
      if (response && response.status === 422) {
        setErrorMessage(response.data.message);
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <div className="text-center">
          <img alt="Your Company" src={logo} className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Sign in to your account</h2>
        </div>
        <form className="mt-6 space-y-4" onSubmit={Submit}>
          {errorMessage && (
            <div className="p-3 text-sm text-red-800 rounded bg-red-100" role="alert">
              {errorMessage}
            </div>
          )}
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link className="font-semibold text-green-600 hover:text-green-500" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
