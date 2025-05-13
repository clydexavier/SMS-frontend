import React from 'react'
import axiosClient from '../../axiosClient';
import { useAuth } from '../../auth/AuthContext';


export default function GAMPage() {
  const { setUser, setToken ,setRole} = useAuth();

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await axiosClient.get('/logout');
      setUser(null);
      setToken(null);
      setRole(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <div>
      <h1>
      GAMPage
      </h1>
    <button onClick={onLogout}>
      Logout
    </button>
    </div>
  )
}
