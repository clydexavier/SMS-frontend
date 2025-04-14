import React from 'react'
import axiosClient from '../../axiosClient'
import { useStateContext } from '../../context/ContextProvider'

export default function UnauthorizedPage() {
    const { setUser, setToken, setRole,user } = useStateContext();
  
    const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      localStorage.removeItem("ACCESS_TOKEN");
      SetUser(null);
      setToken(null);
      setRole(null);
      await axiosClient.get('/logout');
      setUser(null);
      setToken(null);
      setRole(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div>
        <h1>
            Unauthorized Page
        </h1>
        <button onClick={onLogout}>Logout</button>
    </div>
  )
}
